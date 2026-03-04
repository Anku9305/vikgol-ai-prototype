const express = require("express")
const cors = require("cors")
const OpenAI = require("openai")

const app = express()

app.use(cors())
app.use(express.json())

// Serve static files
app.use(express.static(__dirname))

// OpenAI API
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

// Telegram configuration
const TELEGRAM_TOKEN = "YOUR_TELEGRAM_TOKEN"
const CHAT_ID = "YOUR_CHAT_ID"

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
            content:"You are the Lead Solution Architect at Vikgol. Generate a structured 12-week roadmap with phases, stack and risks."
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
Phase 1 - Architecture Planning
Backend Setup
Database Schema Design

Phase 2 - API Development
Core Business Logic
Performance Monitoring

Phase 3 - AI Integration
Testing & Optimization

Phase 4 - Deployment
CI/CD Pipeline
Monitoring & Scaling
`

    }

    await sendTelegram(`New Lead Generated\n\nIdea:\n${idea}\n\nRoadmap:\n${roadmap}`)

    res.json({roadmap})

  }catch(error){

    console.log(error)

    res.json({
      roadmap:"Server error occurred"
    })

  }

})

// Root route


// Start server
const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log("Server running on port " + PORT)
})