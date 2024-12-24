const http = require('http')
const app = require('./app')
const mongoose = require('mongoose')
const server = http.createServer(app)
const port = process.env.port || 8080

const url = 'mongodb://localhost:27017/e-commdb'
mongoose
  .connect(url)
  .then(() => {
    console.log('Database connected successfully')
  })
  .catch(err => {
    console.log(err.message)
  })

// connect to sever
app.listen(port, err => {
  if (err) {
    console.log(err.message)
  } else {
    console.log('This connection has been successfully', port)
  }
})
