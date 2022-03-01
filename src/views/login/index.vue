<template>
  <div class="login">
    <div class="login-container">
      <el-form ref="form" :model="loginData" class="login-form">
        <el-form-item
          prop="account"
          :rules="{ required: true, message: '用户名不能为空' }"
        >
          <el-input
            placeholder="用户名"
            v-model="loginData.account"
            prefix-icon="el-icon-user-solid"
          ></el-input>
        </el-form-item>
        <el-form-item
          prop="password"
          :rules="{ required: true, message: '请输入密码' }"
        >
          <el-input
            type="password"
            show-password
            placeholder="密码"
            v-model="loginData.password"
            prefix-icon="el-icon-lock"
            @keyup.enter.native="onSubmit"
          ></el-input>
          <!-- @keydown.native.enter="onSubmit" -->
        </el-form-item>
        <el-form-item>
          <el-button type="primary" style="width: 100%" @click="onSubmit"
            >登录</el-button
          >
        </el-form-item>
      </el-form>
    </div>
    <div class="popContainer" v-if="dialog">
      <div class="divbox">
        <div class="iconClose">
          <span>拖动滑块验证成功后登录</span>
          <i class="el-icon-close" @click="iconClose"></i>
        </div>
        <slide-verify
          :l="42"
          :r="10"
          :w="348"
          :h="270"
          @success="onSuccess"
          @fail="onFail"
          @refresh="onRefresh"
          :slider-text="text"
        ></slide-verify>
        <div class="message" v-show="this.msg != ''">{{ msg }}</div>
      </div>
    </div>
  </div>
</template>
<script>
import storage from "@/utils/storage";
import menu from "@/assets/menu.json";
import { login } from "@/api/login";
export default {
  inject: ["reload"], //刷新当前页面
  data() {
    return {
      loginData: {
        account: "",
        password: "",
      },
      msg: "",
      text: "向右滑动",
      dialog: false,
    };
  },
  methods: {
    onSubmit() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.dialog = true;
        }
      });
    },
    async login(data) {
      const res = await login(data);
      if (res && res.code === 200) {
        const { webRouter, ...user } = res.data;
        /**
         * 用后端接口返回的路由表时解注释
         */
        const menu = webRouter;
        if (webRouter.length === 0) {
          this.$message.warning("您的账号没有任何菜单权限，请联系管理员");
          return;
        }
        storage.setUserInfo(user);
        storage.setPowerTree(menu);
        let lastPath = menu[0].sub.length
          ? menu[0].sub[0].sub[0].url
          : menu[0].url;
        console.log(lastPath);
        // this.$router.push(lastPath);
        this.$router.push("/business/general/overallTrend");
      }
    },
    onSuccess() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.msg = "滑块验证成功";
          // this.onSubmit();
          this.login(this.loginData);
          this.dialog = false;
        } else {
          this.$message.error("请正确输入账号和密码");
          // this.reload(); //刷新当前页面
        }
      });
    },
    onFail() {
      this.msg = "滑块验证失败，请重新滑动";
    },
    onRefresh() {
      this.msg = "";
    },
    iconClose() {
      this.dialog = false;
    },
  },
};
</script>

<style scoped lang="scss">
.login {
  height: 100vh;
  width: 100%;
  background: url("~@/assets/images/login_bg.jpg") no-repeat 100%;
  background-size: 100%;
  opacity: 0.9;
}
.login-container {
  padding-top: 30vh;
  display: flex;
  justify-content: flex-end;
  margin-right: 15%;
}
.login-form {
  width: 300px;
  padding: 50px 50px 30px;
  border-radius: 20px; /* 圆角 */
  background: #fff;
}
.popContainer {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.3);
  .divbox {
    margin: 200px 40%;
    box-sizing: border-box;
    width: 350px;
    object-fit: contain;
    .iconClose {
      display: flex;
      justify-content: space-between;
      padding: 10px;
      box-sizing: border-box;
      background-color: #fff;
      width: 348px;
    }
    .message {
      background-color: #fff;
      width: 350px;
      color: #409eff;
      padding: 10px;
      box-sizing: border-box;
    }
  }
}
</style>
