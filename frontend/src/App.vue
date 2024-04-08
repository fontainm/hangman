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

  async mounted() {
    this.words = await wordsService.getAll()
    this.createUsername()
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
      if (i > -1) {
        this.game.solution[i].solved = true
        this.game.solution[i].solvedBy = this.username
        await gamesService.updateGame(this.game)
      }
      if (!this.game.solution.some((word) => !word.solved)) {
        this.gameOver = true
      }
      this.guess = ''
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
    },

    createUsername() {
      const adjective = this.getRandom(this.getType('adjective'))
      const object = this.getRandom(this.getType('object'))
      this.username = `${adjective.text}_${object.text}`
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
    border-bottom: 3px solid #c4dbe0;
    line-height: 1;
    background: #c4dbe0;
    border-radius: 0.5rem;
    transform: rotateY(180deg);
    transition: all 0.5s ease;
    box-shadow: 2px 2px 8px #444;
    cursor: pointer;

    span {
      color: #0c6980;
    }

    &.solved {
      transform: rotateY(0);
    }
  }

  .username {
    position: absolute;
    font-size: 0.7rem;
    background: #222;
    color: white;
    top: -1.7rem;
    right: 0.5rem;
    padding: 0.5rem;
    border-radius: 0.5rem 0.5rem 0 0;
  }
}

.wrapper {
  display: flex;
  justify-content: center;
  flex-direction: column;
  background: #c4dbe0;
  width: 100%;
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
</style>
