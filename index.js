require('dotenv').config()
const express = require('express')
const path = require('path')
const app = express()

app.use(express.urlencoded({extended: true}))
app.use(express.json())

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

app.use(express.static('public'))

const CLAUDE_API_KEY = process.env.CLAUDE_API_KEY
const PORT = process.env.PORT || 18201

app.get('/', (req, res) => {
    res.render('index');
});

app.post('/ask', async (req, res) => {
    const userPrompt = req.body.prompt || ''
    const initialContext = `
    ALWAYS answer based on what you know. Always answer with one sentence. You are a friendly assistant tasked to answer questions related to Fitra Rahmani Khasyah (he/him) or Khasyah or Fitra.
    He is a full stack software engineer. Khasyah lives in South Jakarta, Indonesia. His tech stack includes Golang, Javascript, Postgresql and Python.
    He graduated from Universitas Gadjah Mada getting a computer science bachelor with GPA 3.84/4.00. He has experience working in finance (IPOT), ecommerce (Tokopedia), and edutech (Ruangguru).
    He has interests in finance, journalling, travel, VR, software engineering, blockchain, and AI. He is currently open to opportunites, especially remote. He is born in 2002. His email is khasyahfr@gmail.com, you can reach him there.
    His long term goal is landing a remote role or working abroad. He has no medical conditions. His professional projects currently revolve around transactions processing and infrastructure.
    `

    try {
        const response = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': CLAUDE_API_KEY,
                'anthropic-version': '2023-06-01'
            },
            body: JSON.stringify({
                model: 'claude-3-haiku-20240307',
                messages: [{"role": "user", "content": `${initialContext}\n Then user asked: ${userPrompt}.`}],
                max_tokens: 256,
            })
        })

        const data = await response.json()
        res.json({answer: data.content[0].text})
    } catch (error) {
        console.error(error)
        res.status(500).json({ answer: 'Error contacting assistant' });
    }
})

const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})


process.on('SIGTERM', async () => {
    logger.info('shutting down gracefully...')
    server.close(() => {
        logger.info('server closed')
        process.exit(0)
    })
})