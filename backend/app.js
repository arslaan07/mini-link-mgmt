const express = require('express')
const app = express()
const authRoutes = require('./routes/auth')
const urlRoutes = require('./routes/url')
const connectDB = require('./connection/mongoose')
const cookieParser = require('cookie-parser')
const cors = require('cors')
require('dotenv').config()

connectDB()
const allowedOrigins = [
  "http://localhost:5173", // Development environment
  "https://link-manage.netlify.app/", // Production environment
];

app.use(cors({
  origin: [
      'https://link-manage.netlify.app/',
      'http://localhost:5173'
  ],
  credentials: true
}))
// app.use(cors({
//   origin: 'http://localhost:5173', // Frontend origin
//   credentials: true,              // Allow cookies
// } 
// ))
app.use(express.json());
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

app.use('/api/auth', authRoutes)
app.use('/api/urls', urlRoutes)
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });