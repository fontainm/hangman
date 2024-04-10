<template>
  <div>
    <p class="win">I think {{ winner }} won</p>
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
      // TODO: Get winner
      return this.solution[0].solvedBy
    },
  },

  methods: {
    restart() {
      this.$emit('restart')
    },
  },
}
</script>

<style>
.win {
  text-transform: uppercase;
  color: #0c6980;
  font-weight: bold;
  font-size: 3rem;
  margin: 0 0 1rem 0;
}
</style>
