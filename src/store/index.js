import {
  createStore
} from 'vuex'

export default createStore({
  state: {
    alert: null,
    // alertMsg: "",
    // alertStatus: "",
    postImage: null,
    commentImage: null,
    clickDelay: 1000
  },
  mutations: {
    setAlert(s, p) {
      s.alert = p;
    },
    // setAlertMsg(s, msg) {
    //   s.alertMsg = msg;
    // },
    // setAlertStatus(s, status) {
    //   s.alertStatus = status;
    // },
    alert(s, payload) {
      s.alert.alert(payload);
    },
    setPostImage(s, image) {
      s.postImage = image;
    },
    setCommentImage(s, image) {
      s.commentImage = image;
    }
  },
  actions: {},
  modules: {}
})