<template>
  <div @click="scrollToTop">
    <i class="iconfont icon-arrow-up"></i>
  </div>
</template>
<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "ScrollToTop",
  setup() {
    const scrollToTop = () => {
      window.scrollTo(0, 0);
    };
    return {
      scrollToTop,
    };
  },
});
</script>

<style scoped lang="scss">
</style>
