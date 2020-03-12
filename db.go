package main

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"log"
	"net/http"
	"strings"
	"time"

	"github.com/gorilla/mux"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"go.mongodb.org/mongo-driver/mongo/readpref"
)

// loadMongoClient initializes a connection to the mongo server running on localhost
// and returns a pointer to its client.
func loadMongoClient() (*mongo.Client, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()
	client, err := mongo.Connect(ctx, options.Client().ApplyURI("mongodb://localhost:27017"))
	if err != nil {
		return nil, err
	}
	// verify successful connection
	err = client.Ping(ctx, readpref.Primary())
	if err != nil {
		return nil, err
	}

	return client, nil
}

// retrieveMongoCollection takes a mongo client, database name, and collection name
// and returns the mongo collection, to be used for CRUD operations
func retrieveMongoCollection(client *mongo.Client, db string, collection string) *mongo.Collection {
	c := client.Database(db).Collection(collection)
	return c
}

// this is a very basic example of how to query the mongo db. It first inserts a record
// into the db: team_zero, collection: temp
// then it prints the corresponding document id associated with the record inserted.
// finally, it selects the inserted record and reads the data into a struct,
// printing the results to the log.
func dbInsertSelectExample(db *mongo.Client) {
	// EXAMPLE OF USING THE DB CONNECTION
	// ASSUME WE HAVE A MONGO DB NAMED team_zero WITH COLLECTION temp
	// WE WILL INSERT THE DOCUMENT {"test": "hello world"}, THEN
	// RETRIEVE IT AGAIN.
	tempCollection := retrieveMongoCollection(db, "team_zero", "temp")

	// INSERT EXAMPLE
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()
	res, err := tempCollection.InsertOne(ctx, bson.M{"name": "bob", "age": 20, "isNice": true})
	if err != nil {
		log.Fatal(err)
	}
	// retrieve id of inserted document
	id := res.InsertedID
	log.Printf("Inserted document id: %s\n", id)

	// SELECT EXAMPLE

	// we first need to declare the struct that will store the result (usually this is done outside of the func,
	// but its just here for an example).
	var result struct {
		Name   string
		Age    int
		IsNice bool
	}
	// what we will be searching for (a document with the name field set as bob)
	filter := bson.M{"name": "bob"}
	ctx, cancel = context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()
	err = tempCollection.FindOne(ctx, filter).Decode(&result)
	if err != nil {
		log.Fatal(err)
	}

	log.Printf("The selected record is: %+v\n", result)
}

// Source: https://www.alexedwards.net/blog/how-to-properly-parse-a-json-request-body
type malformedRequest struct {
	status int
	msg    string
}

// Source: https://www.alexedwards.net/blog/how-to-properly-parse-a-json-request-body
func (mr *malformedRequest) Error() string {
	return mr.msg
}

// Source: https://www.alexedwards.net/blog/how-to-properly-parse-a-json-request-body
func decodeJSONBody(w http.ResponseWriter, r *http.Request, dst interface{}) error {
	if r.Header.Get("Content-Type") != "" && r.Header.Get("Content-Type") != "application/json" {
		msg := "Content-Type header is not application/json"
		return &malformedRequest{status: http.StatusUnsupportedMediaType, msg: msg}
	}

	r.Body = http.MaxBytesReader(w, r.Body, 1048576)

	dec := json.NewDecoder(r.Body)
	dec.DisallowUnknownFields()

	err := dec.Decode(&dst)
	if err != nil {
		var syntaxError *json.SyntaxError
		var unmarshalTypeError *json.UnmarshalTypeError

		switch {
		case errors.As(err, &syntaxError):
			msg := fmt.Sprintf("Request body contains badly-formed JSON (at position %d)", syntaxError.Offset)
			return &malformedRequest{status: http.StatusBadRequest, msg: msg}

		case errors.Is(err, io.ErrUnexpectedEOF):
			msg := fmt.Sprintf("Request body contains badly-formed JSON")
			return &malformedRequest{status: http.StatusBadRequest, msg: msg}

		case errors.As(err, &unmarshalTypeError):
			msg := fmt.Sprintf("Request body contains an invalid value for the %q field (at position %d)", unmarshalTypeError.Field, unmarshalTypeError.Offset)
			return &malformedRequest{status: http.StatusBadRequest, msg: msg}

		case strings.HasPrefix(err.Error(), "json: unknown field "):
			fieldName := strings.TrimPrefix(err.Error(), "json: unknown field ")
			msg := fmt.Sprintf("Request body contains unknown field %s", fieldName)
			return &malformedRequest{status: http.StatusBadRequest, msg: msg}

		case errors.Is(err, io.EOF):
			msg := "Request body must not be empty"
			return &malformedRequest{status: http.StatusBadRequest, msg: msg}

		case err.Error() == "http: request body too large":
			msg := "Request body must not be larger than 1MB"
			return &malformedRequest{status: http.StatusRequestEntityTooLarge, msg: msg}

		default:
			return err
		}
	}

	if dec.More() {
		msg := "Request body must only contain a single JSON object"
		return &malformedRequest{status: http.StatusBadRequest, msg: msg}
	}

	return nil
}

