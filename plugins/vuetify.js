import Vue from 'vue'
import Vuetify from 'vuetify'
import colors from 'vuetify/es5/util/colors'
import '@fortawesome/fontawesome-free/css/all.css'

Vue.use(Vuetify, {
  theme: {
    primary: '#475F77',
    secondary: '#DCDDD8',
    accent: '#82B1FF',
    error: '#D74B4B',
    info: '#2196F3',
    success: '#4CAF50',
    warning: '#FFC107'
  },
  iconfont:'fa'
})
