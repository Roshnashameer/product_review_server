// load env file
require('dotenv').config()
// import express 
const express = require('express')
const cors=require('cors')
const router = require('./routes/routes')
require('./db/connection')
// create server using express
const pdtServer = express()
// convert all incoming json data to js data
pdtServer.use(express.json())
pdtServer.use(cors())
pdtServer.use(router)

const PORT = 4005 || process.env.PORT
pdtServer.listen(PORT, () => {
    console.log(`________pdtServer  started at ${PORT}___`);
})
pdtServer.get('/',(req,res)=>{
    res.send('<h1>pdt server started</h1>')
})