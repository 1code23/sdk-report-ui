<template>
  <div>
    <div class="proses"></div>
    <div class="main">
      <div class="mainHead disfr jsb">
        <div class="mainHead_l">
          <span class="title"
            >实时在线
            <el-popover placement="bottom-start" width="150" trigger="hover">
              <p class="titleF">
                <span class="titleBlue">在线新增用户:</span>
                当前时间首次启动应用的用户数，每30秒更新一次，以设备为判断标准
              </p>
              <p class="titleF">
                <span class="titleBlue">在线活跃用户:</span>
                当前时间使用应用页面的在线用户数，每30秒更新一次，以设备为判断标准
              </p>
              <p class="titleF">
                <span class="titleBlue">昨日峰值:</span>
                显示昨日最高的30s同时在线新增/活跃用户数，以设备为判断标准，每天更新一次
              </p>
              <p class="titleF">
                <span class="titleBlue">昨日峰值同比:</span>
                计算当前同时在线新增/活跃用户数，同昨日峰值的比例
                （今日当前30s值-昨日峰值）/昨日峰值 * 100%
                （保留2位小数），每30秒更新一次
              </p>
              <p class="titleF">
                <span class="titleBlue">在线用户柱状图:</span>
                展示5分钟内的在线新增/活跃用户数，每30s更新一次，由右至左更新
              </p>
              <i
                class="el-icon-warning-outline"
                slot="reference"
                style="color: white"
              ></i> </el-popover
          ></span>
        </div>
        <div class="mainHead_r">
          <i class="el-icon-timer"></i
          ><span style="margin-left: 8px">每30秒更新</span>
        </div>
      </div>
      <div class="mainContent disfr jsb ac">
        <div class="content_l">
          <p class="content_l_title">同时在线活跃用户数</p>
          <p class="content_l_number">28</p>
          <div>
            <span class="title">
              <el-popover placement="right-start" width="150" trigger="hover">
                <div class="titleF">
                  <span class="title_text">昨日峰值</span>
                  <p style="margin: 10px 0">21:59:30-22:00:00</p>
                  <p>同时在线活跃用户数19</p>
                </div>
                <span slot="reference" style="font-size: 12px"
                  >昨日峰值 19</span
                >
              </el-popover></span
            >
            <span style="font-size: 12px; margin: 0 8px">26.32%</span>
            <i
              class="el-icon-top"
              style="font-weight: 900; font-size: 12px"
            ></i>
          </div>
        </div>
        <div class="content_r">
          <div ref="activechartCategory" class="chartCategory"></div>
        </div>
      </div>
      <div class="lineBox"></div>
      <div class="mainContent disfr jsb ac">
        <div class="content_l">
          <p class="content_l_title">同时在线新用户数</p>
          <p class="content_l_number">28</p>
          <div>
            <span class="title">
              <el-popover placement="right-start" width="150" trigger="hover">
                <div class="titleF">
                  <span class="title_text">昨日峰值</span>
                  <p style="margin: 10px 0">21:59:30-22:00:00</p>
                  <p>同时在线新用户数19</p>
                </div>
                <span slot="reference" style="font-size: 12px"
                  >昨日峰值 19</span
                >
              </el-popover></span
            >
            <span style="font-size: 12px; margin: 0 8px">26.32%</span>
            <i
              class="el-icon-top"
              style="font-weight: 900; font-size: 12px"
            ></i>
          </div>
        </div>
        <div class="content_r">
          <div ref="newUserchartCategory" class="chartCategory"></div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import * as echarts from "echarts";
