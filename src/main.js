import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { applyTheme, getCurrentTheme } from './utils/theme'

applyTheme(getCurrentTheme())

const app = createApp(App)
app.use(router)
app.mount('#app')