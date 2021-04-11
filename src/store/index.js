import {
  createStore
} from 'vuex'

export default createStore({
  state: {
    alert: null,
    postImage: null,
    commentImage: null,
    clickDelay: 1000
  },
  mutations: {
    setAlert(s, p) {
      s.alert = p;
    },
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