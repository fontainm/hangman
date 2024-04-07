const gamesRouter = require('express').Router()
const Game = require('../models/game')

gamesRouter.get('/', async (request, response) => {
  const games = await Game.find({})
  response.json(games)
})

gamesRouter.post('/', async (request, response) => {
  console.log('trying to post', request.body)
  const game = new Game({
    started_at: new Date(),
    solution: request.body,
  })

  const savedGame = await game.save()
  response.status(201).json(savedGame)
})

module.exports = gamesRouter
