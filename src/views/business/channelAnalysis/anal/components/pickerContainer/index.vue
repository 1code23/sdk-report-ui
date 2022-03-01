<template>
  <div class="box disfr pickerContainer">
    <el-menu
      class="cycleMenu bordRgrey"
      @select="selectMenu"
      :default-active="defaultActive"
    >
      <el-menu-item v-for="(a, b) in menuList" :key="b" :index="a.key">
        <span slot="title"
          >{{ a.label }}
          <i class="el-icon-arrow-right"></i>
        </span>
      </el-menu-item>
    </el-menu>
    <div class="content flex1">
      <div class="dateRange" v-if="defaultActive == 'dateRange'">
        <datePicker></datePicker>
      </div>
      <div class="channelCom" v-if="defaultActive == 'channel'">
        <checkFilter
          key="channelCom"
          :checkList.sync="channelCheck"
          :list="appChannelList"
          dataKey="app_channel"
          dataLabel="label"
        ></checkFilter>
      </div>
      <div class="versionCom" v-if="defaultActive == 'version'">
        <checkFilter
          key="versionCom"
          :checkList.sync="versionCheck"
          :list="appVnameList"
          dataKey="app_vname"
          dataLabel="label"
        ></checkFilter>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import datePicker from "./components/datePicker.vue";
import checkFilter from "./components/checkFilter.vue";
export default {
  computed: {
    ...mapGetters(["appInfo", "appChannelList", "appVnameList"]),
  },
  components: {
    datePicker,
    checkFilter,
  },
  data() {
    return {
      defaultActive: "dateRange",
      menuList: [
        {
          label: "时段对比",
          key: "dateRange",
        },
        {
          label: "渠道对比",
          key: "channel",
        },
        {
          label: "版本对比",
          key: "version",
        },
      ],
      channelCheck: [],
      versionCheck: [],
    };
  },
  mounted() {
    console.log(this.appVnameList);
  },
  methods: {
    selectMenu(val) {
      this.defaultActive = val;
    },
  },
};
</script>

<style lang="scss" scoped>
.pickerContainer {
  width: 400px;
  height: 306px;
  /deep/.cycleMenu {
    width: 120px;
    height: 306px;
    border-right: 1px solid #e5e5e5;
    .el-menu-item {
      line-height: 48px;
      height: 48px;
      padding: 0 16px;
    }
  }
  .content {
    width: 280px;
    height: 100%;
  }
  .dateRange,
  .channelCom,
  .versionCom {
    width: 100%;
    height: 100%;
  }
}
</style>
