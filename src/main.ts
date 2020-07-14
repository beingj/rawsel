import Vue from 'vue';
import App from './App.vue';
import vuetify from './plugins/vuetify';

Vue.config.productionTip = false;

const myapp = new Vue({
    vuetify,
    render: (h) => h(App),
}).$mount('#app');

// console.log(myapp);
// https://stackoverflow.com/a/12709880
declare global {
    interface Window { myapp: any; }
}

window.myapp = myapp
// v-main: myapp.$children[0].$children[0].$children[1]
