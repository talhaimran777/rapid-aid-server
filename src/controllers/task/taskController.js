const validateTask = require('../../validation/task')
const validateComment = require('../../validation/comment')
const validateOffer = require('../../validation/offer')

const { body, check, validationResult } = require('express-validator')
const fs = require('fs')
const path = require('path')
const Task = require('../../models/Task')
const User = require('../../models/User')

// INITIALLY I'M GETING TASKS FORM THE LOCAL JSON FILE
let data = fs.readFileSync(path.resolve(__dirname, '../../data/tasks.json'), 'utf-8')

const getTasks = async (req, res) => {
  const { searchKeyword } = req.query

  if (!searchKeyword) {
    try {
      const tasks = await Task.find().sort({ _id: -1 })
      res.status(200).json({ status: 'ok', tasks })
    } catch (err) {
      console.error(err.message)
      res.status(500).send('Server Error')
    }
  } else {
    try {
      // const tasks = await Task.find({
      //   title: { $regex: searchKeyword, $options: 'i' },
      // }).sort({ _id: -1 })

      const tasks = await Task.find()
        .or([
          { title: { $regex: searchKeyword, $options: 'i' } },
          { description: { $regex: searchKeyword, $options: 'i' } },
          { name: { $regex: searchKeyword, $options: 'i' } },
          { address: { $regex: searchKeyword, $options: 'i' } },
          { status: { $regex: searchKeyword, $options: 'i' } },
        ])
        .sort({ _id: -1 })
      res.status(200).json({ status: 'ok', tasks })
    } catch (err) {
      console.error(err.message)
      res.status(500).send('Server Error')
    }
  }
}

const getTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id).populate({
      path: 'offers',
      populate: {
        path: 'user',
        model: 'User',
        select: 'name avatar',
      },
    })
    // console.log(task)
    if (!task) {
      return res.status(404).json({ status: 'FAILED', msg: 'Task was not found!' })
    }

    res.status(200).json({ status: 'SUCCESS', task })
  } catch (err) {
    // console.error(err.message)

    res.status(500).send({ status: 'FAILED', msg: 'Server Error' })
  }
}

const postTask = async (req, res) => {
  // const { errors, isValid } = validateTask(req.body)
  // validateT

  // if (!isValid) {
  //   return res.status(400).json({ ...errors, validationFormType: 'postTask' })
  // }

  // Finds the validation errors in this request and wraps them in an object with handy functions

  // check('title', 'Title is required').notEmpty()

  // body('title').isLength({ min: 5, max: 30 }).withMessage('Title must be between 5 and 30 characters')

  const errors = validationResult(req)
  console.log(errors)

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }

  const { title, description, budget, address, dueDate, userId } = req.body
  const postedDate = Date.now()
  const lastUpdated = Date.now()

  try {
    const user = await User.findById(userId).select('-password')
    const task = new Task({
      title: title,
      description: description,
      budget: budget,
      dueDate,
      address: address,
      status: 'open',
      user: userId,
      name: user.name,
      avatar: user.avatar,
      postedDate,
      lastUpdated,
    })

    const result = await task.save()

    res.status(201).json({ status: 'SUCCESS', task: result })
  } catch (err) {
    res.status(500).json({ status: 'FAILED', error: err, message: 'Server Error' })
  }
}

const deleteTask = async (req, res) => {
  const { id } = req.params
  try {
    const task = await Task.findById(id)

    if (!task) {
      return res.status(404).json({ statusCode: 404, msg: 'Task was not found!' })
    }

    await task.remove()
    res.json({ status: 200, msg: 'Task was removed successfully!' })
  } catch (err) {
    res.status(500).json({ status: 'FAILED', error: err, message: 'Server Error' })
  }
}

const updateTask = async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }

  const { id } = req.params
  const { title, description, budget, address, dueDate, userId } = req.body

  try {
    const task = await Task.findById(id)
    if (!task) {
      return res.status(404).json({ status: 'FAILED', msg: 'Task was not found!' })
    } else {
      const user = await User.findById(userId).select('-password')
      if (user) {
        task.title = title
        task.description = description
        task.budget = budget
        task.dueDate = dueDate
        task.address = address
        task.lastUpdated = Date.now()
        const result = await task.save()
        return res.status(201).json({ status: 'SUCCESS', task: result })
      }
    }
  } catch (err) {
    res.status(500).json({ status: 'FAILED', error: err, message: 'Server Error' })
  }
}

const addComment = async (req, res) => {
  // res.status(201).json({ status: 'SUCCESS', task: result })
  const { errors, isValid } = validateComment(req.body)
  if (!isValid) {
    return res.status(400).json({ ...errors, validationFormType: 'comment' })
  }

  const { user, comment } = req.body
  const { id } = user

  const lastUpdated = Date.now()

  try {
    // console.log(req.params)
    const user = await User.findById(id).select('-password')
    const task = await Task.findById(req.params.id)

    const newComment = {
      comment: comment,
      name: user.name,
      avatar: user.avatar,
      user: user.id,
    }

    task.comments.unshift(newComment)

    await task.save()

    res.status(201).json({ status: 'SUCCESS', comments: task.comments })

    // console.log(req.body)
  } catch (err) {
    console.log('ERROR')
    res.status(500).json({ status: 'FAILED', error: err, message: 'Server Error' })
  }
}

const postOffer = async (req, res) => {
  const errors = validationResult(req)
  console.log(errors)

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }

  const { user, offeredAmount, description } = req.body
  const { id } = user

  // const lastUpdated = Date.now()

  try {
    // console.log(req.params)
    // const user = await User.findById(id).select('-password')
    const task = await Task.findById(req.params.id)

    const newOffer = {
      user: id,
      offeredAmount: offeredAmount,
      description: description,
    }

    task.offers.unshift(newOffer)

    await task.save()

    res.status(201).json({ status: 'SUCCESS', offers: task.offers })

    // console.log(req.body)
  } catch (err) {
    console.log('ERROR')
    res.status(500).json({ status: 'FAILED', error: err, message: 'Server Error' })
  }
}

module.exports = {
  getTasks,
  getTask,
  postTask,
  updateTask,
  addComment,
  deleteTask,
  postOffer,
}
