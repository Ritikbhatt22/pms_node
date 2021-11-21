var express = require('express');
var router = express.Router();
var Dashboard = require("../controllers/dashboard")
var middleware = require("../middleware/middleware")

router.get("/AllCounts", middleware.checkToken,Dashboard.AllCounts)
router.get("/HolidaysList", middleware.checkToken,Dashboard.HolidaysList)
router.get("/employeeAttendance", middleware.checkToken,Dashboard.employee_attendance)
router.get("/upcomingBirthday", middleware.checkToken,Dashboard.upcomingBirthDay)
// router.post("/insert", middleware.checkToken,Dashboard.insert)
module.exports = router;

