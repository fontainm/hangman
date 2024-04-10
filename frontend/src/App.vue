<template>
  <div id="app">
    <div v-if="game">
      <div>You are: {{ username }}</div>
      <div class="solution">
        <div
          v-for="(word, index) in game.solution"
          :key="index"
          class="word"
          :class="{ solved: word.solved }"
        >
          <span>{{ word.text }}</span>
          <span v-if="word.solved" class="username">{{ word.solvedBy }}</span>
        </div>
      </div>
      <Stats :solution="game.solution" />
      <GameOver v-if="gameOver" @restart="restart" class="wrapper" />
      <div v-else class="wrapper">
        <input type="text" v-model="guess" @keyup.enter="submit" />
        <button type="submit" @click="submit">Guess</button>
      </div>
    </div>
    <div v-else>Loading</div>
  </div>
</template>

<script>
import wordsService from './services/words'
import gamesService from './services/games'

import GameOver from './components/GameOver'
import Stats from './components/Stats'

export default {
  name: 'App',

  components: {
    GameOver,
    Stats,
  },

  data() {
    return {
      words: [],
      game: null,
      guess: '',
      username: '',
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
  },

  async mounted() {
    this.words = await wordsService.getAll()
    this.username = window.localStorage.getItem('hangmanuser')
    if (!this.username) {
      this.createUsername()
    }
    this.game = await gamesService.getGame()
    if (!this.game) {
      this.createGame()
    }
  },

  methods: {
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
      this.createGame()
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

    createUsername() {
      const adjective = this.getRandom(this.getType('adjective'))
      const object = this.getRandom(this.getType('object'))
      this.username = `${adjective.text}_${object.text}`
      window.localStorage.setItem('hangmanuser', this.username)
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

<style type="scss">
.solution {
  font-size: 3rem;
  margin: 2rem 0;
  display: flex;
  justify-content: center;
  flex-wrap: wrap;

  div.word {
    padding: 1rem;
    margin: 0.25rem;
    line-height: 1;
    background: #a4bbc0;
    border-radius: 0.5rem;
    transform: rotateY(180deg);
    transition: all 0.5s ease;
    cursor: pointer;

    span {
      color: #0c6980;

      &.username {
        position: absolute;
        font-size: 0.7rem;
        background: #222;
        color: #c4dbe0;
        top: -1.7rem;
        right: 0.5rem;
        padding: 0.5rem;
        border-radius: 0.5rem 0.5rem 0 0;
      }
    }

    &.solved {
      transform: rotateY(0);
      background: #c4dbe0;
      box-shadow: 2px 2px 8px #444;
    }
  }
}

.wrapper {
  display: flex;
  justify-content: center;
  flex-direction: column;
  background: #c4dbe0;
  width: 100%;
  margin: auto;
  border-radius: 0.5rem;
  padding: 1rem;
  box-shadow: 2px 2px 8px #444;

  input {
    text-transform: uppercase;
    font-size: 2rem;
    margin-bottom: 1rem;
    text-align: center;
    color: #0c6980;
  }

  button {
    display: block;
    text-transform: uppercase;
    font-size: 2rem;
    cursor: pointer;
    background-color: #0c6980;
  }

  input,
  button {
    border: 0 !important;
    outline: none !important;
    padding: 1rem;
    border-radius: 0.5rem;
  }
}

@media screen and (max-width: 767px) {
  .solution {
    font-size: 1.75rem;
  }

  .wrapper {
    button,
    input {
      font-size: 1.75rem;
      padding: 0.75rem;
    }
  }
}
</style>
