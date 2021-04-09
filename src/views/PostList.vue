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
              <div class="h4 mb-0">Forum吧</div>
              <div>国内最大的Forum交流讨论社区之一</div>
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
      <template #default>
        <div>
          <!-- <my-post v-for="id in postIds[activePage]" :key="id" :postId="id" /> -->
          <my-post v-for="id in activePageIds" :key="id" :postId="id" />
        </div>
      </template>
      <template #fallback>
        <loading />
      </template>
    </Suspense>
    <nav>
      <ul class="pagination justify-content-center mt-2">
        <li
          class="page-item"
          :class="{ disabled: activePage === 0 }"
          @click="togglePage(activePage - 1)"
        >
          <a class="page-link" href="javascript:;" tabindex="-1">Previous</a>
        </li>
        <li
          class="page-item"
          :class="{ active: i === activePage + 1 }"
          v-for="i in postIds.length"
          :key="i + i * activePage"
          @click="togglePage(i - 1)"
        >
          <a class="page-link" href="javascript:;">{{ i }}</a>
        </li>
        <li
          class="page-item"
          :class="{ disabled: activePage === postIds.length - 1 }"
          @click="togglePage(activePage + 1)"
        >
          <a class="page-link" href="javascript:;">Next</a>
        </li>
      </ul>
    </nav>
    <picture-area type="post" ref="pictureArea" />
    <release-post ref="releasePost" />
    <static-footer class="mt-5 text-center" />
  </div>
  <scroll-to-top class="to-top" />
</template>

<script>
// @ is an alias to /src
import { onMounted, reactive, ref, nextTick } from "vue";
import ReleasePost from "@/components/ReleasePost.vue";
import MyPost from "@/components/MyPost.vue";
import StaticFooter from "@/components/StaticFooter.vue";
import ScrollToTop from "@/components/ScrollToTop.vue";
import PictureArea from "@/components/PictureArea.vue";

import { request } from "@/service";

import _ from "lodash";

export default {
  name: "Home",
  components: {
    ReleasePost,
    MyPost,
    StaticFooter,
    ScrollToTop,
    PictureArea,
  },
  async setup() {
    // const bus = inject("bus");
    const home = ref(null);
    let isFocus = ref(true);
    const releasePost = ref(null);
    let postIds = ref([]);
    let activePage = ref(0);
    // const updating = ref(false);
    const pictureArea = ref(null);
    const activePageIds = ref([]);

    const addPost = (id) => {
      // updating.value = true;
      console.log("tinajia tiezi");
      postIds.value = _.flatten(postIds.value);
      postIds.value.unshift(id);
      postIds.value = _.chunk(postIds.value, 10);
      activePageIds.value = postIds.value[0];
      if (pictureArea.value) pictureArea.value.imgSrc = "";
      // nextTick(() => (updating.value = false));
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
      // console.log(id);
    };

    onMounted(() => {
      let navHeight = $(".navbar")[0].offsetHeight;
      home.value.style.marginTop = navHeight + "px";
    });

    try {
      let res = await request.get("/allpostid");
      // console.log(res);
      for (let i = res.postids.length - 1; i >= 0; i--) {
        postIds.value.push(res.postids[i]);
      }
      postIds.value = _.chunk(postIds.value, 10);
      activePageIds.value = postIds.value[0];
    } catch (err) {
      console.log(err);
    }

    let flag = true;
    const togglePage = (page) => {
      if (page >= 0 && page < postIds.value.length) {
        if (flag) {
          activePageIds.value = postIds.value[page].reverse();
        }
        activePage.value = page;
        nextTick(() => {
          window.scrollTo({
            top: 0,
          });
        });
      }
    };

    const toRelease = () => {
      releasePost.value.isFocus = true;
      releasePost.value.$el.scrollIntoView({
        block: "end",
        behavior: "smooth",
      });
    };

    return reactive({
      postIds,
      activePage,
      home,
      isFocus,
      // updating,
      pictureArea,
      releasePost,
      toRelease,
      togglePage,
      activePageIds,
      addPost,
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
