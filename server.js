const express = require("express")
const cors = require("cors")
const OpenAI = require("openai")

const app = express()

app.use(cors())
app.use(express.json())

// Serve static files (index.html, logo, etc)
app.use(express.static(__dirname))

// OpenAI setup
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

// Telegram configuration
const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN
const CHAT_ID = process.env.CHAT_ID


// Telegram notification function
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

Generate a structured 12-week roadmap including:

Phase-wise Milestones
The Vikgol Stack (Next.js, FastAPI, PostgreSQL, Vector DB, LangGraph, AWS)
Architecture Thinking
Technical Risks to Mitigate`
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

      roadmap = `
Phase 1 (Weeks 1-3)
Architecture Planning
Backend Setup
Database Schema Design

Phase 2 (Weeks 4-6)
API Development
Core Business Logic
Performance Monitoring

Phase 3 (Weeks 7-9)
AI Agent Integration
Testing & Optimization

Phase 4 (Weeks 10-12)
AWS Deployment
CI/CD Pipeline
Monitoring & Scaling
`

    }

    // Send Telegram notification
    await sendTelegram(`🚀 New Lead Generated

Idea:
${idea}

Roadmap:
${roadmap}`)

    res.json({ roadmap })

  }catch(error){

    console.log(error)

    res.json({
      roadmap:"Server error occurred"
    })

  }

})


// Root route → serve UI
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html")
})


// Start server
const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log("Server running on port " + PORT)
})