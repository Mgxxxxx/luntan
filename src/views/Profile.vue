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
                @click="togglePage(activePage - 1)"
              >
                <a class="page-link" href="javascript:;">Previous</a>
              </li>
              <li
                class="page-item"
                :class="{ active: i - 1 === activePage }"
                v-for="i in allPosts.length"
                :key="i"
                @click="togglePage(i - 1)"
              >
                <a class="page-link" href="javascript:;">{{ i }}</a>
              </li>
              <li
                class="page-item"
                :class="{ disabled: activePage === allPosts.length - 1 }"
                @click="togglePage(activePage + 1)"
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
import { defineComponent, ref, onBeforeUnmount } from "vue";
import Avatar from "@/components/Avatar.vue";
import store from "@/store";
import {
  getImg,
  allPostIdsByUid,
  uploadImg,
  selectUserById,
  deletePostById,
  selectPostById,
} from "@/service";
import _ from "lodash";

export default defineComponent({
  name: "Profile",
  components: { Avatar },
  async setup() {
    const userName = localStorage.getItem("u_nickname");
    const uid = localStorage.getItem("u_id");
    let postIds = [];
    const allPosts = ref([]);
    const activePage = ref(0);
    const headerImg = ref(null);
    let imgSrc = getImg(localStorage.getItem("img_id"));

    onBeforeUnmount(() => {
      window.URL.revokeObjectURL(imgSrc);
    });

    const upload = async (file, headerImgUrl) => {
      console.log(file);
      const data = new FormData();
      data.append("object", "user");
      data.append("object_id", Number.parseInt(localStorage.getItem("u_id")));
      data.append("image", file, file.name);
      try {
        let res = await uploadImg(data);
        res = await selectUserById(uid);
        // console.log(res);
        localStorage.setItem("img_id", res.img_id);
      } catch (err) {
        console.log(err);
      }
      headerImg.value.src = headerImgUrl;
    };

    const deletePost = async (id) => {
      let info = { msg: "", status: "alert-danger" };
      try {
        let res = await deletePostById(id);
        // console.log(res);
        if (res.state === 1) {
          info.msg = "删除成功";
          info.status = "alert-success";
          let index = allPosts.value[activePage.value].findIndex(
            (item) => item.id === id
          );
          allPosts.value[activePage.value].splice(index, 1);
          allPosts.value = _.chunk(_.flatten(allPosts.value), 10);
        } else {
          info.msg = "删除失败";
        }
        store.commit("alert", info);
      } catch (err) {
        console.warn(err);
      }
    };

    const togglePage = (page) => {
      if (page >= 0 && page < allPosts.value.length) {
        activePage.value = page;
      }
    };

    let numOfEndPost = 0;

    let res = await allPostIdsByUid(uid);
    postIds = res.postids === (undefined || null) ? [] : res.postids.reverse();
    // console.log(postIds);
    for (let i = 0; i < postIds.length; i++, numOfEndPost++) {
      let item = await selectPostById(postIds[i]);
      allPosts.value.push({ id: postIds[i], ...item });
    }
    allPosts.value = _.chunk(allPosts.value, 10);

    return {
      userName,
      activePage,
      imgSrc,
      allPosts,
      headerImg,
      deletePost,
      togglePage,
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
