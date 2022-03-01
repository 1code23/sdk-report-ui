<template>
  <div id="app" @click="clicked">
    <router-view v-if="isRouterAlive" />
  </div>
</template>
<script>
import storage from "@/utils/storage";
import { TIMEOUT } from "@/utils/constant.js";
export default {
  provide() {
    return {
      reload: this.reload, //刷新当前页面
    };
  },
  data() {
    return {
      isRouterAlive: true, //刷新当前页面
    };
  },
  mounted() {
    //设置超时退出
    window.setInterval(this.tTime, 30000); // 设置定时器
  },
  methods: {
    clicked() {
      storage.setLastTime(new Date().getTime()); //当界面被点击更新点击时间
    },
    tTime() {
      const currentTime = new Date().getTime(); //当前时间
      const lastTime = storage.getLastTime(); //最后一次点击的时间
      if (currentTime - lastTime > TIMEOUT) {
        // 超时
        if (storage.isLogin()) {
          // 退出登录
          this.loginOut();
        }
      }
    },
    // 退出登录
    async loginOut() {
      let token = "";
      const userInfo = storage.getUserInfo();
      if (userInfo) {
        token = userInfo.token || "";
      }
      // const res = await request("get", "/safe/logout", { token });
      // if (res && res.code == 200) {
      storage.clearSession(); // 清除存储在localStorage里的信息
      this.$store.commit("clearHistoryMenu"); // 清空历史菜单
      if (this.$route.name == "login") return; // 当前已经是登陆页时不做跳转
      this.$router.push("login"); // 跳转登录页
      // }
    },
    reload() {
      //刷新当前页面(需要刷新的页面注入inject: ["reload"],调用该方法)
      this.isRouterAlive = false;
      this.$nextTick(function () {
        this.isRouterAlive = true;
      });
    },
  },
};
</script>

<style lang="scss"></style>
