import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { IonicVue } from '@ionic/vue'

import '@ionic/vue/css/core.css'
import '@ionic/vue/css/normalize.css'
import '@ionic/vue/css/structure.css'
import '@ionic/vue/css/typography.css'
import '@ionic/vue/css/padding.css'
import '@ionic/vue/css/flex-utils.css'
import '@ionic/vue/css/display.css'

import App from './App.vue'
import router from './app/router'
import './design/styles/main.css'

const app = createApp(App)

app.use(createPinia())
app.use(IonicVue)
app.use(router)

app.mount('#app')
