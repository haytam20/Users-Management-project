const express = require('express')
const app = express()
const port = 3002
const mongoose=require('mongoose')

app.get('/', (req, res) => {
  res.sendFile("./Home.html",{root:__dirname})
})



mongoose
    .connect("mongodb+srv://haytam1331:bOFbsZlIOBnoGSAY@cluster0.5uydnqq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
    .then(()=>{
        app.listen(port, () => {
            console.log(`http://localhost:${port}/`)
          })
    })
    .catch((err)=>{console.log(err)});



    // bOFbsZlIOBnoGSAY