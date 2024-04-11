<template>
  <div class="stats">
    <table class="scoreboard">
      <tr>
        <th>Rank</th>
        <th>User</th>
        <th>Score</th>
      </tr>
      <tr
        v-for="(user, index) in Object.entries(solvers).sort(
          (a, b) => b[1] - a[1]
        )"
        :key="index"
      >
        <td>{{ index + 1 }}.</td>
        <td>
          {{ user[0] }}
        </td>
        <td>{{ user[1] }}</td>
      </tr>
    </table>
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
      this.users.map((user) => {
        result[user] = 0
      })
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

  .scoreboard {
    width: 250px;
    margin: auto;

    th,
    td {
      text-align: left;

      &:nth-child(2) {
        text-align: center;
      }

      &:nth-child(3) {
        text-align: right;
      }
    }
  }
}
</style>