// Board ...
type Board struct {
	ID      primitive.ObjectID   `bson:"_id,omitempty"`
	Title   string               `json:"title" bson:"title"`
	Columns []primitive.ObjectID `json:"columns" bson:"columns"`
}

// Column ...
type Column struct {
	ID      primitive.ObjectID   `bson:"_id,omitempty"`
	Title   string               `json:"title" bson:"title"`
	BoardID primitive.ObjectID   `bson:"board_id"`
	Tickets []primitive.ObjectID `json:"tickets" bson:"tickets"`
}

// Ticket ...
type Ticket struct {
	ID          primitive.ObjectID `bson:"_id,omitempty"`
	Title       string             `json:"title" bson:"title"`
	Description string             `json:"description" bson:"description"`
	Assignee    string             `json:"assignee" bson:"assignee"`
	Points      int                `json:"points" bson:"points"`
	BoardID     primitive.ObjectID `bson:"board_id"`
	ColumnID    primitive.ObjectID `bson:"column_id"`
}

func createBoard(w http.ResponseWriter, r *http.Request) {

	// parse request body
	var newBoard Board
	err := decodeJSONBody(w, r, &newBoard)
	if err != nil {
		var mr *malformedRequest
		if errors.As(err, &mr) {
			http.Error(w, mr.msg, mr.status)
		} else {
			log.Println(err.Error())
			http.Error(w, http.StatusText(http.StatusInternalServerError), http.StatusInternalServerError)
		}
		return
	}
	newBoard.Columns = []primitive.ObjectID{}

	// connect to db
	db, err := loadMongoClient()
	if err != nil {
		log.Println(err.Error())
		http.Error(w, http.StatusText(http.StatusInternalServerError), http.StatusInternalServerError)
		return
	}

	// insert board
	boardsCollection := retrieveMongoCollection(db, "team_zero", "boards")
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()
	res, err := boardsCollection.InsertOne(ctx, newBoard)
	if err != nil {
		log.Println(err.Error())
		http.Error(w, http.StatusText(http.StatusInternalServerError), http.StatusInternalServerError)
		return
	}

	// return new board info
	filter := bson.M{"_id": res.InsertedID}
	err = boardsCollection.FindOne(ctx, filter).Decode(&newBoard)
	if err != nil {
		log.Println(err.Error())
		http.Error(w, http.StatusText(http.StatusInternalServerError), http.StatusInternalServerError)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(newBoard)
}

func createColumn(w http.ResponseWriter, r *http.Request) {

	// get board id
	var newColumn Column
	queryVars := mux.Vars(r)
	boardID, err := primitive.ObjectIDFromHex(queryVars["boardID"])
	if err != nil {
		http.Error(w, "Invalid Board ID", http.StatusBadRequest)
		return
	}

	// parse request body
	err = decodeJSONBody(w, r, &newColumn)
	if err != nil {
		var mr *malformedRequest
		if errors.As(err, &mr) {
			http.Error(w, mr.msg, mr.status)
		} else {
			log.Println(err.Error())
			http.Error(w, http.StatusText(http.StatusInternalServerError), http.StatusInternalServerError)
		}
		return
	}
	newColumn.BoardID = boardID
	newColumn.Tickets = []primitive.ObjectID{}

	// connect to db
	db, err := loadMongoClient()
	if err != nil {
		log.Println(err.Error())
		http.Error(w, http.StatusText(http.StatusInternalServerError), http.StatusInternalServerError)
		return
	}
	// get board
	boardsCollection := retrieveMongoCollection(db, "team_zero", "boards")
	filter := bson.M{"_id": boardID}
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()
	var board Board
	err = boardsCollection.FindOne(ctx, filter).Decode(&board)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			http.Error(w, "The specified Board ID does not exist", http.StatusBadRequest)
		} else {
			log.Println(err.Error())
			http.Error(w, http.StatusText(http.StatusInternalServerError), http.StatusInternalServerError)
		}
		return
	}

	// insert column
	columnsCollection := retrieveMongoCollection(db, "team_zero", "columns")
	res, err := columnsCollection.InsertOne(ctx, newColumn)
	if err != nil {
		log.Println(err.Error())
		http.Error(w, http.StatusText(http.StatusInternalServerError), http.StatusInternalServerError)
		return
	}
	newColumn.ID = res.InsertedID.(primitive.ObjectID)

	// update board
	update := bson.D{primitive.E{Key: "$set", Value: bson.D{primitive.E{Key: "columns", Value: append(board.Columns, newColumn.ID)}}}}
	err = boardsCollection.FindOneAndUpdate(ctx, filter, update).Decode(&board)
	if err != nil {
		log.Println(err.Error())
		http.Error(w, http.StatusText(http.StatusInternalServerError), http.StatusInternalServerError)
	}

	// return new column info
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(newColumn)
}

