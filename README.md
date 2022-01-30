# node-express-jwt-auth

## General info
This project is simple user authentication/authorization.
* sign user up 
* authenticate user (jwt)
* log user in (start user session)
* log user out (end user session)
* simple example of user roles and permissions (middleware)
* simple client frontend included to test this services.

# Pre-requisites
- Install [Node.js](https://nodejs.org/en/) version 8.0.0


# Getting started
- Clone the repository
```
git clone  https://github.com/a7medsayed/node-express-jwt-auth.git
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
| **views**        | Contains  application views files.
| **public**        | serving static resources.
| **shared**        | Contains common and shared files.
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
Navigate to `http://localhost:3000`


