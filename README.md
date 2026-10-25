# Todo REST API (Node.js + Express)

A beginner-friendly REST API for managing todos, built with **Node.js** and **Express**. It supports full CRUD (Create, Read, Update, Delete) and stores data in memory.

> **Note:** Data lives in memory only, so it resets every time the server restarts.

## Features

- Create, read, update, and delete todos
- JSON request and response bodies
- Input validation and proper HTTP status codes (`200`, `201`, `400`, `404`)

## Tech Stack

- [Node.js](https://nodejs.org/)
- [Express](https://expressjs.com/)

## Getting Started

### Prerequisites

- Node.js installed (check with `node --version`)

### Installation

```bash
git clone https://github.com/YOUR-USERNAME/YOUR-REPO.git
cd YOUR-REPO
npm install
```

### Run the server

```bash
node index.js
```

For automatic restarts on every save, use nodemon:

```bash
npx nodemon index.js
```

The server runs at `http://localhost:6000`.

## API Endpoints

| Method | Endpoint     | Description        | Body (JSON)                                  |
|--------|--------------|--------------------|----------------------------------------------|
| GET    | `/`          | Welcome message    | none                                         |
| GET    | `/todos`     | Get all todos      | none                                         |
| GET    | `/todos/:id` | Get one todo       | none                                         |
| POST   | `/todos`     | Create a todo      | `{ "task": "...", "status": "...", "tag": [] }` |
| PUT    | `/todos/:id` | Update a todo      | any of `task`, `status`, `tag`               |
| DELETE | `/todos/:id` | Delete a todo      | none                                         |

### Todo object

```json
{
  "id": 1,
  "task": "testing one",
  "status": "todo",
  "tag": ["node js", "javascript"]
}
```

### Status codes

| Code | Meaning                              |
|------|--------------------------------------|
| 200  | Request succeeded                    |
| 201  | Todo created                         |
| 400  | Bad request (e.g. `task` is missing) |
| 404  | Todo not found                       |

## Example Requests

You can test with [Thunder Client](https://www.thunderclient.com/) (VS Code extension), Postman, or curl.

**Create a todo**

```bash
curl -X POST http://localhost:6000/todos \
  -H "Content-Type: application/json" \
  -d '{"task": "learn express", "tag": ["node js"]}'
```

**Update a todo**

```bash
curl -X PUT http://localhost:6000/todos/1 \
  -H "Content-Type: application/json" \
  -d '{"status": "Done"}'
```

**Delete a todo**

```bash
curl -X DELETE http://localhost:6000/todos/2
```

> **Windows PowerShell users:** use `curl.exe` instead of `curl`, and write the JSON on one line with escaped quotes, for example:
> `curl.exe -X POST http://localhost:6000/todos -H "Content-Type: application/json" -d "{\"task\": \"learn express\"}"`

> **Important:** For POST and PUT, the `Content-Type: application/json` header is required. Without it, `express.json()` cannot parse the body and `req.body` will be empty. Thunder Client and Postman add it automatically when the body type is set to JSON.

## Troubleshooting

### Quick checklist

1. Did I save the file? (`Ctrl + S`)
2. Did I restart the server? (`Ctrl + C`, then `node index.js`)
3. Does the URL port match the port printed in the terminal?
4. Is an old server still running?

### Common errors

| Error | Cause | Fix |
|-------|-------|-----|
| `Cannot GET /todos/1` (or `Cannot PUT` / `Cannot DELETE`) | The running server does not have that route yet | Save the file and restart the server |
| `Assignment to constant variable` | A `const` variable was reassigned | Change `const` to `let` |
| `EADDRINUSE: address already in use :::6000` | An old server is still using the port | Kill old Node processes (see below) or change the port |
| Request returns a 404 from the wrong server | URL port differs from the server port | Use the port printed in the terminal |
| `req.body` is empty / `task` is `undefined` | Missing `Content-Type: application/json` header | Set the body type to JSON |

## Command Reference

### Running the server

| Command | Description |
|---------|-------------|
| `node index.js` | Runs the file with Node.js and starts the server. Node reads the file once at startup, so restart after every code change. |
| `npx nodemon index.js` | Runs the server with nodemon, which restarts automatically on save. (`npx` runs a package without installing it globally.) |
| `Ctrl + C` | Stops the running server (press inside the terminal). |
| `cls` | Clears the terminal screen (Windows). |

### Finding and stopping an old server (Windows)

| Command | Description |
|---------|-------------|
| `netstat -ano \| findstr :6000` | Shows which program is using port 6000. The last number in the result is the PID. |
| `taskkill /PID <PID> /F` | Force-stops **one** program by its Process ID. |
| `taskkill /F /IM node.exe` | Force-stops **all** Node.js processes. |

**Breaking down `netstat -ano | findstr :6000`:**

| Part | Meaning |
|------|---------|
| `netstat` | **Net**work **stat**istics: lists open ports and connections |
| `-a` | **A**ll connections and listening ports |
| `-n` | **N**umerical: show port numbers instead of names |
| `-o` | **O**wner: show the PID of the program using each port |
| `\|` | Pipe: sends the output of the left command to the right command |
| `findstr :6000` | **Find str**ing: keeps only lines containing `:6000` |

**Breaking down `taskkill`:**

| Part | Meaning |
|------|---------|
| `/PID` | Select the program by its **P**rocess **ID** |
| `/F` | **F**orce the program to stop |
| `/IM` | Select programs by **I**mage **N**ame (file name) |
| `node.exe` | The file name of Node.js |

> **PID** (Process ID) is the unique number the operating system gives to every running program.
>
> `Access is denied` messages for some Node processes are normal. Those are protected system or editor processes and can be ignored.

### Mac / Linux equivalents

| Command | Description |
|---------|-------------|
| `lsof -i :6000` | Shows what is using port 6000 |
| `kill -9 <PID>` | Force-stops that process |

### Useful shortcuts (VS Code)

| Shortcut | Action |
|----------|--------|
| `Ctrl + S` | Save the file (an unsaved file shows a white dot on its tab) |
| `Ctrl + F` | Search inside the file |
| `Ctrl + A` | Select everything |
| `Ctrl + Shift + Esc` | Open Task Manager (Details tab shows PIDs) |

## Project Structure

```
.
├── index.js        # Express server and all routes
├── package.json
└── README.md
```

## Future Improvements

- Connect to a database (MongoDB) so data persists
- Add authentication
- Split routes and controllers into separate files

## License

This project is for learning purposes.
