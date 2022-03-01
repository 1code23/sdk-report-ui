<template>
  <el-container style="background: #edeff4">
    <!-- 顶部 -->
    <el-header>
      <div class="navbar">
        <div class="logoBox">
          <img
            class="logo"
            src="~@/assets/images/logo.png"
            height="40px"
            width="55px"
          />
        </div>
        <div class="navbar-nav navbar-center">
          <!-- <div class="navbar-center"> -->
          <ul>
            <li
              v-for="(item, index) in navbarList"
              :class="{ 'top-menu-active': index === activeIndex }"
              :key="index"
              @click="handleSelectMenu(index)"
              style="font-size: 16px; margin: 0 24px"
              v-show="item.show"
            >
              <i v-if="item.icon" :class="item.icon"></i>
              {{ item.name }}
            </li>
          </ul>
        </div>
        <div class="navbar-right">
          <ul>
            <span v-if="userInfo" style="margin-right: 15px">{{
              userInfo.roleName
            }}</span>
            <el-dropdown v-if="userInfo">
              <li style="color: white">
                {{ userInfo.name }}
                <i class="el-icon-arrow-down"></i>
              </li>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item @click.native="loginOut"
                  >退出登录</el-dropdown-item
                >
                <!-- <el-dropdown-item @click.native="dialogVisible = true"
                  >修改密码</el-dropdown-item
                > -->
              </el-dropdown-menu>
            </el-dropdown>
          </ul>
        </div>
      </div>
    </el-header>
    <!-- 侧边栏和主体 -->
    <el-container class="men">
      <el-aside width="168px"
        ><AsideMenu
          :menuList="asideMenuList"
          @changeAppInfo="changeAppInfo"
        ></AsideMenu
      ></el-aside>
      <el-main>
        <!-- <el-tabs
          closable
          v-if="historyMenuItemList.length !== 0"
          :value="activeMenuPath"
          type="border-card"
          :before-leave="handleBeforeLeave"
          @tab-click="handleClickTab"
          @tab-remove="handleRmoveTab"
          style="box-shadow: none"
        >
          <el-tab-pane
            v-for="item in historyMenuItemList"
            :key="item.path"
            :name="item.path"
            :label="item.meta.toolTip | tabPaneLabel"
            >{{ item.meta.toolTip }}</el-tab-pane
          >
        </el-tabs> -->
        <div class="router-view">
          <!-- <keep-alive
            > -->
          <router-view :key="$route.path"></router-view>
          <!-- </keep-alive> -->
        </div>
      </el-main>
    </el-container>
    <!-- 修改密码弹窗 -->
    <el-dialog
      center
      width="650px"
      title="修改密码"
      @closed="handleCancel"
      :visible.sync="dialogVisible"
    >
      <el-form
        :model="formData"
        :rules="rules"
        label-width="100px"
        ref="formRef"
        class="detail-form"
      >
        <el-form-item label="原密码" prop="oldPassword">
          <el-input
            show-password
            type="password"
            v-model="formData.oldPassword"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="newPassword">
          <el-input
            show-password
            type="password"
            v-model="formData.newPassword"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="confirmNewPassword">
          <el-input
            show-password
            type="password"
            v-model="formData.confirmNewPassword"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleChangePassword('formData')"
            >提交</el-button
          >
          <el-button @click="handleCancel()">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </el-container>
