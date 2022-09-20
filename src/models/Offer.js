const mongoose = require('mongoose')
const Schema = mongoose.Schema

// Create Schema for Users
const OfferSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  description: {
    type: String,
    required: true,
  },
  offeredAmount: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
})

module.exports = Message = mongoose.model('Offer', OfferSchema)
