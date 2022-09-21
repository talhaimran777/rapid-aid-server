const express = require('express')
const app = require('express')()
const httpServer = require('http').createServer(app)
const options = {
  cors: {
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
    optionsSuccessStatus: 204,
  },
}
const io = require('socket.io')(httpServer, options)

const cors = require('cors')
const mongoose = require('mongoose')
const dotenv = require('dotenv')

// ROUTES
const authRoute = require('./routes/api/auth/authRoute')
const taskRoute = require('./routes/api/task/taskRoute')
const profileRoute = require('./routes/api/profile/profileRoute')
const messageRoute = require('./routes/api/message/messageRoute')
const conversationRoute = require('./routes/api/conversation/conversationRoute')
const offerRoute = require('./routes/api/offer/offerRoute')
const orderRoute = require('./routes/api/order/orderRoute')

dotenv.config()

let connectDb = async () => {
  let connectionString = process.env.CONNECTION_STRING
  let databaseName = process.env.DATABASE
  let databasePass = process.env.DATABASE_PASS

  connectionString = connectionString.replace('<PASSWORD>', databasePass).replace('<DATABASE>', databaseName)

  try {
    let db = await mongoose.connect(connectionString, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    })

    if (db) {
      console.log('Database Connected!')

      const port = process.env.PORT || 5000

      httpServer.listen(port, () => console.log('Listening for requests on port: ' + port))
    }
  } catch (err) {
    console.log(err)
  }
}

connectDb()

// const usersRoute = require('./routes/api/usersRoute');
// const tasksRoute = require('./routes/api/tasksRoute');
// const authRoute = require('./routes/authRoute');
// const clientsRoute = require('./routes/clientsRoute');

// dotenv.config();

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cors())

app.use((req, res, next) => {
  req.io = io

  io.on('connection', (socket) => {
    console.log('User connected')
  })
  next()
})

app.use('/api/v1/auth', authRoute)
app.use('/api/v1/tasks', taskRoute)
app.use('/api/v1/profiles', profileRoute)
app.use('/api/v1/messages', messageRoute)
app.use('/api/v1/conversations', conversationRoute)
app.use('/api/v1/offers', offerRoute)
app.use('/api/v1/orders', orderRoute)

// USING AUTH ROUTE
// app.post('/login', (req, res) => {
//   res.send({ status: 200, message: 'Login successful' })
// })

// USING TASKS ROUTE
// app.use('/api', tasksRoute);

// USING USERS ROUTES
// app.use('/api', clientsRoute);

app.get('/', (req, res) => {
  res.status(200).send('Simple get request on route /')
})

module.exports = app
