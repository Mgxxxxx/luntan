import {
  createApp
} from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import "bootstrap"
import "bootstrap/dist/css/bootstrap.css"
import "./style/index.css"
import EventBus from "./utils/EventBus"
import Alert from "./components/Alert.vue"
import Loading from "./components/Loading.vue"

const bus = new EventBus();

const app = createApp(App).use(store).use(router);

app.provide("bus", bus);
app.config.globalProperties.bus = bus;

app.component("Alert", Alert);
app.component("Loading", Loading);

app.directive('focus', {
  updated(el, flag) {
    flag.value && el.focus();
  }
})

app.mount("#app");