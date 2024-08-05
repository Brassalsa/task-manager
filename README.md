# Task Manager API

This is a Task Manager API built with Hono.js in TypeScript. It allows users to register, log in, and perform CRUD operations on tasks. The API also includes admin controls.

## Installation

To set up the project locally, follow these steps:

1. #### Clone the repository:

   ```bash
   git clone https://github.com/Brassalsa/task-manager.git
   cd task-manager

   ```

2. #### Install the dependencies:

```bash
npm install
```

3. #### Set Environment Variables:
   Create a .env file in the root directory and add the following environment variables:

```
PORT=3000
JWT_SECRET="bruh"
DATABASE_URL="file:./dev.db"
```

## Usage

#### Run with npm

```
npm run dev
```

### Run & build with Docker

```
 docker-compose up --build
```

### Open

```
 http://localhost:3000
```

### API Docs

Run the project and the go to "/docs"

```
 http://localhost:3000/docs
```
