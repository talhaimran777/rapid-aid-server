const mongoose = require('mongoose')
const { validationResult } = require('express-validator')
const User = require('../../models/User')
const Order = require('../../models/Order')
const Task = require('../../models/Task')
const Conversation = require('../../models/Conversation')
const Message = require('../../models/Message')

const createOrder = async (req, res) => {
  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }

  const { user, taskId, offerId, taskerId } = req.body
  const { id } = user
  // console.log(user)

  try {
    const data = {}

    data.hirerId = id
    data.taskId = taskId
    data.offerId = offerId
    data.taskerId = taskerId
    data.orderParticipants = [id, taskerId]

    const newOrder = new Order(data)

    if (newOrder) {
      await newOrder.save()

      const task = await Task.findById(taskId)
      task.status = 'assigned'
      await task.save()

      const tasker = await User.findById(taskerId)
      const conversation = await Conversation.findOneAndUpdate(
        {
          recipients: {
            $in: [
              [id, tasker._id],
              [tasker._id, id],
            ],
          },
        },
        {
          recipients: [id, tasker._id],
          lastMessage: 'I have hired you!',
          date: Date.now(),
        },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      )

      const newMessage = new Message({
        conversation: conversation._id,
        to: tasker._id,
        from: id,
        avatar: user?.avatar,
        message: 'I have hired you!',
      })
      await newMessage.save()

      res.status(201).json({ status: 'SUCCESS', data: newOrder })
    }
  } catch (err) {
    console.log('ERROR')
    res.status(500).json({ status: 'FAILED', error: err, message: 'Server Error' })
  }
}

const getOrder = async (req, res) => {
  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }

  const { user } = req.body
  const { id } = user

  try {
    const orders = await Order.find()
      .or([
        { hirerId: id, orderStatus: 'pending' },
        { taskerId: id, orderStatus: 'pending' },
      ])
      .populate('taskId')
      .populate('offerId')

    if (orders?.length) {
      res.status(200).json({ status: 'SUCCESS', data: orders[0] })
    } else {
      res.status(200).json({ status: 'SUCCESS', data: null })
    }
  } catch (err) {
    console.log('ERROR')
    res.status(500).json({ status: 'FAILED', error: err, message: 'Server Error' })
  }
}

const markOrderComplete = async (req, res) => {
  // const errors = validationResult(req)

  // if (!errors.isEmpty()) {
  //   return res.status(400).json({ errors: errors.array() })
  // }

  console.log(req.body)

  const { user, orderId, taskId } = req.body
  const { id } = user

  try {

    const order = await Order.findById(orderId)

    if(order){
      order.orderStatus = 'completed'
      await order.save()

      const task = await Task.findById(taskId)
      task.status = 'completed'
      await task.save()

      res.status(200).json({ status: 'SUCCESS', data: order, message: 'Order completed successfully!' })
    }
    else {
      res.status(404).json({ status: 'FAILED', message: 'No Order Found!' })
    }

    // const orders = await Order.find()
    //   .or([
    //     { hirerId: id, orderStatus: 'pending' },
    //     { taskerId: id, orderStatus: 'pending' },
    //   ])
    //   .populate('taskId')
    //   .populate('offerId')

    // if (orders?.length) {
    //   res.status(200).json({ status: 'SUCCESS', data: orders[0] })
    // } else {
    //   res.status(200).json({ status: 'SUCCESS', data: null })
    // }
  } catch (err) {
    console.log('ERROR')
    res.status(500).json({ status: 'FAILED', error: err, message: 'Server Error' })
  }
}

module.exports = {
  createOrder,
  getOrder,
  markOrderComplete
}
