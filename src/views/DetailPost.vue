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
          <img :src="imgSrc" alt="头像" />
        </div>
        <div class="poster">
          <a href="javascript:;">{{ postContent.poster }}</a>
        </div>
      </div>
      <div class="content float-left text-left">
        <div class="content-body">
          {{ postContent.post_txt }}
          <div v-if="postImage" class="post-img-container">
            <img :src="postImage" alt="PostImage" />
          </div>
        </div>
        <div class="content-footer">
          <span class="content-time mr-2">
            {{ postContent.time }}
          </span>
          <span class="content-reply">回复(0)</span>
        </div>
      </div>
    </div>
    <Suspense>
      <template #default>
        <div>
          <floor v-for="(id, i) in commentIds" :key="id + i" :commentId="id" />
        </div>
      </template>
      <template #fallback>
        <loading />
      </template>
    </Suspense>
    <div class="reply-box px-2 py-2 clearfix">
      <picture-area type="comment" ref="pictureArea" />
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
import { defineComponent, onMounted, ref, inject, onBeforeUnmount } from "vue";
import Floor from "@/components/Floor";
import PictureArea from "@/components/PictureArea";

import store from "@/store";

import { useRoute } from "vue-router";

import { request, getImg, uploadImg } from "@/service";
import moment from "moment";

export default defineComponent({
  name: "DetailPost",
  components: { Floor, PictureArea },
  async setup() {
    const bus = inject("bus");
    const route = useRoute();
    let postContent = ref(null);
    let replyContent = ref("");
    let isFocus = ref(false);
    let commentIds = ref([]);
    const pictureArea = ref(null);
    let imgSrc = "";
    let postImage = "";

    onMounted(() => {
      const height = $(".header")[0].offsetHeight;
      $("#headerWarpper").height(height);
      let navHeight = $(".navbar")[0].offsetHeight;
      document.querySelector("#detail").style.marginTop = navHeight + "px";
    });

    onBeforeUnmount(() => {
      localStorage.removeItem(postContent.u_id + "headimg");
      window.URL.revokeObjectURL(imgSrc);
      window.URL.revokeObjectURL(postImage);
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
      postContent["user_img_id"] = res.data.img_id;
      let res1, res2;
      [res, res1, res2] = await Promise.allSettled([
        request.get("/allcommentidonpostid", {
          params: { post_id: Number.parseInt(route.params.id) },
        }),
        getImg(postContent.user_img_id),
        postContent.img_id !== ""
          ? getImg(postContent.img_id)
          : Promise.resolve(),
      ]);
      if (res1?.value?.data === undefined) {
        console.warn("获取用户头像失败");
        imgSrc = "";
      } else if (res1.value?.data) {
        imgSrc = window.URL.createObjectURL(res1.value.data);
        localStorage.setItem(postContent.u_id + "headimg", imgSrc);
      }
      if (postContent.img_id !== "" && res2?.value?.data === undefined) {
        console.warn("获取帖子图片失败");
        postImage = "";
      } else if (res2.value?.data) {
        postImage = window.URL.createObjectURL(res2.value.data);
      }
      if (res.value.data.commentids !== null) {
        commentIds.value = res.value.data.commentids;
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
        let res = await request.post(
          "/createcomment",
          JSON.stringify({
            post_id: Number.parseInt(route.params.id),
            u_id: Number.parseInt(localStorage.getItem("u_id")),
            comment_txt: replyContent.value,
          })
        );
        let msg,
          status,
          commentId = -1;
        switch (res.data.state) {
          case 1:
            msg = "发帖成功";
            status = "alert-success";
            commentId = res.data.comment_id;
            replyContent.value = "";
            break;
          default:
            msg = "发帖失败";
            status = "alert-danger";
        }
        if (res.data.state === 1) {
          if (store.state.commentImage) {
            console.log("upload commentImage");
            const data = new FormData();
            data.append("object", "comment");
            data.append("object_id", Number.parseInt(commentId));
            data.append("image", store.state.commentImage);
            res = await uploadImg(data);
            if (res.data.state === 1) {
              window.URL.revokeObjectURL(store.state.commentImage);
              store.commit("setCommentImage", null);
              pictureArea.value.imgSrc = "";
            } else {
              msg = "发帖失败";
              status = "alert-danger";
            }
          }
        }
        commentId !== -1 && commentIds.value.push(commentId);
        store.commit("setAlertMsg", msg);
        store.commit("setAlertStatus", status);
        bus.emit("alert");
      } catch (err) {
        console.log(err);
        bus.emit("alert");
      }
    };

    return {
      isFocus,
      postContent,
      commentIds,
      replyContent,
      imgSrc,
      postImage,
      pictureArea,
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
