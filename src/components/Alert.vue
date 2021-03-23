<template>
  <div
    class="alert alert-dismissible fade show w-50"
    :class="[store.state.alertStatus]"
    role="alert"
    ref="baseAlert"
  >
    {{ store.state.alertMsg }}
  </div>
</template>
<script>
import { defineComponent, ref, getCurrentInstance } from "vue";
import store from "@/store";
import anime from "animejs";
import _ from "lodash";

export default defineComponent({
  name: "Alert",
  setup() {
    const { ctx } = getCurrentInstance();
    let baseAlert = ref(null);

    const alert = _.throttle(
      () => {
        // console.log("alert start");
        anime({
          targets: baseAlert.value,
          translateY: 50,
          direction: "alternate",
          duration: 1000,
          endDelay: 200,
          easing: "easeInOutQuart",
        });
      },
      2400,
      { trailing: false }
    );

    return {
      ctx,
      baseAlert,
      alert,
      store,
    };
  },
});
</script>

<style lang="scss">
.alert {
  position: fixed !important;
  top: -50px;
  left: 25%;
  right: 25%;
  z-index: 999;
}
</style>
