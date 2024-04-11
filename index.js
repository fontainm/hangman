const express = require('express')
const app = express()
const cors = require('cors')
const config = require('./utils/config')
const middleware = require('./utils/middleware')

const wordsController = require('./controllers/words')
const usersController = require('./controllers/users')
const gamesController = require('./controllers/games')

const server = require('http').createServer(app)
const io = require('socket.io')(server, {
  cors: {
    origin: '*',
  },
})

let users = []

io.on('connection', (socket) => {
  let currentUser = null

  console.log('New user joined')

  socket.on('disconnect', () => {
    console.log(`${currentUser ?? 'Unknown user'} disconnected`)
    users = users.filter((u) => u !== currentUser)
    io.emit('update users', users)
  })

  socket.on('join game', (username) => {
    currentUser = username
    io.emit('join game', currentUser)
    if (!users.includes(currentUser)) {
      users.push(currentUser)
    }
    console.log(`User ${currentUser} joined`)
    console.log('all users: ', users)
    io.emit('update users', users)
  })

  socket.on('update solution', (msg) => {
    io.emit('update solution', msg)
  })

  socket.on('reset game', (game) => {
    io.emit('reset game', game)
  })
})

const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

mongoose
  .connect(config.MONGODB_URI)
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })

app.use(cors())
app.use(express.json())
app.use(express.static('dist'))
app.use(middleware.errorHandler)

app.use('/api/words', wordsController)
app.use('/api/users', usersController)
app.use('/api/games', gamesController)

const PORT = config.PORT
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
