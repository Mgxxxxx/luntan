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
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    };
    return {
      scrollToTop,
    };
  },
});
</script>

<style scoped lang="scss">
</style>
