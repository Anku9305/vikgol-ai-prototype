const express = require("express")
const cors = require("cors")

const app = express()

app.use(cors())
app.use(express.json())

// serve static files
app.use(express.static(__dirname))

// telegram config
const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN
const CHAT_ID = process.env.CHAT_ID

async function sendTelegram(message){

const url = `https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`

await fetch(url,{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify({
chat_id: CHAT_ID,
text: message
})
})

}

// roadmap API
app.post("/generate", async (req,res)=>{

const idea = req.body.idea

const roadmap = `
Phase 1- System Architecture & Data Modeling
(Weeks 1-3)
Architecture Planning
Backend Setup
Database Schema Design

Phase 2- Fleet Management APIs
(Weeks 4-6)
API Development
Core Business Logic
Performance Monitoring

Phase 3- Route Optimization Engine
(Weeks 7-9)
AI Agent Integration
Testing & Optimization

Phase 4-AWS Deployment & Monitoring
(Weeks 10-12)
AWS Deployment
CI/CD Pipeline
Monitoring & Scaling
`

// telegram notification
await sendTelegram(`🚀 New Lead Generated

Idea:
${idea}

Roadmap:
${roadmap}`)

res.json({roadmap})

})

app.get("/",(req,res)=>{
res.sendFile(__dirname + "/index.html")
})

const PORT = process.env.PORT || 5000

app.listen(PORT,()=>{
console.log("Server running on port " + PORT)
})