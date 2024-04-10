import Vue from 'vue'
import App from './App.vue'
import './styles/index.scss'
import VueSocketIO from 'vue-socket.io'
import SocketIO from 'socket.io-client'

Vue.config.productionTip = false

/* Establish Connection */
const socketConnection = SocketIO('http://localhost:3003')

Vue.use(
  new VueSocketIO({
    debug: true,
    connection: socketConnection,
  })
)

new Vue({
  render: (h) => h(App),
}).$mount('#app')
