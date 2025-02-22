const {initialiseDatabase}=require("./database/database.connection")
const cors=require("cors")
const Lead=require("./models/Lead")
const Comment=require("./models/Comment")
const Sales=require("./models/Sales")
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
const createNewAgent=async (data) => {
   try {
    const {name,email}=data
    // Name Validation
    if(!name|| typeof name !== 'string' ){
        throw new Error("Invalid input: 'name' is required and must be a string.")
    }
    const agent=new Sales(data)
    const save=await agent.save()
    return save
   } catch (error) {
    throw error
   } 
}
app.post("/salesagent",async (req,res) => {
    try {
    const {name,email}=req.body
    if(!email || typeof email !== 'string' || !email.includes('@')|| !email.includes('.')|| email.indexOf('@')>= email.indexOf("."))
        {
        res.status(400).json({ "error": `Invalid input: ${email} must be a valid email address.`
        })}
    const existingAgent=await Sales.findOne({email})
    if (existingAgent) {
        res.status(409).json({ "error": `Sales agent with email ${email} already exists.`
        })
    }
    if(!existingAgent)
    {const agent=await createNewAgent(req.body)
        if(agent) {res.status(200).json(agent)}
    }
    
       
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
})
app.listen(PORT,()=>{
    console.log("Server is running on PORT: ",PORT)
})