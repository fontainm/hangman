<template>
  <div class="stats">
    <div
      v-for="(user, index) in Object.entries(solvers).sort(
        (a, b) => b[1] - a[1]
      )"
      :key="index"
      class="scoreboard"
    >
      <div>
        {{ user[0] }}
      </div>
      <div>{{ user[1] }}</div>
    </div>

    <div class="score">
      {{ solvedWords.length }} / {{ solution.length }} solved
    </div>
  </div>
</template>

<script>
export default {
  name: 'Stats',

  props: {
    solution: {
      required: true,
    },
    users: {
      required: true,
    },
  },

  computed: {
    solvedWords() {
      return this.solution.filter((word) => word.solved)
    },

    solvers() {
      let result = []
      this.solvedWords.map((word) => {
        result[word.solvedBy] = result[word.solvedBy]
          ? result[word.solvedBy] + 1
          : 1
      })
      return result
    },
  },
}
</script>

<style lang="scss">
.stats {
  margin-bottom: 2rem;

  .score {
    margin-top: 2rem;
  }

  .scoreboard {
    display: flex;
    justify-content: space-between;
    max-width: 200px;
    margin: auto;
  }
}
</style>
