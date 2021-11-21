var connection = require("../config/config");
let utils = require('../utils/utitlity')

exports.add_project_task = async (req, res) => {
    try {
        let date = new Date();

        let obj = {
            'project_id': req.body.project_id ? req.body.project_id : 0,
            'task_name': req.body.task_name ? req.body.task_name : '',
            'task_description': req.body.task_description,
            'module_id': req.body.module_id,
            'project_task_priority_id': req.body.project_task_priority_id,
            'project_task_status_id': req.body.project_task_status_id,
            'percentage_complete': req.body.percentage_complete,
            'start_date': utils.date(req.body.start_date),
            'end_date': utils.date(req.body.end_date),
            'estimated_time_second': req.body.estimated_time_second,
            'actual_time_second': req.body.actual_time_second ? req.body.actual_time_second : req.body.estimated_time_second,
            'task_document': req.body.task_document,
            'created_date': date,
            'modified_date': date,
            'dsr_update_date': date,
            'is_active': req.body.is_active ? req.body.is_active : 1
        }


        var result = await connection.query('INSERT INTO project_task SET ?', obj)
        return res.status(HttpStatus.ACCEPTED).send({
            "code": HttpStatus.OK,
            "message": "task added sucessfully",
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






exports.getEmployeeProjects = async (req, res) => {
    try {
        var query = `SELECT project.id,project.project_name FROM project_team,project WHERE project_team.employee_id = ? AND project_team.project_id = project.id`
        var result = await connection.query(query, [req.user.empID])
        return res.status(HttpStatus.ACCEPTED).send({
            "code": HttpStatus.OK,
            "message": 'All Employee Projects retrieved.',
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




exports.getProjectTaskPriority = async (req, res) => {
    try {
        var query = `SELECT id,task_priority FROM project_task_priority `
        var result = await connection.query(query)
        return res.status(HttpStatus.ACCEPTED).send({
            "code": HttpStatus.OK,
            "message": 'Project Task With Associated Employee',
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


exports.getProjectTaskStatus = async (req, res) => {
    try {
        var query = `SELECT id,task_status FROM project_task_status`
        var result = await connection.query(query)
        return res.status(HttpStatus.ACCEPTED).send({
            "code": HttpStatus.OK,
            "message": 'project taskStatus',
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


exports.getProjectModule = async (req, res) => {
    try {
        var query = `SELECT id,project_module FROM project_module`
        var result = await connection.query(query)
        return res.status(HttpStatus.ACCEPTED).send({
            "code": HttpStatus.OK,
            "message": 'projectModule ',
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


//project , task,task description,prority, date, document ,status,created , operation.
exports.getAllTaskList = async (req, res) => {
    try {
        let query = `SELECT project_name,project_task.id AS taskId,task_name,task_description,task_status,task_priority,start_date,end_date,task_document,DATE(project_task.created_date) AS date FROM project,project_task,project_task_status,project_task_priority,project_team  WHERE  project_task.project_id= project.id  AND project_team.project_id = project.id AND project_team.employee_id = ? AND project_task_priority.id = project_task.project_task_priority_id AND project_task_status.id =project_task.project_task_status_id `

        var result = await connection.query(query, [req.user.empID])

        return res.status(HttpStatus.ACCEPTED).send({
            "code": HttpStatus.OK,
            "message": 'All Tasks Retreived sucessfully.',
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




exports.allPendingTasks = async (req, res) => {
    try {
        var query = `SELECT project_name,task_name,task_description,task_status,task_priority,start_date,end_date,task_document,DATE(project_task.created_date) AS date FROM project,project_task,project_task_status,project_task_priority,project_team  WHERE  project_task.project_id= project.id  AND project_team.project_id = project.id AND project_team.employee_id = ? AND project_task_priority.id = project_task.project_task_priority_id AND project_task_status.id =project_task.project_task_status_id AND project_task_status.id<=3`
        var result = await connection.query(query, [req.user.empID])

        return res.status(HttpStatus.ACCEPTED).send({
            "code": HttpStatus.OK,
            "message": 'All Tasks Retreived sucessfully.',
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
// dsr details // dsr name,dsr date, time
exports.allTaskDsr = async (req, res) => {
    try {
        var query = `SELECT comment,DATE(project_comment.created_date) AS date ,used_second 
    FROM project_comment,project_task 
    WHERE project_comment.project_task_id= project_task.id
    AND project_comment.employee_id =? 
    AND project_comment.project_task_id =?`

        var result = await connection.query(query, [req.user.empID, req.body.taskId])
        let sum = 0
        for (let i = 0; i < result.length; i++) {
            sum += result[i].used_second

        }
        console.log(result.length, "booom boom roboya")
        let obj = { "tasks": result, "totalHours": sum }
        return res.status(HttpStatus.ACCEPTED).send({
            "code": HttpStatus.OK,
            "message": 'All Tasks Retreived sucessfully.',
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