<template>
  <div class="w-50 mx-auto form" style="margin-top: 80px">
    <div class="form-group">
      <input
        type="text"
        class="form-control"
        placeholder="Account"
        v-model="account"
        ref="accInput"
      />
    </div>
    <div class="form-group">
      <input
        type="password"
        class="form-control"
        placeholder="Password"
        v-model="passwd"
        @keyup.enter="login"
      />
    </div>
    <div class="form-group" v-show="!mode">
      <input
        type="text"
        class="form-control"
        placeholder="name"
        v-model="name"
      />
    </div>
    <button class="btn btn-primary btn-sm float-right ml-2" @click="toggle">
      Toggle
    </button>
    <button
      v-if="!mode"
      type="button"
      class="btn btn-primary btn-sm float-right"
      @click="register"
      :disabled="account === '' || passwd === '' || name === ''"
    >
      Sign up
    </button>
    <button
      v-else
      type="button"
      class="btn btn-primary btn-sm float-right"
      @click="login"
      :disabled="account === '' || passwd === ''"
    >
      Login on
    </button>
  </div>
  <alert ref="alert" />
</template>

<script>
import {
  defineComponent,
  ref,
  reactive,
  getCurrentInstance,
  onMounted,
} from "vue";
import store from "@/store";
import { request } from "@/service";
import CookieUtils from "@/utils/CookieUtils.js";
import { useRouter } from "vue-router";

export default defineComponent({
  name: "Login",
  async setup() {
    const { ctx } = getCurrentInstance();
    const router = useRouter();
    let account = ref(null);
    let passwd = ref("");
    let name = ref("");
    let mode = ref(true);
    const accInput = ref(null);
    const alert = ref(null);

    const login = async () => {
      // console.log(account.value, passwd.value);
      try {
        let res = await request.get("/login", {
          params: {
            u_name: account.value,
            u_password: passwd.value,
          },
        });
        // console.log(res);
        switch (res.data.state) {
          case 0:
            store.commit("setAlertMsg", "该账号未注册");
            store.commit("setAlertStatus", "alert-warning");
            break;
          case 1:
            store.commit("setAlertMsg", "登录成功");
            store.commit("setAlertStatus", "alert-success");
            // CookieUtils.set("u_id", res.data.u_id);
            // CookieUtils.set("u_nickname", res.data.u_nickname);
            localStorage.setItem("u_id", res.data.u_id);
            localStorage.setItem("u_nickname", res.data.u_nickname);
            console.log(localStorage.getItem("u_id"));
            res = await request.get("/selectuseronid", {
              // params: { u_id: Number.parseInt(CookieUtils.get("u_id")) },
              params: { u_id: Number.parseInt(localStorage.getItem("u_id")) },
            });
            // CookieUtils.set(
            //   "img_id",
            //   res.data.img_id,
            //   24 * 60 * 60 * 1000,
            //   "/"
            // );
            localStorage.setItem("img_id", res.data.img_id);
            router.push("/");
            break;
          case 2:
            store.commit("setAlertMsg", "帐号或密码错误");
            store.commit("setAlertStatus", "alert-danger");
            break;
          default:
            store.commit("setAlertMsg", "其他问题");
            store.commit("setAlertStatus", "alert-danger");
        }
        alert.value.alert();
      } catch (err) {
        alert.value.alert();
      }
    };
    const register = () => {
      request
        .post(
          "/register",
          JSON.stringify({
            u_name: account.value,
            u_password: passwd.value,
            u_nickname: name.value,
          })
        )
        .then((res) => {
          console.log(res);
          switch (res.data.state) {
            case 0:
              store.commit("setAlertMsg", "该账号已注册");
              store.commit("setAlertStatus", "alert-warning");
              break;
            case 1:
              store.commit("setAlertMsg", "注册成功");
              store.commit("setAlertStatus", "alert-success");
              break;
            default:
              store.commit("setAlertMsg", "其他问题");
              store.commit("setAlertStatus", "alert-danger");
          }
        });
      alert.value.alert();
    };
    const toggle = () => {
      accInput.value.focus();
      mode.value = !mode.value;
      account.value = "";
      passwd.value = "";
    };

    onMounted(() => {
      accInput.value.focus();
    });

    return reactive({
      ctx,
      account,
      passwd,
      name,
      accInput,
      mode,
      login,
      register,
      toggle,
      alert,
    });
  },
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.alert {
  top: -50px;
  left: 25%;
  right: 25%;
}
</style>
