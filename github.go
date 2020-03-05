package main

import (
	"fmt"
	"net/http"
	"log"
	"io/ioutil"
)

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