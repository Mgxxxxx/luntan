<template>
  <div class="clearfix floor">
    <div class="author float-left">
      <div class="poster-img">
        <img :src="imgSrc" alt="头像" />
        <!-- <img src="@/assets/4.jpg" alt="头像" /> -->
      </div>
      <div class="poster">
        <a href="javascript:;">{{ commentContent.poster }}</a>
      </div>
    </div>
    <div class="content float-left text-left">
      <div class="content-body">
        {{ commentContent.comment_txt }}
        <div v-if="commentImage" class="post-img-container">
          <img :src="commentImage" alt="CommentImage" />
        </div>
      </div>
      <div class="content-footer">
        <span class="content-time mr-2">
          {{ commentContent.time }}
        </span>
        <span class="content-reply">回复(0)</span>
      </div>
    </div>
  </div>
</template>
<script>
import { defineComponent, onBeforeUnmount, ref, toRefs } from "vue";
import { request, getImg } from "@/service.js";
import moment from "moment";

export default defineComponent({
  name: "Floor",
  props: ["commentId"],
  async setup(props) {
    const { commentId } = toRefs(props);
    let commentContent = ref(null);
    let imgSrc = "";
    let commentImage = "";
    onBeforeUnmount(() => {
      imgSrc !== "" && window.URL.revokeObjectURL(imgSrc);
      commentImage !== "" && window.URL.revokeObjectURL(commentImage);
      localStorage.removeItem(commentContent.u_id + "headimg");
      console.log("leave floor");
    });

    try {
      let res = await request.get("/selectcommentonid", {
        params: { comment_id: Number.parseInt(commentId.value) },
      });
      commentContent = res.data;
      commentContent["time"] = moment(res.data.comment_time).format(
        "YYYY-MM-DD HH:mm"
      );
      imgSrc = localStorage.getItem(commentContent.u_id + "headimg") ?? "";
      let res1;
      [res, res1] = await Promise.allSettled([
        request.get("/selectuseronid", {
          params: { u_id: commentContent.u_id },
        }),
        getImg(commentContent.img_id),
      ]);
      if (res1.value?.data) {
        commentImage = window.URL.createObjectURL(res1.value.data);
      }
      commentContent["poster"] = res.value?.data?.u_nickname ?? "老色皮";
      if (imgSrc === "") {
        let commenterId = res.value.data.u_id;
        res = await getImg(res.value.data.img_id);
        if (res.data) {
          imgSrc = window.URL.createObjectURL(res.data);
          localStorage.setItem(commenterId + "headimg", imgSrc);
        } else imgSrc = "";
      }
    } catch (error) {
      console.log(error);
    }

    return {
      commentContent,
      imgSrc,
      commentImage,
    };
  },
});
</script>

<style scoped lang="scss">
.floor {
  border: 1px solid#ececec;
  .author {
    width: 180px;
    background-color: #fbfbfd;
    padding: 15px 0;
    text-align: center;
    .poster-img {
      display: inline-block;
      width: 100px;
      height: 100px;
      // margin: 0 auto;
      overflow: hidden;
      border: 2px solid #ccc;
      padding: 2px;
      img {
        width: 100%;
      }
    }
  }
  .content {
    width: calc(100% - 180px);
    min-height: 220px;
    padding: 20px 10px 10px 0;
    position: relative;
    .post-img-container img {
      margin-top: 10px;
      height: 100px;
    }
    .content-footer {
      position: absolute;
      bottom: 10px;
      right: 10px;
      font-size: 12px;
      .content-time {
        color: #b2bec3;
      }
      .content-reply {
        color: #0984e3;
        cursor: pointer;
      }
    }
  }
}
</style>
