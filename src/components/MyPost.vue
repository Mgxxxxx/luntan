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
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, toRefs, ref } from "vue";
import request from "@/service";
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
    let loadingEnd = ref(true);

    try {
      let res = await request.get("/selectpostonid", {
        params: { post_id: Number.parseInt(postId.value) },
      });
      postContent = res.data;
      isLoading.value = false;
      postContent["time"] = moment(res.data.post_time).format(
        "YYYY-MM-DD HH:mm"
      );
      res = await request.get("/selectuseronid", {
        params: { u_id: postContent.u_id },
      });
      postContent["poster"] = res.data.u_nickname;
    } catch (error) {
      console.log(error);
      loadingEnd.value = false;
    }

    return {
      router,
      postContent,
      isLoading,
      loadingEnd,
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
</style>
