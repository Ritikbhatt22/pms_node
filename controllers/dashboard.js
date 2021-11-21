var connection = require("../config/config")

var CodeGenerator = require('node-code-generator');
let utils = require('../utils/utitlity')

const Promise = require('bluebird');
const HttpStatus = require('http-status-codes');
const fs = Promise.promisifyAll(require('fs'))

const Errors = require('../errors');

exports.AllCounts = async (req, res) => {
    try {
        var query = `SELECT
  (SELECT COUNT(*) FROM employee WHERE status = 0) as totalEmployee, 
  (SELECT COUNT(*) FROM project_team WHERE project_team.employee_id = ?) as totalProjects,
  (SELECT COUNT(*) FROM project_dsr WHERE project_dsr.employee_id = ?) as totalDsr,
  (SELECT COUNT(*) FROM project_task WHERE project_task.project_id = 1) as totalTask`;
        // var query = 'SELECT count(*) as allEmployees,count(*) as totalProjects FROM  employee,project  WHERE '
        var result = await connection.query(query, [req.user.empID, req.user.empID])

        return res.status(HttpStatus.ACCEPTED).send({
            "code": HttpStatus.OK,
            "message": "All counts For Dsr",
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



let total = 0;
exports.employee_attendance = async (req, res) => {
    try {
        var date = new Date()
        var query = (`SELECT  total_time,attendance_date FROM employee_attendance WHERE employee_attendance.employee_id =?   
    AND MONTH(attendance_date) =  MONTH(CURRENT_DATE()) 
    AND  YEAR(attendance_date) = YEAR(CURRENT_DATE())`)

        var result = await connection.query(query, [req.user.empID])
        var array = [];
        for (var i = 0; i < result.length; i++) {
            array.push(result[i].total_time)
        }
        var hour = 0;
        var minute = 0;
        var second = 0;
        for (let j = 0; j < array.length; j++) {
            splitTime1 = array[j].split(':');
            hour += parseInt(splitTime1[0])
            minute += parseInt(splitTime1[1])
            hour = hour + parseInt(minute / 60);
            minute = minute % 60;
        }
        var sanjeev = hour + ':' + minute + ':' + 00
        var averageMonthTime = hour / result.length;
        let obj = { "yesterday_attendance": sanjeev, "monthly_average": averageMonthTime }
        return res.status(HttpStatus.ACCEPTED).send({
            "code": HttpStatus.OK,
            "message": "list of all holidays",
            "data": obj
        })

    }
    catch (err) {
        if (err instanceof Errors.NotFound)
            return res.status(HttpStatus.NOT_FOUND).send({ message: err.message }); // 404
        console.log(err);
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ error: err, message: err.message }); // 500
    }
}




exports.HolidaysList = async function (req, res) {
    try {
        let array = [];
        var query = (`SELECT holiday_name,holiday_start_date,no_of_day,is_optional_leave 
    FROM holiday 
    ORDER BY DATE(holiday_start_date) ASC`)
        var result = await connection.query(query)


        for (let i = 0; i < result.length; i++) {
            if (result[i].is_optional_leave == 0) {
                array.push(result[i])
            }
        }

        var query1 = ` SELECT  leave_type,
Sum(leave_days) as 'no_of_days'
FROM apply_leave as A ,leave_type as L  
WHERE A.leave_type_id = L.id AND A.employee_id = 17  AND YEAR(A.created_date) = YEAR(CURRENT_DATE())
group by L.id `

        var results = await connection.query(query1)
        let data = { "holiday": result, "optional_leave": array, "Allowed leave": results }

        return res.status(HttpStatus.ACCEPTED).send({
            "code": HttpStatus.OK,
            "message": "list of all holidays",
            "data": data
        })
    }
    catch (err) {
        if (err instanceof Errors.NotFound)
            return res.status(HttpStatus.NOT_FOUND).send({ message: err.message }); // 404
        console.log(err);
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ error: err, message: err.message }); // 500
    }
}

exports.upcomingBirthDay =async  (req, res)=> {
    try {
        var query = `
    select * from (
        select empID,empFirstName,dob,gender,  datediff(DATE_FORMAT(dob,concat('%',YEAR(CURDATE()),'-%m-%d')),NOW()) as no_of_days from employee
    union
        select empID,empFirstName,dob,gender, 
        datediff(DATE_FORMAT(dob,concat('%',(YEAR(CURDATE())+1),'-%m-%d')),NOW()) as no_of_days from employee) AS upcomingbirthday
    WHERE no_of_days>0 
    GROUP BY empID 
    ORDER BY no_of_days asc
    LIMIT 4`
        var result = connection.query(query)


        return res.status(HttpStatus.ACCEPTED).send({
            "code": HttpStatus.OK,
            "message": "Upcoming Birthday List",
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







