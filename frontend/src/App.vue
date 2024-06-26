<template>
  <div id="app">
    <LoginForm v-if="!username" @join="setUser" />
    <div v-else>
      <div v-if="game">
        <div class="solution">
          <div
            v-for="(word, index) in game.solution"
            :key="index"
            class="word"
            :class="{ solved: word.solved }"
          >
            <span>{{ word.solved ? word.text : word.shuffledText }}</span>
            <span v-if="word.solved" class="username">{{ word.solvedBy }}</span>
          </div>
        </div>
        <Stats :solution="game.solution" :users="users" :username="username" />
        <GameOver
          v-if="gameOver"
          :solution="game.solution"
          @restart="restart"
          class="wrapper"
        />
        <div v-else class="wrapper">
          <input type="text" v-model="guess" @keyup.enter="submit" />
          <button type="submit" @click="submit">Guess</button>
        </div>
      </div>
      <div v-else>
        <Loader />
      </div>
    </div>
  </div>
</template>

<script>
import wordsService from './services/words'
import gamesService from './services/games'

import GameOver from './components/GameOver'
import Stats from './components/Stats'
import LoginForm from './components/LoginForm'
import Loader from './components/Loader'

export default {
  name: 'App',

  components: {
    GameOver,
    Stats,
    LoginForm,
    Loader,
  },

  data() {
    return {
      words: [],
      game: null,
      guess: '',
      username: '',
      users: [],
      gameOver: false,
    }
  },

  sockets: {
    connect() {
      console.log('Connected to server')
    },
    disconnect() {
      console.log('Disconnected from server')
    },
    'update solution'(solution) {
      this.game.solution = solution
      this.checkGameOver()
    },
    'reset game'(game) {
      this.game = game
      this.gameOver = false
    },
    'update users'(users) {
      this.users = users
    },
  },

  async mounted() {
    this.setUser(window.localStorage.getItem('hangmanuser'))
  },

  methods: {
    setUser(username) {
      this.username = username
      if (!this.username) {
        return
      }
      window.localStorage.setItem('hangmanuser', this.username)
      this.loadGame()
    },

    async loadGame() {
      this.words = await wordsService.getAll()
      this.$socket.emit('join game', this.username)
      await this.getGame()
      this.checkGameOver()
    },

    async submit() {
      const i = this.game.solution.findIndex(
        (word) => word.text.toLowerCase() === this.guess.toLowerCase()
      )
      if (i > -1 && !this.game.solution[i].solved) {
        this.game.solution[i].solved = true
        this.game.solution[i].solvedBy = this.username
        await gamesService.updateGame(this.game)
        this.$socket.emit('update solution', this.game.solution)
      }
      this.checkGameOver()
      this.guess = ''
    },

    checkGameOver() {
      if (!this.game.solution.some((word) => !word.solved)) {
        this.gameOver = true
      }
    },

    async restart() {
      this.gameOver = false
      await gamesService.removeGame(this.game.id)
      this.getGame()
    },

    async getGame() {
      this.game = await gamesService.getGame()
      if (!this.game) {
        this.createGame()
      }
    },

    async createGame() {
      const article = this.getRandom(this.getType('article'))
      const adjective = this.getRandom(this.getType('adjective'))
      const object = this.getRandom(this.getType('object'))
      const verb = this.getRandom(this.getType('verb'))
      const subject = this.getRandom(this.getType('subject'))
      const adverb = this.getRandom(this.getType('adverb'))

      const solution = [
        { ...article, solved: false },
        { ...adjective, solved: false },
        { ...object, solved: false },
        { ...verb, solved: false },
        { ...subject, solved: false },
        { ...adverb, solved: false },
      ]

      this.game = await gamesService.addGame(solution)
      this.$socket.emit('reset game', this.game)
    },

    getRandom(list) {
      return list[Math.floor(Math.random() * list.length)]
    },

    getType(type) {
      return this.words.filter((word) => word.type === type)
    },
  },
}
</script>
