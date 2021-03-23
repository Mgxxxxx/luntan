<template>
  <div
    style="width: 982px; background-color: white"
    class="mx-auto"
    id="detail"
  >
    <div id="headerWarpper" class="position-relative">
      <header class="header px-1 py-2 d-flex justify-content-between">
        <div class="title">
          {{ postContent.post_name }}
        </div>
        <div
          class="reply btn btn-outline-secondary btn-sm py-0"
          @click="toReply"
        >
          回复
        </div>
      </header>
    </div>
    <div class="clearfix floor">
      <div class="author float-left">
        <div class="poster-img">
          <img src="@/assets/3.jpg" alt="头像" />
        </div>
        <div class="poster">
          <a href="javascript:;">{{ postContent.poster }}</a>
        </div>
      </div>
      <div class="content float-left text-left">
        <div class="content-body">
          {{ postContent.post_txt }}
        </div>
        <div class="content-footer">
          <span class="content-time mr-2">
            {{ postContent.time }}
          </span>
          <span class="content-reply">回复(0)</span>
        </div>
      </div>
    </div>
    <floor v-for="(id, i) in commentIds" :key="id + i" :commentId="id" />
    <div class="reply-box px-2 py-2 clearfix">
      <div class="form-group">
        <textarea
          v-model="replyContent"
          class="form-control"
          rows="6"
          v-focus="isFocus"
          @blur="isFocus = false"
        ></textarea>
      </div>
      <button
        type="button"
        class="btn btn-primary btn-sm px-3 float-right"
        @click="releaseReply"
        :disabled="replyContent === ''"
      >
        发表
      </button>
    </div>
  </div>
</template>

<script>
import { defineComponent, onMounted, ref, inject } from "vue";
import Floor from "@/components/Floor";

import store from "@/store";

import { useRoute } from "vue-router";

import CookieUtils from "@/utils/CookieUtils.js";
import request from "@/service";
import moment from "moment";

export default defineComponent({
  name: "DetailPost",
  components: { Floor },
  async setup() {
    const bus = inject("bus");
    const route = useRoute();
    let postContent = ref(null);
    let replyContent = ref("");
    let isFocus = ref(false);
    let commentIds = ref([]);

    onMounted(() => {
      const height = $(".header")[0].offsetHeight;
      $("#headerWarpper").height(height);
      let navHeight = $(".navbar")[0].offsetHeight;
      document.querySelector("#detail").style.marginTop = navHeight + "px";
    });

    try {
      let res = await request.get("/selectpostonid", {
        params: { post_id: route.params.id },
      });
      postContent = res.data;
      postContent["time"] = moment(res.data.post_time).format(
        "YYYY-MM-DD HH:mm"
      );
      res = await request.get("/selectuseronid", {
        params: { u_id: postContent.u_id },
      });
      postContent["poster"] = res.data.u_nickname;
      // console.log(postContent);
      res = await request.get("/allcommentidonpostid", {
        params: { post_id: Number.parseInt(route.params.id) },
      });
      // console.log(res);
      if (res.data.commentids !== null) {
        commentIds.value = res.data.commentids;
      }
    } catch (error) {
      console.log(error);
    }

    const toReply = () => {
      isFocus.value = true;
      document.querySelector(".reply-box").scrollIntoView(false);
    };

    const releaseReply = async () => {
      if (replyContent.value.includes("莫广贤")) {
        window.alert("?????");
        return;
      }
      try {
        const res = await request.post(
          "/createcomment",
          JSON.stringify({
            post_id: Number.parseInt(route.params.id),
            u_id: Number.parseInt(CookieUtils.get("u_id")),
            comment_txt: replyContent.value,
          })
        );
        let msg, status;
        switch (res.data.state) {
          case 1:
            msg = "发帖成功";
            status = "alert-success";
            commentIds.value.push(res.data.comment_id);
            replyContent.value = "";
            break;
          case 2:
            msg = "发帖人有问题";
            status = "alert-danger";
            break;
          case 3:
            msg = "帖子id有问题";
            status = "alert-danger";
            break;
          default:
            msg = "发帖失败";
            status = "alert-danger";
        }
        store.commit("setAlertMsg", msg);
        store.commit("setAlertStatus", status);
        bus.emit("alert");
      } catch (err) {
        console.log(err);
      }
    };

    return {
      isFocus,
      postContent,
      commentIds,
      replyContent,
      toReply,
      releaseReply,
    };
  },
});
</script>

<style scoped lang="scss">
.header {
  width: 982px;
  position: fixed;
  top: 56px;
  z-index: 1;
  background-color: white;
  border-bottom: 1px solid #afacac;
  .btn {
    font-size: 13px;
  }
}
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
