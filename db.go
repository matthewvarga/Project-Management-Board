package main

import (
	"context"
	"log"
	"time"
    "net/http"
    "fmt"
    "errors"
    "io"
    "strings"
	"github.com/gorilla/mux"
    "encoding/json"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"go.mongodb.org/mongo-driver/mongo/readpref"
    "go.mongodb.org/mongo-driver/bson/primitive"
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
type Board struct {
    ID primitive.ObjectID `bson:"_id,omitempty"`
    Title string `json:"title" bson:"title"`
}

type Column struct {
    ID primitive.ObjectID `bson:"_id,omitempty"`
    Title string `json:"title" bson:"title"`
    BoardID primitive.ObjectID `bson:"board_id"`
}

type Ticket struct {
    ID primitive.ObjectID `bson:"_id,omitempty"`
    Title string `json:"title" bson:"title"`
    Description string `json:"description" bson:"description"`
    Assignee string `json:"assignee" bson:"assignee"`
    Points int `json:"points" bson:"points"`
    ColumnID primitive.ObjectID `bson:"column_id"`
}

type ID struct {
    ID interface{} `json:"_id", bson:"_id"`
}

func createBoard(w http.ResponseWriter, r *http.Request) {
    
    // parse request body
    var board Board
    err := decodeJSONBody(w, r, &board)
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
    
    // insert board
    boards := retrieveMongoCollection(db, "team_zero", "boards")
    ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
    defer cancel()
    res, err := boards.InsertOne(ctx, board)
    if err != nil {
        log.Println(err.Error())
        http.Error(w, http.StatusText(http.StatusInternalServerError), http.StatusInternalServerError)
        return
    }
    
    /*
    // get board info
    filter := bson.M{"_id": res.InsertedID}
	ctx, cancel = context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()
	err = boards.FindOne(ctx, filter).Decode(&board)
	if err != nil {
        log.Println(err.Error())
		http.Error(w, http.StatusText(http.StatusInternalServerError), http.StatusInternalServerError)
        return
	}
    */
    
    // send result
    w.Header().Set("Content-Type", "application/json")
    json.NewEncoder(w).Encode(ID{ID: res.InsertedID})
}

func createColumn(w http.ResponseWriter, r *http.Request) {
    
    // parse request body
    var column Column
    queryVars := mux.Vars(r)
    board_id, error := primitive.ObjectIDFromHex(queryVars["board_id"])
    if error != nil {
        http.Error(w, "Invalid Board ID", http.StatusBadRequest)
        return
    }
    column.BoardID = board_id
    err := decodeJSONBody(w, r, &column)
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
    // check if board exists
    boards := retrieveMongoCollection(db, "team_zero", "boards")
    filter := bson.M{"_id": board_id}
    ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()
    var board Board
	err = boards.FindOne(ctx, filter).Decode(&board)
	if err != nil {
        if err.Error() == "mongo: no documents in result" {
            http.Error(w, "Invalid Board ID", http.StatusBadRequest)
        } else {
            log.Println(err.Error())
            http.Error(w, http.StatusText(http.StatusInternalServerError), http.StatusInternalServerError)
        }
        return
	}
    
    // insert column
    columns := retrieveMongoCollection(db, "team_zero", "columns")
    ctx, cancel = context.WithTimeout(context.Background(), 5*time.Second)
    defer cancel()
    res, err := columns.InsertOne(ctx, column)
    if err != nil {
        log.Println(err.Error())
        http.Error(w, http.StatusText(http.StatusInternalServerError), http.StatusInternalServerError)
        return
    }
    /*
    // get column info
    filter = bson.M{"_id": res.InsertedID}
	ctx, cancel = context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()
	err = columns.FindOne(ctx, filter).Decode(&column)
	if err != nil {
        log.Println(err.Error())
		http.Error(w, http.StatusText(http.StatusInternalServerError), http.StatusInternalServerError)
        return
	}
    */
    
    // send result
    w.Header().Set("Content-Type", "application/json")
    json.NewEncoder(w).Encode(ID{ID: res.InsertedID})
}

func createTicket(w http.ResponseWriter, r *http.Request) {
    
    // parse request body
    var ticket Ticket
    queryVars := mux.Vars(r)
    board_id, error := primitive.ObjectIDFromHex(queryVars["board_id"])
    column_id, error := primitive.ObjectIDFromHex(queryVars["column_id"])
    if error != nil {
        http.Error(w, "Invalid Board ID", http.StatusBadRequest)
        return
    }
    ticket.ColumnID = column_id
    err := decodeJSONBody(w, r, &ticket)
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
    // check if board exists
    boards := retrieveMongoCollection(db, "team_zero", "boards")
    filter := bson.M{"_id": board_id}
    ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()
    var board Board
	err = boards.FindOne(ctx, filter).Decode(&board)
	if err != nil {
        if err.Error() == "mongo: no documents in result" {
            http.Error(w, "Invalid Board ID", http.StatusBadRequest)
        } else {
            log.Println(err.Error())
            http.Error(w, http.StatusText(http.StatusInternalServerError), http.StatusInternalServerError)
        }
        return
	}
    
    // check if column exists
    columns := retrieveMongoCollection(db, "team_zero", "columns")
    filter = bson.M{"_id": column_id}
    ctx, cancel = context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()
    var column Column
	err = columns.FindOne(ctx, filter).Decode(&column)
	if err != nil {
        if err.Error() == "mongo: no documents in result" {
            http.Error(w, "Invalid Column ID", http.StatusBadRequest)
        } else {
            log.Println(err.Error())
            http.Error(w, http.StatusText(http.StatusInternalServerError), http.StatusInternalServerError)
        }
        return
	}
    
    // insert ticket
    tickets := retrieveMongoCollection(db, "team_zero", "tickets")
    ctx, cancel = context.WithTimeout(context.Background(), 5*time.Second)
    defer cancel()
    res, err := tickets.InsertOne(ctx, ticket)
    if err != nil {
        log.Println(err.Error())
        http.Error(w, http.StatusText(http.StatusInternalServerError), http.StatusInternalServerError)
        return
    }
    /*
    // get ticket info
    filter = bson.M{"_id": res.InsertedID}
	ctx, cancel = context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()
	err = tickets.FindOne(ctx, filter).Decode(&ticket)
	if err != nil {
        log.Println(err.Error())
		http.Error(w, http.StatusText(http.StatusInternalServerError), http.StatusInternalServerError)
        return
	}
    */
    
    // send result
    w.Header().Set("Content-Type", "application/json")
    json.NewEncoder(w).Encode(ID{ID: res.InsertedID})
}