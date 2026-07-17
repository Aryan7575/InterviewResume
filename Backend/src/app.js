const express = require("express")
const authRouter = require('./routes/auth.route')
const InterviewRouter = require('./routes/interview.route')
const cookieParser = require('cookie-parser')
const cors = require("cors")
const app = express()

app.use(express.json())
app.use(cookieParser())
app.use(cors({
    origin: [
        "http://localhost:5173",
        "https://interview-resume-five.vercel.app"
    ],
    credentials: true
}));

app.use('/api/auth',authRouter)
app.use('/api/interview',InterviewRouter)

module.exports = app