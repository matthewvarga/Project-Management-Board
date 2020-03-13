package main

import (
	"encoding/json"
	"net/http"

	"github.com/gorilla/mux"
)

func handleRoutes(router *mux.Router) {

	// EXAMPLE OF API SUPER BASIC API HANDLER
	// CAN ALSO USE MIDDLEWARE TO DICTATE WHAT
	// TYPE OF CALLS THE ENDPOINT ACCEPTS
	// WITH .Methods("GET", "POST", etc...)
	// SEE https://github.com/gorilla/mux#examples
	router.HandleFunc("/api/health", func(w http.ResponseWriter, r *http.Request) {
		// an example API handler
		json.NewEncoder(w).Encode(map[string]bool{"ok": true})
	})

	// ADD OTHER ROUTES HERE

	router.HandleFunc("/api/boards/", createBoard).Methods("POST")
	router.HandleFunc("/api/boards/{boardID}/columns/", createColumn).Methods("POST")
	router.HandleFunc("/api/boards/{boardID}/columns/{columnID}/tickets/", createTicket).Methods("POST")
	router.HandleFunc("/api/boards/{boardID}/", updateBoard).Methods("PATCH")
	router.HandleFunc("/api/boards/{boardID}/", getBoard).Methods("GET")
	router.HandleFunc("/api/boards/{boardID}/", deleteBoard).Methods("DELETE")
	router.HandleFunc("/api/boards/{boardID}/columns/{columnID}/", deleteColumn).Methods("DELETE")
	router.HandleFunc("/api/boards/{boardID}/columns/{columnID}/tickets/{ticketID}", deleteTicket).Methods("DELETE")
}
