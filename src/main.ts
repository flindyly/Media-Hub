import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './index.css'
import './assets/main.css'
import VueCollapsiblePanel from '@dafcoe/vue-collapsible-panel';

const app = createApp(App)
app.use(router)
app.use(VueCollapsiblePanel)
app.mount('#app')
