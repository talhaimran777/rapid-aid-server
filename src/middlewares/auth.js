const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')

dotenv.config()

const auth = async (req, res, next) => {
  try {
    // console.log(req.headers)
    const token = req.headers['authorization']
    if (!token)
      return res.status(401).json({
        status: 'Failed!',
        message: 'Token not found!',
      })

    // REMOVING BEARER FROM THE TOKEN STRING
    const withoutBearerToken = token.split(' ')[1]

    const privateKey = process.env.SECRET_KEY

    let payload = await jwt.verify(withoutBearerToken, privateKey)

    // PUTTING USERS OBJECT IN THE REQUEST.USER OBJECT
    req.body.user = payload
  } catch (err) {
    res.status(401).json({
      status: 'Failed!',
      message: 'Not authorized!',
    })
  }

  next()
}

module.exports = auth
