const express = require('express')
const app = express()
const cors = require('cors')
const config = require('./utils/config')
const middleware = require('./utils/middleware')

const Word = require('./models/word')

app.use(cors())
app.use(express.json())
app.use(middleware.errorHandler)

app.get('/api/words', async (request, response, next) => {
  try {
    const result = await Word.find({})
    response.json(result)
  } catch (error) {
    next(error)
  }
})

const PORT = config.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
