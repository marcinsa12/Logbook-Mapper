import { createApp } from 'vue'
import { createPinia } from 'pinia'

import 'vuetify/styles'
import "@mdi/font/css/materialdesignicons.css";
import "@fortawesome/fontawesome-free/css/all.css";

import { createVuetify } from 'vuetify'
import { VDataTable } from 'vuetify/labs/VDataTable'

import App from './App.vue'
import router from './router'
import * as mapHelpers from '@/helpers/map'

import './assets/main.css'

const app = createApp(App)

app.mixin({
    methods: {...mapHelpers}
})

app.use(createPinia())
app.use(router)
app.use(createVuetify({
    components: { VDataTable },
    theme: {
        defaultTheme: 'dark'
    }
}))

app.mount('#app')
