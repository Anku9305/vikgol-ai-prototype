const express = require("express")
const cors = require("cors")
const OpenAI = require("openai")

const app = express()

app.use(cors())
app.use(express.json())

app.use(express.static(__dirname))

app.get("/",(req, res) => {
  res.send("Vikgol AI Architect Server Running")
})

// OpenAI API
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

// Telegram configuration
const TELEGRAM_TOKEN = "8584559764:AAG08fLaosLjQidPXuVj6an9HxjLavJhb44"
const CHAT_ID = "1987668591"


// Telegram Notification Function
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


// Generate Roadmap API
app.post("/generate", async (req,res)=>{

  const idea = req.body.idea

  try{

    let roadmap = ""

    try{

      const completion = await client.chat.completions.create({

        model:"gpt-4.1-mini",

        messages:[

          {
            role:"system",
            content:`You are the Lead Solution Architect at Vikgol.

When a user provides a product idea, generate a structured 12-week execution roadmap.

Include the following sections:

Phase-wise Milestones:
Use specific milestones such as Security Hardening, Latency Optimization, Production Monitoring, CI/CD Automation and Performance Testing.

The Vikgol Stack:
Recommend modern technologies including:
Next.js
FastAPI
PostgreSQL
Vector Databases (Pinecone or Milvus)
LangGraph for multi-agent workflows
AWS infrastructure.

Architecture Thinking:
Explain briefly how AI agents interact with APIs, vector databases and backend services.

Technical Risks to Mitigate:
Add a section titled "Technical Risks to Mitigate".
Mention risks such as Token Costs, Data Privacy, API Rate Limiting and scaling challenges.

If the idea involves logistics, delivery or mobility systems, ensure the roadmap explicitly includes:

Route Optimization
Real-time API Latency
Fleet Management Logic

Tone should be consultative, analytical and slightly critical of basic implementations.`
          },

          {
            role:"user",
            content:idea
          }

        ]

      })

      roadmap = completion.choices[0].message.content

    }catch(err){

      console.log("OPENAI ERROR:", err)
      console.log("OpenAI failed, using fallback roadmap")

    roadmap = `
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
    }


    // Send Telegram Notification
    await sendTelegram(`🚀 New Lead Generated

Idea:
${idea}

Roadmap:
${roadmap}`)


    res.json({roadmap})

  }catch(error){

    console.log(error)

    res.json({
      roadmap:"Server error occurred"
    })

  }

})


// Health check route
app.get("/",(req,res)=>{
  res.send("Vikgol AI Architect Server Running")
})


// Start server
app.listen(5000,()=>{
  console.log("Server running on port 5000")
})