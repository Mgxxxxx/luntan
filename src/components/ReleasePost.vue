<template>
  <div class="form-group w-100 px-2 mx-auto py-2 clearfix">
    <input
      type="text"
      class="form-control mb-1"
      v-model="title"
      placeholder="Title"
      v-focus="isFocus"
      @blur="isFocus = false"
    />
    <!-- <rich-text-editor @updateContent="updateContent" ref="editor" /> -->
    <textarea class="form-control" rows="5" v-model="content"></textarea>
    <button
      type="button"
      class="btn btn-primary btn-sm float-right mt-2"
      @click="releasePost"
      :disabled="title === '' || !content"
    >
      send
    </button>
  </div>
</template>

<script>
import { defineComponent, ref, reactive, getCurrentInstance } from "vue";
import store from "@/store";
import { request, uploadImg } from "@/service.js";
// import RichTextEditor from "@/components/RichTextEditor.vue";

export default defineComponent({
  name: "HelloWorld",
  // components: { RichTextEditor },
  setup() {
    // const bus = inject("bus");

    const { parent } = getCurrentInstance();
    console.log(parent.ctx);

    const editor = ref(null);
    let title = ref("");
    let content = ref("");
    let isFocus = ref(false);

    let uid = Number.parseInt(localStorage.getItem("u_id"));

    const releasePost = () => {
      let id;
      let info = { msg: "", status: "alert-danger" };
      request
        .post(
          "/createpost",
          JSON.stringify({
            u_id: uid,
            post_name: title.value,
            post_txt: content.value,
            post_txthtml: content.value,
          })
        )
        .then((res) => {
          // console.log(res);
          let msg, status;
          switch (res.state) {
            case 1:
              msg = "发帖成功";
              status = "alert-success";
              id = res.post_id;
              title.value = "";
              content.value = "";
              break;
            default:
              msg = "发帖失败";
              status = "alert-danger";
          }
          info.msg = msg;
          info.status = status;
          // store.commit("setAlertMsg", msg);
          // store.commit("setAlertStatus", status);
          if (res.state === 1) {
            if (store.state.postImage) {
              const data = new FormData();
              data.append("object", "post");
              data.append("object_id", Number.parseInt(res.post_id));
              data.append("image", store.state.postImage);
              return uploadImg(data);
            } else {
              return Promise.resolve({ state: 1 });
            }
          } else {
            return Promise.reject("发帖失败");
          }
        })
        .then((res) => {
          // console.log(res);
          if (res.state === 1) {
            window.URL.revokeObjectURL(store.state.postImage);
            store.commit("setPostImage", null);
            // bus.emit("addPost", id);
            parent.ctx?.addPost(id);
            // console.log(store.state.alertStatus);
            store.commit("alert", info);
            // bus.emit("alert");
          } else return Promise.reject("帖子添加图片失败");
        })
        .catch((err) => {
          console.warn(err);
          info.msg = err;
          store.commit("alert", info);
          // store.commit("setAlertStatus", err);
          // bus.emit("alert");
        });
    };

    const updateContent = (contentHtml, contentText) => {
      // console.log(contentHtml);
      // console.log(contentText);
      content.value[0] = contentHtml;
      content.value[1] = contentText;
    };

    return reactive({
      editor,
      title,
      content,
      isFocus,
      releasePost,
      updateContent,
    });
  },
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
</style>
