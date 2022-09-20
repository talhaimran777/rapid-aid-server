const mongoose = require('mongoose')
const Schema = mongoose.Schema

// Create Schema for Users
const OrderSchema = new Schema({
  taskId: {
    type: Schema.Types.ObjectId,
    ref: 'Task',
  },
  offerId: {
    type: Schema.Types.ObjectId,
    ref: 'Offer',
  },
  taskerId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  hirerId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  orderParticipants: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  orderStatus: {
    type: String,
    enum: ['pending', 'completed'],
    default: 'pending',
  },
  date: {
    type: Date,
    default: Date.now,
  },
})

module.exports = Message = mongoose.model('Order', OrderSchema)
