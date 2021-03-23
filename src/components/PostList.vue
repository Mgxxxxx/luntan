<template>
  <Suspense>
    <template #default>
      <my-post v-for="id in curPageIds" :key="id" :postId="id" />
    </template>
    <template #fallback>
      <loading />
    </template>
  </Suspense>
</template>

<script>
import { defineComponent, ref, reactive, inject } from "vue";
import MyPost from "./MyPost.vue";

import request from "@/service";

export default defineComponent({
  name: "PostList",
  components: { MyPost },
  async setup() {
    const bus = inject("bus");

    let postIds = ref([]);
    let curPageIds = ref([]);

    bus.on("addPost", (id) => {
      curPageIds.value.push(id);
      // console.log(id);
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

    return reactive({
      postIds,
      curPageIds,
    });
  },
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
</style>
