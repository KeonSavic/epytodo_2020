/* EXPRESS */
const express = require('express');
const router = express.Router();

/* MYSQL2 (database package) */
const mysql = require('mysql2');

/* MYSQL DB CONNECTION */
const con = mysql.createConnection({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    database: process.env.MYSQL_DATABASE,
    password: process.env.MYSQL_ROOT_PASSWORD,
});

module.exports.con = con