# Social Network Project Tiktour

![Project Logo](TiktourLogo.png)


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

2. **Environment Variables**: Create a `.env` file in the root directory based on `env_temp` file. Fill in the necessary environment variables such as `MONGO_URL`, `JWT_SECRET`, and others as required,                 
`port`, the server port (3001) 


 Example `.env` file:
 ```dotenv
 MONGO_URL=mongodb://localhost:27017/social_network_db
 JWT_SECRET=your_jwt_secret_here
 port=3001
 ```

 Replace `your_jwt_secret_here` with a secure JWT secret key.

3. **Install Dependencies**: Before running the project, install all dependencies specified in `package.json`.
 ```bash
 npm install --force
 ```

4. **Start the Server**: To run the server, use the following command:
 ```bash
 npm start
 ```
 This will start the server and allow it to accept HTTP requests from clients.

5. **Making HTTP Requests**: Once the server is running, you can make HTTP requests to its endpoints using tools like Postman or through frontend applications.

## Further Project Development

- Usage of the API.
- Additional documentation on various API endpoints.
- Integration with the frontend.
- User interface development.
- Details about testing and authentication tools in use.
- Setup instructions for the development environment or solutions to common issues.





