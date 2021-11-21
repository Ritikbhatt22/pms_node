const {body, validationResult} = require('express-validator/check');



exports.add =[
      
        body('empemail','Invalid Email Address').matches('^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$').isEmail(),
      
        body('password',"Invalid Password").matches(`^(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{6,50}$`),

        body('empFirstName',"Invalid First Name").matches('^[a-zA-Z][a-zA-Z\s]*$'),

        body('empLastName','Invalid Last Name').matches('^[a-zA-Z][a-zA-Z\s]*$'),

        body('gender',"Invalid gender").matches('^male$|^female$'),

        body('mobile_no',"invalid Format").matches('^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$'),



      ]



exports.projectClientValid=[

    body('client_email',"Invalid email Address").matches('^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$').isEmail(),
 
    body('client_name','Invalid Client Name').matches('^[a-zA-Z ]+$')

]


exports.loginValid=[
    body('password',"Invalid Password").matches('(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{6,20}$')
]