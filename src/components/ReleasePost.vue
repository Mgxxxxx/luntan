<template>
  <div class="form-group w-100 px-2 mx-auto py-2 clearfix">
    <!-- <textarea class="form-control" rows="5" v-model="content"></textarea> -->
    <input
      type="text"
      class="form-control mb-1"
      v-model="title"
      placeholder="Title"
      v-focus="isFocus"
      @blur="isFocus = false"
    />
    <rich-text-editor @updateContent="updateContent" ref="editor" />
    <button
      type="button"
      class="btn btn-primary btn-sm float-right mt-2"
      @click="releasePost"
      :disabled="title === '' || !content[0]"
    >
      send
    </button>
  </div>
</template>

<script>
import { defineComponent, ref, reactive } from "vue";
import store from "@/store";
import request from "@/service";
import CookieUtils from "@/utils/CookieUtils";
import RichTextEditor from "@/components/RichTextEditor.vue";
import { inject } from "vue";

export default defineComponent({
  name: "HelloWorld",
  components: { RichTextEditor },
  setup() {
    const bus = inject("bus");

    const editor = ref(null);
    let title = ref("");
    let content = ref([]);
    let isFocus = ref(false);

    let uid = Number.parseInt(CookieUtils.get("u_id"));

    const releasePost = () => {
      if (title.value.includes("莫广贤")) {
        alert("???");
        return;
      }
      if (content.value.includes("莫广贤")) {
        alert("????");
        return;
      }
      request
        .post(
          "/createpost",
          JSON.stringify({
            u_id: uid,
            post_name: title.value,
            post_txt: content.value[1],
            post_txthtml: content.value[0],
          })
        )
        .then((res) => {
          // console.log(res);
          let msg, status;
          switch (res.data.state) {
            case 1:
              msg = "发帖成功";
              status = "alert-success";
              bus.emit("addPost", res.data.post_id);
              title.value = "";
              // console.log(editor.value.content);
              editor.value.content = "";
              break;
            case 2:
              msg = "发帖人有问题";
              status = "alert-danger";
              break;
            default:
              msg = "发帖失败";
              status = "alert-danger";
          }

          store.commit("setAlertMsg", msg);
          store.commit("setAlertStatus", status);
          bus.emit("alert");
        })
        .catch((err) => {
          console.log(err);
          store.commit("setAlertStatus", "发帖失败");
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
