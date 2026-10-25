// const operations = require("./mathOperation")
// const time = require("./logger")

// console.log(operations.add(20,30))
// console.log(time)

// const http = require("http")

// const server = http.createServer((req,res)=>{
//     if(req.url=="/"){
// res.write("HElllooo")
//     }else if(req.url=="/abou"){
// res.write("welcome to about page")

//     }else{
//         res.write("Iam sorry I cannot understand you")
//     }

//     res.end()
// }

// )

// // 👉 MISSING PIECE: Start the server so it listens for requests
// const PORT = 3000;
// server.listen(PORT, () => {
//     console.log(`Server is running at http://localhost:${PORT}`);})

const express = require("express");
const app = express();

// temporary Todo database
let TodoArray = [
  {
    id: 1,
    task: "testing one",
    status: "todo",
    tag: ["node js", "javascript"],
  },
  {
    id: 2,
    task: "testing second",
    status: "processing",
    tag: ["node js", "javascript"],
  },
  {
    id: 3,
    task: "testing third",
    status: "Done",
    tag: ["node js", "javascript"],
  },
];

console.log(TodoArray);

// Middleware to parse incoming JSON from requests
app.use(express.json());

console.log("==========================================");
console.log("!!! THIS IS MY BRAND NEW SERVER CODE !!!");
console.log("==========================================");

// POST route: Receive new todo and push it to TodoArray
app.post("/todos", (req, res) => {
  console.log("🔥 POST ROUTE IS RUNNING!");

  let todo = req.body;

  let newTodo = {
    id: TodoArray.length > 0 ? TodoArray[TodoArray.length - 1].id + 1 : 1,
    task: todo.task,
    tag: todo.tag || todo.tags || [],
    status: todo.status || "todo",
  };

  // Push the new todo into your array
  TodoArray.push(newTodo);

  console.log("ADDED SUCCESSFULLY:", newTodo);

  // Send back the complete object including the new ID
  res.status(201).json(newTodo);
});
// Home route
app.get("/", (req, res) => {
  res.send("welcome to node js testing express");
});

// Get all todos
app.get("/todos", (req, res) => {
  res.send(TodoArray);
});

// Get one todo by id
app.get("/todos/:id", (req, res) => {
  let id = Number(req.params.id);

  let todo = TodoArray.find((t) => t.id === id);

  if (!todo) {
    return res.status(404).json({ error: "Todo not found" });
  }

  res.json(todo);
});

// UPDATE: change a todo by id
app.put("/todos/:id", (req, res) => {
  let id = Number(req.params.id);

  let todo = TodoArray.find((t) => t.id === id);

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

// delete by id
app.delete("/todos/:id", (req, res) => {
  let id = Number(req.params.id);

  TodoArray = TodoArray.filter((t) => t.id !== id);

  res.json({ message: "Todo deleted" });
});

// Set a fallback port (like 4000) for local testing if no environment port is provided
const PORT = process.env.PORT || 6000;

app.listen(PORT, () => {
  console.log(`Server is running successfully on port ${PORT}!!!!!!`);
});

/*
=====================================================
 NODE.JS / EXPRESS COMMANDS CHEAT SHEET (Windows)
=====================================================

--- RUNNING THE SERVER ---

node index.js
  Runs your file with Node.js and starts the server.
  Node reads the file ONCE at startup, so after editing
  the code you must stop and start it again.

npx nodemon index.js
  Runs the server with nodemon, which restarts it
  automatically every time you save the file.
  (npx = run a package without installing it globally)

Ctrl + C
  Pressed inside the terminal. Stops the running server.

cls
  Clears the terminal screen (removes old errors so you
  only see new ones).


--- FINDING AND KILLING AN OLD SERVER ---

netstat -ano | findstr :4000
  Shows which program is using port 4000.
    netstat    = network statistics (lists open ports)
    -a         = all connections and listening ports
    -n         = show numbers instead of names
    -o         = show the owner's PID
    |          = pipe: sends the output to the next command
    findstr    = find string (keeps only lines containing :4000)
  The last number in the result is the PID.

PID
  Process ID. A unique number Windows gives to each
  running program.

taskkill /PID 12345 /F
  Stops ONE specific program.
    /PID 12345 = the program with this ID (use your own number)
    /F         = Force it to stop

taskkill /F /IM node.exe
  Stops ALL Node programs at once.
    /F         = Force
    /IM        = Image Name (find programs by file name)
    node.exe   = the file name of Node.js
  "Access is denied" lines for some processes are normal
  (Windows-protected processes). Ignore them.

Mac / Linux equivalents:
  lsof -i :4000      shows what is using port 4000
  kill -9 <PID>      force-stops that process

Task Manager: Ctrl + Shift + Esc -> Details tab -> PID column


--- TESTING THE API ---

Thunder Client (VS Code extension) or Postman:
  GET     http://localhost:6000/todos       get all todos
  GET     http://localhost:6000/todos/1     get one todo
  POST    http://localhost:6000/todos       add a todo (JSON body)
  PUT     http://localhost:6000/todos/1     update a todo (JSON body)
  DELETE  http://localhost:6000/todos/1     delete a todo (no body)

curl (terminal alternative):
  curl -X POST http://localhost:6000/todos \
    -H "Content-Type: application/json" \
    -d '{"task": "learn express"}'
    -X      = which HTTP method to use
    -H      = add a header
    -d      = the data (body) to send

Header "Content-Type: application/json"
  Tells the server the body is JSON, so express.json()
  can turn it into req.body. Thunder Client adds it
  automatically when Body is set to JSON.


--- VS CODE SHORTCUTS ---

Ctrl + S   save the file (an unsaved file shows a white dot)
Ctrl + F   search inside the file
Ctrl + A   select everything


--- COMMON ERRORS AND FIXES ---

Cannot GET /todos/1  (or Cannot PUT / Cannot DELETE)
  -> The route doesn't exist in the RUNNING server.
     Save the file, then restart the server.

Assignment to constant variable
  -> A const variable was reassigned. Change const to let.

EADDRINUSE: address already in use :::6000
  -> An old server is still using the port.
     Run: taskkill /F /IM node.exe   or change the port.

Request goes to the wrong place
  -> The port in the URL must match the port printed in the
     terminal ("Server is running on port ...").

req.body is empty / task is undefined
  -> Missing Content-Type: application/json header,
     or the Body type is not set to JSON.


--- CHECKLIST WHEN SOMETHING DOESN'T WORK ---
1. Did I save the file? (Ctrl + S)
2. Did I restart the server? (Ctrl + C, then node index.js)
3. Does the URL port match the terminal port?
4. Is an old server still running? (taskkill /F /IM node.exe)
=====================================================
*/
