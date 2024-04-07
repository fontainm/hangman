<template>
  <div>
    <p class="win">You Win!</p>
    <button @click="restart">Restart</button>
  </div>
</template>

<script>
export default {
  name: 'GameOver',

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
