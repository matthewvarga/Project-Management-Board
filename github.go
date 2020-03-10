package main

import (
	"net/http"
	"io/ioutil"
	"log"
	"encoding/json"
	"bytes"
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

type CreateBranchRequest struct {
	SourceBranch string `json:"sourceBranch"`
	NewBranch string `json:"newBranch"`
	Repo string `json:"repo"`
	Owner string `json:"owner"`
}

type GetBranch struct {
	Ref    string `json:"ref"`
	NodeID string `json:"node_id"`
	URL    string `json:"url"`
	Object struct {
		Sha  string `json:"sha"`
		Type string `json:"type"`
		URL  string `json:"url"`
	} `json:"object"`
}

/**
Creates a branch in GitHub
repo: name field of repository
owner: owner field of repository
sourceBranch: string of old branch
newBranch: string of new branch
**/
func createBranch(w http.ResponseWriter, r *http.Request, token string) {
	var createBranchRequest CreateBranchRequest
	var getBranch GetBranch

	err := json.NewDecoder(r.Body).Decode(&createBranchRequest)

	if err != nil {
        http.Error(w, err.Error(), http.StatusBadRequest)
	}
	
	client := http.Client{}
	request, _ := http.NewRequest("GET", "https://api.github.com/repos/" + createBranchRequest.Owner + "/" + createBranchRequest.Repo + "/git/ref/heads/" + createBranchRequest.SourceBranch, nil)

	request.Header.Set("Content-Type", "application/json")
	request.Header.Set("Authorization", "token " + token)

	response, err := client.Do(request)

	if err != nil {
		log.Fatalln(err)
	}

	defer response.Body.Close()

	// need the SHA hash of the commit that we are trying to branch from
	if err := json.NewDecoder(response.Body).Decode(&getBranch); err != nil {
		w.WriteHeader(http.StatusBadRequest)
	}

	// create a new branch request using new branch name and SHA hash of commit to branch from
	requestBody := map[string]string{"ref": "refs/heads/" + createBranchRequest.NewBranch, "sha": getBranch.Object.Sha}
	requestJSON, err := json.Marshal(requestBody)
	createRequest, _ := http.NewRequest("POST", "https://api.github.com/repos/" + createBranchRequest.Owner + "/" + createBranchRequest.Repo + "/git/refs", bytes.NewBuffer(requestJSON))
	createRequest.Header.Set("Content-Type", "application/json")
	createRequest.Header.Set("Authorization", "token " + token)
	
	createResponse, err := client.Do(createRequest)

	if err != nil {
		log.Fatalln(err)
	}

	defer createResponse.Body.Close()
	
	body, _ := ioutil.ReadAll(createResponse.Body)
	
	w.Header().Set("Content-Type", "application/json")
	w.Write(body)
}