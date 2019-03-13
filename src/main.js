// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import axios from 'axios';
import BootstrapVue from 'bootstrap-vue';
import { FormCheckbox, Tooltip } from 'bootstrap-vue/es/components';
import Raven from 'raven-js';
import RavenVue from 'raven-js/plugins/vue';
import Vue from 'vue';
import VueAxios from 'vue-axios';
import VueCookie from 'vue-cookie';
import Toast from 'vue-easy-toast/dist/vue-easy-toast-lite.min';
import ToggleButton from 'vue-js-toggle-button';
import App from './App.vue';
import router from './router';
import { store } from './store';
import { baseURL, newApiProperty } from './services/urlConfig';
import { configWithCredentials } from './services/auth';

Vue.mixin({
  data() {
    return {
      get configWithCredentials() {
        return configWithCredentials();
      },
    };
  },
});

axios.defaults.baseURL = baseURL;
axios.defaults.withCredentials = true;

Vue.mixin({
  data() {
    return {
      get newApiProperty() {
        return newApiProperty;
      },
    };
  },
});

Vue.use(ToggleButton);
Vue.use(VueAxios, axios);
Vue.use(Toast);
Vue.use(VueCookie);
Vue.use(BootstrapVue);
Vue.use(FormCheckbox);
Vue.use(Tooltip);
Vue.config.productionTip = false;

Raven
  .config('https://77faaa2fdf004548878e4d594d84579b@sentry.teeko.io/11')
  .addPlugin(RavenVue, Vue)
  .install();
/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  template: '<App/>',
  components: { App },
});
