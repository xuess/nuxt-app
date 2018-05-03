import Vue from 'vue'


const components = {  }

Object.keys(components).forEach(key => {
  Vue.component(key, components[key])
})