func createTicket(w http.ResponseWriter, r *http.Request) {

	// get board/column ids
	var newTicket Ticket
	queryVars := mux.Vars(r)
	boardID, err := primitive.ObjectIDFromHex(queryVars["boardID"])
	if err != nil {
		http.Error(w, "Invalid Board ID", http.StatusBadRequest)
		return
	}
	columnID, err := primitive.ObjectIDFromHex(queryVars["columnID"])
	if err != nil {
		http.Error(w, "Invalid Column ID", http.StatusBadRequest)
		return
	}

	// parse request body
	err = decodeJSONBody(w, r, &newTicket)
	if err != nil {
		var mr *malformedRequest
		if errors.As(err, &mr) {
			http.Error(w, mr.msg, mr.status)
		} else {
			log.Println(err.Error())
			http.Error(w, http.StatusText(http.StatusInternalServerError), http.StatusInternalServerError)
		}
		return
	}
	newTicket.BoardID = boardID
	newTicket.ColumnID = columnID

	// connect to db
	db, err := loadMongoClient()
	if err != nil {
		log.Println(err.Error())
		http.Error(w, http.StatusText(http.StatusInternalServerError), http.StatusInternalServerError)
		return
	}

	// get column
	columnsCollection := retrieveMongoCollection(db, "team_zero", "columns")
	filter := bson.M{"_id": columnID, "board_id": boardID}
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()
	var column Column
	err = columnsCollection.FindOne(ctx, filter).Decode(&column)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			http.Error(w, "The specified Board/Column ID combination does not exist", http.StatusBadRequest)
		} else {
			log.Println(err.Error())
			http.Error(w, http.StatusText(http.StatusInternalServerError), http.StatusInternalServerError)
		}
		return
	}

	// insert ticket
	ticketsCollection := retrieveMongoCollection(db, "team_zero", "tickets")
	res, err := ticketsCollection.InsertOne(ctx, newTicket)
	if err != nil {
		log.Println(err.Error())
		http.Error(w, http.StatusText(http.StatusInternalServerError), http.StatusInternalServerError)
		return
	}
	newTicket.ID = res.InsertedID.(primitive.ObjectID)

	// update column
	update := bson.D{primitive.E{Key: "$set", Value: bson.D{primitive.E{Key: "tickets", Value: append(column.Tickets, newTicket.ID)}}}}
	err = columnsCollection.FindOneAndUpdate(ctx, filter, update).Decode(&column)
	if err != nil {
		log.Println(err.Error())
		http.Error(w, http.StatusText(http.StatusInternalServerError), http.StatusInternalServerError)
	}

	// return new ticket info
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(newTicket)
}

