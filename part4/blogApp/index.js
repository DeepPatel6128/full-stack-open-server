//import dependencies
const express = require('express')
const mongoose = require('mongoose')
const config = require('./utils/config')
const blogRouter = require('./routes/blog')
const app = express();
const cors = require('cors')

//initialize middlewares
app.use(cors())
app.use(express.json())


//connect to mongodb
require('dotenv').config();
const mongoURI = config.MONGODB_URI
mongoose.set('strictQuery', false)
mongoose.connect(mongoURI).then(()=> console.log('Connected')).catch((e)=>console.log('Did not connect', e.message))



//all routes goes here
app.use('/api/blogs', blogRouter)
app.use('/api/blogs', blogRouter)
app.listen(3001, ()=>{console.log('Listening to port')})