</template>
<script>
import request from "@/utils/request.js";
import storage from "@/utils/storage";
import AsideMenu from "./AsideMenu.vue";
import { mapGetters } from "vuex";
export default {
  components: { AsideMenu },
  data() {
    return {
      navbarList: [], //头部导航栏
      activeIndex: 0, // 当前激活的一级菜单index
      activeMenu: this.$route.path, // 正在访问的菜单路径
      dialogVisible: false, // 修改密码弹框显示与隐藏
      formData: {},
      rules: {
        oldPassword: [{ required: true, message: "请输入原密码" }],
        newPassword: [{ required: true, message: "请输入新密码" }],
        confirmNewPassword: [{ required: true, message: "请确认新密码" }],
      },
    };
  },

  created() {
    this.init();
    this.initPower();
    this.initNavbarList(true);
  },
  computed: {
    ...mapGetters(["appInfo"]),
    // 当前用户的所有菜单
    menuList() {
      return this.$store.state.menuList;
    },
    //当前用户访问过的菜单集
    historyMenuItemList() {
      return this.$store.state.historyMenuItemList;
    },
    // 正在访问的菜单路径
    activeMenuPath() {
      return this.$store.state.activeMenuPath;
    },
    // 当前用户信息
    userInfo() {
      return this.$store.state.userInfo;
    },
    // 左侧栏菜单
    asideMenuList() {
      return this.menuList[this.activeIndex].sub || [];
    },
  },

  filters: {
    tabPaneLabel(toolTip) {
      return toolTip.split(">").pop();
    },
  },
  methods: {
    //初始化头部导航栏,因为在切换不同的应用时需要改变头部导航栏
    initNavbarList(refresh) {
      let _this = this;
      this.$nextTick(() => {
        //根据 app_appid 展示对应的头部导航栏，因为上面有用到对应的 index 来调用 handleSelectMenu，所以这里未改变数组长度，而是添加了一个show属性来控制显示
        if (this.appInfo.app_appid == "all") {
          handleNavBarByProduct(true, "/product", "/product/appList");
        } else {
          handleNavBarByProduct(
            false,
            "/business",
            "/business/general/overallTrend"
          );
        }
      });
      // 处理头部栏对应是否展示 我的产品 目录信息
      function handleNavBarByProduct(isShow, path, toPath) {
        _this.navbarList = _this.menuList.map((m) => {
          if (m.url == "/product") {
            m.show = isShow;
            return m;
          } else {
            m.show = !isShow;
            return m;
          }
        });
        //如果页面刷新则保持当前页面，不做初始化时默认选中第一个的操作
        if (!refresh) {
          // 切换应用后，对应页面的跳转
          let index = _this.menuList.findIndex((m) => m.url === path);
          if (index > 0) {
            _this.$router.push(toPath);
            _this.handleSelectMenu(index);
          }
        }
      }
    },
    initPower() {
      let menuList = JSON.parse(JSON.stringify(this.$store.state.menuList));
      let path = this.$route.path;
      // 若该路由不属于菜单路由，则将取出它的菜单路由
      if (this.$route.meta && this.$route.meta.subPage) {
        path = this.$route.meta.propMenu;
      }
      let route;
      menuList.forEach((item) => {
        item.sub.forEach((itm) => {
          itm.sub.forEach((it) => {
            if (it.url == path) route = it;
          });
        });
      });
      let powerBtn =
        route && route.sub ? route.sub.map((item) => item.action) : [];
      this.$store.commit("changebtnPermissions", powerBtn);
    },
    // 事件监听
    // 选择一级菜单触发事件
    handleSelectMenu(index) {
      if (index === this.activeIndex) return; // 一级菜单未发生改变时不需要执行任何操作
      this.$store.commit("clearHistoryMenu"); // 清空历史菜单
      this.activeIndex = index;
      this.toFirstPath(); // 跳转至第一个路由
    },
    // 解决组件部署离开页面造成的误选中问题 --- swx
    handleBeforeLeave(path) {
      if (this.$route.path !== path) {
        return false;
      } else {
        return true;
      }
    },
    // 通过标签切换菜单
    handleClickTab(tab) {
      this.$router.push(tab.name);
    },
    // 删除标签
    handleRmoveTab(name) {
      const maxLength = this.historyMenuItemList.length;
      if (maxLength == 1) return; //仅剩一个 不让删
      const deleteIndex = this.historyMenuItemList.findIndex(
        (i) => i.path === name
      );
      //删除当前选中的tab
      if (name === this.activeMenuPath) {
        //若是子页面，则返回上级页面
        const deleteItem = this.historyMenuItemList[deleteIndex];
        if (deleteItem.meta && deleteItem.meta.subPage) {
          this.$router.go(-1);
        } else {
          //否则优先设置成下一个 如果下一个没有 设置为前一个
          let nextPathIndex = 0;
          if (deleteIndex < maxLength - 1) {
            nextPathIndex = deleteIndex + 1;
          } else {
            nextPathIndex = deleteIndex - 1;
          }
          this.$router.push(this.historyMenuItemList[nextPathIndex].path);
        }
      }
      this.$store.commit("deleteHistoryMenu", deleteIndex);
    },
    handleChangePassword() {
      this.$refs.formRef.validate((valid) => {
        if (valid) {
          const data = this.formData;
          if (data.newPassword !== data.confirmNewPassword) {
            this.$message.error("新密码和确认密码不一致");
          } else {
            this.changePassword({ ...data, id: this.userInfo.userId });
          }
        } else {
          this.$message.error("请检查输入的数据");
        }
      });
    },
    handleCancel() {
      this.dialogVisible = false;
      this.$refs.formRef.resetFields();
    },
    // 后端请求
    // 退出登录
    async loginOut() {
      // const res = await request("get", "/safe/logout", {
      //   token: this.userInfo.token,
      // });
      // if (res && res.code == 0) {
      storage.clearSession(); // 清除存储在localStorage里的信息
      this.$store.commit("clearHistoryMenu"); // 清空历史菜单
      if (this.$route.name == "login") return; // 当前已经是登陆页时不做跳转
      this.$router.push("login"); // 跳转登录页
      // }
    },
    async changePassword(data) {
      const res = await await request("post", "/safe/updatePassword", data);
      if (res && res.code === 0) {
        this.dialogVisible = false;
        this.$message.success("修改密码成功，请用新密码重新登录");
        this.loginOut();
      }
    },
    // 其他
    init() {
      //初始化菜单
      const menu = storage.getPowerTree();
      this.$store.commit("initMenuList", menu);
      this.initActiveIndex();
      // 保存历史菜单
      this.$store.dispatch("pushHistoryMenu", {
        path: this.$route.path,
        meta: this.$route.meta || {},
      });
      // 保存当前激活的路径
      this.$store.commit("changeActiveMenuPath", this.$route.path);
      //获取登录后的用户信息，并保存到store里
      this.$store.commit("setUserInfo", storage.getUserInfo());
      // this.toFirstPath(); // 跳转至第一个路由
    },
    initActiveIndex() {
      let path = this.$route.path;
      // 判断子页面是否存在 parentMenu 父级菜单，用于解决页面刷新菜单丢失问题
      if (this.$route.meta && this.$route.meta.parentMenu) {
        path = this.$route.meta.parentMenu;
      }
      let index = this.menuList.findIndex((item) => {
        return item.sub.find((itm) => {
          return itm.sub.find((it) => it.url == path);
        });
      });
      if (index < 0) index = 0;
      this.activeIndex = index;
    },
    // 跳转至左侧菜单的第一个路由
    toFirstPath() {
      let path = "/"; // 跳转的路径
      if (this.asideMenuList.length !== 0) {
        const sub1MenuObj = this.asideMenuList[0];
        if (sub1MenuObj.sub && sub1MenuObj.sub.length !== 0) {
          path = sub1MenuObj.sub[0].url;
        } else {
          path = sub1MenuObj.url || "/";
        }
      }
      this.$nextTick(function () {
        this.$router.push(path);
      });
    },
    changeAppInfo() {
      this.initNavbarList();
    },
  },
  watch: {
    $route: function (to) {
      this.initPower();
      // 路由改变时激活菜单
      this.$store.commit("changeActiveMenuPath", to.path);
      this.$store.dispatch("pushHistoryMenu", {
        path: to.path,
        meta: to.meta || {},
      });
      //解决页面跳转时，头部导航栏的选中以及左侧菜单栏的变化
      this.activeIndex = this.menuList.findIndex(
        (m) => to.path.indexOf(m.url) > -1
      );
    },
  },
};
</script>
<style lang="scss" scope>
$menuWidth: 77vw;
.el-container {
  height: 100%;
  overflow: hidden;
}
.el-header {
  background-color: #131f3e;
  color: #fff;
  line-height: 60px;
  height: 60px !important;
  display: flex;
  justify-content: center;
}
.el-menu {
  border-right: 0;
  user-select: none;
}
.el-aside {
  height: calc(100vh - 50px);
  padding-left: calc((100% - 75vw) / 2);
  box-sizing: content-box;
  overflow-x: hidden;
  // background-color: #eee;
}

