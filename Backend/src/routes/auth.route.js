const {Router } = require('express')
const authController = require('../controllers/auth.controller')
const authMiddleware = require('../middlewares/auth.middleware')
const authRouter = Router()

/**
 * @route Post /api/auth/register
 * @description Register a new user
 * @access Public
 */
authRouter.post('/register',authController.registerUserController)

/**
 * @route Post /api/auth/login  
 * @description Login a user with email and password
 * @access Public
 */

authRouter.post('/login',authController.loginUserController)

/**
 * @route Get /api/auth/logout
 * @description Logout a user by clearing the cookie
 * @access Public
 */

authRouter.get('/logout',authController.logOutUserController)

/**
 * @route Get /api/auth/get-me
 * @description Get the details of the currently logged-in user
 * @access Private
 */

authRouter.get('/get-me',authMiddleware.authUser, authController.getMeController)

module.exports = authRouter