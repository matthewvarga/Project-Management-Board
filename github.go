package main

import (
	"net/http"
	"io/ioutil"
	"log"
	"encoding/json"
)

/**
Returns a list of repository objects. In order to get a list of names, loop through list of returned objects
and filter by full_name parameter
**/
func getRepositories(w http.ResponseWriter, r *http.Request, token string) {
	client := http.Client{}
	request, _ := http.NewRequest("GET", "https://api.github.com/user/repos", nil)

	request.Header.Set("Content-Type", "application/json")
	request.Header.Set("Authorization", "token " + token)

	response, err := client.Do(request)

	if err != nil {
		log.Fatalln(err)
	}

	defer response.Body.Close()

	body, _ := ioutil.ReadAll(response.Body)
	
	w.Header().Set("Content-Type", "application/json")
	w.Write(body)
}

type Repository struct {
	Repo string
	Owner string 
}

/**
Gets a list of collaborators for a specific repository, and the following need to be in the POST request
repo: name field of repository
owner: owner field of repository
**/
func getRepositoryCollaborators(w http.ResponseWriter, r *http.Request, token string) {
	var repository Repository

	err := json.NewDecoder(r.Body).Decode(&repository)
    if err != nil {
        http.Error(w, err.Error(), http.StatusBadRequest)
	}

	client := http.Client{}
	request, _ := http.NewRequest("GET", "https://api.github.com/repos/" + repository.Owner + "/" + repository.Repo + "/collaborators", nil)

	request.Header.Set("Content-Type", "application/json")
	request.Header.Set("Authorization", "token " + token)

	response, err := client.Do(request)

	if err != nil {
		log.Fatalln(err)
	}

	defer response.Body.Close()

	body, _ := ioutil.ReadAll(response.Body)
	
	w.Header().Set("Content-Type", "application/json")
	w.Write(body)
}