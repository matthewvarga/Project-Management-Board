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
    router.HandleFunc("/api/boards/", createBoard)
    router.HandleFunc("/api/boards/{board_id}/columns/", createColumn)
    router.HandleFunc("/api/boards/{board_id}/columns/{column_id}/tickets/", createTicket)
}
