<template>
  <div class="newUser">
    <template>
      <div
        class="chartsWpper"
        ref="chartsWpper"
        v-show="showEchart"
        id="mainEcharts"
      ></div>
      <div class="chartsWpper" v-show="!showEchart">
        <el-empty :image-size="200"></el-empty>
      </div>
    </template>
  </div>
</template>

<script>
import * as echarts from "echarts";
export default {
  props: {
    xAxisData: {
      type: Array,
      default() {
        return [];
      },
    },
    seriesData: {
      type: Array,
      default() {
        return [];
      },
    },
    // yxisData: {
    //   type: String,
    //   default() {
    //     return "{value}";
    //   },
    // },
    tabOpcity: {
      type: String,
      default() {
        return "1";
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
      option: {
        legend: {
          show: true,
          bottom: 10,
        },
        //位置
        grid: {
          left: "4%",
          right: "4%",
          top: "4%",
          bottom: "16%",
          containLabel: true,
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: [],
          axisLabel: {
            showMaxLabel: false, //x轴最后一个刻度不显示
          },
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
        series: [],
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
        console.log(newVal);
        if (newVal.length > 0) {
          this.option.series = newVal;
          var myChart = window.echarts.init(this.$refs.chartsWpper);
          myChart.setOption(this.option, true);
        }
      },
      // deep: true,
      // immediate: true,
    },
    tabOpcity: {
      handler(newVal, oldVal) {
        if (newVal == "1") {
          this.option.yAxis.type = "value";
          this.option.yAxis.axisLabel.formatter = "{value}";
          this.option.tooltip.formatter = "";
        } else if (newVal == "2" || newVal == "3") {
          let that = this;
          this.option.yAxis.type = "time";
          this.option.yAxis.axisLabel.formatter = function (value, index) {
            return that.fomartTime(value);
          }; //y轴显示时间

          this.option.tooltip.formatter = function (params) {
            var str = "";
            params.forEach((a, b) => {
              str +=
                params[b].marker +
                params[b].seriesName +
                "<span style='margin-left:15px'></span>" +
                that.fomartTime(params[b].data) +
                "<br>";
            });
            return params[0].name + "<br>" + str;
          };
        } else if (newVal == "4") {
          this.option.yAxis.type = "value";
          this.option.yAxis.axisLabel.formatter = "{value}%";
          this.option.tooltip.formatter = function (params) {
            var str = "";
            params.forEach((a, b) => {
              str +=
                params[b].marker +
                params[b].seriesName +
                "<span style='margin-left:15px'></span>" +
                params[b].data +
                "%" +
                "<br>";
            });
            return params[0].name + "<br>" + str;
          };
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
      const main = document.getElementById("mainEcharts");
      if (main) {
        this.myChart.resize();
      }
    },
    fomartTime(value) {
      let unit = ["分钟", "小时", "天"],
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
    },
  },
  activated() {
    window.addEventListener("resize", this.handleWindowResize);
  },
  deactivated() {
    window.removeEventListener("resize", this.handleWindowResize);
  },
  mounted() {
    const main = document.getElementById("mainEcharts");
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
  height: 290px;
  background: white;
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
