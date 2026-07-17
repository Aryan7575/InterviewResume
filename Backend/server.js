require("dotenv").config()
const app = require('../Backend/src/app')
const connectDb = require('../Backend/src/config/db')

connectDb()

app.listen(3000,()=>{
    console.log("server is connected to port 3000");
})