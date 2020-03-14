package main

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"log"
	"net/http"
	"reflect"
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

		case strings.HasPrefix(err.Error(), "cannot unmarshal into an ObjectID"):
			msg := "Request body contains an invalid value for an ID field"
			return &malformedRequest{status: http.StatusBadRequest, msg: msg}

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

// Board Object
type Board struct {
	ID      primitive.ObjectID `json:"id" bson:"_id,omitempty"`
	Title   string             `json:"title" bson:"title"`
	Columns []Column           `json:"columns" bson:"columns"`
}

// Column Object
type Column struct {
	ID      primitive.ObjectID `json:"id" bson:"_id,omitempty"`
	Title   string             `json:"title" bson:"title"`
	Tickets []Ticket           `json:"tickets" bson:"tickets"`
}

// Ticket Object
type Ticket struct {
	ID          primitive.ObjectID `json:"id" bson:"_id,omitempty"`
	Title       string             `json:"title" bson:"title"`
	Description string             `json:"description" bson:"description"`
	Assignee    string             `json:"assignee" bson:"assignee"`
	Points      int                `json:"points" bson:"points"`
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
	newBoard.ID = primitive.NewObjectID()
	newBoard.Columns = []Column{}

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
	_, err = boardsCollection.InsertOne(ctx, newBoard)
	if err != nil {
		log.Println(err.Error())
		http.Error(w, http.StatusText(http.StatusInternalServerError), http.StatusInternalServerError)
		return
	}

	// send new board info
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(newBoard)
}

func createColumn(w http.ResponseWriter, r *http.Request) {

	// parse query vars
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
	newColumn.ID = primitive.NewObjectID()
	newColumn.Tickets = []Ticket{}

	// connect to db
	db, err := loadMongoClient()
	if err != nil {
		log.Println(err.Error())
		http.Error(w, http.StatusText(http.StatusInternalServerError), http.StatusInternalServerError)
		return
	}

	// add column to board
	boardsCollection := retrieveMongoCollection(db, "team_zero", "boards")
	filter := bson.D{primitive.E{Key: "_id", Value: boardID}}
	update := bson.D{primitive.E{Key: "$push", Value: bson.D{primitive.E{Key: "columns", Value: newColumn}}}}
	opts := options.FindOneAndUpdate().SetReturnDocument(1)
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()
	var board Board
	err = boardsCollection.FindOneAndUpdate(ctx, filter, update, opts).Decode(&board)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			http.Error(w, "The specified Board ID does not exist", http.StatusBadRequest)
		} else {
			log.Println(err.Error())
			http.Error(w, http.StatusText(http.StatusInternalServerError), http.StatusInternalServerError)
		}
		return
	}

	// send updated board info
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(board)
}

func createTicket(w http.ResponseWriter, r *http.Request) {

	// parse query vars
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
	newTicket.ID = primitive.NewObjectID()

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

	// connect to db
	db, err := loadMongoClient()
	if err != nil {
		log.Println(err.Error())
		http.Error(w, http.StatusText(http.StatusInternalServerError), http.StatusInternalServerError)
		return
	}

	// add ticket to board
	boardsCollection := retrieveMongoCollection(db, "team_zero", "boards")
	filter := bson.D{primitive.E{Key: "_id", Value: boardID}, primitive.E{Key: "columns._id", Value: columnID}}
	update := bson.D{primitive.E{Key: "$push", Value: bson.D{primitive.E{Key: "columns.$.tickets", Value: newTicket}}}}
	opts := options.FindOneAndUpdate().SetReturnDocument(1)
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()
	var board Board
	err = boardsCollection.FindOneAndUpdate(ctx, filter, update, opts).Decode(&board)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			http.Error(w, "The specified Board/Column ID combination does not exist", http.StatusBadRequest)
		} else {
			log.Println(err.Error())
			http.Error(w, http.StatusText(http.StatusInternalServerError), http.StatusInternalServerError)
		}
		return
	}

	// return updated board info
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(board)
}

