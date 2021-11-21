var express = require('express');
var router = express.Router();
var controller = require("../controllers/auth")
var middleware = require("../middleware/middleware")
var validation = require("../config/config2")

/* GET users listing. */
// const {body, validationResult} = require('express-validator/check');
router.post('/login',validation.loginValid, controller.login)
router.post('/addUser', middleware.checkToken ,validation.add, controller.addUser)
router.post('/addExperience', middleware.checkToken, controller.addExperience)

// router.get("/",)
module.exports = router;
