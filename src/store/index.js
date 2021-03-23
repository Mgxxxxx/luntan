import {
  createStore
} from 'vuex'

export default createStore({
  state: {
    alertMsg: "",
    alertStatus: "",
  },
  mutations: {
    setAlertMsg(s, msg) {
      s.alertMsg = msg;
    },
    setAlertStatus(s, status) {
      s.alertStatus = status;
    }
  },
  actions: {},
  modules: {}
})