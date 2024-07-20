# Social Network Project Tiktour

![Project Logo](TiktourLogo.png)

**link to frontend app:** [TikTour-client](https://github.com/Romihia/TikTour-Client)

## Project Description
This project aims to build an innovative and advanced social network allowing users to connect, create personal profiles, post content, establish social connections, and perform various community actions in a virtual environment.

## Backend
The backend of the project handles the core business logic of the application, including:

- User Management: Registration, login, profile management, and permissions.
- Posts and Content: Creation, editing, and deletion of posts, viewing posts from other users.
- Friends and Relationships: Building friend lists, friend requests and acceptances, viewing profiles and content of friends.
- Security: User authentication, permissions management, secure password hashing and storage.

## Technologies Used
- **Node.js** for server-side development.
- **Express.js** as the development framework for the server, facilitating handling of HTTP requests.
- **MongoDB and Mongoose** as the database for structured data storage.
- **RESTful API**: For data transfer between client and server following HTTP standards.

## Setting Up the Project
1. **Create Database**: Ensure you have MongoDB installed and running locally. Create a database for the project.


2. **Clone the project**: clone the project from github.
 ```bash
 git clone https://github.com/Romihia/TikTour-Server.git
 ```

3. **Environment Variables**: Create a `.env` file in the root directory based on `env_temp` file. Fill in the necessary environment variables such as `MONGO_URL`, `JWT_SECRET`, and others as required,                 
`port`, the server port (3001) 


 Example `.env` file:
 ```dotenv
 MONGO_URL=mongodb://localhost:27017/social_network_db
 JWT_SECRET=your_jwt_secret_here
 port=3001
 ```

 Replace `your_jwt_secret_here` with a secure JWT secret key.

4. **Install Dependencies**: Before running the project, install all dependencies specified in `package.json`.
 ```bash
 cd backend
 npm install
 ```

5. **Start the Server**: To run the server, use the following command:
 ```bash
 npm run start
 ```
 This will start the server and allow it to accept HTTP requests from clients.

6. **Making HTTP Requests**: Once the server is running, you can make HTTP requests to its endpoints using tools like Postman or through frontend applications.

## Examples of Usage

### 1. Ping Endpoint

- **Endpoint**: `http://localhost:3001/ping`
- **Method**: GET
- **Expected Response**: 
  ```json
  {
    "message": "pong 2"
  }
  ```

### 2. User Registration

- **Endpoint**: `http://localhost:3001/auth/register`
- **Method**: POST
- **Request Body**:
  ```json
  {
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com",
    "password": "securepassword",
    "location": "New York",
    "username": "johndoe",
    "dateOfBirth": "1990-01-01"
  }
  ```
- **Expected Response**:
  ```json
    {
        "firstName": "John",
        "lastName": "Doe",
        "email": "john.doe@example.com",
        "username": "johndoe",
        "password": "lBr5oobAehLoY1YOe2MI4fLn4ReXumcGlyBr.3AZQFWTQnC",
        "picturePath": "",
        "friends": [],
        "dateOfBirth": "1990-01-01T00:00:00.000Z",
        "location": "New York",
        "_id": "669bd8de5312795e00099716",
        "createdAt": "2024-07-20T15:33:50.503Z",
        "updatedAt": "2024-07-20T15:33:50.503Z",
        "__v": 0
    }
  ```
  ### 2. User Login

- **Endpoint**: `http://localhost:3001/auth/login`
- **Method**: POST
- **Request Body**:
  ```json
    {
        "identifier": "john.doe@example.com",
        "password": "securepassword"
    }

  ```
- **Expected Response**:
  ```json
    {
    "token": "eyJhbGciOiJInR5c6IkpXVCJ9.eyJpZCI6IjOWJkOGRlNTMxMjc",
    "user": {
        "_id": "669bd8de5312795e00099716",
        "firstName": "John",
        "lastName": "Doe",
        "email": "john.doe@example.com",
        "username": "johndoe",
        "password": "lBr5oobAehLoY1YOe2MI4fLn4ReXumcGlyBr.3AZQFWTQnC",
        "picturePath": "",
        "friends": [],
        "dateOfBirth": "1990-01-01T00:00:00.000Z",
        "location": "New York",
        "createdAt": "2024-07-20T15:33:50.503Z",
        "updatedAt": "2024-07-20T15:33:50.503Z",
        "__v": 0
    }
    }
  ```

## Further Project Development

- Usage of the API.
- Additional documentation on various API endpoints.
- Integration with the frontend.
- User interface development.
- Details about testing and authentication tools in use.
- Setup instructions for the development environment or solutions to common issues.





