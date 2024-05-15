# HIVE - Team Management App

## Description

HIVE is a Node.js project built using Express and MongoDB. It serves as a platform for teams to collaborate, communicate, and manage their projects efficiently.

## Features

- User authentication and authorization
- Create, join, and manage teams
- Chat functionality for real-time communication
- Integration with machine learning and text analysis features

## Technologies Used

- Node.js
- Express.js
- MongoDB
- Socket.IO
- JWT (JSON Web Tokens) for authentication
- Mongoose for MongoDB object modeling

## Installation

1. **Clone the repository:**

```bash
  git clone https://github.com/Group-task-brl/BRL-task4-backend.git
```

2. **Navigate to the project directory:**

```bash
  cd BRL-task4-backend
```

3. **Install dependencies:**

 ```bash
  npm install
```

4. **Set up environment variables by creating a `.env` file and adding the necessary variables. You'll need:**
- `PORT`: Port number on which the server will run.
- `MONGODB_URL`: URL for your MongoDB database.
- `EMAIL`: Email address for sending notifications.
- `PASSWORD`: Password for the email account.
- Other necessary environment variables (refer to the example in the README).

5. **Start the server:**

  ```bash
  npm start
```

## Usage

1. Register or login to the application.
2. Create or join a team.
3. Utilize the chat feature for real-time communication.
4. Explore other functionalities such as machine learning data analysis and text processing.

## Environment Variables

Make sure to set the required environment variables in your `.env` file. Here's an example of what your `.env` file might look like:

```dotenv
PORT=4000
MONGODB_URL='mongodb://127.0.0.1:27017/grouptaskdb'
EMAIL='your-email@example.com'
PASSWORD='your-email-password'
URL=http://localhost:4000
SECRET_KEY_JWT=your-secret-key-for-JWT
SECRET_KEY_SESSION=your-secret-key-for-session
TOKEN_HEADER_KEY=your-token-header-key
SECRET_KEY=your-secret-key
SITE_KEY=your-site-key
CLOUD_NAME=your-cloud-name
API_KEY=your-api-key
API_SECRET=your-api-secret
