<template>
  <div class="text-center my-2">
    <div class="spinner-border text-info" role="status">
      <span class="sr-only">Loading...</span>
    </div>
  </div>
</template>
<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "Loading",
  setup() {
    return {};
  },
});
</script>

<style scoped lang="scss">
</style>
