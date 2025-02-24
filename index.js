const {initialiseDatabase}=require("./database/database.connection")
const cors=require("cors")
const Lead=require("./models/Lead")
const Comment=require("./models/Comment")
const Sales=require("./models/Sales")
const Tag=require("./models/Tag")
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
        throw new Error(`Invalid input: ${name} is required and must be a string.`)
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
       return res.status(400).json({ "error": `Invalid input: ${email} must be a valid email address.`
        })}
    const existingAgent=await Sales.findOne({email})
    if (existingAgent) {
       return res.status(409).json({ "error": `Sales agent with email ${email} already exists.`
        })
    }
    
    const agent=await createNewAgent(req.body)
        if(agent) {return res.status(200).json(agent)}
    
    
       
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
})
app.get("/salesAgent",async(req,res)=>{
    try {
        const data=await Sales.find()
        if(data && data.length>0){
            res.status(200).json(data)
        }else{
            res.status(404).json({"error":"Sales Agent's data not found."})
        }
    } catch (error) {
        res.status(500).json({"error":"Failed to get sales agent's data"})
    }
})
const createLead=async (data) => {
    try {
        const lead=await Lead(data)
        return lead.save()
    } catch (error) {
        throw error
    }
}
app.post("/leads",async (req,res) => {
    const {name,source,salesAgent}=req.body
    try {
       if(!name || typeof name !== "string"){
        return res.status(400).json({ "error": `Invalid input: name is required.`
        })
       } 
       if(!source || typeof source !== "string"){
        return res.status(400).json({ "error": `Invalid input: source is required.`
        })
       } 
       const existingAgent=await Sales.findById(salesAgent)
       if(existingAgent){
        const lead=await createLead(req.body)
        return res.status(200).json(lead)
       }
       if(!existingAgent){
return res.status(404).json({"error": `Sales agent with ID ${salesAgent} not found.`})
       }
    } catch (error) {
console.log(error)
        res.status(500).json({"error":"Failed to post lead"})
    }
})
app.get("/leads",async (req,res) => {
    try {
        const { salesAgent, status, tags, source } = req.query;
        const data=await Lead.find().populate("salesAgent")
        if(data && data.length>0){
            res.status(200).json(data)
        }else{
            res.status(404).json({"error":"Leads data not found."})
        } 
        if (status && !allowedStatuses.includes(status)) {
            return res.status(400).json({ 
              "error": `Invalid input: 'status' must be one of ${JSON.stringify(allowedStatuses)}.` 
            });
          }
    } catch (error) {
        res.status(500).json({"error":"Failed to get Leads data"})
    }
})
const updateData=async(id, data)=>{
try {
 const lead=await Lead.findByIdAndUpdate(id,data,{new:true})   
 return lead
} catch (error) {
    throw error
}
}
app.put("/leads/:id",async (req,res) => {
    try {
        const data=await updateData(req.params.id,req.body)
        if(data ){
            res.status(200).json(data)
        }else{
            res.status(404).json({"error": `Lead with ID ${req.params.id} not found.`})
        }
    } catch (error) {
        res.status(500).json({"error":"Failed to update lead data"})
    }
})
app.delete("/leads/:id",async(req,res)=>{
    try {
        const deletedData=await Lead.findByIdAndDelete(req.params.id)
        if(deletedData){
res.status(200).json({
    "message": "Lead deleted successfully."
})
        }else{
            res.status(404).json({"error":`Lead with ${req.params.id} not found.`})
        }
    } catch (error) {
        res.status(500).json({"error":"Failed to update lead data"})
    }
})
app.get("/report/pipeline",async(req,res)=>{
    const leadsData=await Lead.find()
    try {
        if(leadsData && leadsData.length>0){
            res.status(200).json({"totalLeadsInPipeline":leadsData.length})
        }else{
            res.status(404).json({"error":"leads data not found"})
        }
    } catch (error) {
        res.status(500).json({"error":"Failed to fetch total  number of leads"})
    }
})
const createComment=async (data) => {
  try {
   const comment=new Comment(data)
   return await  comment.save() 
  } catch (error) {
    throw error
  }  
}
app.post("/leads/:id/comments",async(req,res)=>{
    const {id}=req.params
    const {commentText}=req.body
    try {
        const lead =await Lead.findById(id)
        if(!lead){
          return res.status(404).json({ "error": `Lead with ID '${id}' not found.` });
        }
        console.log(lead)
        const existingAuthor=await Sales.findById(lead.salesAgent)
        
        if(!existingAuthor ){
           return res.status(400).json({"error":"Please add a valid author Id"})
        }
        if (!commentText || typeof commentText !== 'string') {
            return res.status(400).json({ "error": 'Invalid input: commentText is required and must be a string.' });
          }
         
          const savedComment=await createComment({commentText,author:existingAuthor,"lead":id})
          return res.status(200).json(savedComment)
    } catch (error) {
       console.log(error)
        return res.status(500).json({ error: 'Failed to add comment to lead.' });
    }
})
app.get("/leads/:id/comments",async(req,res)=>{
    const {id}=req.params
    const comments=await Comment.find({"lead":id}).populate("lead").populate("author")
    try {
        if(comments){
            res.status(200).json(comments)
        }else{
            res.status(404).json({"error":"Comments not found."})
        }
    } catch (error) {
        res.status(500).json({"error":"Failed to fetch comments"})
    }
})
app.get("/report/last-week",async(req,res)=>{
    try {
        
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch closed leads." });
    }
})
app.post("/tag",async(req,res)=>{
    try {
   const tag=new Tag(req.body)     
   const saved=await tag.save()
   if(saved){
    res.json(saved)
   }
    } catch (error) {
        res.status(500).json({error:"fail to add tag"})
    }
})
app.listen(PORT,()=>{
    console.log("Server is running on PORT: ",PORT)
})