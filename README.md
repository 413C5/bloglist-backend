# bloglist-backend

This is the backend for the bloglist project, where users can create new blogs. The main feature of this particular project is that it uses Jest for automated testing, which is contained within the test.js files.

# How to Run the Tests

To run all tests, execute the following command:

### `npm run test`

Alternatively, to run each test individually, you can use the following commands:

### `npm run test:file tests/dummy.test.js`

### `npm run test:file tests/user_api.test.js`

### `npm run test:file tests/blog_api.test.js`


# Types of Tests Contained within each File

`dummy.test.js`

- 1.-Total likes
    - when list has only one blog, equals the likes of that 
    - when list has more than one blog, equals the likes of that
- 2.-Highest number of likes
    - blog with highest number of likes
- 3.-Author with most blogs
    - author with most blogs
- 4.-Author with most likes
    - author with most likes

`user_api.test.js`

- 1.-User creation
    - user creation successful
    - user creation fails if username already in db
    - user creation fails if username < 3 char
    - user creation fails if username is missing
    - user creation fails if name is missing
- 2.-Password test
    - user creation fails if password < 3 char
    - user creation fails if password is missing

`blog_api.test.js`

- 1.-Blogs are returned correctly:
    - blogs are returned as json
    - all blogs are returned
    - a specific blog is within the returned blogs
    - unique identifier property of the blog is named id
    - returned blogs have properties title, author, url and likes
- 2.-Viewing blogs:
    - a specific blog can be viewed
    - viewing a blog fails with 400 if id not valid
    - viewing blog fails with statuscode 404 if blog does not exist
- 3.-Adding blogs:
    - a valid blog is added
    - a valid blog with 0 likes is added and has 0 likes
    - blog without title is not added
    - blog without author is not added
    - blog without url is not added
    - blog is not added without authorization token
- 4.-Deleting blogs:
    - a blog can be deleted
    - blog is not deleted with unvalid authorization token
- 5.-Updating blogs:
    - a blog can be updated
    - blog is not updated with unvalid authorization token

# Project Details:

This project corresponds to the backend of the bloglist-frontend project. Both of them comprise part 4 and 5 of the [fsopen2023](https://github.com/413C5/fsopen2023) repository. Its frontend is found in [this repository](https://github.com/413C5/bloglist-frontend).

Feel free to explore the [fsopen2023](https://github.com/413C5/fsopen2023) repository to understand its broader context and discover related projects.

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in production mode.\
It sets the `NODE_ENV` environment variable to `production` and executes `node index.js`.

### `npm run start:dev`

Runs the app in development mode.\
It sets the `NODE_ENV` environment variable to `development` and uses `nodemon` to watch for changes in files and automatically restarts the server. 

### `npm run start:test`

Runs the app in test mode.\
It sets the `NODE_ENV` environment variable to `test` and uses `nodemon` to watch for changes in files and automatically restarts the server.

### `npm test`

Launches the test runner in interactive watch mode.\
It sets the `NODE_ENV` environment variable to `test` and executes `jest` with verbose output, running tests sequentially, and forcing exit after tests are done.

### `npm run lint`

Runs eslint to lint all files in the project directory.

### `npm run test:file`

Runs tests for a specific file in test mode.\
It sets the `NODE_ENV` environment variable to `test` and executes `jest`.

