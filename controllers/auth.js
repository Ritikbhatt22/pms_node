var connection = require("../config/config")
const bodyParser = require('body-parser');
let jwt = require('jsonwebtoken');
let config = require('../config/config');
let middleware = require('../middleware/middleware');
let config1 = require("../config/config1")

let utils = require('../utils/utitlity')

const Promise = require('bluebird');
const HttpStatus = require('http-status-codes');


const Errors = require('../errors');

var expressValidator = require('express-validator');
var flash = require('express-flash');
const { body, validationResult } = require('express-validator/check');





exports.addUser = async (req, res) => {



    try {
        var today = new Date();
        const validation_result = validationResult(req);
        console.log(validation_result, "dasdasdsad")
        if (validation_result.isEmpty() === true) {



            var today = new Date();
            var users = {
                "empFirstName": req.body.empFirstName,
                "middle_name": req.body.middle_name,
                "empLastName": req.body.empLastName,
                "gender": req.body.gender,
                "martial_status": req.body.martial_status,
                "employee_code": req.body.employee_code,
                "empemail": req.body.empemail,
                "password": req.body.password,
                "mobile_no": req.body.mobile_no,
                "dob": utils.date(req.body.dob),
                "doj": utils.date(req.body.doj),
                "created_date": today,

            }

            console.log('req.user', req.user, "sadsdadasda", users)
            if (req.user.is_admin == 1) {

                var results = await connection.query(`SELECT * FROM employee WHERE empemail =?`, [req.body.empemail])

                if (results.length > 0) {
                    res.send({
                        "code": 203,
                        "message": "Email already exists"
                    });


                } else {
                    try {
                        var result = await connection.query('INSERT INTO employee SET ?', users)

                        return res.status(HttpStatus.ACCEPTED).send({
                            "code": HttpStatus.OK,
                            "message": "user registered sucessfully",
                            "data": result
                        })

                    }
                    catch (err) {
                        if (err instanceof Errors.NotFound)
                            return res.status(HttpStatus.NOT_FOUND).send({ message: err.message }); // 404
                        console.log(err);
                        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ error: err, message: err.message }); // 500
                    }

                }
            }
        }
        else {
            res.json({
                "code": 400,
                "message": "incorrect format",
            })
        }
    }
    catch (err) {
        console.log(err);
        res.json({
            "code": 202,
            "message": "Action only allowed by admin",
            "data": null
        })
    }
}



exports.login = async (req, res, next) => {
    try {

        const validation_result = validationResult(req);
        console.log(validation_result, "dasdasdsad")
        if (validation_result.isEmpty() === true) {
        var empemail = req.body.empemail;
        var password = req.body.password;

        // For the given username fetch user from DB



        console.log(empemail);
        console.log(password);

        var results = await connection.query("SELECT * FROM employee WHERE empemail = ?", [empemail])

        console.log('The solution is: ', results);

        if (results.length > 0) {
            if (results[0].password == password) {
                console.log('emp id', results[0].empID)
                let payload = {

                    'password': password,
                    'empemail': empemail,
                    'is_admin': results[0].is_admin,
                    'empID': results[0].empID
                }
                console.log(payload, "Payload")
                let token = jwt.sign(payload,
                    config1.secret,
                    {
                        expiresIn: '24h' // expires in 24 hours
                    }
                );
                console.log(token);
                res.send({
                    "code": 200,
                    "message": "login sucessfull",
                    'data': results[0],
                    'token': token,
                });
            }
            else {
                res.send({
                    "code": 204,
                    "success": "Password does not match"
                });
            }
        }
        else {
            res.send({
                "code": 204,
                "success": "Email does not exists"
            });
        }
    }
    else {
        res.json({
            "code": 400,
            "message": "Password not matched",
        })
    }
    }
    catch (err) {
        if (err instanceof Errors.NotFound)
            return res.status(HttpStatus.NOT_FOUND).send({ message: err.message }); // 404
        console.log(err);
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ error: err, message: err.message }); // 500
    }
}

exports.addExperience = async (req, res) => {
    try {
        let date = new Date();

        let obj = {
            "employee_id": req.body.employee_id,
            "company_name": req.body.company_name,
            "experience_from": req.body.experience_from,
            "experience_to": req.body.experience_to,
            "experience_technology": JSON.stringify(req.body.experience_technology),
            "description": req.body.description,
            "created_date": date,
            "modified_date": date
        }

        var results = await connection.query('INSERT INTO employee_experience SET ?', obj)
        return res.status(HttpStatus.ACCEPTED).send({
            "code": HttpStatus.OK,
            "message": "user registered sucessfully",
            "data": results
        })
    }
    catch (err) {
        if (err instanceof Errors.NotFound)
            return res.status(HttpStatus.NOT_FOUND).send({ message: err.message }); // 404
        console.log(err);
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ error: err, message: err.message }); // 500
    }
}








