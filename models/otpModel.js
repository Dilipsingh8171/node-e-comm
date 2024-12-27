const mongoose = require('mongoose')

const otpSchema = new mongoose.Schema({
  mobile: {
    type: Number
  },
  otp: {
    type: Number
  },
  time: {
    type: Number
  }
})

module.exports = mongoose.model('otpModel', otpSchema)
