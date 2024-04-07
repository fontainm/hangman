<template>
  <div class="stats">
    <div class="score">{{ solved }} / {{ solution.length }} revealed</div>
    <!-- TODO: Add Scoreboard -->
  </div>
</template>

<script>
export default {
  name: 'Stats',

  props: {
    solution: {
      required: true,
    },
  },

  computed: {
    solved() {
      return this.solution.filter((word) => word.solved).length
    },
  },
}
</script>

<style>
.stats {
  margin-bottom: 2rem;
}
</style>
