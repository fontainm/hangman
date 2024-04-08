import axios from 'axios'
const baseUrl = 'http://localhost:3003/api/games'

const getGame = async () => {
  const response = await axios.get(baseUrl)
  return response.data
}

const addGame = async (solution) => {
  const response = await axios.post(baseUrl, solution)
  return response.data
}

const updateGame = async (game) => {
  const response = await axios.put(`${baseUrl}/${game.id}`, game.solution)
  return response.data
}

const removeGame = async (id) => {
  await axios.delete(`${baseUrl}/${id}`)
}

export default {
  getGame: getGame,
  addGame: addGame,
  updateGame: updateGame,
  removeGame: removeGame,
}
