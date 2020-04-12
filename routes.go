package main

import (
	"encoding/json"
	"log"
	"net/http"

	"github.com/gorilla/mux"
)

const clientID = "ecd70f356de063418ef0"
const clientSecret = "0090c648260f30e8da7a38d252b8b6a17f1576c1"

func getToken(r *http.Request) string {
	for _, cookie := range r.Cookies() {
		if cookie.Name == "token" {
			return cookie.Value
		}
	}
	return ""
}

// user session struct
type authenticationMiddleware struct {
	tokenUsers map[string]string
}

var amw authenticationMiddleware = authenticationMiddleware{tokenUsers: make(map[string]string)}

// Middleware function, which will be called for each request
func (amw *authenticationMiddleware) Middleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		token := getToken(r)

		if user, found := amw.tokenUsers[token]; found {
			// We found the token in our map
			log.Printf("Authenticated user %s\n", user)
			// Pass down the request to the next middleware (or final handler)
			next.ServeHTTP(w, r)
		} else {
			// Write an error and stop the handler chain
			http.Error(w, "Forbidden", http.StatusForbidden)
		}
	})
}

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

	subrouter := router.PathPrefix("/api").Subrouter()
	subrouter.Use(amw.Middleware)
	// ADD OTHER ROUTES HERE
	subrouter.HandleFunc("/boards/", createBoard).Methods("POST")
	subrouter.HandleFunc("/boards/{boardID}/columns/", createColumn).Methods("POST")
	subrouter.HandleFunc("/boards/{boardID}/columns/{columnID}/tickets/", createTicket).Methods("POST")
	subrouter.HandleFunc("/boards/{boardID}/", updateBoard).Methods("PATCH")
	subrouter.HandleFunc("/boards/{boardID}/", getBoard).Methods("GET")
	subrouter.HandleFunc("/boards/user/{user}/", getBoardFromUser).Methods("GET")
	subrouter.HandleFunc("/boards/{boardID}/", deleteBoard).Methods("DELETE")
	subrouter.HandleFunc("/boards/{boardID}/columns/{columnID}/", deleteColumn).Methods("DELETE")
	subrouter.HandleFunc("/boards/{boardID}/columns/{columnID}/tickets/{ticketID}", deleteTicket).Methods("DELETE")
	// Handle GitHub OAuth authorization
	router.HandleFunc("/oauth/redirect", func(w http.ResponseWriter, r *http.Request) {
		githubAuthorize(w, r, clientID, clientSecret)
	})

	// POST to create a branch
	router.HandleFunc("/api/branches", func(w http.ResponseWriter, r *http.Request) {
		createBranch(w, r, getToken(r))
	}).Methods("POST")

	// POST to create a PR
	router.HandleFunc("/api/repos/pulls", func(w http.ResponseWriter, r *http.Request) {
		createPullRequest(w, r, getToken(r))
	}).Methods("POST")

	// GET to retrieve branches for given repo
	router.HandleFunc("/api/{owner}/repos/{repo}/branches", func(w http.ResponseWriter, r *http.Request) {
		getBranches(w, r, getToken(r))
	}).Methods("GET")

	// GET
	router.HandleFunc("/api/repos", func(w http.ResponseWriter, r *http.Request) {
		getRepositories(w, r, getToken(r))
	}).Methods("GET")

	// GET to get a list of collaborators
	router.HandleFunc("/api/{owner}/repos/{repo}/users", func(w http.ResponseWriter, r *http.Request) {
		getRepositoryCollaborators(w, r, getToken(r))
	}).Methods("GET")

	// GET to Sign out
	router.HandleFunc("/api/signout", func(w http.ResponseWriter, r *http.Request) {
		signout(w, r)
	}).Methods("GET")
}
