import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

// Check that service workers are supported
if ('serviceWorker' in navigator) {
    // Use the window load event to keep the page load performant
    window.addEventListener('load', () => {
        navigator.serviceWorker.register(import.meta.env.VITE_SW_PATH);
    });
}
const app = createApp(App)

const pinia = createPinia();

app.use(pinia)
app.use(router)

app.mount('#app')
