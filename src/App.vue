<template>
  <div id="app">
    <div>You are: {{ username }}</div>
    <div class="solution">
      <div
        v-for="(word, index) in solution"
        :key="index"
        class="word"
        :class="{ solved: word.solved }"
      >
        <span>{{ word.text }}</span>
        <span v-if="word.solved" class="username">{{ word.solvedBy }}</span>
      </div>
    </div>
    <Stats :solution="solution" />
    <GameOver v-if="gameOver" @restart="restart" class="wrapper" />
    <div v-else class="wrapper">
      <input type="text" v-model="guess" @keyup.enter="submit" />
      <button type="submit" @click="submit">Guess</button>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

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
      solution: [],
      guess: '',
      username: '',
      gameOver: false,
    }
  },

  async mounted() {
    const response = await axios.get('http://localhost:3001/words')
    this.words = response.data
    this.createUsername()
    this.createSolution()
  },

  methods: {
    submit() {
      const i = this.solution.findIndex(
        (word) => word.text.toLowerCase() === this.guess.toLowerCase()
      )
      if (i > -1) {
        this.solution[i].solved = true
        this.solution[i].solvedBy = this.username
      }
      if (!this.solution.some((word) => !word.solved)) {
        this.gameOver = true
      }
      this.guess = ''
    },

    restart() {
      this.gameOver = false
      this.createSolution()
    },

    createSolution() {
      const article = this.getRandom(this.words.articles)
      const adjective = this.getRandom(this.words.adjectives)
      const object = this.getRandom(this.words.objects)
      const verb = this.getRandom(this.words.verbs)
      const subject = this.getRandom(this.words.subjects)
      const adverb = this.getRandom(this.words.adverbs)

      this.solution = [
        { text: article, solved: false },
        { text: adjective, solved: false },
        { text: object, solved: false },
        { text: verb, solved: false },
        { text: subject, solved: false },
        { text: adverb, solved: false },
      ]
    },

    createUsername() {
      const adjective = this.getRandom(this.words.adjectives)
      const object = this.getRandom(this.words.objects)
      this.username = `${adjective}_${object}`
    },

    getRandom(list) {
      return list[Math.floor(Math.random() * list.length)]
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
