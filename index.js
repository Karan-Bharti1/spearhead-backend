const {nitialiseDatabase, initialiseDatabase}=require("./database/database.connection")
const cors=require("cors")
const Lead=require("./models/Lead")
const Comment=require("./models/Comment")
const Sales=require("./database/database.connection")
const Tag=require("./database/database.connection")
const PORT=3000
const express=require('express')
const app=express()
app.use(express.json())
const corsOptions={
    origin:"*",
    credentials:true,
    optionsSuccessStatus:200
}
app.use(cors(corsOptions))
initialiseDatabase()
app.listen(PORT,()=>{
    console.log("Server is running on PORT: ",PORT)
})