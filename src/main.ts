import { createApp } from 'vue'
import router from './router'
import './style.css'
import App from './App.vue'
import { useAuth } from './composables/useAuth'

const initializeApp = async () => {
    const { checkUser } = useAuth()

    await checkUser()

    const app = createApp(App)
    app.use(router)
    app.mount('#app')
}

initializeApp()
