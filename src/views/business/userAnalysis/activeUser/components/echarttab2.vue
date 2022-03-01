<template>
  <div class="newUser">
    <template>
      <div
        class="chartsWpper"
        ref="chartsWpper"
        v-show="showEchart"
        id="main"
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
          axisLabel: {
            showMaxLabel: false, //x轴最后一个刻度不显示
          },
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
          // {
          //   name: "ceshi1",
          //   data: [],
          //   type: "line",
          // },
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
        newVal.length == 1
          ? (this.option.xAxis.axisLabel.showMaxLabel = true)
          : (this.option.xAxis.axisLabel.showMaxLabel = false);
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
          this.yxisData == 2 || this.yxisData == 3
            ? (this.option.yAxis.axisLabel.formatter = "{value} %")
            : (this.option.yAxis.axisLabel.formatter = "{value} ");
          this.option.series = newVal;
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
      const main = document.getElementById("main");
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
    const main = document.getElementById("main");
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
