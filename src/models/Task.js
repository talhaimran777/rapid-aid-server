const mongoose = require('mongoose')
const Schema = mongoose.Schema

// Create Schema
const taskSchema = new Schema({
  //   _id: mongoose.Schema.Types.ObjectId,

  user: {
    type: Schema.Types.ObjectId,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  budget: {
    type: Number,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  dueDate: {
    type: Date,
    required: true,
  },
  status: { type: String, required: true },
  name: {
    type: String,
    required: true,
  },
  avatar: {
    type: String,
    required: true,
  },
  postedDate: { type: Date, required: true },
  lastUpdated: { type: Date },
  comments: [
    {
      user: {
        type: Schema.Types.ObjectId,
      },
      comment: {
        type: String,
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
      avatar: {
        type: String,
        required: true,
      },
      date: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  offers: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Offer',
    },
  ],
})

module.exports = mongoose.model('Task', taskSchema)
