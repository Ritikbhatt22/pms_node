var connection = require("../config/config");

exports.AllCounts = async function (req, res) {
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

exports.employee_attendance = async (req, res) => {
    try {
        var query = (`SELECT in_time,out_time, total_time,attendance_date 
    FROM employee_attendance WHERE employee_attendance.employee_id =? 
    AND  MONTH(attendance_date) = MONTH(CURRENT_DATE())
     AND YEAR(attendance_date) = YEAR(CURRENT_DATE())`)
        var result = await connection.query(query, [req.user.empID])

        function diff_hours(dt2, dt1) {
            var diff = (dt2.getTime() - dt1.getTime()) / 1000;
            diff /= (60);
            return Math.abs(diff);
        }
        dt1 = new Date(result[0].in_time + 'AM');
        console.log(dt1, "dt1")
        dt2 = new Date(result[0].out_time);
        var total_time = diff_hours(dt1, dt2)
        let totalMonthTime = 0;
        for (let i = 0; i < result.length; i++) {
            totalMonthTime = total_time + totalMonthTime;
        }
        averageMonthTime = totalMonthTime / result.length;
        console.log(totalMonthTime, "ritik")
        let obj = { "yesterday_attendance": total_time, "monthly_average": averageMonthTime }
        return res.status(HttpStatus.ACCEPTED).send({
            "code": HttpStatus.OK,
            "message": "list of all holidays",
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




exports.HolidaysList = async function (req, res) {
    try {
        let array = [];
        var query = (`SELECT holiday_name,holiday_start_date,no_of_day,is_optional_leave FROM holiday`)
        var result = await connection.query(query)

        for (let i = 0; i < result.length; i++) {
            if (result[i].is_optional_leave == 0) {
                array.push(result[i])

            }
        }
        var query = `SELECT COUNT(leave_days) as Applied,leave_type,yearly_allowed as Allowed 
            FROM apply_leave,leave_type WHERE apply_leave.leave_type_id=leave_type.id 
            AND apply_leave.employee_id=?`
        var results = await connection.query(query, [req.user.empID])

        let data = { "holiday": result, "optional_leave": array, "Allowed leave": results }

        return res.status(HttpStatus.ACCEPTED).send({
            "code": HttpStatus.OK,
            "message": "list of all holidays",
            'data': data
        })

    }
    catch (err) {
        if (err instanceof Errors.NotFound)
            return res.status(HttpStatus.NOT_FOUND).send({ message: err.message }); // 404
        console.log(err);
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ error: err, message: err.message }); // 500
    }
}


exports.upcomingBirthDay = async (req, res) => {
    try {
        var query = `SELECT empFirstName,dob FROM employee 
    WHERE (MONTH(dob) >= MONTH(CURRENT_DATE()) AND DAY(dob)>= DAY(CURRENT_DATE()) AND YEAR(dob) = YEAR(CURRENT_DATE()))
    OR (MONTH(dob) <= MONTH(CURRENT_DATE()) AND DAY(dob) <= DAY(CURRENT_DATE()) AND YEAR(dob) > YEAR(CURRENT_DATE()) )
    LIMIT 4
    `
        var result = await connection.query(query)
        return res.status(HttpStatus.ACCEPTED).send({
            "code": HttpStatus.OK,
            "message": "Upcoming Birthday List",
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


// exports.insert=(req,res)=>{
//   let date =new Date();
//     let obj= {
//     "holiday_name":req.body.holiday_name,
//     "holiday_start_date":req.body.holiday_start_date,
//     "no_of_day":req.body.no_of_day,
//     "is_optional_leave":req.body.is_optional_leave,
//     "created_date":date


//   }
//   connection.query('INSERT INTO holiday SET ?',obj,(err,result)=>{
//           console.log(err,"ritik") 
//     if (err) {
//         res.send({
//             "code": 202,
//             "message": "error occured"

//         })
//     }
//     else {
//         res.send({
//             "code": 200,
//             "message": "list of all holidays",
//             "data": result
//         })
//     }

//   })

// }