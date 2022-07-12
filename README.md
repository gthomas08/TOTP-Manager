# TOTP Manager (Shibboleth Integration)

<!-- ABOUT THE PROJECT -->

## About The Project

This project is part of the Computer Engineering and Informatics Department (CEID) of University of Patras Thesis. It features a platform that an admin can use to manage TOTP enrollements. This project is directly integrated with the [Sibboleth IdP V4.2.1](https://shibboleth.atlassian.net/wiki/spaces/IDP4/overview?homepageId=1265631498) and its [TOTP Plugin](https://shibboleth.atlassian.net/wiki/spaces/IDPPLUGINS/pages/1376878877/TOTP).

### Built With

The project was built with the MERN Stack.

- [MongoDB](https://www.mongodb.com)
- [Express](https://expressjs.com)
- [React](https://reactjs.org)
- [Node.js](https://nodejs.org/)

<!-- GETTING STARTED -->

## Getting Started

To get a local copy up and running follow these steps.

### Prerequisites

- Node.js
- npm
- MongoDB

For more information on how to install Node.js and npm, visit [Node.js](https://nodejs.org/) website.

For more information on how to install MongoDB, visit [MongoDB](https://www.mongodb.com) website.

### Installation

1. Setup a local database. More information in [MongoDB](https://www.mongodb.com) website.

2. Clone the repo
   ```sh
   git clone https://github.com/GTS08/TOTP-Manager.git
   ```
3. Change directory to server

4. Install npm packages
   ```sh
   npm install
   ```
5. Set the environmental variables in .env file

   ```sh
   MONGODB_URI=<MONGODB_URI>
   PORT=3001
   SECRET=<secret_key_for_token>
   ENCRYPTION_KEY=<32_byte_random_string>
   ENCRYPTION_VECTOR=<16_byte_random_string>
   ```

6. Start the server

   ```sh
   npm run dev
   ```

7. Change directory to client

8. Install npm packages

   ```sh
   npm install
   ```

9. Start react app
   ```sh
   npm start
   ```

<!-- USAGE EXAMPLES -->

## Usage

Start by creating an admin under Admin Collection in the database with the following structure.

```json
{
  "username": "<adminUsername>",
  "passwordHash": "<passwordHash>"
}
```

To generate a passwordHash, you can use an online [bcrypt generator](https://bcrypt-generator.com/).

Once an admin is created, visit http://localhost:3000/ to log in with the admin credentials.
