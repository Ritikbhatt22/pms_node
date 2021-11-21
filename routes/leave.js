var express = require('express');
var router = express.Router();
var leave = require("../controllers/leave")
var middleware = require("../middleware/middleware")


router.post("/applyLeave", middleware.checkToken, leave.applyLeave);
router.get("/getLeaveType", middleware.checkToken, leave.getLeaveType);
router.get("/appliedLeaveList",middleware.checkToken,leave.appliedLeaveList);

module.exports = router;