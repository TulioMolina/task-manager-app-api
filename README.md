# task-manager-app-api

A REST API for a task manager app, built with Node.js/Express.js.

This API comprises two resources: user and task. Each user can perform CRUD operations on their profile and tasks. [MongoDB](https://www.mongodb.com/) is used as database. Authentication system is implemented with [JWT](https://jwt.io/) tokens. Endpoint testing is implemented with [Jest](https://jestjs.io/). The API and database were deployed to [Heroku](https://devcenter.heroku.com/) and [Atlas](https://www.mongodb.com/cloud/atlas), respectively.

## Technologies
- [Express.js](https://expressjs.com/)
- [MongoDB](https://www.mongodb.com/), [Mongoose](https://mongoosejs.com/)
- [JWT](https://jwt.io/), [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken)
- [Jest](https://jestjs.io/), [SuperTest](https://www.npmjs.com/package/supertest)
- [bcrypt.js](https://www.npmjs.com/package/bcryptjs)
- [Sendgrid](https://www.npmjs.com/package/@sendgrid/mail), [@sendgrid/mail](https://www.npmjs.com/package/@sendgrid/mail) (email service) 
- [Multer](https://www.npmjs.com/package/multer) (file upload)

## Local setup
- Clone the repo: `git clone https://github.com/TulioMolina/task-manager-app-api.git`
- Install dependencies: `npm install`
- Appropriately configure your development environment by creating and populating the `/config/dev.env` file with the following environment variables:
  - `PORT`
  - `SENDGRID_API_KEY`
  - `JWT_SECRET`
  - `MONGODB_URL`
- Run locally on `PORT`: `npm run dev`

Deployed API server at this [link](https://tm-task-manager.herokuapp.com).

## API reference
As previously mentioned, the API consists of two type of resources: user and task. A task can only be created and operated by its associated user. The API supports methods to create, read, update and delete such resources. This reference explains how to use the API in order to perform such actions. The API was designed following REST conventions; thus, resources are represented as JSON objects. In the same way, responses and requests body are also JSON objects, with minor exceptions (image upload and retrieval endpoints) properly pointed out as **special cases** further on.

Authentication is handled with JWT tokens, which solely contain the user id as payload, and are issued on the response body as the `token` property to a **sign up** or **login** action request. Therefore, the client must include the following header for any other type of request: `Authorization: Bearer <token>`, with exception of the **get avatar** action, as specified within its description below.

This guide is organized by resource type, as follows:

#### User resource
The `user` resource is modeled with the `name`, `email`, `password`, `age` properties.

| Action                | HTTP request/Endpoint             | Request Body Properties               | Response Body Properties  | Description
| :---                  |     :---                          |          :---                         | :---                      | :---
| **sign up** | `POST /users` | `name`: *required*,`email`: *required*, `password`: *required*, `age`: *optional, default set to* `0` | `user`, `token` | Creates a new user, public endpoint.
| **login** | `POST /users/login` | `email`: *required*, `password`: *required* | `user`, `token` | Logs in a user, public endpoint.
| **logout** | `POST /users/logout` | - | - | Logs out a user.
| **logout all** | `POST /users/logoutAll` | - | - | Logs out a user from all their sessions.
| **get profile** | `GET /users/me` | - | `user` | Gets user profile.
| **update profile** | `PATCH /users/me` | `name`: *optional*,`email`: *optional*, `password`: *optional*, `age`: *optional* | `user` | Updates user profile.
| **delete** | `DELETE /users/me` | - | `user` | Deletes user and all their associated tasks.
| **upload avatar** | `POST /users/me/avatar` | **Special case**: `Content-Type` header must have `form-data` value, and body must be of the form `avatar`: `<image>` key value pair, expected file formats are `.jpg`, `.jpeg` and `.png` | - | Uploads user avatar.
| **delete avatar** | `DELETE /users/me` | - | - | Deletes user avatar.
| **get avatar** | `GET /users/*:id*/avatar` | - | **Special case**: `<image>` in `.png` format | Gets avatar of a user with specific *id*, public endpoint.

#### Task resource
The `task` resource is modeled with the `description` and `completed` properties, and it is associated to its respective `user` owner.

| Action                | HTTP request/Endpoint             | Request Body Properties               | Response Body Properties  | Description
| :---                  |     :---                          |          :---                         | :---                      | :---
| **create** | `POST /tasks` | `description`: *required*, `completed`: *optional, default set to* `false` | `task` | Creates a task for an authenticated user.
| **get** | `GET /tasks/*:id*` | - | `task` | Gets a task of specific *id* for an authenticated user.
| **get tasks** | `GET /tasks` | - | - | Gets tasks for an authenticated user. Optional query string parameters can be set to filter, limit, paginate and/or sort the resulting tasks: `completed=<true or false>`; `limit=<number>`; `skip=<number>`; `sortBy=createdAt:<desc or asc>`.    
| **update** | `PATCH /tasks/*:id*` | `description`: *optional*, `completed`: *optional* | `task` | Updates a task of specific *id* for an authenticated user.
| **delete** | `DELETE /tasks/*:id*` | - | `task` | Deletes a task of specific *id* for an authenticated user.

All URIs are relative to https://tm-task-manager.herokuapp.com (deployed server) or to the root domain of your local development environment.