.el-main {
  // background-color: #edeff4;
  // padding-top: 20px;
  padding: 0 20px;
  padding-right: calc((100% - 75vw) / 2);
  &::-webkit-scrollbar {
    width: 0px !important; //y轴滚轮的宽
  }
}

.navbar {
  width: 85%;
  display: flex;
  justify-content: center;
  // position: relative;
  // z-index: 99;
  // width: $menuWidth;
  // margin: 0 auto;
  .logoBox {
    width: 20%;
    display: flex;
    justify-content: center;
  }
  .logo {
    display: inline-block;
    margin-top: 9px;
    margin-right: 95px;
    margin-left: 5px;
    padding: 0 18px;
    // width: 30%;
  }
  .navbar-right {
    // right: 0px;
    width: 30%;
    // position: absolute;
    // top: 0;
    height: 56px;
    line-height: 56px;
    display: flex;
    justify-content: flex-end;
  }
}
.navbar-nav {
  ul {
    display: flex;
    flex-direction: row;
    font-size: 16px;
    li {
      color: #fff;
      height: 56px;
      // padding: 0px 20px;
      margin: 0 20px;
      line-height: 56px;
      font-size: 16px;
      cursor: pointer;
      box-sizing: border-box;
    }
    li:active,
    .top-menu-active {
      color: #fff;
      border-bottom: 2px solid #409eff;
    }
  }
}
.navbar-center {
  margin: 0 auto;
  // width: 40%;
}
.router-view {
  min-width: 1012px;
  width: 100%;
  // width: 1212px;
}
.men {
  width: 100%;
  margin: 0 auto;
  // background: #eee;
}
</style>
