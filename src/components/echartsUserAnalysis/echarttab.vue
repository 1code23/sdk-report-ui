<template>
  <div class="newUser">
    <template>
      <div
        class="chartsWpper"
        ref="chartsWpper"
        v-show="showEchart"
        id="echartsDiv"
      ></div>
      <div class="chartsWpper" v-show="!showEchart">
        <el-empty :image-size="200"></el-empty>
      </div>
    </template>
  </div>
</template>

<script>
import * as echarts from "echarts";
import { changeDateTime } from "@/utils/index.js";
export default {
  props: {
    xAxisData: {
      // required: true,
      type: Array,
      default() {
        return [];
      },
    },
    seriesData: {
      // required: true,
      type: Array,
      default() {
        return [];
      },
    },
    name: {
      type: String,
      default() {
        return;
      },
    },
    yxisData: {
      type: String,
      default() {
        return "{value}";
      },
    },
    showEchart: {
      type: Boolean,
      default() {
        return false;
      },
    },
  },
  data() {
    return {
      changeDateTime,
      option: {
        legend: {
          show: true,
          bottom: "10",
        },
        //位置
        grid: {
          left: "3%",
          right: "3%",
          top: "4%",
          bottom: "10%",
          containLabel: true,
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: [],
        },
        yAxis: {
          type: "value",
          splitLine: {
            show: true,
            lineStyle: {
              type: "dashed",
              width: 1.2,
              color: "rgb(237, 239, 244)",
            },
          },
          axisLabel: { formatter: "{value}" },
        },
        series: [
          {
            name: "活跃用户",
            data: [{}],
            type: "line",
            lineStyle: {
              //线条样式
              color: "#409EFF",
              width: 2,
            },
            itemStyle: {
              // 转折点样式
              borderWidth: 1,
              // borderColor: "#409EFF",
              color: "#409EFF",
            },
          },
        ],
        //鼠标滑过的提示
        tooltip: {
          show: true,
          trigger: "axis",
        },
      },
    };
  },
  watch: {
    xAxisData: {
      handler(newVal, oldVal) {
        if (newVal.length > 0) {
          this.option.xAxis.data = newVal;
          var myChart = window.echarts.init(this.$refs.chartsWpper);
          myChart.setOption(this.option);
        }
      },
      deep: true,
      immediate: true,
    },
    seriesData: {
      handler(newVal, oldVal) {
        // console.log(newVal);
        if (newVal.length > 0) {
          this.option.series[0].data = newVal;
          var myChart = window.echarts.init(this.$refs.chartsWpper);
          myChart.setOption(this.option);
        }
      },
      deep: true,
      immediate: true,
    },
    name: {
      handler(newVal, oldVal) {
        if (newVal) {
          // console.log(newVal);
          this.option.series[0].name = newVal;
        }
      },
      deep: true,
      immediate: true,
    },
    yxisData: {
      handler(newVal, oldVal) {
        // console.log(newVal);
        if (newVal != "6" && newVal != "7") {
          this.option.yAxis.axisLabel.formatter = "{value}";
          if (newVal == "8" || newVal == "10") {
            let that = this;
            // this.option.yAxis.type = "time";
            this.option.yAxis.axisLabel.formatter = function (value, index) {
              // return that.fomartTime(value);
              return that.changeDateTime(value);
            }; //y轴显示时间
            this.option.tooltip.formatter = function (params) {
              let s =
                params[0].name +
                "<br>" +
                params[0].marker +
                params[0].seriesName +
                "<span style='margin-left:15px'></span>" +
                // that.fomartTime(params[0].data);
                that.changeDateTime(params[0].data);
              return s;
            }; //鼠标悬浮显示数据
          } else {
            this.option.yAxis.type = "value";
            this.option.yAxis.axisLabel.formatter = "{value}";
            this.option.tooltip.formatter = "";
          }
        } else {
          this.option.yAxis.axisLabel.formatter = "{value} %";
          this.option.yAxis.type = "value";
          this.option.tooltip.formatter = "";
        }
        var myChart = window.echarts.init(this.$refs.chartsWpper);
        myChart.setOption(this.option);
      },
      deep: true,
      // immediate: true,
    },
  },
  methods: {
    handleWindowResize() {
      const main = document.getElementById("echartsDiv");
      if (main) {
        this.myChart.resize();
      }
    },
    fomartTime(value) {
      let unit = ["分钟", "小时", "天"],
        // let unit = [":", ":", "天"],
        day = 0,
        hour = 0,
        min = 0,
        second = 0,
        returnStr = 0,
        arrVal = value.toString().split(".");
      if (arrVal.length > 1) {
        second = parseFloat("0." + arrVal[1]);
        second *= 60;
        value = parseInt(arrVal[0]);
      }
      returnStr = value + unit[0];
      if (value >= 60) {
        hour = parseInt(value / 60);
        min = value % 60;
      }
      if (hour) {
        returnStr = hour + unit[1];
        if (min) {
          returnStr += min + unit[0];
        }
      }
      if (second) {
        returnStr += second.toFixed(0) + "秒";
      }
      return returnStr;
      // return value;

      //      var day = Math.floor(s / (24 * 3600)); // Math.floor()向下取整
      // var hour = Math.floor((s - day * 24 * 3600) / 3600);
      // var minute = Math.floor((s - day * 24 * 3600 - hour * 3600) / 60);
      // var second = s - day * 24 * 3600 - hour * 3600 - minute * 60;
      // if (hour < 10) {
      //   hour = "0" + hour;
      // }
      // if (minute < 10) {
      //   minute = "0" + minute;
      // }
      // if (second < 10) {
      //   second = parseInt(second);
      //   second = "0" + second;
      // }
      // return hour + ":" + minute + ":" + second;
      // return s;
    },
  },
  activated() {
    window.addEventListener("resize", this.handleWindowResize);
  },
  deactivated() {
    window.removeEventListener("resize", this.handleWindowResize);
  },
  mounted() {
    const main = document.getElementById("echartsDiv");
    this.myChart = echarts.init(main);
    this.myChart.setOption(this.option);
    window.addEventListener("resize", () => {
      this.handleWindowResize();
    });
  },
};
</script>

<style lang="scss" scoped>
.chartsWpper {
  width: 100%;
  height: 500px;
  background: white;
  padding-right: 30px;
  box-sizing: border-box;
}
.mr17 {
  margin: 0 20px;
}
.headTop {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.tb {
  margin-bottom: 30px;
  background: white;
}
</style>
