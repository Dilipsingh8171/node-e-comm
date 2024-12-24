const express = require('express')
const app = express()
const cors = require('cors')
const dotenv = require('dotenv')
const cloudinary = require('cloudinary').v2

dotenv.config()
app.use(express.json())
app.use(cors())

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
})
//user-routes
const userroutes = require('./routes/user_routes')
app.use('/api', userroutes)

module.exports = app
