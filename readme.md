## Simple Pagination in Node - Mongo
- I created this as a tutorial so that people who are learning Node/Express can use opensource resources.This is just for understanding all the pieces togather. We haven't use best practices and all but feel free make a PR.

### How To Run ?

- If you want to run with `docker-compose` directly. Follow these Steps:
    - clone the project
    - `cd node-mongo-pagination`
    - run `docker-compose up`
    - You will get mongodb databse and running application.
    - Port 8181 on local machine GET -> `http://localhost:8181/users/?page=1&limit=2`
    - Port 27017 is also exposed.(for mongo) make sure these both port are free.
    - There is also Post request to create user in db POST -> `http://localhost:8181/users/` with body `{"name":"Parth","number":"20"}`
    - Our Databse schema name is `mongo-pagination`

- Manually setup:
    - Install Mongo on local machine.
    - create a schema in database `mongo-pagination`. Use Robo3T for that for ease of use.
    - I assume you already have `node`,`npm`, `yarn`(optional), `postman`(to make api calls)
    - Run `npm install` or `yarn` to install dependencies.
    - Run `npm start-dev` (we already defined in `package.json` check `start-dev`)

### How to create ? Step by Step.

- At any point you dont understand anything then just check coresponding file in github or contact me.
- I generated node/express project using `npx express-generator --view=pug node-mongo-pagination` (feel free to create it by yourself also.you dont need generator.)
- Run `yarn` or `npm install` to install dependencies.
- Now add dependencies `yarn add nodemon mongoose` or `npm install nodemon mongoose`
- Mongoose is a mongo utility to interact with databse.
- Now we need to create our schema for our databse.
- First make sure you have `app.listen(PORT)` in the `app.js`. Here PORT is the port where our application will start. I used `8484`.
- Now first add one script in `package.json` under `scripts`
```
 "start-dev": "nodemon ./app.js"
```
- After that test the application by running `npm start-dev` or `yarn start-dev`
- Now open the browser and check `localhost:8484` (your port might be different, make sure you have get endpoint in code).You should see express page with welcome written over there.
- Now we need to write logic to make a connection with database. Look below code. we have mongoose connect function with `url of database` and `options`. Put this code at `app.js`. (See the file on github for more info)
```
const option = {
  socketTimeoutMS: 30000,
  keepAlive: true,
  reconnectTries: 30000,
  useNewUrlParser: true 
};
const mongoUrl='mongodb://mongo:27017/mongo-pagination';

mongoose
  .connect(mongoUrl,option)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log("Error in DB connection",err));

```
- For example we will have users `Table`(collection).
  create a file in `schemas > UserSchema.js` and add this code inside that file.
```
const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
      },
      number: {
        type: String,
        default: "1234"
      }
    });

module.exports = mongoose.model("user", UserSchema);

```
- Now create `users.js` file and create `/users` routing
- In mongo (mongoose) we can use pagination like this (check github `user.js` file)
- we need to import our `UserSchema` in `user.js` like this `const UserSchema = require("path_to_UserSchema");`
```
DBModel.find(query, fields, { skip: 10, limit: 5 }, function(err, results) { ... });
```
- So our code for get will look like this:
```
  UserSchema.find({}, {}, query, function (err, data) {
    response = err ?
      { "message": "Error occured while fetching data" } :
      { "message": data };
    res.json(response);
  });
```
- We write some logic for page counting and skipping. Here `size/limit` is the no of items per page and `page` is the page no. We will pass this query object in mongoose find function.
```
  query.skip = size * (pageNo - 1);
  query.limit = size;
```
- After that we can finally run the application.



### Docker and Docker-compose setup. (optional):
- This section is not part of the documentation but if you want to do it just feel free to copy paste it.If you want to understand more about `docker` and `docker-compose` then feel free to find some articles on internet.
- Our `Dockerfile` will act as guide how to build the app.Create a file named as`Dockerfile` in root of the project. (put below code there)
```
FROM node:10
WORKDIR /app
COPY package.json package.json
RUN npm install
COPY . .
EXPOSE 3000
RUN npm install -g nodemon
CMD [ "nodemon", "app.js" ]
```
- Here we will not cover the docker so just copy paste the code.

- Create a file named `docker-compose.yml` and paste this below mentioned code. ( use whatever the version of doc-compose that you are using in below code) 
```
version: "3"
services:
  app:
    container_name: mongo-pagination
    restart: always
    build: ./
    ports:
      - "8181:8484"
    volumes:
      - .:/app
    links:
      - mongo
  mongo:
    container_name: mongo
    image: mongo
    ports:
      - "27017:27017"
```
- If you want to stop running the container run `docker-compose down`
- If you want to delete the images `docker images` find your image (take id) run `docker rmi id`
- If you want to check all running container `docker ps -a`