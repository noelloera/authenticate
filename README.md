# Authenticate

## Introduction 
Back-end REST API built on Express.js. The application authenticates users using JSON web tokens. Ensures the encryption of passwords. Encodes tokens using signatures, server-secret, and user database identification. Provides middleware function which verifies JSON web tokens. Then responds with data from (NoSQL) MongoDB database.

## Table of Contents
* [General Info](#general-info)
* [Technologies](#technologies)
* [Setup](#setup)

## General Info
Authenticate is a REST API built using Express.js which uses JSON web tokens, in conjunction with password encryption to handle sensitive user authorization calls. Provide routes for logging in, signing up, re-signing access tokens, as well as responding with user data from MongoDB provided the tokens are valid.
1. The server listens for calls made to PORT
2. Upon "/login" / "/signup" POST request and appropriate credentials. JSON web tokens are sent.
3. Access and refresh tokens are sent to client upon success code
4. Upon success, API response includes JSON web tokens
5. Client will need to include the Authorization "Bearer [access token]"
6. Middleware authorization function will check the Header with every call to ensure validity of token
7. Dependent on path calls. Corresponding user data will be sent from MongoDB queries, and updates.
8. Upon failing status code, "/token" refresh route provided if client includes valid refresh token
9. Data routes can be modified to fit needs of response data being sent, as well as MongoDB URI 

##Features
* User registration
* MongoDB data storage 
* Password, and user information encryption
* Access token refreshing (provided refresh token valid)

## Technologies
* Express v4
* Express-validator v6
* Jsonwebtoken v8
* Mongoose v
* Morgan v1
* Nodemon v2
* Password-Validator v5
* Dotenv v8
* Body-parser v1

## Setup
Running this project requires local installation of npm: 
1. $ cd ..Authenticate
2. $ npm install
3. $ node index.js / nodemon index.js

##Status
Application is functional. Development still ongoing.
