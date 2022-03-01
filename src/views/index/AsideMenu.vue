<template>
  <div id="sidebar">
    <el-select
      style="margin: 20px 0"
      v-model="selectAppId"
      placeholder="请选择"
      @change="handleAppInfo"
      size="mini"
    >
      <el-option
        v-for="item in appList"
        :key="item.app_appid"
        :label="item.app_name"
        :value="item.app_appid"
      >
      </el-option>
    </el-select>
    <el-menu
      router
      unique-opened
      background-color="#edeff4"
      :default-active="activeMenuPath"
    >
      <el-submenu
        v-for="submenu in menuList"
        :key="submenu.name"
        :index="submenu.name"
        :default-active="activeMenuPath"
      >
        <template slot="title">
          <span :class="submenu.icon" style="margin-right: 10px"></span
          ><span>{{ submenu.name }}</span>
        </template>
        <template v-if="submenu.sub">
          <!-- activeMenuPath.indexOf(item.url) > -1 暂时根据路径判断是否属于子菜单页面 -->
          <el-menu-item
            v-for="item in submenu.sub"
            :key="item.url"
            :index="item.url"
            :route="item.url"
            :class="{
              active:
                activeMenuPath == item.url ||
                activeMenuPath.indexOf(item.url) > -1,
            }"
            style="margin-left: 8px"
          >
            {{ item.name }}
          </el-menu-item>
        </template>
      </el-submenu>
    </el-menu>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import storage from "@/utils/storage";
export default {
  props: {
    menuList: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  data() {
    return {
      selectAppId: "",
    };
  },
  computed: {
    ...mapGetters(["appList", "appInfo"]),
    // 正在访问的菜单路径
    activeMenuPath() {
      return this.$store.state.activeMenuPath;
    },
  },
  created() {
    this.selectAppId = this.appInfo.app_appid;
  },
  methods: {
    handleAppInfo(appid) {
      const menu = storage.getPowerTree();
      // this.$router.push(menu[0].sub[0].sub[0].url);
      const appInfo = this.appList.find((a) => a.app_appid === appid);
      this.selectAppId = appInfo.app_appid;
      this.$store.commit("app/SET_APP_INFO", appInfo);
      this.$emit("changeAppInfo");
      // console.log(appInfo);
    },
  },
};
</script>
<style lang="scss">
#sidebar {
  .el-input__inner {
    border-radius: 50px;
  }
  .el-submenu .el-menu-item,
  .el-submenu__title {
    height: 40px;
    line-height: 40px;
  }
  .el-submenu .el-submenu__title:hover {
    background-color: rgb(237, 239, 244) !important;
  }
  .el-submenu .el-menu-item:hover {
    background-color: rgb(237, 239, 244) !important;
  }
  .active {
    background: rgb(225, 231, 245) !important;
    color: #3b82fe !important;
    font-weight: 600 !important;
  }
  .el-submenu.is-active > .el-submenu__title {
    color: #3b82fe !important;
    span {
      font-weight: 600 !important;
    }
  }
  .el-submenu__icon-arrow {
    right: 33px;
  }
}
.el-submenu__title,
.el-menu-item {
  font-size: 14px;
  color: #252934;
}
.el-aside {
  overflow-y: hidden;
}
</style>
