# Project Team Zero GitHub API Wrappers Documentation
 - These REST calls are for internal use only by the application, and require the user of the application to be authenticated in order for these REST calls to be successful, hence examples are not being provided since the application is responsible for setting up the call with correct headers and passing in the required token
 - Examples of functionality provided by these calls include getting repositories, branches, collaborators, as well as being able to create branches and pull requests
 - These REST calls mostly interact with the existing GitHub API, but have been simplified to meet the use case of our application

## Sign Out
- description: signs out the current user
- request: `GET api/signout/`
- response: 200
    - The current user has signed out

## GitHub OAuth
- description: endpoint to start GitHub OAuth handshake to retrieve the OAuth token
- request: `GET oauth/redirect/`
- response: 200
    - The current user has signed out

## Get Branches
- description: retrieve a list of branches for a repository
- request: `GET /api/{owner}/repos/{repo}/branches`
    - owner: owner of repository
    - repo: name of repository
- response: 200
    - List of branches along with their details

## Get Repositories
- description: retrieve a list of repositorie
- request: `GET /api/repos`
- response: 200
    - List of repositories along with their details

## Get Collaborators
- description: retrieve a list of collaborators for a repository
- request: `GET /api/{owner}/repos/{repo}/users`
    - owner: owner of repository
    - repo: name of repository
- response: 200
    - List of collaborators along with their details

## Create Branch
- description: create a branch for a repository
- request: `POST /api/branches`
    - content-type: `application/json`
    - body: object
      - sourceBranch: (string) the source to branch from
      - newBranch: (string) name of branch to create
      - owner: (string) the owner of the repo
      - repo: (string) the name of the repo
- response: 200
    - A branch has been created within the repository

## Create Pull Request
- description: create a branch for a repository
- request: `POST /api/repos/pulls`
    - content-type: `application/json`
    - body: object
      - src: (string) the source to merge from from
      - dest: (string) the branch to merge to
      - title: (string) the title of the PR
      - body: (string) the description of the PR
      - owner: (string) the owner of the repo
      - repo: (string) the name of the repo
- response: 200
    - A Pull Request has been created
