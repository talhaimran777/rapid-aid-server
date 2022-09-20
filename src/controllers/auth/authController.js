/*eslint comma-dangle: ["error", "always-multiline"]*/

// ** VALIDATORS
const validateRegisterInput = require('../../validation/register')
const validateLoginInput = require('../../validation/login')

// ** IMPORTANT STUFF
const jwt = require('jsonwebtoken')
const User = require('../../models/User')
const bcrypt = require('bcrypt')
const dotenv = require('dotenv')
const md5 = require('md5')

dotenv.config()

// @route POST api/v1/auth/login
// @desc Login user and return JWT token
// @access Public

const login = (req, res) => {
  // Form validation
  const { errors, isValid } = validateLoginInput(req.body)

  // Check validation
  if (!isValid) {
    return res.status(400).json({ ...errors, validationFormType: 'login' })
  }

  const email = req.body.email
  const password = req.body.password

  // Find user by email
  User.findOne({ email }).then((user) => {
    // Check if user exists
    if (!user) {
      return res.status(404).json({
        email: 'Email not found',
        validationFormType: 'login',
      })
    }

    // Check password
    bcrypt.compare(password, user.password).then((isMatch) => {
      if (isMatch) {
        // User matched
        // Create JWT Payload
        const payload = {
          id: user.id,
          name: user.name,
          email: user.email,
          avatar: user.avatar,
        }

        // Sign token
        jwt.sign(
          payload,
          process.env.SECRET_KEY,
          {
            expiresIn: 31556926, // 1 year in seconds
          },
          (err, token) => {
            res.json({
              success: true,
              token: token,
            })
          }
        )
      } else {
        return res.status(400).json({
          password: 'Password incorrect',
          validationFormType: 'login',
        })
      }
    })
  })
}

// @route POST api/v1/auth/register
// @desc Register user
// @access Public

const register = (req, res) => {
  // Form validation
  const { errors, isValid } = validateRegisterInput(req.body)

  // Check validation
  if (!isValid) {
    return res.status(400).json({ ...errors, validationFormType: 'register' })
  }

  User.findOne({ email: req.body.email }).then((user) => {
    if (user) {
      return res.status(400).json({
        email: 'Email already exists',
        validationFormType: 'register',
      })
    } else {
      // USER AVATAR

      const { name, email, password } = req.body
      const hashedEmail = md5(email)
      const avatar = `https://www.gravatar.com/avatar/${hashedEmail}?s=200`

      const today = new Date()
      const date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate()
      const time = today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds()
      const dateTime = date + ' ' + time

      const newUser = new User({
        name,
        email,
        password,
        avatar,
        creationTime: dateTime,
      })

      // Hash password before saving in database
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err
          newUser.password = hash
          newUser
            .save()
            .then((user) => res.json(user))
            .catch((err) => console.log(err))
        })
      })
    }
  })
}

module.exports = {
  login,
  register,
}
