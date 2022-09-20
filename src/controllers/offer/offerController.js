const mongoose = require('mongoose')
const { validationResult } = require('express-validator')
const User = require('../../models/User')
const Task = require('../../models/Task')
const Offer = require('../../models/Offer')

const postOffer = async (req, res) => {
  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }

  const { user, offeredAmount, description } = req.body
  const { id } = user

  try {
    const user = await User.findById(id).select('-password')
    const task = await Task.findById(req.params.id)
    // console.log(task)

    const newOffer = {
      user: user.id,
      offeredAmount,
      description,
    }

    const offer = new Offer(newOffer)

    if (offer) {
      const result = await offer.save()
      if (result._id) {
        task.offers.unshift(mongoose.Types.ObjectId(result._id))
        await task.save()
        res.status(201).json({ status: 'SUCCESS', data: { offer } })
      }
    }
  } catch (err) {
    console.log('ERROR')
    res.status(500).json({ status: 'FAILED', error: err, message: 'Server Error' })
  }
}

const getOffers = async (req, res) => {
  //   const errors = validationResult(req)
  //   if (!errors.isEmpty()) {
  //     return res.status(400).json({ errors: errors.array() })
  //   }

  const { user } = req.body
  const { id } = user

  try {
    // task.comments.unshift(newComment)

    // await task.save()

    // res.status(201).json({ status: 'SUCCESS', data: { user, task } })

    const offers = await Offer.find().populate('user')

    res.send(offers)
  } catch (err) {
    console.log('ERROR')
    res.status(500).json({ status: 'FAILED', error: err, message: 'Server Error' })
  }
}

module.exports = {
  postOffer,
  getOffers,
}
