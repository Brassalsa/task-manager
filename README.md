# Task Manager API

This is a Task Manager API built with Hono.js in TypeScript. It allows users to register, log in, and perform CRUD operations on tasks. The API also includes admin controls.

## Description

### Users

Users can register, login (with their email and password), delete their accounts, they can also perform crud operations on their tasks. The also can fetch multiple tasks by applying **filters**:

1. **limit**: No. of tasks fetched
2. **skip**: page number

### Tasks

Task can be created by users. It can be fetched in a list by providing **filter**:

1. **limit**: No. of tasks fetched
2. **skip**: page number
3. **priority**: low, normal and high
4. **due_date**: Due date of tasks.

### Admins

Admin users can view, delete user details. They can create other admin users and also promote user to admins. They cann't delete other admin users or demote them.
They also can fetch multiple users by applying **filters**:

1. **limit**: No. of tasks fetched
2. **skip**: page number

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

Run the project and the go to **"/docs"**

```
 http://localhost:3000/docs
```

For **authorization**: register or login, then copy the token and paste in authorization button(green lock on top right), then you can access the all routes but for **admin routes**, need to manually change the user type to admin in db.

To run the db on browser run:

```bash
npx prisma studio
```

it will open the db in browser and you can make changes accordingly.
