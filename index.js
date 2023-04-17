const express = require('express');
require('dotenv').config();
const mongoose = require('mongoose');
var morgan = require('morgan');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoute');
// const authRoutes = require('./routes/authroute.js');



// middlewares
const app = express();
app.use(morgan('dev'))

// database Connected
connectDB()

// to read json 
app.use(express.json());


// rest api
app.get('/', (req, res) => {
  res.send('Server is runing..')
})


// all routes
app.use("/api/v1/auth", authRoutes)



const port = process.env.PORT || 8080
app.listen( port, () => {
  console.log(`server running on ${process.env.MODE} mode on port ${port}`)
})



// Link: https://www.youtube.com/watch?v=A_-fn_ij59c
// Time: 51:24