func getTicket(w http.ResponseWriter, r *http.Request) {

	// parse request body
	queryVars := mux.Vars(r)
	boardID, err := primitive.ObjectIDFromHex(queryVars["boardID"])
	if err != nil {
		http.Error(w, "Invalid Board ID", http.StatusBadRequest)
		return
	}
	columnID, err := primitive.ObjectIDFromHex(queryVars["columnID"])
	if err != nil {
		http.Error(w, "Invalid Column ID", http.StatusBadRequest)
		return
	}
	ticketID, err := primitive.ObjectIDFromHex(queryVars["ticketID"])
	if err != nil {
		http.Error(w, "Invalid Column ID", http.StatusBadRequest)
		return
	}

	// connect to db
	db, err := loadMongoClient()
	if err != nil {
		log.Println(err.Error())
		http.Error(w, http.StatusText(http.StatusInternalServerError), http.StatusInternalServerError)
		return
	}

	// get column
	columnsCollection := retrieveMongoCollection(db, "team_zero", "columns")
	filter := bson.M{"_id": columnID, "board_id": boardID}
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()
	var column Column
	err = columnsCollection.FindOne(ctx, filter).Decode(&column)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			http.Error(w, "The specified Board/Column ID combination does not exist", http.StatusBadRequest)
		} else {
			log.Println(err.Error())
			http.Error(w, http.StatusText(http.StatusInternalServerError), http.StatusInternalServerError)
		}
		return
	}

	// get ticket
	var ticket Ticket
	ticketsCollection := retrieveMongoCollection(db, "team_zero", "tickets")
	filter = bson.M{"_id": ticketID, "column_id": columnID}
	err = ticketsCollection.FindOne(ctx, filter).Decode(&ticket)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			http.Error(w, "The specified Ticket ID does not exist", http.StatusBadRequest)
		} else {
			log.Println(err.Error())
			http.Error(w, http.StatusText(http.StatusInternalServerError), http.StatusInternalServerError)
		}
		return
	}

	// send result
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(ticket)
}

func getColumn(w http.ResponseWriter, r *http.Request) {

	// parse request body
	queryVars := mux.Vars(r)
	boardID, err := primitive.ObjectIDFromHex(queryVars["boardID"])
	if err != nil {
		http.Error(w, "Invalid Board ID", http.StatusBadRequest)
		return
	}
	columnID, err := primitive.ObjectIDFromHex(queryVars["columnID"])
	if err != nil {
		http.Error(w, "Invalid Column ID", http.StatusBadRequest)
		return
	}

	// connect to db
	db, err := loadMongoClient()
	if err != nil {
		log.Println(err.Error())
		http.Error(w, http.StatusText(http.StatusInternalServerError), http.StatusInternalServerError)
		return
	}

	// get column
	columnsCollection := retrieveMongoCollection(db, "team_zero", "columns")
	filter := bson.M{"_id": columnID, "board_id": boardID}
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()
	var column Column
	err = columnsCollection.FindOne(ctx, filter).Decode(&column)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			http.Error(w, "The specified Board/Column ID combination does not exist", http.StatusBadRequest)
		} else {
			log.Println(err.Error())
			http.Error(w, http.StatusText(http.StatusInternalServerError), http.StatusInternalServerError)
		}
		return
	}

	// send result
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(column)
}

func getBoard(w http.ResponseWriter, r *http.Request) {

	// parse request body
	queryVars := mux.Vars(r)
	boardID, err := primitive.ObjectIDFromHex(queryVars["boardID"])
	if err != nil {
		http.Error(w, "Invalid Board ID", http.StatusBadRequest)
		return
	}

	// connect to db
	db, err := loadMongoClient()
	if err != nil {
		log.Println(err.Error())
		http.Error(w, http.StatusText(http.StatusInternalServerError), http.StatusInternalServerError)
		return
	}

	// get board
	boardsCollection := retrieveMongoCollection(db, "team_zero", "boards")
	filter := bson.M{"_id": boardID}
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()
	var board Board
	err = boardsCollection.FindOne(ctx, filter).Decode(&board)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			http.Error(w, "The specified Board ID does not exist", http.StatusBadRequest)
		} else {
			log.Println(err.Error())
			http.Error(w, http.StatusText(http.StatusInternalServerError), http.StatusInternalServerError)
		}
		return
	}

	// send result
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(board)
}
