package main

import (
	"net/http"
	"log"
	"io/ioutil"
)

/**
Returns a list of repository objects. In order to get a list of names, loop through list of returned objects
and filter by full_name parameter
**/
func getRepositories(w http.ResponseWriter, r *http.Request, token string) {
	client := http.Client{}
	request, err := http.NewRequest("GET", "https://api.github.com/user/repos", nil)

	request.Header.Set("Content-Type", "application/json")
	request.Header.Set("Authorization", "token " + token)

	if err != nil {
		log.Fatalln(err)
	}

	response, err := client.Do(request)

	if err != nil {
		log.Fatalln(err)
	}

	defer response.Body.Close()

	body, err := ioutil.ReadAll(response.Body)
	
	w.Header().Set("Content-Type", "application/json")
	w.Write(body)
}