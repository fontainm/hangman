const mongoose = require('mongoose')

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

module.exports = mongoose.model('Word', wordSchema)