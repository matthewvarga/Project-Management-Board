package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"time"
)

// OAuthAccessResponse ...
type OAuthAccessResponse struct {
	AccessToken string `json:"access_token"`
}

// ProfileResponse ...
type ProfileResponse struct {
	Login string `json:"login"`
}

/*
Full credits to https://www.sohamkamani.com/blog/golang/2018-06-24-oauth-with-golang/ for providing the tutorial
to perform a GitHub OAuth Flow in Go. Setting up the HTTP request and headers was mostly borrowed, but certain aspects
like storing the OAuth token in the cookie was implemented by us.
*/
func githubAuthorize(w http.ResponseWriter, r *http.Request, clientID, clientSecret string) {

	httpClient := http.Client{}
	// First, we need to get the value of the `code` query param
	err := r.ParseForm()

	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
	}

	// code is a specific parameter sent back with the OAuth redirect
	code := r.FormValue("code")

	// Next, lets for the HTTP request to call the github oauth enpoint
	// to get our access token
	reqURL := fmt.Sprintf("https://github.com/login/oauth/access_token?client_id=%s&client_secret=%s&code=%s", clientID, clientSecret, code)
	req, err := http.NewRequest(http.MethodPost, reqURL, nil)

	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
	}

	// We set this header since we want the response as JSON
	req.Header.Set("accept", "application/json")

	// Send out the HTTP request
	res, err := httpClient.Do(req)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
	}
	defer res.Body.Close()

	// Parse the request body into the `OAuthAccessResponse` struct
	var t OAuthAccessResponse
	if err := json.NewDecoder(res.Body).Decode(&t); err != nil {
		w.WriteHeader(http.StatusBadRequest)
	}

	// set the cookie for the OAuth token
	cookie := &http.Cookie{
		Name:     "token",
		Value:    t.AccessToken,
		Path:     "/",
		HttpOnly: true,
		Secure:   true,
	}

	http.SetCookie(w, cookie)

	// create and execute a response to extract the username using the token
	request, _ := http.NewRequest("GET", "https://api.github.com/user", nil)
	request.Header.Set("Content-Type", "application/json")
	request.Header.Set("Authorization", "token "+t.AccessToken)

	response, err := httpClient.Do(request)

	if err != nil {
		log.Fatalln(err)
	}

	defer response.Body.Close()

	var profile ProfileResponse
	if err := json.NewDecoder(response.Body).Decode(&profile); err != nil {
		w.WriteHeader(http.StatusBadRequest)
	}

	// set the cookie for the username
	userCookie := &http.Cookie{
		Name:   "username",
		Value:  profile.Login,
		Path:   "/",
		Secure: true,
	}

	http.SetCookie(w, userCookie)
	if t.AccessToken != "" {
		amw.tokenUsers[t.AccessToken] = profile.Login
	}

	// redirect to home page
	w.Header().Set("Location", "/")
	w.WriteHeader(http.StatusFound)
}

func logout(w http.ResponseWriter, r *http.Request) {
	tCookie := &http.Cookie{
		Name:     "token",
		Value:    "",
		Path:     "/",
		Expires:  time.Unix(0, 0),
		HttpOnly: true,
	}
	uCookie := &http.Cookie{
		Name:     "username",
		Value:    "",
		Path:     "/",
		Expires:  time.Unix(0, 0),
		HttpOnly: true,
	}

	http.SetCookie(w, tCookie)
	http.SetCookie(w, uCookie)
	w.WriteHeader(http.StatusOK)
}
