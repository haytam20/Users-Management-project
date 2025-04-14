const express = require('express')
const app = express()
const port = 3002

app.get('/', (req, res) => {
  res.sendFile("./Home.html",{root:__dirname})
})

app.listen(port, () => {
  console.log(`http://localhost:${port}/`)
})