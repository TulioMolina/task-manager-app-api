# task-manager-app-api

A REST API for a task manager app implemented in Node.js/Express.js.

The API consists of two resources: user and task. Each user can perform CRUD operations on their profile and tasks. [MongoDB](https://www.mongodb.com/) is used as database. Authentication system is implemented with [JWT](https://jwt.io/) tokens. Endpoint testing is implemented with [Jest](https://jestjs.io/). The API and database were deployed to [Heroku](https://devcenter.heroku.com/) and [Atlas](https://www.mongodb.com/cloud/atlas), respectively.

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

Deployed API at https://tm-task-manager.herokuapp.com.

## API reference
As previously mentioned, the API consists of two type of resources: user and task, and the API supports methods to create, read, update and delete such resources. This reference explains how to use the API in order to perform such actions. The API was designed following REST conventions, thus, resources are represented, in a response body, as JSON objects; and requests body are also expected to be JSON objects.

Authentication is handled with JWT tokens, which solely contain the user id as payload, and are issued on the response body as the `token` property to a **sign up** or **login** action request. Therefore, the client must include the following header for any other type of request: `Authorization: Bearer <token>`, with exception of the **get avatar** action, as specified within its description below.

This guide is organized by resource type, as follows:

#### User resource

| Action                | HTTP request/Endpoint             | Request Body Properties               | Response Body Properties  | Description
| :---                  |     :---                          |          :---                         | :---                      | :---
| **sign up** | `POST /users` | `name`: *required*,`email`: *required*, `password`: *required*, `age`: *not required* | `user`, `token` | Creates a new user, public endpoint.
| **login** | `POST /users/login` | `email`: *required*, `password`: *required* | `user`, `token` | Logs in an user, public endpoint.
| **logout** | `POST /users/logout` | - | - | Logs out an user from current client.
| **logout all** | `POST /users/logoutAll` | - | - | Logs out an user from all their clients.
| **get profile** | `GET /users/me` | - | `user` | gets user profile.
| **update profile** | `PATCH /users/me` | `name`: *not required*,`email`: *not required*, `password`: *not required*, `age`: *not required* | `user` | Updates user profile.
| **delete** | `DELETE /users/me` | - | `user` | Deletes user.
| **upload avatar** | `POST /users/me/avatar` | Special case: `Content-Type` header must have `form-data` value, and body must be of the form `avatar`: `<image>` key value pair, expected file formats are `.jpg`, `.jpeg` and `.png` | - | Uploads user avatar.
| **delete avatar** | `DELETE /users/me` | - | - | Deletes user avatar.
| **get avatar** | `GET /users/*:id*/avatar` | - | Special case: `<image>` in `.png` format | Gets avatar of user with specific *id*, public endpoint.
