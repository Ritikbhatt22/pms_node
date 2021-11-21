var connection = require("../config/config");
var CodeGenerator = require('node-code-generator');
let utils = require('../utils/utitlity')



const Promise = require('bluebird');
const HttpStatus = require('http-status-codes');
const fs = Promise.promisifyAll(require('fs'))

const Errors = require('../errors');

const { body, validationResult } = require('express-validator/check');

// Generate an array of random unique project_code according to the provided pattern:




exports.add_project = (req, res) => {
    try {
        var date = new Date();
        var obj = {

            'project_billing_method_id': req.body.project_billing_method_id,
            'project_model': req.body.project_model ? req.body.project_model : 'Scrum',
            'project_code': req.body.project_code,
            'project_name': req.body.project_name,
            'project_description': req.body.project_description,
            'project_start_date': utils.date(req.body.project_start_date),
            'project_end_date': utils.date(req.body.project_end_date),
            'project_priority_id': req.body.project_priority_id,
            'project_status_id': req.body.project_status_id,
            'percentage_complete': req.body.percentage_complete,
            'project_client_id': req.body.project_client_id,
            'risk_description': req.body.risk_description,
            'total_budgets': req.body.total_budgets,
            'reporting_to': req.body.reporting_to,
            'project_document': req.body.project_document,
            'created_date': date
        }
        return new Promise(function (resolve, reject) {
            connection.query('INSERT INTO project SET ?', obj, (err, result) => {
                console.log(err, "ritik")
                if (err) {
                    reject(err);
                }
                else {
                    try {
                        var str = req.body.employee_id;
                        var temp = JSON.parse("[" + str + "]");
                        if (temp.length > 0) {
                            for (let i = 0; i < temp.length; i++) {
                                let empObj = {
                                    'project_id': result.insertId,
                                    'employee_id': temp[i],
                                    'created_date': date,
                                    'modified_date': date
                                }

                                connection.query(`INSERT INTO project_team SET ? `, empObj, (err, results) => {

                                    if (err) {
                                        return reject(err);
                                    } else {
                                        data = results
                                        console.log("project team Record Added")
                                        return resolve(results)

                                    }

                                })
                            }

                            let moduleObj = {
                                "project_id": result.insertId,
                                "project_module": req.body.project_module,
                                "created_date": date,
                                "modified_date": date
                            }
                            connection.query(`INSERT INTO project_module SET ? `, moduleObj, (err, data) => {
                                if (err) {
                                    return reject(err);
                                }
                                else {
                                    console.log("module details updated");
                                    return resolve(data);
                                }
                            })
                            return resolve(result);
                        }

                    }

                    catch (error) {
                        console.log(error);
                        throw error;
                    }
                }
            })

        })
            .then(function (value) {
                res.send({
                    "code": 202,
                    "message": "project added sucessfully",
                    'data': value
                })
            })

            .catch(function (err) {
                res.send({
                    "code": 404,
                    "message": "error occured",
                    'error': err
                })
            });
    }
    catch (error) {
        console.log(error)
    }
}



