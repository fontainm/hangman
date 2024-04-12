<template>
  <div>
    <p class="win">{{ winner }} won</p>
    <button @click="restart">Restart</button>
  </div>
</template>

<script>
export default {
  name: 'GameOver',

  props: {
    solution: {
      required: true,
    },
  },

  computed: {
    winner() {
      let result = []
      this.solution.map((word) => {
        result[word.solvedBy] = result[word.solvedBy]
          ? result[word.solvedBy] + 1
          : 1
      })
      let winner = Object.entries(result).sort((a, b) => b[1] - a[1])
      return winner[0][0]
    },
  },

  methods: {
    restart() {
      this.$emit('restart')
    },
  },
}
</script>