import moment from "moment";
// import { getBasicNorm } from "@/api/userEngagement";
export default {
  components: {},
  data() {
    return {
      retimer: "",
      activeOption: {
        color: ["#fff"],
        tooltip: {
          trigger: "axis",
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: "shadow", // 默认为直线，可选为：'line' | 'shadow'
          },
        },
        grid: {
          left: "50%",
          right: "1%",
          bottom: "20%",
          containLabel: true,
        },
        xAxis: [
          {
            type: "category",
            show: false,
            data: [
              "2022-02-14 15:00:00",
              "2022-02-14 15:00:30",
              "2022-02-14 15:01:00",
              "2022-02-14 15:01:30",
              "2022-02-14 15:02:00",
              "2022-02-14 15:02:30",
              "2022-02-14 15:03:00",
            ],
            // data: ["同时在线活跃用户数"],
            axisTick: {
              alignWithLabel: true,
            },
          },
        ],
        yAxis: [
          {
            type: "value",
            show: false,
          },
        ],
        series: [
          {
            name: "同时在线活跃用户数",
            type: "bar",
            barWidth: "60%",
            data: [10, 52, 200, 334, 390, 330, 220],
          },
        ],
      },
      newOption: {
        color: ["#fff"],
        tooltip: {
          trigger: "axis",
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: "shadow", // 默认为直线，可选为：'line' | 'shadow'
          },
        },
        grid: {
          left: "50%",
          right: "1%",
          bottom: "20%",
          containLabel: true,
        },
        xAxis: [
          {
            type: "category",
            show: false,
            data: [
              "2022-02-14 15:00:00",
              "2022-02-14 15:00:30",
              "2022-02-14 15:01:00",
              "2022-02-14 15:01:30",
              "2022-02-14 15:02:00",
              "2022-02-14 15:02:30",
              "2022-02-14 15:03:00",
            ],
            axisTick: {
              alignWithLabel: true,
            },
          },
        ],
        yAxis: [
          {
            type: "value",
            show: false,
          },
        ],
        series: [
          {
            name: "同时在线新用户数",
            type: "bar",
            barWidth: "60%",
            data: [10, 52, 200, 334, 390, 330, 220],
          },
        ],
      },
    };
  },
  methods: {
    tabClick() {},
  },
  // activated() {
  //   window.addEventListener("resize", this.handleWindowResize);
  // },
  // deactivated() {
  //   window.removeEventListener("resize", this.handleWindowResize);
  // },
  mounted() {
    var myChart = window.echarts.init(this.$refs.activechartCategory);
    myChart.setOption(this.activeOption);
    var newUser = window.echarts.init(this.$refs.newUserchartCategory);
    newUser.setOption(this.newOption);
    window.addEventListener("resize", () => {
      myChart.resize();
      newUser.resize();
    });
    // let _this = this; // 声明一个变量指向Vue实例this，保证作用域一致
    // this.retimer = setInterval(() => {}, 1000);
  },
  beforeDestroy() {
    // if (this.retimer) {
    //   clearInterval(this.retimer); // 在Vue实例销毁前，清除我们的定时器
    // }
  },
};
</script>
<style lang="scss" scoped>
.proses {
  width: 80%;
  height: 10px;
  background: #edeff4;
  opacity: 0.4;
  animation-name: example;
  animation-duration: 30s;
  animation-iteration-count: infinite;
  animation-timing-function: linear;
}
@keyframes example {
  from {
    width: 80%;
  }
  to {
    width: 0;
  }
}
.main {
  width: 100%;
  padding: 20px 10px;
  color: white;
  box-sizing: border-box;
  .mainHead_l {
    font-size: 16px;
  }
  .mainHead_r {
    font-size: 12px;
  }
  .mainContent {
    width: 100%;
    .content_l {
      width: 35%;
      padding: 60px 0;
      .content_l_title {
        font-size: 16px;
      }
      .content_l_number {
        font-size: 28px;
        margin: 16px 0;
      }
    }
    .content_r {
      width: 65%;
      .chartCategory {
        width: 100%;
        height: 200px;
      }
    }
  }
  .lineBox {
    width: 100%;
    height: 1px;
    background: #fff;
    opacity: 0.4;
  }
}
</style>
