# Team Zero

Our application, *zero*, aims to be a project management tool that is integrated with github, allowing for easy collaboration amongst developers. It is a visual aid for tracking who is working on what, along with providing essential git features such as creating / merging branches, and submitting merge requests. It can seen as a combination of numerous similar tools such as Jira, Github Projects, and Gitlab Boards, but with handpicked features from all combined into a single simple application.

## Team Members

This project was created by:

- Matthew Varga
- Abithan Kumarasamy
- Johnson Zhu


## Beta Version

Below is a list of key features we would like to have completed for the Beta version:

- User registration and login through github OAuth
- Display a project board for each logged in user
- Connect a users github repository to the project board
- Allow users to add, remove, and re-arrange columns within the board
- Allow users to add, remove, and re-arrange tickets within columns on the baord

## Final Version

Below is a list of features we would like to have completed for the Final version:

- Allow users to edit existing columns
- Allow users to edit existing tickets
- Add additional information to tickets (flags, story points, comments, assignee)
- track how long a ticket is in each column
- connect tickets to git branches (be able to create a new branch from the ticket)
- be able to filter tickets based on their flags or title
- add a slack / discord bot that notifies the room when:
    - a new ticket has been made
    - a ticket has moved between columns
    - a ticket assignee has changed

## Technology Involved

- For this applciation, we will be utilizing the following technologies:
    - [Go](https://golang.org/) - web server
    - [Gorilla](https://www.gorillatoolkit.org/) - go toolkit for sessions, router, csrf protection, cookies
    - [Mongodb](https://www.mongodb.com/) - database
    - [GraphQL](https://graphql.org/) - query language
    - [React](https://reactjs.org/) - library for developing UI components
    - [React-Router](https://reacttraining.com/react-router/web/guides/quick-start) - library to allow for frontend routing
    - [Webpack](https://webpack.js.org/) - bundle all frontend together
    - [Babel](https://babeljs.io/) - compiler for js and sass
    - [npm](https://www.npmjs.com/) - install and manage froment dependencies
    - [sass](https://sass-lang.com/) - cleaner and more managable css

## Top 5 Technnical Challenges

Our top 5 technical challenges we plan to overcome during this project are:

1) Utilizing many new frontent frameworks / librarys (React, Webpack, Babel, SASS)
2) Utilizing a variety of new backend and database languages / resources (Go, MongoDB, GraphQL)
3) Heavily Integrating APIs (GitHub, Discord / Slack)
4) Involving Continous Integration in the development cycle
5) creating a slack / discor bot that works alongside the web application

## Getting Started

To begin developing the application locally, follow the instructions listed below. Deployment instructions are provided further down in this document.

1) `clone` the repository into your *GOPATH*
2) `cd` into *static* and run: `npm install`, this will install all dependencies required for the frontend development
4) from *root* directory install the required dependencies:

    ```
        go get github.com/gorilla/mux
    ```
5) if developing **only** the frontend without need of the server to be running, run `npm start` from *static*, and a development server will open on `localhost:8080`.
6) if developing server or need server running follow the steps below:
    - run: `npm run build` from *root* to **compile(todo find better word)** javascript files into single file within *dist*
    - run `go run .` from *root*, this will open a development server on `localhost:3000`

## Prerequisits / Dependencies

### frontend

- [nodejs](https://nodejs.org/en/)

- [npm](https://www.npmjs.com/) - package manager for dependencies

- [webpack](https://webpack.js.org/) - bundle everything together
    - [html-webpack-plugin](https://github.com/jantimon/html-webpack-plugin)

- [babel](https://babeljs.io/) - compile javascript for cross-browser support

- [react](https://reactjs.org/) - build UI components
    - [react-router](https://reacttraining.com/react-router/web/guides/quick-start) - frontend routing

- [sass](https://sass-lang.com/) - cleaner css

### backend

- [Go](https://golang.org/)

    - [gorilla/mux](https://github.com/gorilla/mux) - router

## Deployment

TODO: add instructions on how to deploy to production environment.

## Acknowledgments

The frontend setup steps were followed from [here](https://www.valentinog.com/blog/babel/?fbclid=IwAR3GD55NNS9rAWAEn3QS1TSmrLmIVr7EARtUgmRHD5AUlW9ETj7A7flAluQ).
