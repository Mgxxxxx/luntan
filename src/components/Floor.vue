<template>
  <div class="clearfix floor">
    <div class="author float-left">
      <div class="poster-img">
        <img :src="imgSrc" alt="头像" />
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
        <span class="content-time">
          {{ commentContent.time }}
        </span>
        <span class="content-reply">回复(0)</span>
        <span
          class="content-reply"
          v-if="canDel"
          @click="delComment(commentId, parent)"
          >删除</span
        >
      </div>
    </div>
  </div>
</template>
<script>
import { defineComponent, getCurrentInstance, ref, toRefs } from "vue";
import { selectCommentById, selectUserById } from "@/service.js";
import { delComment } from "./Floor/index.js";
import moment from "moment";

export default defineComponent({
  name: "Floor",
  props: ["commentId"],
  async setup(props) {
    const { parent } = getCurrentInstance();
    const { commentId } = toRefs(props);
    let commentContent = ref(null);
    let imgSrc = "";
    let commentImage = "";
    let canDel;

    try {
      let res = await selectCommentById(commentId.value);
      commentContent = res;
      if (commentContent.img_id !== "") {
        commentImage = `/api/getimg/${commentContent.img_id}`;
      }
      canDel =
        Number.parseInt(localStorage.getItem("u_id")) === commentContent.u_id;
      commentContent["time"] = moment(res.comment_time).format(
        "YYYY-MM-DD HH:mm"
      );
      res = await selectUserById(commentContent.u_id);
      commentContent["poster"] = res.u_nickname ?? "老色皮";
      imgSrc = `/api/getimg/${res.img_id}`;
    } catch (error) {
      console.warn(error);
    }

    return {
      commentContent,
      imgSrc,
      canDel,
      parent,
      commentImage,
      delComment,
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
        margin-left: 5px;
      }
    }
  }
}
</style>
