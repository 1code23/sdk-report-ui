<template>
  <div class="newUser">
    <template>
      <div
        class="chartsWpper"
        ref="chartsWpper"
        v-show="showEchart"
        :id="mainid"
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
    mainid: {
      type: String,
      default() {
        return "";
      },
    },
  },
  data() {
    return {
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
          axisLabel: { formatter: "{value} %" },
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
            type: "line",
            name: "",
            data: [],
            showSymbol: true,
            itemStyle: {
              normal: {
                color: "#2196f3", //折点颜色
                lineStyle: {
                  color: "#2196f3", //折线颜色
                },
              },
            },
            // smooth: true, //折点是圆弧状的
            // symbol: "circle", //折点设定为实心点
            symbolSize: 8, //设定实心点的大小
            // hoverAnimation: false,
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
          // console.log(newVal);
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
        if (newVal.length > 0) {
          this.option.series = newVal;
          this.option.tooltip.formatter = function (params) {
            var str = "";
            params.forEach((a, b) => {
              str +=
                params[b].marker +
                params[b].name +
                "%" +
                "<span style='margin-left:15px'></span>" +
                params[b].value;
            });
            return str;
          };
          var myChart = window.echarts.init(this.$refs.chartsWpper);
          myChart.setOption(this.option, true);
        }
      },
      deep: true,
      immediate: true,
    },
  },
  methods: {
    handleWindowResize() {
      const main = document.getElementById(this.mainid);
      if (main) {
        this.myChart.resize();
      }
    },
  },
  activated() {
    window.addEventListener("resize", this.handleWindowResize);
  },
  deactivated() {
    window.removeEventListener("resize", this.handleWindowResize);
  },
  mounted() {
    const main = document.getElementById(this.mainid);
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
