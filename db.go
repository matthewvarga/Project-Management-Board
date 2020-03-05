package main

import (
	"context"
	"log"
	"time"

	"go.mongodb.org/mongo-driver/bson"
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
