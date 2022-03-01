<template>
  <div>
    <BlockContent style="padding: 15px">
      <Header style="padding-bottom: 10px">
        <div class="head-title" slot="l">
          <span>实时监控</span> <span style="margin: 0 8px">{{ nowDate }}</span
          ><i class="el-icon-s-management"></i>
        </div>
      </Header>
    </BlockContent>
    <div class="disfr jsb">
      <div class="realTime">
        <!-- 实时在线 -->
        <realTimeView></realTimeView>
      </div>
      <div class="basic">
        <!-- 基本指标 -->
        <basicIndex></basicIndex>
      </div>
    </div>
    <div class="disfr jsb">
      <!-- 自定义事件TOP 5 -->
      <div class="eventBox">
        <eventview></eventview>
      </div>
      <!-- 渠道趋势 -->
      <div class="eventBox">
        <userTrend></userTrend>
      </div>
    </div>
  </div>
</template>
<script>
import moment from "moment";
import { BlockContent, Header } from "@/components/BlockContent/index.js";
import realTimeView from "./components/realTimeView.vue";
import basicIndex from "./components/basicIndex.vue";
import eventview from "./components/event.vue";
import userTrend from "./components/userTrend.vue";
export default {
  inject: ["reload"], //刷新当前页面
  components: {
    BlockContent,
    Header,
    realTimeView,
    basicIndex,
    eventview,
    userTrend,
  },
  data() {
    return {
      nowDate: moment().locale("zh-cn").format("LTS"),
      timer: "",
      requestTimer: "",
    };
  },
  mounted() {
    let _this = this; // 声明一个变量指向Vue实例this，保证作用域一致
    this.timer = setInterval(() => {
      _this.nowDate = moment().locale("zh-cn").format("LTS"); // 修改数据date
    }, 1000);
    this.requestTimer = setInterval(() => {
      this.reload();
    }, 1000 * 300);
  },
  beforeDestroy() {
    if (this.timer) {
      clearInterval(this.timer); // 在Vue实例销毁前，清除我们的定时器
    }
    if (this.requestTimer) {
      clearInterval(this.requestTimer); // 在Vue实例销毁前，清除我们的定时器
    }
  },
  created() {
    // window.setInterval(() => {
    //   setTimeout(() => {
    //     ///调取接口
    //     console.log("1");
    //   }, 0);
    // }, 5000);
  },
};
</script>
<style lang="scss" scoped>
.eventBox {
  width: 49.5%;
  margin-top: 20px;
  background: white;
}
.realTime {
  width: 36%;
  height: 530px;
  background-image: linear-gradient(
    to bottom right,
    #3b82fe,
    rgb(74, 175, 255)
  );
}
.basic {
  width: 63%;
  height: 530px;
}
.head-title {
  font-size: 16px;
  color: #252934;
  i {
    font-size: 22px;
  }
  span {
    font-weight: 800;
  }
}
</style>
