<template>
  <loading v-if="isLoading && end" />
  <div v-if="!isLoading" class="card no-border">
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
import { request, getImg } from "@/service.js";
import moment from "moment";
import { useRouter } from "vue-router";

export default defineComponent({
  name: "MyPost",
  props: ["postId"],
  async setup(props, ctx) {
    const router = useRouter();
    const { postId } = toRefs(props);
    let postContent = null;
    let isLoading = ref(true);
    let postImage = "";

    try {
      let res1;
      let res = await request.get("/selectpostonid", {
        params: { post_id: Number.parseInt(postId.value) },
      });
      postContent = res.data;
      isLoading.value = false;
      postContent["time"] = moment(res.data.post_time).format(
        "YYYY-MM-DD HH:mm"
      );
      if (postContent.img_id) {
        [res, res1] = await Promise.allSettled([
          request.get("/selectuseronid", {
            params: { u_id: postContent.u_id },
          }),
          getImg(postContent.img_id),
        ]);
        console.log(res, res1);
        postContent["poster"] = res.value.data.u_nickname;
        if (res1.value && res1.value.data) {
          postImage = window.URL.createObjectURL(res1.value.data);
        }
      } else {
        res = await request.get("/selectuseronid", {
          params: { u_id: postContent.u_id },
        });
        postContent["poster"] = res.data.u_nickname;
      }
    } catch (error) {
      console.log(error);
    }

    return {
      router,
      postContent,
      isLoading,
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
