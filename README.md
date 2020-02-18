# Team Zero

Our application, *zero*, aims to be a project management tool that is integrated with github, allowing for easy collaboration amongst developers. It is a visual aid for tracking who is working on what, along with proving essential git features such as creating / merging branches, and submitting merge requests. It can seen as a combination of numerous similar tools such as Jira, Github Projects, and Gitlab Boards, but with handpicked features from all combined into a single simple application.

## Beta Version

Below is a list of key features we would like to have completed for the Beta version:

- TODO

## Final Version

Below is a list of features we would like to have completed for the Final version:

- TODO

## Technology Involved

- TODO

## Top 5 Technnical Challenges

- TODO

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

## Authors

This project was created by:

- Matthew Varga
- Abithan Kumarasamy
- Johnson Zhu

## Acknowledgments

The frontend setup steps were followed from [here](https://www.valentinog.com/blog/babel/?fbclid=IwAR3GD55NNS9rAWAEn3QS1TSmrLmIVr7EARtUgmRHD5AUlW9ETj7A7flAluQ).
