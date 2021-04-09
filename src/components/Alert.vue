<template>
  <div
    class="alert alert-dismissible fade show w-50"
    :class="alertInfo.status"
    role="alert"
    ref="baseAlert"
  >
    {{ alertInfo.msg }}
  </div>
</template>
<script>
import { defineComponent, ref } from "vue";
import store from "@/store";
import anime from "animejs";
import _ from "lodash";

export default defineComponent({
  name: "Alert",
  setup() {
    let baseAlert = ref(null);
    let alertInfo = ref({
      msg: "no msg",
      status: "succuess",
    });

    const alert = (info) => {
      // console.log("alert start");
      alertInfo.value = info;
      anime({
        targets: baseAlert.value,
        translateY: 50,
        direction: "alternate",
        duration: 1000,
        endDelay: 200,
        easing: "easeInOutQuart",
      });
    };

    return {
      baseAlert,
      alert,
      store,
      alertInfo,
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
