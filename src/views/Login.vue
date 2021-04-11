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
        @keyup.enter="_login"
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
import _ from "lodash";
import store from "@/store";
import { request } from "@/service";
import { useRouter } from "vue-router";

export default defineComponent({
  name: "Login",
  setup() {
    const { ctx } = getCurrentInstance();
    const router = useRouter();
    let account = ref(null);
    let passwd = ref("");
    let name = ref("");
    let mode = ref(true);
    const accInput = ref(null);
    const alert = ref(null);

    const _login = async () => {
      let info = { msg: "", status: "alert-danger" };
      try {
        let res = await request.get("/login", {
          params: {
            u_name: account.value,
            u_password: passwd.value,
          },
        });
        switch (res.state) {
          case 0:
            info.msg = "该账号未注册";
            break;
          case 1:
            info.msg = "登录成功";
            info.status = "alert-success";
            localStorage.setItem("u_id", res.u_id);
            localStorage.setItem("u_nickname", res.u_nickname);
            res = await request.get("/selectuseronid", {
              params: { u_id: Number.parseInt(localStorage.getItem("u_id")) },
            });
            localStorage.setItem("img_id", res.img_id);
            router.push("/");
            break;
          case 2:
            info.msg = "帐号或密码错误";
            break;
          default:
            info.msg = "其他问题";
        }
        alert.value.alert(info);
      } catch (err) {
        alert.value.alert(info);
      }
    };
    const _register = () => {
      let info = { msg: "", status: "alert-danger" };
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
          switch (res.state) {
            case 0:
              info.msg = "该账号已注册";
              // store.commit("setAlertMsg", "该账号已注册");
              // store.commit("setAlertStatus", "alert-warning");
              break;
            case 1:
              info.msg = "注册成功";
              info.status = "success";
              // store.commit("setAlertMsg", "注册成功");
              // store.commit("setAlertStatus", "alert-success");
              break;
            default:
              info.msg = "其他问题";
            // store.commit("setAlertMsg", "其他问题");
            // store.commit("setAlertStatus", "alert-danger");
          }
          alert.value.alert(info);
        });
    };
    const login = _.debounce(_login, store.state.clickDelay, {
      leading: true,
      trailing: false,
    });
    const register = _.debounce(_register, store.state.clickDelay, {
      leading: true,
      trailing: false,
    });
    const toggle = () => {
      accInput.value.focus();
      mode.value = !mode.value;
      account.value = "";
      passwd.value = "";
    };

    onMounted(() => {
      accInput.value.focus();
    });

    return {
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
    };
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
