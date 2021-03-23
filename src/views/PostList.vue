<template>
  <div class="home container p-0" ref="home">
    <div class="card head">
      <div class="card-body p-0">
        <!-- <img src="@/assets/6.jpg" class="img-fluid" alt="background" /> -->
        <div class="img-fluid"></div>
        <div class="wrap">
          <div class="logo">
            <img src="@/assets/2.jpg" class="img-thumbnail" alt="510logo" />
          </div>
          <div
            class="wrap-right d-flex align-items-center justify-content-between"
          >
            <div class="d-flex flex-column align-items-start">
              <div class="h4 mb-0">510吧</div>
              <div>国内最大的510宿舍交流讨论社区之一</div>
            </div>
            <div>
              <button class="btn btn-primary px-4" @click="toRelease">
                发帖
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <Suspense>
      <template #default v-if="!updating">
        <my-post v-for="id in curPageIds" :key="id" :postId="id" />
      </template>
      <template #fallback>
        <loading />
      </template>
    </Suspense>
    <release-post ref="releasePost" />
    <static-footer class="mt-5 text-center" />
  </div>
  <scroll-to-top class="to-top" />
</template>

<script>
// @ is an alias to /src
import { onMounted, reactive, ref, inject, nextTick } from "vue";
import ReleasePost from "@/components/ReleasePost.vue";
import MyPost from "@/components/MyPost.vue";
import StaticFooter from "@/components/StaticFooter.vue";
import ScrollToTop from "@/components/ScrollToTop.vue";

import request from "@/service.js";

export default {
  name: "Home",
  components: {
    ReleasePost,
    MyPost,
    StaticFooter,
    ScrollToTop,
  },
  async setup() {
    const bus = inject("bus");
    const home = ref(null);
    let isFocus = ref(true);
    const releasePost = ref(null);
    let postIds = ref([]);
    let curPageIds = ref([]);
    const updating = ref(false);

    bus.on("addPost", (id) => {
      updating.value = true;
      curPageIds.value.unshift(id);
      nextTick(() => (updating.value = false));
      console.log(id);
    });

    onMounted(() => {
      let navHeight = $(".navbar")[0].offsetHeight;
      home.value.style.marginTop = navHeight + "px";
    });

    try {
      let res = await request.get("/allselectpostid");
      // console.log(res);
      for (let i = res.data.postids.length - 1; i >= 0; i--) {
        postIds.value.push(res.data.postids[i]);
      }
      curPageIds.value = postIds.value.slice(0, 10);
    } catch (err) {
      console.log(err);
    }

    const toRelease = () => {
      // console.log(releasePost.value.$el);
      // console.log(releasePost.value);
      releasePost.value.isFocus = true;
      releasePost.value.$el.scrollIntoView(false);
    };

    return reactive({
      postIds,
      curPageIds,
      home,
      isFocus,
      updating,
      releasePost,
      toRelease,
    });
  },
};
</script>

<style scoped lang="scss">
.home {
  background-color: #fff;
  min-width: 982px;
  .head {
    .img-fluid {
      width: 100%;
      min-width: 982px;
      min-height: 200px;
      background: url(~@/assets/6.jpg) no-repeat 0% 20%;
      background-size: cover;
    }
    // border-radius: 0;
    border: none;
  }
  .wrap {
    background-color: #f4f6f9;
    border-bottom: 1px solid #e9ebf0;
    .logo {
      position: absolute;
      bottom: -5px;
      margin: 20px;
      img {
        width: 150px;
      }
    }
    .wrap-right {
      padding-left: 200px;
      height: 74px;
      .btn {
        margin-right: 20px;
      }
    }
  }
}
.position-fixed {
  z-index: 1;
  left: 0;
  right: 0;
  top: 0;
}
.to-top {
  position: fixed;
  bottom: 5px;
  right: 5px;
}
</style>
