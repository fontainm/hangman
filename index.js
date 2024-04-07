const express = require('express')
const app = express()
const cors = require('cors')
const config = require('./utils/config')
const mongoose = require('mongoose')

const url = config.MONGODB_URI

mongoose.set('strictQuery', false)
mongoose
  .connect(url)
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })

const wordSchema = new mongoose.Schema({
  text: String,
  type: String,
})

wordSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  },
})

const Word = mongoose.model('Word', wordSchema)

let words = {
  articles: [
    'the',
    'a',
    'my',
    'his',
    'her',
    'our',
    'their',
    'no',
    'one',
    'this',
    'that',
  ],
  adjectives: [
    'cool',
    'hungry',
    'slow',
    'nice',
    'thin',
    'young',
    'wrong',
    'sarcastic',
    'beautiful',
    'red',
    'dead',
  ],
  objects: [
    'bird',
    'clock',
    'boy',
    'cow',
    'pineapple',
    'horse',
    'astronaut',
    'duck',
    'teacher',
    'lady',
    'professor',
    'hamster',
    'dog',
    'boat',
  ],
  verbs: [
    'kicks',
    'eats',
    'loves',
    'likes',
    'hates',
    'misses',
    'visits',
    'beats',
    'hugs',
    'kills',
  ],
  subjects: [
    'professors',
    'agents',
    'directors',
    'animals',
    'cinemas',
    'stars',
    'plants',
    'water',
    'fire',
    'mountains',
  ],
  adverbs: [
    'slowly',
    'elegantly',
    'precisely',
    'quickly',
    'sadly',
    'humbly',
    'proudly',
    'shockingly',
    'calmly',
    'passionately',
  ],
}

app.use(cors())

app.get('/api/words', (request, response) => {
  Word.find({}).then((words) => {
    response.json(words)
  })
})

const PORT = config.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
