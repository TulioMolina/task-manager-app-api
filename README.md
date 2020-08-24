# task-manager-app-api

A REST API for task manager apps, built with Node.js/Express.js.

This API comprises two resources: user and task. Each user can perform CRUD operations on their profile and tasks. [MongoDB](https://www.mongodb.com/) is used as database. The authentication system is token-based with [JWT](https://jwt.io/). Endpoint testing is implemented with [Jest](https://jestjs.io/). [Postman](https://www.postman.com/) was used as a development tool to easily make requests on the endpoints. The API and database were deployed to [Heroku](https://devcenter.heroku.com/) and [Atlas](https://www.mongodb.com/cloud/atlas), respectively. Please refer to the [API reference](#api-reference) section below for usage details.

## Technologies
- [Express.js](https://expressjs.com/)
- [MongoDB](https://www.mongodb.com/), [Mongoose](https://mongoosejs.com/)
- [JWT](https://jwt.io/), [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken)
- [Jest](https://jestjs.io/), [SuperTest](https://www.npmjs.com/package/supertest)
- [bcrypt.js](https://www.npmjs.com/package/bcryptjs)
- [Sendgrid](https://sendgrid.com/), [@sendgrid/mail](https://www.npmjs.com/package/@sendgrid/mail) (email notification service) 
- [Multer](https://www.npmjs.com/package/multer) (file upload)
- [Postman](https://www.postman.com/)

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
As previously mentioned, the API consists of two types of resources: user and task. A user is created with an email address and password combination. Once a user is created (or deleted), a salutation email is sent to the registered user email address. A task can only be created and operated by its associated user.
The API supports methods to create, read, update, and delete such resources.

This reference explains how to use the API to perform such actions, as well as the authentication mechanism to do so. The API was designed following REST conventions; thus, resources are represented as JSON objects. In the same way, response and request bodies are also JSON data, with minor exceptions (image upload and retrieval) properly explained further on.

This guide is organized with the following sections:
  - [User resource](#user-resource)
  - [Task resource](#task-resource)
  - [Authentication](#authentication)

### User resource
This resource is modeled as the `user` object with `name`, `email`, `password`, and `age` properties.

| Action                | Endpoint             | Request Body Properties               | Response Body Properties  | Description
| :---                  |     :---                          |          :---                         | :---                      | :---
| **sign up** | `POST /users` | `name`: *required*,`email`: *required*, `password`: *required*, `age`: *optional, default set to* `0` | `user`, `token` | Creates a new `user` and issues authentication `token`, public endpoint.
| **login** | `POST /users/login` | `email`: *required*, `password`: *required* | `user`, `token` | Issues authentication `token`, public endpoint.
| **logout** | `POST /users/logout` | - | - | Invalidates authentication `token`.
| **logout all** | `POST /users/logoutAll` | - | - | Invalidates the existing authentication `token`(s) that belong to a `user`.
| **get profile** | `GET /users/me` | - | `user` | Gets `user`.
| **update profile** | `PATCH /users/me` | `name`: *optional*,`email`: *optional*, `password`: *optional*, `age`: *optional* | `user` | Updates `user`.
| **delete** | `DELETE /users/me` | - | `user` | Deletes `user` and its associated `task`(s).
| **upload avatar** | `POST /users/me/avatar` | **Special case**: `Content-Type` header must be `form-data`, and body parameter must be of the form `avatar`: `<image file>` | - | Uploads `user` avatar, expected `<image file>` extensions are `.jpg`, `.jpeg` and `.png`.
| **delete avatar** | `DELETE /users/me` | - | - | Deletes `user` avatar.
| **get avatar** | `GET /users/<id>/avatar` | - | **Special case**: `<image file>` | Gets avatar, in `.png` extension, of a `user` with specific `<id>`, public endpoint.

### Task resource
This resource is modeled as the `task` object with `description` and `completed` properties, and it is automatically associated with its respective `user`, when created.

| Action                | Endpoint             | Request Body Properties               | Response Body Properties  | Description
| :---                  |     :---                          |          :---                         | :---                      | :---
| **create** | `POST /tasks` | `description`: *required*, `completed`: *optional, default set to* `false` | `task` | Creates a `task`.
| **get** | `GET /tasks/<id>` | - | `task` | Gets a `task` of specific `<id>`.
| **get tasks** | `GET /tasks` | - | - | Gets `task`(s). The following optional query string parameters can be set to filter, limit, paginate, and/or sort the result: `completed=<true or false>`; `limit=<number>`; `skip=<number>`; `sortBy=createdAt:<desc or asc>`.    
| **update** | `PATCH /tasks/<id>` | `description`: *optional*, `completed`: *optional* | `task` | Updates a `task` of specific `<id>`.
| **delete** | `DELETE /tasks/<id>` | - | `task` | Deletes a `task` of specific `<id>`.

URIs are relative to https://tm-task-manager.herokuapp.com (deployed API server) or to your local development server domain.

### Authentication
This API employs a token-based authentication mechanism with JWT. These tokens solely contain `user` identification data as payload and are issued on the response body to a **sign up** and/or **login** action request as the `token` property. Therefore, to authenticate, the `Authorization: Bearer <token>` header must be included for any other action request, with exception of the **get avatar** action, which is a public endpoint.
