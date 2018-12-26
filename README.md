# techdegree-project-11
Eleventh Techdegree Project - Build a Course Rating API With Express

Be sure to have MongoDB installed on your system.<br>
Import exisiting data:
```javascript
node importdb.js
```
Install the dependencies and devDependencies and start the server.<br>
In the root directory, run:
```sh
$ npm install
$ npm start
```

* attempt at meeting expectations
    * Set up a database connection.
        - [X] Use npm to install Mongoose.
        - [X] Using Mongoose, create a connection to your MongoDB database.
        - [X] Write a message to the console if there's an error connecting to the database.
        - [X] Write a message to the console once the connection has been successfully opened.

    * Create your Mongoose schema and models. Your database schema should match the following requirements:

        - [X] User
            <ul>
                <li>_id (ObjectId, auto-generated)</li>
                <li>fullName (String, required)</li>
                <li>emailAddress (String, required, must be unique and in correct format)</li>
                <li>password (String, required)</li>
            </ul>
        - [X] Course
            <ul>
                <li>_id (ObjectId, auto-generated)</li>
                <li>user (_id from the users collection)</li>
                <li>title (String, required)</li>
                <li>description (String, required)</li>
                <li>estimatedTime (String)</li>
                <li>materialsNeeded (String)</li>
                <li>steps (Array of objects that include stepNumber (Number), title (String, required) and description (String, required) properties)</li>
                <li>reviews (Array of ObjectId values, _id values from the reviews collection)</li>
            </ul>
        - [X] Review
            <ul>
            <li>_id (ObjectId, auto-generated)</li>
            <li>user (_id from the users collection)</li>
            <li>postedOn (Date, defaults to “now”)</li>
            <li>rating (Number, required, must fall between “1” and “5”)</li>
            <li>review (String)</li>
            </ul>
    * Mongoose validation gives you a rich set of tools to validate user data. See http://mongoosejs.com/docs/validation.html for more information.

    * Create the user routes

        * Set up the following routes (listed in the format HTTP VERB Route HTTP Status Code):
            - [X] <code>GET /api/users 200</code> - Returns the currently authenticated user
            - [X] <code>POST /api/users 201</code> - Creates a user, sets the Location header to "/", and returns no content

    * Create the course routes

        * Set up the following routes (listed in the format HTTP VERB Route HTTP Status Code):
            - [X] <code>GET /api/courses 200</code> - Returns the Course "_id" and "title" properties
            - [X] <code>GET /api/course/:courseId 200</code> - Returns all Course properties and related documents for the provided course ID
            - [X] When returning a single course for the <code>GET /api/courses/:courseId</code> route, use Mongoose population to load the related user and reviews documents.
            - [X] <code>POST /api/courses 201</code> - Creates a course, sets the Location header, and returns no content
            - [X] <code>PUT /api/courses/:courseId 204</code> - Updates a course and returns no content
            - [ ] <code>POST /api/courses/:courseId/reviews 201</code> - Creates a review for the specified course ID, sets the Location header to the related course, and returns no content

    * Update any <code>POST</code> and <code>PUT</code> routes to return Mongoose validation errors.

        - [ ] Use the next function in each route to pass any Mongoose validation errors to Express’s global error handler
        Send the Mongoose validation error with a400 status code to the user

    * Update the User model to store the user's password as a hashed value.

        * For security reasons, we don't want to store the password property in the database as clear text.
        - [X] Create a pre save hook on the user schema that uses the bcrypt npm package to hash the user's password.
        See https://github.com/ncb000gt/node.bcrypt.js/ for more information.

    * Create an authentication method on the user model to return the user document based on their credentials

        - [X] Create a static method on the user schema that takes an email, password, and callback
        - [X] The method should attempt to get the user from the database that matches the email address given.
        - [X] If a user was found for the provided email address, then check that user's password against the password given using bcrypt.
        - [X] If they match, then return the user document that matched the email address
        - [X] If they don't match or a user with the email given isn’t found, then pass an error object to the callback

    * Set up permissions to require users to be signed in
        * Postman will set an Authorization header with each request when a user is signed in.
        - [X] Add a middleware function that attempts to get the user credentials from Authorization header set on the request.
        - [X] You can use the basic-auth npm package to parse the `Authorization' header into the user's credentials.
        - [X] Use the authenticate static method you built on the user schema to check the credentials against the database
        - [X] If the authenticate method returns the user, then set the user document on the request so that each following middleware function has access to it.
        - [X] If the authenticate method returns an error, then pass it to the next function
        * Use this middleware in the following routes:
            - [X] ```POST /api/courses```
            - [X] ```PUT /api/courses/:courseId```
            - [X] ```GET /api/users```
            - [ ] ```POST /api/courses/:courseId/reviews```

* attempt at exceeding expectations
    * Review model
        - [ ] Validation added to prevent a user from reviewing their own course
    * User routes
        * Tests have been written for the following user stories:
            - [ ] When I make a request to the <code>GET </code>route with the correct credentials, the corresponding user document is returned
            - [ ] When I make a request to the <code>GET /api/courses/:courseId</code> route with the invalid credentials, a 401 status error is returned
    Course routes
        - [ ] When returning a single course for the <code>GET /api/courses/:courseId</code> route, use Mongoose deep population to return only the fullName of the related user on the course model and each review returned with the course model. This will hide other user’s private details, like passwords and emails, from other users.
        * Example user object returned: <code>{ "_id": "wiubfh3eiu23rh89hcwib", "fullName": Sam Smith" } </code>
        * See the Project Resources section for more information about deep population.

