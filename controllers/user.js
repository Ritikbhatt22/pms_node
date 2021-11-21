var connection = require("../config/config")
var utils = require('../utils/utitlity')
const Promise = require('bluebird');
const HttpStatus = require('http-status-codes');
const fs = Promise.promisifyAll(require('fs'))

const Errors = require('../errors');

exports.allUsersList = async (req, res) => {
    try {
        var result = await connection.query(`SELECT empID,empFirstName,middle_name,empLastName,
        gender,martial_status,empemail,mobile_no,dob,doj
     FROM employee 
     ORDER BY DATE(created_date) DESC `)
        return res.status(HttpStatus.ACCEPTED).send({
            "code": HttpStatus.OK,
            "message": "List of Users",
            'data': result
        })
    }
    catch (err) {
        if (err instanceof Errors.NotFound)
            return res.status(HttpStatus.NOT_FOUND).send({ message: err.message }); // 404
        console.log(err);
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ error: err, message: err.message }); // 500
    }
}







exports.singleUserlist = async (req, res) => {
    try {

        var results = await connection.query(`SELECT empID,empFirstName,middle_name,empLastName,gender,martial_status,empemail,mobile_no,
    dob,doj,employee_code,employee_type_id,employee_designation_id 
    FROM employee  WHERE  empemail = ?`, [req.user.empemail])



        return res.status(HttpStatus.ACCEPTED).send({
            "code": HttpStatus.OK,
            "message": "List Of Users retrieved",
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


exports.update = function (req, res) {

    connection.query("SELECT empID,empFirstName,middle_name,empLastName,gender,martial_status,empemail,mobile_no,dob,doj FROM employee  WHERE  empID = ?", [req.body.empID], function (error, resul, fields) {
        if (error) {
            // console.log("error ocurred",error);
            res.send({
                "code": 400,
                "failed": "Something went wrong"
            })

        }

        else {

            let oldData = JSON.stringify(resul);
            var date = new Date();

            let obj = {
                empID: req.body.empID,
                empFirstName: req.body.empFirstName,
                middle_name: req.body.middle_name,
                empLastName: req.body.empLastName,
                gender: req.body.gender,
                martial_status: req.body.martial_status,
                empemail: req.body.empemail,
                password: req.body.password,
                mobile_no: req.body.mobile_no,
                dob: utils.date(req.body.dob),
                doj: utils.date(req.body.doj),
                created_date: date,

            }
            var x = JSON.stringify(obj)
            //   var res = x.replace(/:/g, "=");
            let newData = JSON.stringify(x);
            let queryer = `UPDATE employee SET ? WHERE empID = '${req.body.empID}'`;
            connection.query(queryer, obj, function (err, result) {

                if (err) {
                    res.send({
                        "code": 202,
                        "message": "Something went wrong",
                        "data": err

                    })
                }

                else {
                    connection.query("SELECT empID,empFirstName,middle_name,empLastName,gender,martial_status,empemail,mobile_no,dob,doj FROM employee  WHERE  empID = ?", [req.body.empID], function (error, result, fields) {
                        if (error) {

                            res.send({
                                "code": 400,
                                "failed": "Something went wrong"
                            })

                        }

                        else {

                            let newOne = JSON.stringify(result);

                            if (oldData === newOne) {
                                res.send({
                                    "code": 202,
                                    "message": "Data Already exists"
                                })

                            }
                            else {
                                var today = new Date();
                                var user = {
                                    row_id: req.body.empID,
                                    updated_by_id: req.user.empID,
                                    table_name: "employee",
                                    old_data: oldData,
                                    new_data: newData,
                                    created_date: today,

                                }

                                connection.query('INSERT INTO history_management SET ?', user, function (error, results, fields) {


                                    //  connection.query('INSERT INTO history_management SET ?',users,function(err,results){
                                    if (err) {
                                        console.log("error ocurred", err);
                                        res.send({
                                            "code": 400,
                                            "message": "Something went wrong",
                                            "err": error
                                        })
                                    } else {

                                        res.send({
                                            "code": 200,
                                            "message": "User Updated sucessfully",
                                            "data": results
                                        });
                                    }

                                })


                            }
                        }
                    })
                }

            })

        }

    })

}

exports.getEmployeeDetails = async (req, res) => {

    try {
        let query = "SELECT empID,employee_id,empFirstName,middle_name,empLastName,gender,martial_status,empemail,mobile_no,dob,doj,company_name,experience_from,experience_to,experience_technology,description  FROM employee,employee_experience WHERE employee.empID=employee_experience.employee_id "
        var results = await connection.query(query)



        let js = results[0].experience_technology;
        let rs = JSON.stringify(js)

        return res.status(HttpStatus.ACCEPTED).send({
            "code": HttpStatus.OK,
            "message": "getting table data",
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


exports.getSingleEmployeeDetails = async (req, res) => {

    try {
        let query = "SELECT empID,employee_id,empFirstName,middle_name,empLastName,gender,martial_status,empemail,mobile_no,dob,doj,company_name,experience_from,experience_to,experience_technology,description  FROM employee,employee_experience WHERE employee.empID=employee_experience.employee_id "
        var results = await connection.query(query);

        let js = results[0].experience_technology;
        let rs = JSON.stringify(js)
        return res.status(HttpStatus.ACCEPTED).send({
            "code": HttpStatus.OK,
            "message": "getting table data",
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


