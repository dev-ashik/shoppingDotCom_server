const express = require('express');
require('dotenv').config();
const mongoose = require('mongoose');
var morgan = require('morgan');
const connectDB = require('./config/db');



// middlewares
const app = express();
// main().catch(err => console.log(err));
app.use(morgan('dev'))

// database Connected
connectDB()

// to read json 
app.use(express.json());


// rest api
app.get('/', (req, res) => {
  res.send('Server is runing..')
})

// async function main() {
//     await mongoose.connect(process.env.MOMGODB_URL);
//     console.log("mongoDB connected");
//     // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
//   }


const port = process.env.PORT || 8080
app.listen( port, () => {
  console.log(`server running on ${process.env.MODE} mode on port ${port}`)
})