exports.project_billing_method_details = async (req, res) => {
    try {
        var result = await connection.query(`SELECT id,billing_method FROM project_billing_method `)
        return res.status(HttpStatus.ACCEPTED).send({
            "code": HttpStatus.OK,
            "message": 'Billing Details ',
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



exports.project_status =async (req, res) => {
    try {
       var result =await connection.query(`SELECT id,project_status FROM project_status`)
        return res.status(HttpStatus.ACCEPTED).send({
            "code": HttpStatus.OK,
            "message": 'project status details',
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


exports.project_priority = async (req, res) => {
    try {
        var result = await connection.query(`SELECT id,project_priority FROM project_priority `)
        return res.status(HttpStatus.ACCEPTED).send({
            "code": HttpStatus.OK,
            "message": 'project priority details',
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


exports.update_project = (req, res) => {
    try {
        let date = new Date();

        var obj = {
            'project_billing_method_id': req.body.project_billing_method_id,
            'project_model': req.body.project_model ? req.body.project_model : 'Scrum',
            'project_code': req.body.project_code,
            'project_name': req.body.project_name,
            'project_description': req.body.project_description,
            'project_start_date': utils.date(req.body.project_start_date),
            'project_end_date': utils.date(req.body.project_end_date),
            'project_priority_id': req.body.project_priority_id,
            'project_status_id': req.body.project_status_id,
            'percentage_complete': req.body.percentage_complete,
            'project_client_id': req.body.project_client_id,
            'risk_description': req.body.risk_description,
            'total_budgets': req.body.total_budgets,
            'reporting_to': req.body.reporting_to,
            'project_document': req.body.project_document,
            'modified_date': date
        }

        connection.query(`UPDATE  project SET ? WHERE id ='${req.body.id}'`, obj, (err, result) => {
            console.log(err, "ritik")
            if (err) {
                res.send({
                    "code": 404,
                    "message": "error occured",
                    'error': err

                })
            }
            else {
                var str = req.body.employee_id;
                var temp = JSON.parse(str);

                if (temp.length > 0) {
                    for (let i = 0; i < temp.length; i++) {
                        let empObj = {

                            'employee_id': temp[i],
                            'modified_date': date
                        }
                        connection.query(`UPDATE project_team SET ? WHERE  project_id =`, [empObj, req.body.project_id], (err, results) => {
                            console.log(err, "bhatt")
                            if (err) {
                                res.send({
                                    "code": 202,
                                    "message": "error occured",
                                    'error': err

                                })
                            } else {
                                data = results
                                console.log("Record Added")
                            }

                        })
                    }
                    res.send({
                        "code": 200,
                        "message": "employee updated sucessfully",
                        "data": result
                    })
                }
                else {
                    res.send({
                        "code": 200,
                        'message': 'Project updated successfully.',
                        "data": result
                    })
                    //  connection.query(`SELECT `)
                }

            }

        })
    }
    catch (error) {
        console.log(error)
        throw error;
    }
}

exports.listProject = async (req, res) => {
    try {
        var query = `SELECT employee_id,project_name,empFirstName 
    FROM project,project_team,employee WHERE project.id= project_team.project_id 
    AND project_team.employee_id = employee.empID AND employee.empID=? `
        var result = await connection.query(query, [req.user.empID])

        return res.status(HttpStatus.ACCEPTED).send({
            "code": HttpStatus.OK,
            "message": 'All project lists Retreived Successfully .',
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

exports.project_clients = async (req, res) => {
    try {
        var today = new Date();
        const validation_result = validationResult(req);
        console.log(validation_result, "dasdasdsad")
        if (validation_result.isEmpty() === true) {
        let date = new Date();
        let obj = {
            'client_name': req.body.client_name,
            'client_email': req.body.client_email,
            'mobile_number': req.body.mobile_number,
            'landline_no': req.body.landline_no,
            'project_client_type_id': req.body.project_client_type_id,
            'client_location': req.body.client_location,
            'country_name': req.body.country_name,
            'start_date': utils.date(req.body.start_date),
            'end_date': utils.date(req.body.end_date),
            'client_url': req.body.client_url,
            'employee_designation_id': req.body.employee_designation_id,
            'created_date': date,
            'modified_date': date
        }

        var result =await connection.query(`INSERT INTO project_client SET ?`, obj)

        return res.status(HttpStatus.ACCEPTED).send({
            "code": HttpStatus.OK,  // given 400 in this CASE 
            "message": 'Client details inserted',
            'data': result
        })
    }
    else {
        res.json({
            "code": 400,
            "message": "incorrect format",
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



exports.get_client = async (req, res) => {
    try {
        var result = await connection.query(`SELECT client_name,id FROM project_client `)

        return res.status(HttpStatus.ACCEPTED).send({
            "code": HttpStatus.OK,  // given 400 in this CASE 
            "message": 'ALl Client details',
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

// for admin
exports.get_client_details = async (req, res) => {
    try {
        var result = await connection.query(`SELECT * FROM project_client`)
        return res.status(HttpStatus.ACCEPTED).send({
            "code": HttpStatus.OK,
            "message": 'Client details',
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

exports.getAssignedProject = async (req, res) => {
    try {
        var query = `
        SELECT project_name,project.id AS projectId ,project_start_date,project_end_date,project.created_date AS projectCreatedDate 
              FROM project,project_team,employee WHERE project_team.project_id= project.id 
             AND project_team.employee_id= employee.empID AND project_team.employee_id = ? `
        var result = await connection.query(query, req.user.empID)
        return res.status(HttpStatus.ACCEPTED).send({
            "code": HttpStatus.OK,
            "message": 'Assigned Projects',
            'data': result
        })
        // console.log(result)
    }
    catch (err) {
        if (err instanceof Errors.NotFound)
            return res.status(HttpStatus.NOT_FOUND).send({ message: err.message }); // 404
        console.log(err);
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ error: err, message: err.message }); // 500
    }

}






exports.getReportingManager = async (req, res) => {
    try {
        var result = await connection.query(`SELECT empFirstName,empID FROM employee WHERE is_admin = 1`)

        return res.status(HttpStatus.ACCEPTED).send({
            "code": HttpStatus.OK,
            "message": 'Reporting managers.',
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

exports.getTeamForProject = async (req, res) => {
    try {
        var result = await connection.query(`SELECT empFirstName,empID FROM employee WHERE is_admin = 0 AND status = 0`)
        return res.status(HttpStatus.ACCEPTED).send({
            "code": HttpStatus.OK,
            "message": 'Reporting managers.',
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



exports.getProjectDsr = async (req, res) => {


    try {
        var query = `SELECT comment,DATE(project_comment.created_date) 
        AS date ,used_second,task_name FROM project_comment,project_task 
        WHERE project_comment.project_id= project_task.project_id 
        AND project_comment.employee_id =? 
        AND project_task.id = project_comment.project_task_id
        AND project_comment.project_id =?`
        var data = await connection.query(query, [req.user.empID, req.body.project_id])
        let sum = 0
        for (let i = 0; i < data.length; i++) {
            sum += data[i].used_second

        }
        console.log(data.length, "sadsa")
        let obj = { "tasks": data, "totalHours": sum }
        return res.send({
            "code": HttpStatus.OK,
            "message": 'ALL Dsr Task retreived ',
            'data': obj
        })
    }
    catch (err) {
        if (err instanceof Errors.NotFound)
            return res.status(HttpStatus.NOT_FOUND).send({ message: err.message }); // 404
        console.log(err);
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ error: err, message: err.message }); // 500
    }
}








exports.getAllProjectDetails = async (req, res) => {
    try {
        var query = `SELECT 
 project.id
,project_code
,project_name
,billing_method
,project_status
,project_priority
,project_description
,project_start_date
,project_end_date
,project.percentage_complete
,risk_description
,total_budgets  
,reporting_to
,project_document
,project.created_date
FROM project,project_billing_method,project_priority,
project_status,project_team
WHERE 
project.id= project_team.project_id AND
project.project_status_id=project_status.id AND
project.project_priority_id=project_priority.id AND
project.project_billing_method_id=project_billing_method.id AND
project.id = ? AND
project_team.employee_id= ? `
        var result = await connection.query(query, [req.body.project_id, req.user.empID])
        return res.status(HttpStatus.ACCEPTED).send({
            "code": HttpStatus.OK,
            "message": 'project details retrieved successfully',
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



exports.getAllTaskDetails = async (req, res) => {
    try {
        var query = `SELECT
project_task.task_name
 ,project_task.task_description
 ,project_task.percentage_complete
 ,project_task.start_date
 ,project_task.end_date 
 ,project_task.task_document
 ,project_task.created_date
 ,task_status
 ,task_priority
 FROM project,project_task ,project_billing_method,project_priority,
 project_status,project_task_priority,project_task_status,project_team
 WHERE project.id=project_task.project_id AND 
 project_team.project_id=project.id AND
 project_team.project_id=project_task.project_id AND
 project_task.project_task_priority_id=project_task_priority.id AND
 project_task.project_task_status_id=project_task_status.id AND
 project.project_status_id=project_status.id AND
 project.project_priority_id=project_priority.id AND
 project.project_billing_method_id=project_billing_method.id AND
 project.id =? AND
 project_team.employee_id=?
`

        var result = await connection.query(query, [req.body.project_id, req.user.empID])
        return res.status(HttpStatus.ACCEPTED).send({
            "code": HttpStatus.OK,
            "message": 'All Task Details Retreived Successfully .',
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


