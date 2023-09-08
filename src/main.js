import './assets/main.css'

import { createApp, watch } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import idb from './services/idb'

const app = createApp(App)

const pinia = createPinia();

app.use(pinia)
app.use(router)

app.mount('#app')
