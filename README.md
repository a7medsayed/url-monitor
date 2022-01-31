# url-monitor

## General info
This project is simple URL monitor application.
users of this app can:
* sign up with email verification.
* sign in with verified email.
* add , edit  , pause , resume and delete url check.
* receieve an email whenever the url goes from up to down or vs versus.

# Pre-requisites
- Install [Node.js](https://nodejs.org/en/) version 8.0.0


# Getting started
- Clone the repository
```
git clone  https://github.com/a7medsayed/url-monitor.git
```
- Install dependencies
```
npm install
```
  
 ## Project Structure (MVC)
The folder structure of this app is explained below:

| Name | Description |
| ------------------------ | --------------------------------------------------------------------------------------------- |
| **node_modules**         | Contains all  npm dependencies                                                            |
| **config**                  | Contains  environment configuration.
| **__test__**                 | Contains test files.  |
| **controllers**        | Contains  Controllers define functions to serve various express routes. 
| **services**        | Contains  services define functions to serve various express routes/controllers. 
| **middlewares**      | Express middlewares which process the incoming requests before handling them down to the routes.
| **routes**           | Contain all express routes, separated by module/area of application                       
| **models**           | Models define schemas that will be used in storing and retrieving data from Application database  |
| **app.js**        | Entry point to express app                                                               |
| package.json             | Contains npm dependencies as well as [build scripts](#what-if-a-library-isnt-on-definitelytyped)   | tsconfig.json            | Config settings for compiling source code only written in TypeScript   


## Usage

### Serving the app

```sh
$ npm start
```

### Running the tests

```sh
$ npm test
```

### Base url

```sh
$ http://localhost:3000
```

| API | Method  |Description |
| ------------------------ | ---------------------|------------------------------------------------------------------------ |
| **/signup**     |  POST  | sign up users              |
| **/login**      |  POST  | log in users  

### all the following apis have to use generated authorization token.

| API | Method  |Description |
| ------------------------ | ---------------------------|------------------------------------------------------------------ |
| **/check/create**      | POST | allow users to add url check    |
| **/check/edit/:id**     | POST   | allow users to edit url check  body: {}  
| **/check/pause/:id**     | POST   | allow users to pause url check   
| **/check/resume/:id**    | POST  | allow users to resume url check  
| **/check/delete/:id**    | DELETE       | allow users to delete url check                       
| **/check/report/**        | GET   | allow users to get report about their checks     |
| **/check/report/:tag**      | GET  | allow users to get report about their checks   by specific tag 


|                  swagger path              |    Description                                                        
| ------------------------ | --------------------------------------------------------------------------------------------- |
| **/api-docs**        | APIs Documentation                                                         |



