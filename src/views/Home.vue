<template>
  <alert ref="alert" />
  <nav class="navbar bg-light position-fixed">
    <span
      class="navbar-brand mb-0 h1"
      style="cursor: pointer"
      @click="router.push('/')"
      >巫妖岭论坛</span
    >
    <div class="dropdown dropleft">
      <button
        class="btn btn-info dropdown-toggle px-3"
        type="button"
        id="dropdownMenuButton"
        data-toggle="dropdown"
        aria-haspopup="true"
        aria-expanded="false"
        @click="dropdown"
      >
        {{ nickname }}
      </button>
      <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
        <button
          class="dropdown-item"
          type="button"
          @click="router.push({ name: 'Profile', params: { id: uid } })"
        >
          Profile
        </button>
        <button class="dropdown-item" type="button" @click="logout">
          Login out
        </button>
      </div>
    </div>
  </nav>
  <Suspense>
    <template #default>
      <router-view />
    </template>
    <template #fallback>
      <loading />
    </template>
  </Suspense>
</template>
<script>
// @ is an alias to /src
import { onMounted, reactive, ref, inject } from "vue";
import ReleasePost from "@/components/ReleasePost.vue";
import StaticFooter from "@/components/StaticFooter.vue";
import ScrollToTop from "@/components/ScrollToTop.vue";
import Alert from "@/components/Alert.vue";

import CookieUtils from "@/utils/CookieUtils";
import { useRouter } from "vue-router";

export default {
  name: "Home",
  components: {
    ReleasePost,
    StaticFooter,
    ScrollToTop,
    Alert,
  },
  setup() {
    const bus = inject("bus");
    const home = ref(null);
    const alert = ref(null);
    let nickname = ref(CookieUtils.get("u_nickname"));
    const uid = CookieUtils.get("u_id");
    const router = useRouter();

    onMounted(() => {
      if (!CookieUtils.get("u_id")) {
        router.push("/login");
        return;
      }
    });

    bus.on("alert", () => {
      // console.log("has listened alert");
      alert.value && alert.value.alert();
    });

    const dropdown = () => {
      $(".dropdown-toggle").dropdown();
    };

    const logout = () => {
      CookieUtils.unset("u_nickname");
      CookieUtils.unset("u_id");
      router.push("/login");
    };

    return reactive({
      home,
      alert,
      uid,
      nickname,
      dropdown,
      logout,
      router,
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
  z-index: 11;
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
