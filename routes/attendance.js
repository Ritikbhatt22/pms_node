
var express = require('express');
var router = express.Router();
var controller = require("../controllers/attendance")
var middleware = require("../middleware/middleware")


router.post('/attendanceUser',middleware.checkToken, controller.attendanceUser);

router.get('/checkTodaysAttendance',middleware.checkToken, controller.checkTodaysAttendance);

router.get('/attendanceDetails',middleware.checkToken, controller.attendanceDetails);
module.exports=router;