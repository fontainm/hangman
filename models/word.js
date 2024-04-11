const mongoose = require('mongoose')

const wordSchema = new mongoose.Schema({
  text: String,
  type: String,
})

wordSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    returnedObject.shuffledText = returnedObject.text
      .split('')
      .sort(function () {
        return 0.5 - Math.random()
      })
      .join('')
    delete returnedObject._id
    delete returnedObject.__v
  },
})

module.exports = mongoose.model('Word', wordSchema)
