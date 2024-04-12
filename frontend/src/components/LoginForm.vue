<template>
  <div>
    <h1>Enter Username</h1>
    <div class="wrapper login">
      <input
        type="text"
        v-model="username"
        @keyup.enter="submit"
        @keydown.space.prevent
      />
      <button
        type="submit"
        :class="{ disabled: usernameInvalid }"
        @click="submit"
      >
        Join
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'GameOver',

  props: {},

  data() {
    return {
      username: '',
    }
  },

  computed: {
    usernameInvalid() {
      return (
        this.username === '' ||
        this.username.includes(' ') ||
        this.username.length > 20
      )
    },
  },

  methods: {
    submit() {
      if (this.usernameInvalid) {
        return
      }
      this.$emit('join', this.username)
    },
  },
}
</script>
