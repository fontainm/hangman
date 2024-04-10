import Vue from 'vue'
import App from './App.vue'
import './styles/index.scss'
import VueSocketIO from 'vue-socket.io'
import SocketIO from 'socket.io-client'

Vue.config.productionTip = false

const socketUrl =
  process.env.NODE_ENV === 'production' ? undefined : 'http://localhost:3003'
const socketConnection = SocketIO(socketUrl)

Vue.use(
  new VueSocketIO({
    debug: true,
    connection: socketConnection,
  })
)

new Vue({
  render: (h) => h(App),
}).$mount('#app')
