# Project Management Tools REST API Documentation

### Create

- description: create a board
- request: `POST /api/boards/`
    - content-type: `application/json`
    - body: object
      - user: (string) owner of the board
      - title: (string) title of the board
- response: 200
    - content-type: `application/json`
    - body: object
      - id: (string) id of the board
      - user: (string) owner of the board
      - title: (string) title of the board
      - columns (list of objects) columns of the board
- response: 400
    - body: Missing required data/User already has a board

- description: create a column
- request: `POST /api/boards/{boardID}/columns/`
    - content-type: `application/json`
    - body: object
      - title: (string) title of the column
- response: 200
    - content-type: `application/json`
    - body: object
      - id: (string) id of the board
      - title: (string) title of the column
      - tickets: (list of objects) tickets of the board
- response: 400
    - body: Invalid Board ID/Board ID does not exist

- description: create a ticket
- request: `POST /api/boards/{boardID}/columns/{columnID}/tickets/`
    - content-type: `application/json`
    - body: object
      - title: (string) title of the ticket
      - description: (string) description of the ticket
      - assignee: (string) who the ticket is assigned to
      - points: (int) story points of the ticket
      - creator: (string) creator of the tickets
      - creator_img_url: (string) link to profile picture
      - repository: (string) repository name for the ticket
      - branch: (string) branch name for the ticket 
- response: 200
    - content-type: `application/json`
    - body: object
      - _id: (string) the image id
      - title: (string) title of the ticket
      - description: (string) description of the ticket
      - assignee: (string) who the ticket is assigned to
      - points: (int) story points of the ticket
      - creator: (string) creator of the tickets
      - creator_img_url: (string) link to profile picture
      - date_created: (date) ticket creation date
      - repository: (string) repository name for the ticket
      - branch: (string) branch name for the tickete
- response: 400:
    - body: Missing Required Data/Invalid Board/Column ID combination

### Read

- description: retrieve a board using id
- request: `GET /api/boards/{boardID}`
- response: 200
    - content-type: `application/json`
    - body: object
      - id: (string) id of the board
      - user: (string) owner of the board
      - title: (string) title of the board
      - columns (list of objects) columns of the board
- response: 400
    - body: Invalid Board ID/Board ID does not exist
    
- description: retrieve the board for a user
- request: `GET /api/boards/user/{userID}`
- response: 200
    - content-type: `application/json`
    - body: object
      - id: (string) id of the board
      - user: (string) owner of the board
      - title: (string) title of the board
      - columns (list of objects) columns of the board
 
### Update

- description: update a board
- request: `PATCH /api/boards/{boardID}`
    - content-type: `application/json`
    - body: object
      - id: (string) id of the board
      - user: (string) owner of the board
      - title: (string) title of the board
      - columns (list of objects) columns of the board
- response: 200
    - content-type: `application/json`
    - body: object
      - id: (string) id of the board
      - user: (string) owner of the board
      - title: (string) title of the board
      - columns (list of objects) columns of the board
- response: 400
    - body: Board/Column/Ticket IDs do not match original board
    
### Delete
  
- description: delete a board
- request: `DELETE /api/boards/{boardID}`
- response: 200
- response: 400
    - body: Invalid Board ID or Board ID does not exist

- description: delete a column
- request: `DELETE /api/boards/{boardID}/columns/{columnID}`
- response: 200
    - body: object
      - id: (string) id of the board
      - user: (string) owner of the board
      - title: (string) title of the board
      - columns (list of objects) columns of the board
- response: 400
    - body: Invalid Board/Column ID or Board/Column ID does not exist
    
- description: delete a ticket
- request: `DELETE /api/boards/{boardID}/columns/{columnID}/tickets/{ticketID}`
- response: 200
    - body: object
      - id: (string) id of the board
      - user: (string) owner of the board
      - title: (string) title of the board
      - columns (list of objects) columns of the board
- response: 400
    - body: Invalid Board ID/Board ID does not exist