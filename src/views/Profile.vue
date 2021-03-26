<template>
  <div class="card mb-3 mx-auto" style="max-width: 982px; margin-top: 56px">
    <div class="row no-gutters">
      <div class="col-md-4 pt-2 text-center" style="background-color: #e9f2fc">
        <div class="user">
          <img ref="headerImg" :src="imgSrc" alt="userimg" />
        </div>
        <div class="user-name text-center h5">{{ userName }}</div>
        <avatar @upload="upload" />
      </div>
      <div class="col-md-8">
        <div>
          <div class="card-header">我的帖子</div>
          <ul class="list-group list-group-flush" style="min-height: 490px">
            <li
              class="list-group-item"
              v-for="post in allPosts[activePage]"
              :key="post.id"
              style="height: 49px"
            >
              {{
                post.post_name.length > 20
                  ? post.post_name.slice(0, 20) + "..."
                  : post.post_name
              }}
              <button type="button" class="close" @click="deletePost(post.id)">
                <span>&times;</span>
              </button>
            </li>
          </ul>
          <nav>
            <ul class="pagination justify-content-center pt-3">
              <li
                class="page-item"
                :class="{ disabled: activePage === 0 }"
                @click="tooglePage(activePage - 1)"
              >
                <a class="page-link" href="javascript:;">Previous</a>
              </li>
              <li
                class="page-item"
                :class="{ active: i - 1 === activePage }"
                v-for="i in allPosts.length"
                :key="i"
                @click="tooglePage(i - 1)"
              >
                <a class="page-link" href="javascript:;">{{ i }}</a>
              </li>
              <li
                class="page-item"
                :class="{ disabled: activePage === allPosts.length - 1 }"
                @click="tooglePage(activePage + 1)"
              >
                <a class="page-link" href="javascript:;">Next</a>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { defineComponent, inject, ref, onUnmounted } from "vue";
import Avatar from "@/components/Avatar.vue";
import CookieUtils from "@/utils/CookieUtils.js";
import store from "@/store";
import { request } from "@/service";
import _ from "lodash";

export default defineComponent({
  name: "Profile",
  components: { Avatar },
  async setup() {
    const bus = inject("bus");
    // const userName = CookieUtils.get("u_nickname");
    const userName = localStorage.getItem("u_nickname");
    // const uid = CookieUtils.get("u_id");
    const uid = localStorage.getItem("u_id");
    let postIds = [];
    const allPosts = ref([]);
    const activePage = ref(0);
    const customFile = ref(null);
    const headerImg = ref(null);
    let imgSrc = "";

    onUnmounted(() => {
      window.URL.revokeObjectURL(imgSrc);
    });

    const getPostId = () =>
      request.get("/selectpostidbyuid", {
        params: { u_id: Number.parseInt(uid) },
      });

    const upload = async (file, headerImgUrl) => {
      console.log(file);
      const data = new FormData();
      data.append("object", "user");
      // data.append("object_id", Number.parseInt(CookieUtils.get("u_id")));
      data.append("object_id", Number.parseInt(localStorage.getItem("u_id")));
      data.append("image", file, file.name);
      try {
        let res = await request.post("/uploadimg", data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        res = await request.get("/selectuseronid", {
          // params: { u_id: Number.parseInt(CookieUtils.get("u_id")) },
          params: { u_id: Number.parseInt(localStorage.getItem("u_id")) },
        });
        console.log(res);
        // CookieUtils.set("img_id", res.data.img_id, 24 * 60 * 60 * 100, "/");
        localStorage.setItem("img_id", res.data.img_id);
      } catch (err) {
        console.log(err);
      }
      headerImg.value.src = headerImgUrl;
    };

    const deletePost = async (id) => {
      try {
        res = await request.post(
          "/deletepostonid",
          JSON.stringify({
            post_id: Number.parseInt(id),
          })
        );
        console.log(res);
        if (res.data.state === 1) {
          store.commit("setAlertMsg", "删除成功");
          store.commit("setAlertStatus", "alert-success");
          console.log(typeof id);
          let index = allPosts.value[activePage.value].findIndex(
            (item) => item.id === id
          );
          allPosts.value[activePage.value].splice(index, 1);
          allPosts.value = _.chunk(_.flatten(allPosts.value), 10);
        } else {
          store.commit("setAlertMsg", "删除失败");
          store.commit("setAlertStatus", "alert-danger");
        }
        bus.emit("alert");
      } catch (err) {
        console.log(err);
      }
    };

    const getUserHeadImg = async () => {
      return request({
        url: "/getimg",
        method: "get",
        // params: { img_id: CookieUtils.get("img_id") },
        params: { img_id: localStorage.getItem("img_id") },
        responseType: "blob",
      });
    };

    const tooglePage = (page) => {
      if (page >= 0 && page < allPosts.value.length) {
        activePage.value = page;
      }
    };

    let numOfEndPost = 0;

    let [res1, res2] = await Promise.allSettled([
      getPostId(),
      getUserHeadImg(),
    ]);
    console.log(res1, res2);
    imgSrc = window.URL.createObjectURL(res2.value.data);
    postIds = res1.value.data.postids.reverse();
    // console.log(postIds.length);
    for (let i = 0; i < postIds.length; i++, numOfEndPost++) {
      let item = await request.get("selectpostonid", {
        params: { post_id: Number.parseInt(postIds[i]) },
      });
      allPosts.value.push({ id: postIds[i], ...item.data });
    }
    allPosts.value = _.chunk(allPosts.value, 10);

    return {
      userName,
      postIds,
      activePage,
      imgSrc,
      allPosts,
      customFile,
      headerImg,
      deletePost,
      tooglePage,
      upload,
    };
  },
});
</script>

<style scoped lang="scss">
.user {
  width: 200px;
  height: 200px;
  border: 2px solid #ccc;
  border-radius: 2px;
  margin: 0 auto;
  overflow: hidden;
  img {
    width: 100%;
  }
}
</style>
