var express = require('express');
var router = express.Router();
var userController = require("../controllers/user")
var middleware = require("../middleware/middleware")

/* GET users listing. */


router.get("/singleUserList", middleware.checkToken, userController.singleUserlist)
router.get("/allUserList", middleware.checkToken, userController.allUsersList)
router.post("/update", middleware.checkToken, userController.update)
router.get("/getEmployeeDetails", middleware.checkToken, userController.getEmployeeDetails)
router.get('/singleEmployeeDetails',middleware.checkToken,userController.getSingleEmployeeDetails)
module.exports = router;

