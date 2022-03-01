<template>
  <div class="basicBox">
    <div class="disfr jsb pad10 ac">
      <div class="basicHead_left">
        <span class="title"
          >基本指标
          <el-popover placement="bottom-start" width="300" trigger="hover">
            <p class="titleF">统计上个5分钟的产品指标</p>
            <p class="titleF">
              <span class="titleBlue">新增用户:</span>
              今日第一次启动应用的用户（以设备为判断标准)
            </p>
            <p class="titleF">
              <span class="titleBlue">活跃用户:</span>
              今日启动过应用的用户（去重），启动过一次的用户即视为活跃用户，包括新用户与老用户
            </p>
            <p class="titleF">
              <span class="titleBlue">启动次数:</span>
              Android启动定义：打开应用即为启动。应用完全退出或者在后台运行超过30s（默认30s）后再被打开，算为一次新启动。iOS启动定义：打开应用即为启动。应用完全退出或者在后台运行后再被打开，算为一次新启动
            </p>
            <p class="titleF">
              <span class="titleBlue">崩溃次数:</span>
              由未捕获的异常导致的应用异常退出的错误，是由SDK自动捕获
            </p>
            <p class="titleF">
              <span class="titleBlue">昨日同期:</span>
              截至今日上个整点时刻的该日数据相对于昨日同时段的变化率
            </p>
            <i
              class="el-icon-question"
              slot="reference"
              style="color: #a4a6ac"
            ></i> </el-popover
        ></span>
      </div>
      <div class="basicHead_right disfr ac">
        <progressView style="margin-right: 8px"></progressView>
        <span>每五分钟更新</span>
      </div>
    </div>
    <div class="tabType disfr jsa ac pad10">
      <div
        class="tabGenre newUser cur"
        v-for="(item, index) in basicData"
        :key="index"
        @click="tabClick(item.id)"
        :class="[activeId == item.id ? 'activeCLass' : '']"
      >
        <p class="tabText">{{ item.name }}</p>
        <span class="tabNum">{{ item.value }}</span>
        <p class="tabTitle">
          昨日同期
          <span
            class="dataNum"
            :class="[item.rate < 0 ? 'greenClass' : 'redClass']"
            >{{ item.rate }}%</span
          ><i
            class="el-icon-top"
            style="font-weight: 900; color: red; font-size: 14px"
            v-show="item.rate > 0"
          ></i>
          <i
            class="el-icon-bottom"
            style="font-weight: 900; color: #44ca5e; font-size: 14px"
            v-show="item.rate < 0"
          ></i>
        </p>
      </div>
    </div>
    <div class="timeTab disfr jfd">
      <Tab
        :activeId.sync="type"
        :list="tabOptionAll"
        style="background: white; margin-right: 10px"
      />
    </div>
    <div>
      <echartLine
        :xAxisData="xAxisData"
        :seriesData="seriesData"
        :showEchart="showEchart"
      ></echartLine>
    </div>
  </div>
</template>
<script>
import { Tab } from "@/components/BlockContent/index.js";
import echartLine from "./echarttab.vue";
import { mapGetters } from "vuex";
import { getBasicNorm, getBasicNormGraph, getCustomEvent } from "@/api/real";
import progressView from "./components/progressView.vue";
export default {
  components: { Tab, echartLine, progressView },
  computed: {
    ...mapGetters(["appInfo"]),
  },
  data() {
    return {
      activeId: "new",
      norm: "1",
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
        {
          id: "3",
          title: "累计",
        },
      ],
      xAxisData: [],
      seriesData: [],
      showEchart: true,
      basicData: [],
      timers: "",
    };
  },
  methods: {
    tabClick(val) {
      this.activeId = val;
      switch (val) {
        case "new":
          this.norm = "1";
          break;
        case "active":
          this.norm = "2";
          break;
        case "launch":
          this.norm = "3";
          break;
        case "collapse":
          this.norm = "4";
          break;
      }
      this.getBasicEchartData({ app_appid: this.appInfo.app_appid });
    },
    getBasicData(obj) {
      getBasicNorm(obj).then((res) => {
        this.basicData = res.data.list.data;
      });
    },
    getBasicEchartData(val) {
      let obj = { ...val, norm: this.norm, type: this.type };
      getBasicNormGraph(obj).then((res) => {
        console.log(res);
        this.xAxisData = res.data.list.dates;
        let array = [];
        res.data.list.items.forEach((item) => {
          array.push({
            data: item.data,
            type: "line",
            name: item.group,
            symbol: "none",
          });
        });
        this.seriesData = array;
      });
    },
    getEventList(obj) {
      getCustomEvent(obj).then((res) => {
        console.log(res);
        // this.basicData = res.data.list.data;
      });
    },
  },
  mounted() {
    let obj = { app_appid: this.appInfo.app_appid };
    this.getBasicData(obj);
    this.getBasicEchartData(obj);
    // this.getEventList(obj);
    // let _this = this; // 声明一个变量指向Vue实例this，保证作用域一致
    // this.timers = setInterval(() => {
    //   _this.getBasicData(obj);
    //   _this.getBasicEchartData();
    //   // _this.getEventList(obj);
    // }, 10000);
  },
  beforeDestroy() {
    if (this.timers) {
      clearInterval(this.timers); // 在Vue实例销毁前，清除我们的定时器
    }
  },
  watch: {
    type(newVal, oldVal) {
      this.getBasicEchartData({ app_appid: this.appInfo.app_appid });
    },
  },
};
</script>
<style lang="scss" scoped>
.basicBox {
  background: white;
  height: 530px;
  box-sizing: border-box;
}
.basicHead_right {
  font-size: 12px;
  color: #6b798e;
}
.tabType {
  .newUser,
  .launchNumber {
    border: 1px solid #e1e4e8;
  }
  .activeUser {
    border-top: 1px solid #e1e4e8;
    border-bottom: 1px solid #e1e4e8;
  }
  .greenClass {
    color: #44ca5e;
  }
  .redClass {
    color: #ff7474;
  }
  .collapseNumber {
    border-right: 1px solid #e1e4e8;
    border-top: 1px solid #e1e4e8;
    border-bottom: 1px solid #e1e4e8;
  }
  .tabGenre {
    width: 25%;
    padding: 20px;
  }
  .tabNum {
    margin: 10px 0;
    font-size: 24px;
    display: inline-block;
    font-weight: 600;
  }
  .tabTitle {
    color: #97aeaf;
    font-size: 14px;
  }
  .dataNum {
    font-size: 14px;
    margin: 0 5px;
  }
  .tabText {
    font-size: 15px;
  }
  .tabGenre:hover {
    background: rgb(245, 249, 255);
  }
  .activeCLass {
    .tabNum {
      color: #3b82fe;
    }
    border: 1px solid blue;
  }
}
</style>
