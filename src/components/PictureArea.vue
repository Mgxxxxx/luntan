<template>
  <div class="card">
    <!-- <div class="card-body">This is some text within a card body.</div> -->
    <div class="card-body">
      <div class="card-title">
        <input type="file" @input="upload" id="image" style="width: 0" />
        <label for="image" class="btn btn-primary btn-sm">
          添加发送的图片
        </label>
      </div>
      <div
        v-if="imgSrc !== ''"
        class="img-container position-relative d-inline-block"
      >
        <img :src="imgSrc" class="img-thumbnail" alt="..." />
        <div type="button" class="close" @click="imgSrc = ''">
          <span>&times;</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { defineComponent, ref, toRefs } from "vue";
import store from "@/store";

export default defineComponent({
  name: "PictureArea",
  props: ["type"],
  setup(props) {
    const { type } = toRefs(props);
    let imgSrc = ref("");

    const upload = (e) => {
      console.log(e.target.files);
      if (e.target.files[0].size > 200 * 1024) {
        alert("you can not!");
        return;
      }
      imgSrc.value = window.URL.createObjectURL(e.target.files[0]);
      window.URL.revokeObjectURL(e.target.files[0]);
      let commitFn = "";
      switch (type.value) {
        case "post":
          commitFn = "setPostImage";
          break;
        case "comment":
          commitFn = "setCommentImage";
          break;
        default:
          break;
      }
      store.commit(commitFn, e.target.files[0]);
    };
    return {
      imgSrc,
      upload,
    };
  },
});
</script>

<style scoped lang="scss">
.img-thumbnail {
  height: 200px;
}
.close {
  position: absolute;
  top: -0.7rem;
  right: -0.4rem;
  // background-color: #e74c3c;
  // border-radius: 50%;
}
</style>
