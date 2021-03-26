import {
  createStore
} from 'vuex'

export default createStore({
  state: {
    alertMsg: "",
    alertStatus: "",
    postImage: null,
    commentImage: null
  },
  mutations: {
    setAlertMsg(s, msg) {
      s.alertMsg = msg;
    },
    setAlertStatus(s, status) {
      s.alertStatus = status;
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