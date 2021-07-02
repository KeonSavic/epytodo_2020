/* EXPRESS */
const express = require('express');
const router = express.Router();

/* MODULES */
require('dotenv').config({path: "../.env"}) /* DOTENV */
var bcrypt = require('bcryptjs'); /* BCRYPT */
var jwt = require('jsonwebtoken'); /* JWT */

/* import DATABASE from CONFIG */
const db = require("../../config/db.js")
const con = db.con

/* REGISTER */
router.post('/register', (req, res) => {
    var email = req.body.email,
        password = bcrypt.hashSync(req.body.password, 10),
        name = req.body.name,
        firstname = req.body.firstname

    if (typeof email != 'undefined' && typeof password != 'undefined' && typeof name != 'undefined' && typeof firstname != 'undefined') {
        con.connect(function(err) { /* Connect to DB */
            if (err) throw err;
            var sql = `INSERT INTO user (email, password, name, firstname) \
            VALUES ('${email}', '${password}', '${name}', '${firstname}');`;

            con.query(sql, function (err) { /* Query to DB */
                if (err) {
                    res.status(400).send({ msg: `account already exists` })
                } else {
                    var token = jwt.sign({ email: email }, process.env.SECRET, { expiresIn: '1h' });
                    res.set('JWT', token);
                    res.status(200).send({ token: `${token}` });
                }
            });
        });
    } else {
        res.status(400).send({ msg: `internal server error` })
    }
})

/* LOGIN */
router.post('/login', (req, res) => {
	var email = req.body.email;

    con.connect(function(err) {
        if (err) throw err;
        var sql = `SELECT * FROM user WHERE email = '${email}'`;

        con.query(sql, function(err,rows) {
            if (rows <= 0) {
                res.status(400).send({ msg: `Invalid Credentials` });
            } else {
                bcrypt.compare(req.body.password, rows[0].password, function(err, result) {
                    if (result) {
                        var token = jwt.sign({ email: email }, process.env.SECRET, { expiresIn: '1h' });
                        res.set('JWT', token);
                        res.status(200).send({ token: `${token}` });
                    } else {
                        res.status(400).send({ msg: `Invalid Credentials` });
                    }
                });
            }
        });
    });
});

module.exports = router;