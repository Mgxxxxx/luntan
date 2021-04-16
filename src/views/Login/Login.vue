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
import { defineComponent, ref, getCurrentInstance, onMounted } from "vue";
import _ from "lodash";
import store from "@/store";
import { login as baseLogin, selectUserById } from "@/service";
import { useRouter } from "vue-router";

export default defineComponent({
  name: "Login",
  setup() {
    const { ctx } = getCurrentInstance();
    const router = useRouter();
    let account = ref(null);
    let passwd = ref("");
    let name = ref("");
    let mode = ref(true); //当前页面的模式：true->登录、false->注册
    const accInput = ref(null); //帐号框元素
    const alert = ref(null); //警告弹窗组件

    //登录功能
    const _login = async () => {
      let info = { msg: "", status: "alert-danger" };
      try {
        let res = await baseLogin(account.value, passwd.value);
        // console.log(res);
        switch (
          res.state //根据返回的状态设置警告弹窗的信息
        ) {
          case 0:
            info.msg = "该账号未注册";
            break;
          case 1:
            info.msg = "登录成功";
            info.status = "alert-success";
            //在localStorage中保存用户的信息
            localStorage.setItem("u_id", res.u_id);
            localStorage.setItem("u_nickname", res.u_nickname);
            //登录成功后获取用户的信息
            res = await selectUserById(localStorage.getItem("u_id"));
            localStorage.setItem("img_id", res.img_id);
            //登录成功后跳转到首页
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
    //注册功能
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
          //根据返回的状态设置警告弹窗的信息
          switch (res.state) {
            case 0:
              info.msg = "该账号已注册";
              break;
            case 1:
              info.msg = "注册成功";
              info.status = "alert-success";
              break;
            default:
              info.msg = "其他问题";
            // store.commit("setAlertMsg", "其他问题");
            // store.commit("setAlertStatus", "alert-danger");
          }
          alert.value.alert(info);
        });
    };
    //对login和register进行防抖处理
    const login = _.debounce(_login, store.state.clickDelay, {
      leading: true,
      trailing: false,
    });
    const register = _.debounce(_register, store.state.clickDelay, {
      leading: true,
      trailing: false,
    });

    const toggle = () => {
      //登录页面和注册页面切换
      accInput.value.focus(); //自动聚焦到帐号框
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
