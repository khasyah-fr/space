const express = require('express')
const path = require('path')

const app = express()
const PORT = 18201

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

app.get('/', (req, res) => {
    res.render('index', { title: 'Khasyahfr', description: "Welcome to khasyahfr's space"})
})

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})