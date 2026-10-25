# Todo REST API: Node.js + Express (Beginner Guide)

A step-by-step guide to building a Todo REST API with **Node.js** and **Express**, including the real problems I ran into and how I fixed them.

> **Note:** Data is stored in memory, so it resets every time the server restarts.

## Table of Contents

1. [Project Setup](#1-project-setup)
2. [Basic Server](#2-basic-server)
3. [Fake Database](#3-fake-database)
4. [Read JSON from Requests](#4-read-json-from-requests)
5. [CRUD Routes](#5-crud-routes)
6. [Testing with Thunder Client](#6-testing-with-thunder-client)
7. [Problems I Hit and How I Fixed Them](#7-problems-i-hit-and-how-i-fixed-them)
8. [Commands to Refresh the Server](#8-commands-to-refresh-the-server)
9. [Debugging Checklist](#9-debugging-checklist)
10. [Publishing to GitHub](#10-publishing-to-github)

---

## 1. Project Setup

```bash
npm init -y
npm install express
```

| Command | Meaning |
|---|---|
| `npm init -y` | Creates `package.json`, the file that describes the project |
| `npm install express` | Downloads Express into the `node_modules` folder |

Then create a file named `index.js`. All the code goes in this file.

## 2. Basic Server

```js
const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.send("welcome to node js testing express");
});

const PORT = process.env.PORT || 6000;

app.listen(PORT, () => {
  console.log(`Server is running successfully on port ${PORT}`);
});
```

| Line | Meaning |
|---|---|
| `require("express")` | Loads the Express library |
| `express()` | Creates the server, stored in `app` |
| `app.get("/", ...)` | When someone opens `/`, run this function |
| `req` / `res` | The request (what the user sent) and the response (what you send back) |
| `app.listen(PORT, ...)` | Starts listening for requests on that port |

Run it:

```bash
node index.js
```

## 3. Fake Database

```js
let TodoArray = [
  { id: 1, task: "testing one", status: "todo", tag: ["node js", "javascript"] },
  { id: 2, task: "testing second", status: "processing", tag: ["node js", "javascript"] },
  { id: 3, task: "testing third", status: "Done", tag: ["node js", "javascript"] },
];
```

A plain array in memory. It uses `let` (not `const`) because the delete route replaces the whole array.

## 4. Read JSON from Requests

```js
app.use(express.json());
```

This middleware converts JSON text sent by the user into a JavaScript object in `req.body`.

It only works when the request has the header `Content-Type: application/json`. Thunder Client and Postman add it automatically when the body type is set to JSON.

## 5. CRUD Routes

| Letter | Action | HTTP Method | Route |
|---|---|---|---|
| C | Create | POST | `/todos` |
| R | Read | GET | `/todos`, `/todos/:id` |
| U | Update | PUT | `/todos/:id` |
| D | Delete | DELETE | `/todos/:id` |

### Create (POST)

```js
app.post("/todos", (req, res) => {
  const todo = req.body;

  if (!todo || !todo.task) {
    return res.status(400).json({ error: "task is required" });
  }

  const newTodo = {
    id: TodoArray.length > 0 ? TodoArray[TodoArray.length - 1].id + 1 : 1,
    task: todo.task,
    tag: todo.tag || todo.tags || [],
    status: todo.status || "todo",
  };

  TodoArray.push(newTodo);
  res.status(201).json(newTodo);
});
```

### Read all (GET)

```js
app.get("/todos", (req, res) => {
  res.json(TodoArray);
});
```

### Read one (GET by id)

```js
app.get("/todos/:id", (req, res) => {
  const id = Number(req.params.id);
  const todo = TodoArray.find((t) => t.id === id);

  if (!todo) {
    return res.status(404).json({ error: "Todo not found" });
  }

  res.json(todo);
});
```

- `:id` is a placeholder in the URL.
- `req.params.id` reads it, always as text, so `Number()` converts it to a number.
- `.find()` returns the first todo that matches, or `undefined` if none does.

### Update (PUT)

```js
app.put("/todos/:id", (req, res) => {
  const id = Number(req.params.id);
  const todo = TodoArray.find((t) => t.id === id);

  if (!todo) {
    return res.status(404).json({ error: "Todo not found" });
  }

  if (req.body.task) {
    todo.task = req.body.task;
  }
  if (req.body.status) {
    todo.status = req.body.status;
  }
  if (req.body.tag) {
    todo.tag = req.body.tag;
  }

  res.json(todo);
});
```

Only the fields sent in the body are changed.

### Delete (DELETE)

```js
app.delete("/todos/:id", (req, res) => {
  const id = Number(req.params.id);
  const todo = TodoArray.find((t) => t.id === id);

  if (!todo) {
    return res.status(404).json({ error: "Todo not found" });
  }

  TodoArray = TodoArray.filter((t) => t.id !== id);
  res.json({ message: "Todo deleted" });
});
```

`.filter()` keeps every todo except the one with that id.

## 6. Testing with Thunder Client

Thunder Client is a VS Code extension for sending requests. Postman works the same way.

| Action | Method | URL | Body (JSON) |
|---|---|---|---|
| Get all | GET | `http://localhost:6000/todos` | none |
| Get one | GET | `http://localhost:6000/todos/1` | none |
| Add | POST | `http://localhost:6000/todos` | `{ "task": "new todo" }` |
| Update | PUT | `http://localhost:6000/todos/1` | `{ "status": "Done" }` |
| Delete | DELETE | `http://localhost:6000/todos/2` | none |

For POST and PUT, set **Body → JSON**.

Typing a URL in the browser always sends a GET request, so use Thunder Client or Postman to test POST, PUT, and DELETE.

## 7. Problems I Hit and How I Fixed Them

### Problem 1: `Cannot GET /todos/1` or `Cannot DELETE /todos/2`

**Cause:** Node reads `index.js` once, when it starts. If you add a route and don't restart, the running server doesn't know about it.

**Fix:** Save the file (`Ctrl + S`), then restart the server.

### Problem 2: The old server kept answering

**Cause:** An old `node` process was still running, so requests kept reaching the outdated code.

**Fix:** Find it and kill it, then start fresh (see section 8).

### Problem 3: Wrong port in the URL

**Cause:** I changed the port in the code (4000, then 5000, then 6000), but the saved request in Thunder Client still used the old one.

**Fix:** The port in the URL must match the port printed in the terminal.

### Problem 4: `TypeError: Assignment to constant variable`

**Cause:** `const TodoArray` cannot be reassigned, but the delete route does `TodoArray = TodoArray.filter(...)`.

**Fix:** Change `const TodoArray` to `let TodoArray`.

### Problem 5: `req.body` is empty and `task` is `undefined`

**Cause:** The `Content-Type: application/json` header is missing, so `express.json()` skips the body.

**Fix:** Set the body type to JSON in Thunder Client or Postman.

## 8. Commands to Refresh the Server

### Basic commands

| Command | Description |
|---|---|
| `node index.js` | Starts the server |
| `Ctrl + C` | Stops the server (press inside the terminal) |
| `cls` | Clears the terminal screen so old errors don't confuse you |
| `npx nodemon index.js` | Runs the server and restarts it automatically on every save |

### Finding and killing an old server (Windows)

| Command | Description |
|---|---|
| `netstat -ano \| findstr :6000` | Shows which program is using port 6000 |
| `taskkill /PID <PID> /F` | Force-stops one program by its PID |
| `taskkill /F /IM node.exe` | Force-stops all Node.js programs |

**`netstat -ano | findstr :6000` explained:**

| Part | Meaning |
|---|---|
| `netstat` | **Net**work **stat**istics: lists open ports |
| `-a` | **A**ll connections and listening ports |
| `-n` | **N**umerical: show port numbers instead of names |
| `-o` | **O**wner: show the PID of each program |
| `\|` | Pipe: sends the output of the left command to the right one |
| `findstr :6000` | **Find str**ing: keeps only lines containing `:6000` |

**`taskkill /F /IM node.exe` explained:**

| Part | Meaning |
|---|---|
| `/F` | **F**orce the program to stop |
| `/IM` | **I**mage **N**ame: find programs by file name |
| `node.exe` | The program name of Node.js |

> **PID** means Process ID, the unique number the operating system gives every running program.
>
> `Access is denied` messages for a few Node processes are normal. They are protected processes and can be ignored.

### Mac / Linux equivalents

| Command | Description |
|---|---|
| `lsof -i :6000` | Shows what is using port 6000 |
| `kill -9 <PID>` | Force-stops that process |

### The refresh routine that fixes most problems

```powershell
taskkill /F /IM node.exe
cls
node index.js
```

## 9. Debugging Checklist

1. Did I save the file? (`Ctrl + S`)
2. Did I restart the server?
3. Does the URL port match the port printed in the terminal?
4. Is an old server still running? (`taskkill /F /IM node.exe`)

### Common errors

| Error | Fix |
|---|---|
| `Cannot GET/PUT/DELETE /todos/1` | Save the file and restart the server |
| `Assignment to constant variable` | Change `const` to `let` |
| `EADDRINUSE: address already in use` | Kill old Node processes or change the port |
| `task` is `undefined` | Set body type to JSON (`Content-Type: application/json`) |

## 10. Publishing to GitHub

```bash
git add index.js README.md
git commit -m "todo CRUD API with express"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPO.git
git push -u origin main
```

Never upload `node_modules`. Create a `.gitignore` file with this content:

```
node_modules
.env
```

Anyone who downloads the project runs `npm install` first, then `node index.js`.

## Next Steps

- Connect to a database (MongoDB) so data survives restarts
- Split routes and controllers into separate files
- Add authentication
