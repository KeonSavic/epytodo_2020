/* EXPRESS */
const express = require('express')
const app = express()
const port = 3000

// parse application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: false }))

// parse application/json (bodyParser to get BODY variables)
app.use(express.json())

/* IMPORT EXTERNAL JS FILES */
const auth = require("./routes/auth/auth.js")
const user = require("./routes/user/user.js")
const todo = require("./routes/todos/todo.js")

// set json spaces to 2
app.set('json spaces', 2);

/* Use external JS files */
app.use(auth);
app.use(user);
app.use(todo);

/* Listen to app */
app.listen(port, () => {})