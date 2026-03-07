const express = require("express")
const cors = require("cors")

const app = express()

app.use(cors())
app.use(express.json())

// serve static files (index.html, logo etc)
app.use(express.static(__dirname))

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

app.post("/generate", async (req,res)=>{

const idea = req.body.idea
const email = req.body.email
const industry = req.body.industry

let roadmap = ""

if(industry === "Fintech"){

roadmap = `
Phase 1 - Fintech Architecture Planning
(Weeks 1-3)
KYC / AML integration
Secure financial database schema
Compliance planning

Phase 2 - Financial APIs
(Weeks 4-6)
Payment gateway integration
Transaction APIs
Fraud monitoring

Phase 3 - AI Risk Analysis
(Weeks 7-9)
Credit scoring model
Fraud detection system
Risk analytics dashboard

Phase 4 - Secure Deployment
(Weeks 10-12)
AWS deployment
Security monitoring
Compliance audit
`
}

else if(industry === "Logistics"){

roadmap = `
Phase 1 - Logistics Architecture Design
(Weeks 1-3)
Fleet database design
Route planning architecture
Driver management schema

Phase 2 - Fleet Management APIs
(Weeks 4-6)
Vehicle tracking APIs
Driver assignment logic
Performance monitoring

Phase 3 - Route Optimization Engine
(Weeks 7-9)
AI route optimization
Delivery prediction system

Phase 4 - Deployment & Monitoring
(Weeks 10-12)
AWS deployment
CI/CD pipeline
System monitoring
`
}

else if(industry === "SaaS"){

roadmap = `
Phase 1 - SaaS Platform Architecture
(Weeks 1-3)
Multi-tenant database design
Authentication system
Core backend setup

Phase 2 - Core Product Development
(Weeks 4-6)
Subscription management
User dashboard APIs
Feature modules

Phase 3 - Scaling & Automation
(Weeks 7-9)
Usage analytics
Billing automation
Performance optimization

Phase 4 - Cloud Deployment
(Weeks 10-12)
AWS deployment
Monitoring & logging
Auto scaling setup
`
}

else if(industry === "Healthcare"){

roadmap = `
Phase 1 - Healthcare System Architecture
(Weeks 1-3)
Patient data schema
HIPAA compliance planning
Secure backend setup

Phase 2 - Healthcare APIs
(Weeks 4-6)
Patient record APIs
Doctor management system
Appointment scheduling

Phase 3 - AI Healthcare Tools
(Weeks 7-9)
AI diagnosis support
Medical data analysis

Phase 4 - Deployment & Security
(Weeks 10-12)
Secure cloud deployment
Monitoring
Compliance verification
`
}

else if(industry === "E-commerce"){

roadmap = `
Phase 1 - Ecommerce Architecture
(Weeks 1-3)
Product database design
User authentication system
Shopping cart schema

Phase 2 - Core Ecommerce APIs
(Weeks 4-6)
Product catalog APIs
Order management system
Payment integration

Phase 3 - Recommendation Engine
(Weeks 7-9)
AI product recommendations
Customer analytics

Phase 4 - Deployment & Scaling
(Weeks 10-12)
AWS deployment
Inventory monitoring
Scaling infrastructure
`
}

else if(industry === "AI Tools"){

roadmap = `
Phase 1 - AI Platform Architecture
(Weeks 1-3)
AI pipeline design
Data ingestion system
Backend setup

Phase 2 - AI Model Integration
(Weeks 4-6)
LLM integration
Prompt workflows
API development

Phase 3 - AI Automation
(Weeks 7-9)
Agent workflows
Model optimization
User interface integration

Phase 4 - Deployment
(Weeks 10-12)
Cloud deployment
Monitoring
Performance optimization
`
}

else{

roadmap = `
Phase 1 - System Architecture & Data Modeling
(Weeks 1-3)
Architecture planning
Backend setup
Database schema design

Phase 2 - Core API Development
(Weeks 4-6)
API development
Core business logic
Performance monitoring

Phase 3 - AI Integration
(Weeks 7-9)
AI workflow integration
Testing & optimization

Phase 4 - Deployment
(Weeks 10-12)
AWS deployment
CI/CD pipeline
Monitoring & scaling
`
}

await sendTelegram(`🚀 New Lead Generated

Idea: ${idea}
Industry: ${industry}
Email: ${email}

Roadmap:
${roadmap}
`)

res.json({roadmap})

})

app.get("/",(req,res)=>{
res.sendFile(__dirname + "/index.html")
})

const PORT = process.env.PORT || 5000

app.listen(PORT,()=>{
console.log("Server running on port " + PORT)
})