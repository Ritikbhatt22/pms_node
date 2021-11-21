var connection = require("../config/config")
var utils = require('../utils/utitlity')


const Promise = require('bluebird');
const HttpStatus = require('http-status-codes');
const fs = Promise.promisifyAll(require('fs'))

const Errors = require('../errors');


// Project,Task,DSR,Used Hr,TaskStatus

exports.getDsrById = async (req, res) => {
    try {
        var query = `SELECT project_name,task_name,task_status,project.id AS projectID ,comment, project_task.id 
    AS projectTaskID FROM project,project_task,project_task_status,project_team,project_comment  
    WHERE  project_task.project_id= project.id  
    AND project_team.project_id = project.id 
    AND project_team.project_id= project_task.project_id 
    AND project_team.employee_id = ? 
    AND project_task_status.id =project_task.project_task_status_id 
    AND project_comment.project_id=project_task.project_id 
    AND  project_team.employee_id=project_comment.employee_id 
    AND project_task.project_id= ? `
        var result = await connection.query(query, [req.user.empID, req.body.projectID])
        return res.status(HttpStatus.ACCEPTED).send({
            "code": HttpStatus.OK,
            "message": 'dsr details by status.',
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

// employee_id,project_name there details 
exports.getDsrList = async (req, res) => {
    try {
        var query = `SELECT dsr_date,created_date,modified_date FROM project_dsr WHERE employee_id = ?`
        var result = await connection.query(query, [req.user.empID])

        return res.status(HttpStatus.ACCEPTED).send({
            "code": HttpStatus.OK,
            "message": 'DSR retrived success',
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




//DSR Date,Submitted Date,	Modified Date

// get dsr by status completed vale jo h

exports.getDsrByStatus = async (req, res) => {
    try {
        var query = `SELECT project_name,task_name,project.id AS projectID , project_task.id AS projectTaskID,
     project_task_status_id,task_status FROM project,project_task,project_task_status,project_team  
     WHERE  project_task.project_id= project.id  
     AND project_team.project_id = project.id 
     AND project_team.project_id= project_task.project_id 
     AND project_team.employee_id = ? 
     AND project_task_status.id =project_task.project_task_status_id 
     AND project_task_status.id<=3 `
        var result = await connection.query(query, [req.user.empID])

        return res.status(HttpStatus.ACCEPTED).send({
            "code": HttpStatus.OK,
            "message": 'dsr details by status.',
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





exports.checkTodaysDsr = async (req, res) => {
    try {
        var query = `select comment FROM project_comment WHERE DATE(created_date)=CURDATE()`;
        var result = await connection.query(query);

        return res.status(HttpStatus.ACCEPTED).send({
            "code": HttpStatus.OK,
            "message": 'Todays dsr status retrieved sucessfully ',
            'data': result.length > 0 ? true : false
        })
    }
    catch (err) {
        if (err instanceof Errors.NotFound)
            return res.status(HttpStatus.NOT_FOUND).send({ message: err.message }); // 404
        console.log(err);
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ error: err, message: err.message }); // 500
    }

}
// Project	Task	DSR	Used Hr	Task Status




exports.getDsrDetails = async (req, res) => {
    try {
        var query = `SELECT project_name,task_name,comment,used_second,task_status
 FROM project,project_task,project_task_status,project_comment 
 WHERE  project_task.project_id= project.id
 AND project_comment.project_id = project.id 
 AND project_task.id =project_comment.project_task_id
 AND project_comment.project_id= project_task.project_id 
 AND project_comment.employee_id = ?' 
 AND project_task_status.id =project_task.project_task_status_id
 AND DATE(project_comment.created_date)=DATE("${utils.date(req.body.date)}") ;`

        var result = await connection.query(query, [req.user.empID])

        return res.status(HttpStatus.ACCEPTED).send({
            "code": HttpStatus.OK,
            "message": 'dsr details retrieved sucessfully ',
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








exports.submitDsr = async (req, res) => {
    try {
        var date = new Date();
        //  console.log(utils.date(date),"riitkenwfjnwejnfew",date,"dbkwebdkbwekbdkwebdkuwe",utils.date())
        var dsr1 = {
            'employee_id': req.user.empID,
            'dsr_date': utils.date(date),
            'is_submit': req.body.is_submit ? req.body.is_submit : 1,
            'created_date': date,
            'modified_date': date
        }
        console.log("hello")
        var query1 = `INSERT  INTO  project_dsr SET ?`

        var dsr = await connection.query(query1, dsr1);

        try {
            // req.body.dsrArr
            // console.log(typeof (req.body), "ritikbhayy", req.body.dsrArr)
            console.log(req.body.dsrArr.length, "dqwdwqdqwd", req.body.dsrArr[0].project_id)
            for (let i = 0; i < req.body.dsrArr.length; i++) {


                var obj = {
                    'project_id': req.body.dsrArr[i].project_id,
                    'project_task_id': req.body.dsrArr[i].project_task_id,
                    'employee_id': req.user.empID,
                    'project_dsr_id': dsr.insertId,
                    'comment': req.body.dsrArr[i].comment,
                    'created_date': date,
                    'modified_date': date,
                    'used_second': req.body.dsrArr[i].task_hours,
                    'is_active': req.body.dsrArr[i].is_active ? req.body.dsrArr[i].is_active : 1

                }
                var query = `INSERT  INTO project_comment SET ?`
                var results = await connection.query(query, obj)




                try {
                    var obj = {
                        'project_task_status_id': req.body.dsrArr[i].project_task_status_id
                    }
                    var query = `UPDATE project_task SET ? WHERE project_task.id= '${req.body.dsrArr[i].project_task_id}' `
                    var result = await connection.query(query, obj);
                    console.log("Record Saved ANd dsr submitted", result);
                    return res.send({
                        'code': 200,
                        "message": 'DSR has been submitted successfully.',
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

        }
        catch (err) {
            if (err instanceof Errors.NotFound)
                return res.status(HttpStatus.NOT_FOUND).send({ message: err.message }); // 404
            console.log(err);
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ error: err, message: err.message }); // 500
        }

    }
    // res.send({
    //     'code': 200,
    //     "message": 'DSR has been submitted successfully.',
    //     'data': dsr
    // })

    catch (err) {
        if (err instanceof Errors.NotFound)
            return res.status(HttpStatus.NOT_FOUND).send({ message: err.message }); // 404
        console.log(err);
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ error: err, message: err.message }); // 500
    }
}
