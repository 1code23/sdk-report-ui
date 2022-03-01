<template>
  <el-row class="channelActive" :gutter="16" style="margin-bottom: 16px">
    <el-col :span="12">
      <Header>
        <div slot="l">
          <span class="fz16 fw7">渠道活跃度</span>
        </div>
        <div slot="r">
          <span class="fz12 fw7">{{ nowDate }}</span>
        </div>
      </Header>
      <pdPanel class="disfr" style="height: 150px">
        <div class="flex1 fc ac jc circleProgress">
          <el-progress
            stroke-linecap="butt"
            :stroke-width="14"
            type="circle"
            :percentage="active_7_rate"
            color="#3b82fe"
          ></el-progress>
          <div class="fz12 mt10">昨日活跃 / 过去7天活跃</div>
        </div>
        <div class="flex1 fc ac jc circleProgress">
          <el-progress
            stroke-linecap="butt"
            :stroke-width="14"
            type="circle"
            :percentage="active_30_rate"
            color="#fc9c41"
          ></el-progress>
          <div class="fz12 mt10">昨日活跃 / 过去30天活跃</div>
        </div>
      </pdPanel>
    </el-col>
    <el-col :span="12">
      <Header>
        <div slot="l">
          <span class="fz16 fw7">新增用户留存率</span>
        </div>
        <div slot="r">
          <span class="fz12 fw7">{{ nowDate }}</span>
        </div>
      </Header>
      <pdPanel style="height: 150px">
        <div class="lineProgress disfr ac jsb">
          <span class="mr10">次日留存率</span>
          <el-progress
            class="lineCut flex1"
            stroke-linecap="butt"
            :stroke-width="10"
            :percentage="retained_the_next_day"
            color="#7868d5"
          ></el-progress>
        </div>
        <div class="lineProgress disfr ac jsb">
          <span class="mr10">7日留存率</span>
          <el-progress
            class="lineCut flex1"
            stroke-linecap="butt"
            :stroke-width="10"
            :percentage="retained_7_rate"
            color="#7868d5"
          ></el-progress>
        </div>
        <div class="lineProgress disfr ac jsb">
          <span class="mr10">14日留存率</span>
          <el-progress
            class="lineCut flex1"
            stroke-linecap="butt"
            :stroke-width="10"
            :percentage="retained_14_rate"
            color="#7868d5"
          ></el-progress>
        </div>
      </pdPanel>
    </el-col>
  </el-row>
</template>

<script>
import { mapGetters } from "vuex";

import {
  pdPanel,
  Header,
  contractionDetail,
} from "@/components/greyPanel/index.js";
import { getChannelActive, getChannelReamin } from "@/api/channelAnalysis.js";
export default {
  components: {
    Header,
    pdPanel,
    contractionDetail,
  },
  computed: {
    ...mapGetters(["appInfo", "appChannelList", "appVnameList"]),
  },
  data() {
    return {
      nowDate: null,
      active_7_rate: 0,
      active_30_rate: 0,
      retained_7_rate: 0,
      retained_14_rate: 0,
      retained_the_next_day: 0,
    };
  },
  mounted() {
    (this.nowDate = adr.mom(new Date()).format("YYYY/MM/DD")), this.init();
  },
  methods: {
    init() {
      this.getData();
    },
    async getData() {
      let params = {
        app_appid: this.appInfo.app_appid,
        app_channel: this.$route.params.id,
      };
      Promise.all([getChannelActive(params), getChannelReamin(params)]).then(
        (res) => {
          console.log(res);
          let dataActive = res[0].data.list[0];
          let dataReamin = res[1].data.list[0];
          this.active_7_rate = dataActive.active_7_rate;
          this.active_30_rate = dataActive.active_30_rate;
          this.retained_7_rate = dataReamin.retained_7_rate;
          this.retained_14_rate = dataReamin.retained_14_rate;
          this.retained_the_next_day = dataReamin.retained_the_next_day;
        }
      );
    },
  },
};
</script>

<style lang="scss" scoped>
.channelActive {
  /deep/.circleProgress {
    .el-progress__text {
      font-size: 24px !important;
    }
  }
  .lineProgress {
    height: 50px;
  }
  /deep/.lineCut {
    .el-progress-bar__outer {
      border-radius: 0;
      .el-progress-bar__inner {
        border-radius: 0;
      }
    }
    .el-progress__text {
      font-size: 12px !important;
    }
  }
}
</style>
