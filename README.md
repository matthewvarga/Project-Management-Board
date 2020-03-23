# Team Zero 

Our application, *zero*, aims to be a project management tool that is well integrated with GitHub, allowing for easy collaboration amongst developers. It is a visual aid for tracking who is working on what, along with providing essential git features such as creating / merging branches, and submitting pull requests. It can seen as a combination of numerous similar tools such as Jira, GitHub Projects, and Gitlab Boards, but with handpicked features from all combined into a single simple and easy to use application.

## Team Members

This project was created by:

- Matthew Varga
- Abithan Kumarasamy
- Johnson Zhu


## Team Members

This project was created by:

- Matthew Varga
- Abithan Kumarasamy
- Johnson Zhu


## Beta Version

Below is a list of key features we would like to have completed for the Beta version:

- User registration and login through GitHub OAuth
- Display a project board for each logged in user
- Connect a user's GitHub repository to the project board
- Allow users to add, remove, and re-arrange columns within the board
- Allow users to add, remove, and re-arrange tickets within columns on the board
- We will have a backend API that provides the interface for all of the functionality mentioned above
- Have a frontend that should be integrated with the backend API
- Ideally, we will keep security in mind throughout the whole process, so managing sessions, sanitizing input etc.

## Final Version

Below is a list of features we would like to have completed for the Final version:

- Allow users to edit existing columns
- Allow users to edit existing tickets
- Add additional information to tickets (flags, story points, comments, assignee)
- Track how long a ticket is in each column
- Connect tickets to git branches (be able to create a new branch from the ticket)
- Connect tickets to git repositories
- Add tags to tickets
- Be able to filter tickets based on their tags or title
- Add a slack / discord bot that notifies the room when:
    - a new ticket has been made or closed
    - a ticket has moved between columns
    - a ticket assignee has changed

## Technology Involved

- For this application, we will be utilizing the following technologies:
    - [Go](https://golang.org/) - web server
    - [Gorilla](https://www.gorillatoolkit.org/) - go toolkit for sessions, router, csrf protection, cookies
    - [Mongodb](https://www.mongodb.com/) - database
    - [GraphQL](https://graphql.org/) - query language
    - [React](https://reactjs.org/) - library for developing UI components
    - [React-Router](https://reacttraining.com/react-router/web/guides/quick-start) - library to allow for frontend routing
    - [react-redux](https://react-redux.js.org/) - application state container
    - [Webpack](https://webpack.js.org/) - bundle all frontend together
    - [Babel](https://babeljs.io/) - compiler for js and sass
    - [npm](https://www.npmjs.com/) - install and manage froment dependencies
    - [sass](https://sass-lang.com/) - cleaner and more managable css

## Top 5 Technnical Challenges

Our top 5 technical challenges we plan to overcome during this project are:

1) Utilizing many new frontend frameworks / libraries (React, Webpack, Babel, SASS)
2) Utilizing a variety of new backend and database languages / resources (Go, MongoDB, GraphQL)
3) Heavily Integrating APIs (GitHub, Discord / Slack)
4) Involving Continous Integration in the development cycle, as well as being able to deploy from scratch
5) Creating a slack / discord bot that works alongside the web application

## Getting Started

To begin developing the application locally, follow the instructions listed below. Deployment instructions are provided further down in this document.

1) `clone` the repository into your *GOPATH*
2) `cd` into *static* and run: `npm install`, this will install all dependencies required for the frontend development
4) from *root* directory install the required dependencies:

    ```
        go get github.com/gorilla/mux
        go get github.com/gorilla/handlers
        go get go.mongodb.org/mongo-driver/mongo
    ```
5) if developing **only** the frontend without need of the server to be running, run `npm start` from *static*, and a development server will open on `localhost:8080`.
6) if developing server or need server running follow the steps below:
    - run: `npm run build` from *root* to **compile(todo find better word)** javascript files into single file within *dist*
    - run `go run .` from *root*, this will open a development server on `project-management.tools`

## Prerequisites / Dependencies

### Frontend

- [nodejs](https://nodejs.org/en/)

- [npm](https://www.npmjs.com/) - package manager for dependencies

- [webpack](https://webpack.js.org/) - bundle everything together
    - [html-webpack-plugin](https://github.com/jantimon/html-webpack-plugin)

- [babel](https://babeljs.io/) - compile javascript for cross-browser support

- [react](https://reactjs.org/) - build UI components
    - [react-router](https://reacttraining.com/react-router/web/guides/quick-start) - frontend routing

- [react-redux](https://react-redux.js.org/) - application state container

- [sass](https://sass-lang.com/) - cleaner css

### Backend

- [Go](https://golang.org/)
    - [gorilla/mux](https://github.com/gorilla/mux) - router

- [mongDB](https://www.mongodb.com/)

## Deployment

TODO: add instructions on how to deploy to production environment.

production ip: 138.197.169.114

## Acknowledgments

The frontend setup steps were followed from [here](https://www.valentinog.com/blog/babel/?fbclid=IwAR3GD55NNS9rAWAEn3QS1TSmrLmIVr7EARtUgmRHD5AUlW9ETj7A7flAluQ).

Tutorial for GitHub OAuth was followed from here: https://www.sohamkamani.com/blog/golang/2018-06-24-oauth-with-golang/
