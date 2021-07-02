/* EXPRESS */
const express = require('express');
const { decode } = require('jsonwebtoken');
const router = express.Router();

/* MODULES */
var jwt = require('jsonwebtoken'); /* JWT */

/* import DATABASE from CONFIG */
const db = require("../../config/db.js")
const con = db.con

/* todo GET => view all the todos */
router.get('/todo', (req, res) => {

    /* Connect to DB */
    con.connect(function(err) {
        if (err) throw err;
        var token = req.headers.jwt

        jwt.verify(token, process.env.SECRET, function(err, decoded) {
            if (err) {
                if (typeof token === 'undefined') {
                    res.status(400).send({ msg: `No token, authorization denied` });
                } else {
                    res.status(400).send({ msg: `Token is not valid` });
                }
            } else {
                var sql = "SELECT * FROM todo";

                /* Query to DB */
                con.query(sql, function(error, results, fields) {
                    res.status(200).send(results);
                });
            }
        });
    });
});

/* todo POST => create a todo */
router.post('/todo', (req, res) => {

    con.connect(function(err) { /* Connect to DB */
        if (err) throw err;
        var title = req.body.title,
            description = req.body.description,
            due_time = req.body.due_time,
            user_id = req.body.user_id,
            status = req.body.status;
        token = req.headers.jwt

        jwt.verify(token, process.env.SECRET, function(err, decoded) {
            if (err) {
                if (typeof token === 'undefined') {
                    res.status(400).send({ msg: `No token, authorization denied` });
                } else {
                    res.status(400).send({ msg: `Token is not valid` });
                }
            } else {
                var sql = `INSERT INTO todo (title, description, due_time, user_id, status) \
                VALUES ('${title}', '${description}', '${due_time}', '${user_id}', '${status}');`;

                con.query(sql, function(err, results) { /* Query to DB */
                    if (err) {
                        res.status(400).send({ msg: `internal server error` })
                    } else {
                        var newsql = `SELECT * FROM todo WHERE title = '${title}' AND description = '${description}' AND due_time = '${due_time}' AND user_id = '${user_id}' AND status = '${status}'`;
                        con.query(newsql, function(error, fields) { /* Query to DB */
                            res.status(200).send(fields[0])
                            if (err) throw err
                        });
                    }
                });
            }
        });
    });
})

/* todo/:id DELETE => delete a todo */
router.delete('/todo/:id', (req, res) => {

    /* Connect to DB */
    con.connect(function(err) {
        if (err) throw err;
        var token = req.headers.jwt

        jwt.verify(token, process.env.SECRET, function(err, decoded) {
            if (err) {
                if (typeof token === 'undefined') {
                    res.status(400).send({ msg: `No token, authorization denied` });
                } else {
                    res.status(400).send({ msg: `Token is not valid` });
                }
            } else {
                var id = req.params['id'];

                if (!isNaN(id)) {
                    var sql = `DELETE FROM todo WHERE id = '${id}'`;

                    /* Query to DB */
                    con.query(sql, function(error, results, fields) {
                        res.status(200).send({ msg: `succesfully deleted record number: ${id}` });
                    });
                } else {
                    res.status(400).send({ msg: `internal server error` });
                }
            }
        });
    });
});

/* todo/:id GET => view the todo (ID) */
router.get('/todo/:id', (req, res) => {

    /* Connect to DB */
    con.connect(function(err) {
        if (err) throw err;
        var token = req.headers.jwt

        jwt.verify(token, process.env.SECRET, function(err, decoded) {
            if (err) {
                if (typeof token === 'undefined') {
                    res.status(400).send({ msg: `No token, authorization denied` });
                } else {
                    res.status(400).send({ msg: `Token is not valid` });
                }
            } else {
                var id = req.params['id'];
                var sql = `SELECT * FROM todo WHERE id = '${id}'`;

                /* Query to DB */
                con.query(sql, function(error, results, fields) {
                    res.status(200).send(results);
                });
            }
        });
    });
});

/* todo/:id PUT => update todo information */
router.put('/todo/:id', (req, res) => {

    /* Connect to DB */
    con.connect(function(err) {
        if (err) throw err;
        var token = req.headers.jwt,
            title = req.body.title,
            description = req.body.description,
            due_time = req.body.due_time,
            user_id = req.body.user_id,
            status = req.body.status;

        jwt.verify(token, process.env.SECRET, function(err, decoded) {
            if (err) {
                if (typeof token === 'undefined') {
                    res.status(400).send({ msg: `No token, authorization denied` });
                } else {
                    res.status(400).send({ msg: `Token is not valid` });
                }
            } else {
                var id = req.params['id'];

                if (!isNaN(id)) {
                    var sql = `UPDATE todo SET title = '${title}', description = '${description}', due_time = '${due_time}', user_id = '${user_id}', status = '${status}' WHERE id = '${id}'`;

                    /* Query to DB */
                    con.query(sql, function(error, result, fields) {
                        if (err) {
                            res.status(400).send({ msg: `internal server error` })
                        } else {
                            var obj = { 'title': title, 'description': description, 'due_time': due_time, 'user_id': user_id, 'status': status };
                            res.status(200).send(obj)
                        }
                    });
                } else {
                    res.status(400).send({ msg: `internal server error` });
                }
            }
        });
    });
});

module.exports = router;