const mongoose = require('mongoose')

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true
    },
    email: {
      type: String,
      unique: true,
      required: true
    },
    mobile: {
      type: Number
    },
    password: {
      type: String,
      required: true
    },
    gender: {
      type: String,
      enum: ['Male', 'Female']
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user'
    }
  },
  { timestamps: true }
)

module.exports = mongoose.model('users', userSchema)
