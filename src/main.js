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

watch(
  pinia.state,
  async (state) => {
    // persist the whole state to the local storage whenever it changes

    idb.deleteAllImages();
    if (state.main.images) {
      idb.saveImages(state.main.images);
    }

    if (state.main?.mode) {
      localStorage.setItem('mode', state.main.mode);
    }

    if (state.main?.index) {
      localStorage.setItem('index', state.main.index);
    }
  },
  { deep: true }
)

app.mount('#app')