func getBoard(w http.ResponseWriter, r *http.Request) {

	// parse query vars
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

func updateBoard(w http.ResponseWriter, r *http.Request) {

	// parse query vars
	queryVars := mux.Vars(r)
	boardID, err := primitive.ObjectIDFromHex(queryVars["boardID"])
	if err != nil {
		http.Error(w, "Invalid Board ID", http.StatusBadRequest)
		return
	}

	// parse request body
	var newBoard Board
	err = decodeJSONBody(w, r, &newBoard)
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

	if boardID != newBoard.ID {
		http.Error(w, "The Board ID being updated does not match the provided Board's ID", http.StatusBadRequest)
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

	// check that the board has the same column and ticket ids
	oldCIDs := make(map[primitive.ObjectID]bool)
	oldTIDs := make(map[primitive.ObjectID]bool)
	for _, c := range board.Columns {
		oldCIDs[c.ID] = true
		for _, t := range c.Tickets {
			oldTIDs[t.ID] = true
		}
	}
	newCIDs := make(map[primitive.ObjectID]bool)
	newTIDs := make(map[primitive.ObjectID]bool)
	for _, c := range newBoard.Columns {
		newCIDs[c.ID] = true
		for _, t := range c.Tickets {
			newTIDs[t.ID] = true
		}
	}
	if !reflect.DeepEqual(oldCIDs, newCIDs) || !reflect.DeepEqual(oldTIDs, newTIDs) {
		http.Error(w, "The Column and Ticket IDs provided do not match the Board's IDs", http.StatusBadRequest)
		return
	}

	// replace the board
	_, err = boardsCollection.ReplaceOne(ctx, filter, &newBoard)
	if err != nil {
		log.Println(err.Error())
		http.Error(w, http.StatusText(http.StatusInternalServerError), http.StatusInternalServerError)
		return
	}

	// send result
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(newBoard)
}

func deleteTicket(w http.ResponseWriter, r *http.Request) {

	// get board/column/ticket ids
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
		http.Error(w, "Invalid Ticket ID", http.StatusBadRequest)
		return
	}

	// connect to db
	db, err := loadMongoClient()
	if err != nil {
		log.Println(err.Error())
		http.Error(w, http.StatusText(http.StatusInternalServerError), http.StatusInternalServerError)
		return
	}
	// delete ticket from board
	boardsCollection := retrieveMongoCollection(db, "team_zero", "boards")
	filter := bson.D{primitive.E{Key: "_id", Value: boardID}, primitive.E{Key: "columns._id", Value: columnID}, primitive.E{Key: "columns.tickets._id", Value: ticketID}}
	update := bson.D{primitive.E{Key: "$pull", Value: bson.D{primitive.E{Key: "columns.$.tickets", Value: bson.D{primitive.E{Key: "_id", Value: ticketID}}}}}}
	opts := options.FindOneAndUpdate().SetReturnDocument(1)
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()
	var board Board
	err = boardsCollection.FindOneAndUpdate(ctx, filter, update, opts).Decode(&board)
	//err = boardsCollection.FindOne(ctx, filter).Decode(&board)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			http.Error(w, "The specified Board/Column/Ticket ID combination does not exist", http.StatusBadRequest)
		} else {
			log.Println(err.Error())
			http.Error(w, http.StatusText(http.StatusInternalServerError), http.StatusInternalServerError)
		}
		return
	}

	// return success
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(board)
}

func deleteColumn(w http.ResponseWriter, r *http.Request) {

	// get board/column ids
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

	// delete column
	boardsCollection := retrieveMongoCollection(db, "team_zero", "boards")
	filter := bson.D{primitive.E{Key: "_id", Value: boardID}, primitive.E{Key: "columns._id", Value: columnID}}
	update := bson.D{primitive.E{Key: "$pull", Value: bson.D{primitive.E{Key: "columns", Value: bson.D{primitive.E{Key: "_id", Value: columnID}}}}}}
	opts := options.FindOneAndUpdate().SetReturnDocument(1)
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()
	var board Board
	err = boardsCollection.FindOneAndUpdate(ctx, filter, update, opts).Decode(&board)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			http.Error(w, "The specified Board/Column ID combination does not exist", http.StatusBadRequest)
		} else {
			log.Println(err.Error())
			http.Error(w, http.StatusText(http.StatusInternalServerError), http.StatusInternalServerError)
		}
		return
	}

	// return success
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(board)
}

func deleteBoard(w http.ResponseWriter, r *http.Request) {

	// get board id
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

	// delete board
	boardsCollection := retrieveMongoCollection(db, "team_zero", "boards")
	filter := bson.D{primitive.E{Key: "_id", Value: boardID}}
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()
	var board Board
	err = boardsCollection.FindOneAndDelete(ctx, filter).Decode(&board)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			http.Error(w, "The specified Board ID does not exist", http.StatusBadRequest)
		} else {
			log.Println(err.Error())
			http.Error(w, http.StatusText(http.StatusInternalServerError), http.StatusInternalServerError)
		}
		return
	}

	// return success
	w.Header().Set("Content-Type", "application/json")
}
