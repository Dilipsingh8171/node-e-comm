const mongoose = require('mongoose')

const subcategorySchema = new mongoose.Schema({
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'category'
  },
  price: {
    type: Number
  },
  subcategory_status: {
    type: String,
    required: true,
    default: 0
  },
  subcategory_name: {
    type: String
  },
  image: {
    type: String
  }
})

module.exports = mongoose.model('subcategory', subcategorySchema)
