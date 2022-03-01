<template>
  <div>
    <div class="basicBoxHeader disfr jsb pad10 ac">
      <div class="basicHead_left">
        <span class="fwei cur basicHeadTitle" @click="goEvent"
          >渠道新增用户趋势</span
        ><span class="fwei"
          ><i class="el-icon-arrow-right" style="font-weight: 600"></i
        ></span>
      </div>
      <div class="basicHead_right disfr ac">
        <progressView style="margin-right: 8px"></progressView>
        <span>每五分钟更新</span>
      </div>
    </div>
    <div class="basicBoxMain">
      <div class="basicBoxMain_header disfr jsb ac">
        <div class="contrast">
          <el-popover
            popper-class="pickerCycle"
            placement="bottom-start"
            width="160"
            v-model="cyclebtn"
          >
            <div class="box disfr pickerContainer" v-if="cyclebtn">
              <div class="content flex1">
                <div class="channelCom">
                  <checkFilter
                    key="channelCom"
                    :checkList.sync="channelCheck"
                    :list="appChannelList"
                    dataKey="app_channel"
                    dataLabel="label"
                    @change="change"
                  ></checkFilter>
                </div>
              </div>
            </div>
            <div class="cyclebtn disfr ac jsb" slot="reference">
              <span class="ellipsis disIl" style="width: 90%">{{
                checkChannelName
              }}</span>
              <i class="el-icon-document-copy fz16 colorGrey" />
            </div>
          </el-popover>
        </div>
        <div class="contrast_right">
          <Tab
            :activeId.sync="type"
            :list="tabOptionAll"
            style="background: white; margin-right: 10px"
          />
        </div>
      </div>
      <div class="basicBoxMain_content">
        <echarttab
          :xAxisData="xAxisData"
          :seriesData="seriesData"
          :showEchart="showEchart"
          :tabOpcity="tabOpcity"
        ></echarttab>
      </div>
    </div>
  </div>
</template>
<script>
import { getChannelNewUserGraph } from "@/api/real";
import { mapGetters } from "vuex";
import checkFilter from "./components/checkFilter.vue";
import { Tab } from "@/components/BlockContent/index.js";
import echarttab from "./components/echarttab2.vue";
import progressView from "./components/progressView.vue";

export default {
  computed: {
    ...mapGetters(["appChannelList"]),
  },
  components: {
    checkFilter,
    Tab,
    echarttab,
    progressView,
  },
  data() {
    return {
      cyclebtn: false,
      eventArray: [
        { name: "xiaoh", data: "20", num: "20" },
        { name: "xiaoh", data: "20", num: "20" },
      ],
      menuList: [
        {
          label: "渠道对比",
          key: "channel",
        },
      ],
      channelCheck: [], //已经选择的渠道
      checkChannelName: "", //已经选择的渠道转化为字符串
      type: "1",
      tabOptionAll: [
        {
          id: "1",
          title: "分钟",
        },
        {
          id: "2",
          title: "小时",
        },
      ],
      xAxisData: [],
      seriesData: [],
      tabOpcity: "1",
      showEchart: true,
    };
  },
  methods: {
    change(val) {
      this.checkChannelName = val.toString();
      this.getChannelNewUserGraph();
      this.seriesData = [
        { data: [1, 2, 3, 4], name: "渠道一", type: "line" },
        { data: [5, 2, 1, 4], name: "渠道二", type: "line" },
        { data: [1, 1, 1, 4], name: "渠道3", type: "line" },
      ];
    },
    goEvent() {
      this.$router.push("/business/channelAnalysis/anal");
    },
    async init() {
      await this.$store.dispatch("app/getAppChannel");
      this.channelCheck = ["unknown_channel14"];
      this.checkChannelName = this.channelCheck.toString();
      // await this.getChannelNewUserGraph();
    },
    getChannelNewUserGraph() {
      let obj = { ChannnelName: this.checkChannelName };
      getChannelNewUserGraph(obj).then((res) => {
        console.log(res);
      });
    },
  },
  mounted() {
    this.init();
    this.xAxisData = ["2022-02-03", "2022-02-05", "2022-02-06", "2022-02-07"];
    this.seriesData = [
      { data: [1, 2, 3, 4], name: "渠道一", type: "line" },
      { data: [5, 2, 1, 4], name: "渠道二", type: "line" },
    ];
  },
};
</script>
<style lang="scss" scoped>
.basicBoxHeader {
  background: rgb(247, 248, 250);
  .basicHeadTitle:hover {
    color: rgb(76, 141, 254);
  }
}
.basicHead_right {
  font-size: 12px;
  color: #6b798e;
}
.fwei {
  font-size: 16px;
  font-weight: 600;
}
.basicBoxMain_header {
  .contrast {
    padding: 10px;
    .cyclebtn {
      padding: 0 0 0 4px;
      width: 238px;
      font-size: 12px;
      height: 28px;
      cursor: pointer;
      border-bottom: 1px solid #6b798e;
    }
  }
}
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
