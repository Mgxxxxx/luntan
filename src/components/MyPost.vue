<template>
  <div class="card no-border">
    <div class="card-body">
      <div class="d-flex flex-column align-items-start">
        <div class="w-100 clearfix">
          <a
            href="javascript:;"
            class="float-left h4"
            @click.prevent="
              router.push({ name: 'DetailPost', params: { id: postId } })
            "
            >{{ postContent.post_name }}</a
          >
          <span class="float-right text-secondary h5">{{
            postContent.poster
          }}</span>
        </div>
        <div class="clearfix w-100 text-small">
          <span
            v-text="postContent.post_txt"
            class="float-left text-cut"
          ></span>
          <span class="float-right text-secondary">{{ postContent.time }}</span>
        </div>
        <div v-if="postImage" class="post-img-container">
          <img :src="postImage" alt="PostImage" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, toRefs, ref } from "vue";
import { getImg, selectPostById, selectUserById } from "@/service.js";
import moment from "moment";
import { useRouter } from "vue-router";

export default defineComponent({
  name: "MyPost",
  props: ["postId"],
  async setup(props) {
    const router = useRouter();
    const { postId } = toRefs(props);
    let postContent = null;
    let postImage = "";

    try {
      let res = await selectPostById(postId.value);
      postContent = res;
      postContent["time"] = moment(res.post_time).format("YYYY-MM-DD HH:mm");
      postImage = postImage = getImg(postContent.img_id);
      res = await selectUserById(postContent.u_id);
      postContent["poster"] = res.u_nickname;
    } catch (error) {
      console.warn(error);
    }

    return {
      router,
      postContent,
      postImage,
    };
  },
});
</script>

<style scoped lang="scss">
.no-border {
  border-bottom: 1px solid rgba(0, 0, 0, 0.125);
  border-radius: 0;
}
.text-cut {
  width: 70%;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  text-align: left;
}
.text-small {
  font-size: 13px;
}
.post-img-container img {
  margin-top: 10px;
  height: 100px;
}
</style>
