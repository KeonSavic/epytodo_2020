/* EXPRESS */
const express = require('express');
const { decode } = require('jsonwebtoken');
const router = express.Router();

/* MODULES */
var jwt = require('jsonwebtoken'); /* JWT */
var bcrypt = require('bcryptjs'); /* BCRYPT */

/* import DATABASE from CONFIG */
const db = require("../../config/db.js")
const con = db.con

/* user GET => view all user informations */
router.get('/user', (req, res) => {

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
                var sql = "SELECT * FROM user";

                /* Query to DB */
                con.query(sql, function(error, results, fields) {
                    res.status(200).send(results);
                });
            }
        });
    });
});

/* user/todos GET => view all (logged-in)user tasks */
router.get('/user/todos', (req, res) => {

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
                var sql_find_id = `SELECT * FROM user WHERE email = '${decoded.email}'`

                /* Query to DB */
                con.query(sql_find_id, function(error, results, fields) {
                    var user_id = results[0].id
                    var sql = `SELECT * FROM todo WHERE user_id = '${user_id}'`;

                    /* Query to DB */
                    con.query(sql, function(error, results, fields) {
                        res.status(200).send(results);
                    });
                });
            }
        });
    });
});

/* user/:id GET => view user information (ID) */
router.get('/user/:param', (req, res) => {

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
                var param = req.params['param'];

                if (!isNaN(param)) {
                    var sql = `SELECT * FROM user WHERE id = '${param}'`;
                } else {
                    var sql = `SELECT * FROM user WHERE email = '${param}'`;
                }

                /* Query to DB */
                con.query(sql, function(error, results, fields) {
                    res.status(200).send(results);
                });
            }
        });
    });
});

/* user/:id DELETE => delete user */
router.delete('/user/:id', (req, res) => {

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
                    var sql = `DELETE FROM user WHERE id = '${id}'`;

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

/* user/:id PUT => update user information */
router.put('/user/:id', (req, res) => {

    /* Connect to DB */
    con.connect(function(err) {
        if (err) throw err;
        var token = req.headers.jwt,
            email = req.body.email,
            password = bcrypt.hashSync(req.body.password, 10),
            firstname = req.body.firstname,
            name = req.body.name;

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
                    var sql = `UPDATE user SET email = '${email}', password = '${password}', firstname = '${firstname}', name = '${name}' WHERE id = '${id}'`;

                    /* Query to DB */
                    con.query(sql, function(error, result, fields) {
                        if (err) {
                            res.status(400).send({ msg: `internal server error` })
                        } else {
                            var obj = { 'email': email, 'password': password, 'firstname': firstname, 'name': name };
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

/*

route               method  protected   description

1 /user               GET     yes         view all user informations                //DONE
2 /user/todos         GET     yes         view all (logged-in)user tasks            //DONE
3 /user/:id or :email GET     yes         view user information                     //DONE
5 /user/:id           DELETE  yes         delete user                               //DONE
4 /user/:id           PUT     yes         update user information                   //DONE

*/