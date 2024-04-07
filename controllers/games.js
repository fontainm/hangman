const gamesRouter = require('express').Router()
const Game = require('../models/game')

gamesRouter.get('/', async (request, response) => {
  const games = await Game.find({})
  response.json(games)
})

gamesRouter.post('/', async (request, response) => {
  const game = new Game({
    started_at: new Date(),
    solution: request.body,
  })

  const savedGame = await game.save()
  response.status(201).json(savedGame)
})

gamesRouter.put('/:id', async (request, response) => {
  const game = await Game.findByIdAndUpdate(
    request.params.id,
    {
      solution: request.body,
    },
    { new: true }
  )
  response.json(game)
})

gamesRouter.delete('/:id', async (request, response) => {
  await Game.findByIdAndDelete(request.params.id)
  response.status(204).end()
})

module.exports = gamesRouter
