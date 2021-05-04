const express = require("express");
const {check, validationResult} = require("express-validator");
const bcrypt = require("bcryptjs");
var crypto = require('crypto');
const router = express.Router();
const { ObjectID } = require("mongodb");
const UsersDAO = require("../dataAccessLayer/UserDAO");
const { error } = require("console");

/**
 * @method - POST
 * @path - /register
 * @description - USER  Registration/ SIGNUP - Only User with MANAGER role can signUP from the singup page and If registration is successfull , This API will send an email verication link to the User mail ID , 
 * Once the User is  verified with in 12 hours, He can able to login to the application. MANAGER Can able to create the user with WORKER role by passing all the details along with IsMANAGER=false
 */
router.post("/register",
[
check("name", "Please enter a valid name").isString().isLength({min:6, max:24}),
check("email", "Please Enter a Valid Email").isEmail(),
check("password", "Please Enter a Valid Password").isLength({min:6}),
check("number","Please enter a valid mobile number").isMobilePhone().isLength({min:10, max:13})
],
async (req, res) => {
    const errors = validationResult(req);
    if(!error.isEmpty()){
        return res.status(400).json({errors:errors.array()});
    }
    try{

        const {name, email, password, number} = req.body;
        let user = await UsersDAO.findUserByMail(email);
        if(user){
            return res.status(400).json(
                {
                    msg:"User already exists"
                });
        }
        const salt = await bcrypt.genSalt(10);
        let hashedpassword = await bcrypt.hash(password, salt);
        let userObject = {
            name: name,
            email:email,
            password:hashedpassword,
            number:number
        }
        let newCreatedUser = await UsersDAO.createNewUser(userObject);
    }catch(err){
            console.log(err.message);
            res.status(500).send("Error While Saving New User")

    }
}
);

/**
 * @method - POST
 * @param - /login
 * @description - User Login Functionality 
 */
 router.post("/login", [
    check("email", "Please enter a valid email").isEmail(),
    check("password", "Please enter a valid password").isLength({
      min: 6
    })
  ],
    async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          errors: errors.array()
        });
      }
  
      const { email, password } = req.body;
      try {
        let user = await UsersDAO.findUserByMail(email);
       
        if (!user) {
          return res.status(401).send({ message: "User Not Exist" });
        }
  
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
          return res.status(401).send({ message: "Incorrect Password !" });
        }
    } catch(err){
        console.error(err);
      res.status(500).json({ message: "Server Error" });
    } 
} );
module.exports = router;