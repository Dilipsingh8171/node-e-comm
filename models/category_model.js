const mongoose = require('mongoose')

const categorySchema = new mongoose.Schema({
  category_name: {
    type: String
  },
  catgory_status: {
    type: String,
    default: 0
  }
})

module.exports = mongoose.model('category', categorySchema)
