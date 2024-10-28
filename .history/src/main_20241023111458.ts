import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import naive from 'naive-ui'
import VueGoogleMaps from '@fawmi/vue-google-maps';

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(naive)
app.use(VueGoogleMaps, {
  load: {
    key: 'YOUR_GOOGLE_MAPS_API_KEY',
  },
});

app.mount('#app')
