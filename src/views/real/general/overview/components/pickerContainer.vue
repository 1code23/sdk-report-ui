<template>
  <div class="box disfr pickerContainer">
    <div class="content flex1">
      <div class="channelCom">
        <checkFilter
          key="channelCom"
          :checkList.sync="channelCheck"
          :list="appChannelList"
          dataKey="app_channel"
          dataLabel="label"
        ></checkFilter>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import checkFilter from "./components/checkFilter.vue";
export default {
  computed: {
    ...mapGetters(["appInfo", "appChannelList", "appVnameList"]),
  },
  components: {
    checkFilter,
  },
  data() {
    return {
      menuList: [
        {
          label: "渠道对比",
          key: "channel",
        },
      ],
      channelCheck: [],
      versionCheck: [],
    };
  },
  mounted() {
    this.init();
    console.log(this.appChannelList);
  },
  methods: {
    async init() {
      await this.$store.dispatch("app/getAppChannel");
      this.channelCheck = [...this.appChannelList];
    },
  },
};
</script>

<style lang="scss" scoped>
.pickerContainer {
  width: 238px;
  height: 306px;
  /deep/.cycleMenu {
    width: 238px;
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
<style lang="scss">
.pickerCycle.el-popover {
  width: 238px !important;
  padding: 0;
}
</style>
