var express = require('express');
var router = express.Router();
var dsr = require("../controllers/dsr")
var middleware = require("../middleware/middleware")

router.post("/submitDsr", middleware.checkToken, dsr.submitDsr);
router.get("/getDsrList", middleware.checkToken, dsr.getDsrList);
router.post("/getDsrById", middleware.checkToken, dsr.getDsrById);
router.get("/getDsrByStatus", middleware.checkToken, dsr.getDsrByStatus);
router.get("/checkTodaysDsr", middleware.checkToken, dsr.checkTodaysDsr);
router.post("/getDsrDetails", middleware.checkToken, dsr.getDsrDetails);
router.get("/getProjectDsr", middleware.checkToken, dsr.getProjectDsr);
module.exports = router;