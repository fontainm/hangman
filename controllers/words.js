const wordsRouter = require('express').Router()
const Word = require('../models/word')

wordsRouter.get('/', async (request, response) => {
  const words = await Word.find({})
  response.json(words)
})

module.exports = wordsRouter
