var connection = require("../config/config")
var utils = require('../utils/utitlity')

const Promise = require('bluebird');
const HttpStatus = require('http-status-codes');
const fs = Promise.promisifyAll(require('fs'))

const Errors = require('../errors');

exports.applyLeave = async (req, res) => {
    try {
        let date = new Date();
        let obj = {
            'employee_id': req.user.empID,
            'leave_type_id': req.body.leave_type_id,
            'approver_employee_id': req.body.approver_employee_id,
            'leave_reason': req.body.leave_reason,
            'contact_number': req.body.contact_number,
            'leave_to_date': req.body.leave_to_date ? utils.date(req.body.leave_to_date) ? utils.date(req.body.leave_to_date) : utils.date(date) : null,
            'leave_from_date': req.body.leave_from_date ? utils.date(req.body.leave_from_date) ? utils.date(req.body.leave_from_date) : utils.date(date) : null,
            'approval_status': req.body.approval_status ? req.body.approval_status : 'Applied',
            'approved_employee_id': req.body.approved_employee_id ? req.body.approved_employee_id : req.body.approver_employee_id,
            'leave_days': req.body.leave_days,
            'created_date': date,
            'modified_date': date
        }
        var query = `INSERT INTO apply_leave SET ?`
        var result = await connection.query(query, obj);
        return res.status(HttpStatus.ACCEPTED).send({
            "code": HttpStatus.OK,
            "message": 'leave details submitted success',
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



exports.getLeaveType = async (req, res) => {
    try {
        var query = `SELECT id,leave_type,one_time_allowed FROM leave_type`
        var result = await connection.query(query)

        return res.status(HttpStatus.ACCEPTED).send({
            "code": HttpStatus.OK,
            "message": 'leave type retreived success',
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

// year ,leavetype ,No of Day ,leavedate ,approver , approvestatus , reason , apply date , operation

// exports.



exports.appliedLeaveList = async (req, res) => {
    try {
        var query = `SELECT attendance_date,in_time,out_time,total_time,login_ip FROM employee_attendance WHERE employee_id=?`
        var result = await connection.query(query, [req.user.empID])

        return res.status(HttpStatus.ACCEPTED).send({
            "code": HttpStatus.OK,
            "message": 'leave type retreived success',
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