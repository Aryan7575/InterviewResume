const userModel = require("../models/user.model")
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
const BlacklistTokensModel = require("../models/blacklist.model");
/**
 * @name registerUserController
 * @description Controller to register a new user expecting username, email and password in the request body    
 * @access Public
 */

async function registerUserController(req,res){
    const{username ,email, password} = req.body;

    if(!username||!email||!password){
        return res.status(400).json({message:"please provide username, email and password"})
    }

    const userAlreadyRegister = await userModel.findOne({
        $or:[
            {username},
            {email}
        ]
    })

    if(userAlreadyRegister){
        return res.status(400).json({
            message:"User already registered"
        })
    }

    const hash = await bcrypt.hash(password, 10)

    const user = await userModel.create({
        username,
        email,
        password:hash
    })

    const token = jwt.sign({
        id:user._id,
        username:user.username
    }, process.env.JWT_SECRETS,{expiresIn:"1d"}  )

    res.cookie('token', token)

    res.status(201).json({
        message:"User Created Successfully",
        user:{
            id:user._id,
            username:user.username,
            email:user.email,
        }
    })
}

/**
 * @name loginUserController
 * @description Controller to login a user expecting email and password in the request body    
 * @access Public
 */

async function loginUserController(req,res){
    const {email, password} = req.body;

    const user = await userModel.findOne({email})

    if(!user){
        return res.status(401).json({
            message:"Invalid email & password"
        })
    }

    const isPassValid = await bcrypt.compare(password, user.password)

    if(!isPassValid){
        return res.status(401).json({
            message:"Password is incorrect"
        })
    }

    const token = jwt.sign({
        id:user._id,
        username:user.username
    }, process.env.JWT_SECRETS,{expiresIn:"1d"}  )

    res.cookie('token', token)

    res.status(201).json({
        message:"User logged in Successfully",
        user:{
            id:user._id,
            username:user.username,
            email:user.email,
        }
    })
}

/**
 * @name logOutUserController
 * @description Controller to logout a user by clearing the cookie and blacklisting the token       
 * @access Public
 */

async function logOutUserController(req,res){
    const token = req.cookies.token

    if(token){
        await BlacklistTokensModel.create({token})
    }

    res.clearCookie('token')

    res.status(201).json({
        message:"User Logged out successfully"
    })

}

/**
 * @name getMeController,
 * @description Controller to get the details of the currently logged-in user
 * @access Private
 */
async function getMeController(req,res){
    const user = await userModel.findById(req.user.id)

    res.status(200).json({
        message:"User details retrieved successfully",
        user:{
            id:user._id,
            username:user.username,
            email:user.email,
        }
    })
}

module.exports = {registerUserController, loginUserController, logOutUserController, getMeController}