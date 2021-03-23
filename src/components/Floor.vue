<template>
  <div class="clearfix floor">
    <div class="author float-left">
      <div class="poster-img">
        <img src="@/assets/4.jpg" alt="头像" />
      </div>
      <div class="poster">
        <a href="javascript:;">{{ commentContent.poster }}</a>
      </div>
    </div>
    <div class="content float-left text-left">
      <div class="content-body">
        {{ commentContent.comment_txt }}
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
import { defineComponent, ref, toRefs } from "vue";
import request from "@/service";
import moment from "moment";

export default defineComponent({
  name: "Floor",
  props: ["commentId"],
  async setup(props) {
    const { commentId } = toRefs(props);
    let commentContent = ref(null);

    try {
      let res = await request.get("/selectcommentonid", {
        params: { comment_id: Number.parseInt(commentId.value) },
      });
      commentContent = res.data;
      // console.log(commentContent);
      commentContent["time"] = moment(res.data.comment_time).format(
        "YYYY-MM-DD HH:mm"
      );
      res = await request.get("/selectuseronid", {
        params: { u_id: commentContent.u_id },
      });
      commentContent["poster"] = res.data.u_nickname;
    } catch (error) {
      console.log(error);
    }

    return {
      commentContent,
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
