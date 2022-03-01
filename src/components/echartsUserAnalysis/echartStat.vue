<template>
  <div class="newUser">
    <template>
      <div class="chartsWpper" ref="chartsPie" id="mainPie"></div>
    </template>
  </div>
</template>

<script>
import * as echarts from "echarts";
export default {
  props: {
    legendData: {
      //图例
      type: Array,
      default() {
        return [];
      },
    },
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
    showForm: {
      type: Boolean,
      default() {
        return true;
      },
    },
  },
  data() {
    return {
      option: {
        xAxis: {},
        yAxis: {
          axisLabel: { formatter: "{value} %" },
        },
        series: [
          {
            symbolSize: 20,
            data: [
              [10.0, 8.04, "unknown_channel"],
              [78.0, 66.95, "unknown_channel"],
              [33.0, 48, "unknown_channel"],
              [98.0, 80.81, "unknown_channel"],
              [11.0, 86.33, "unknown_channel"],
              [14.0, 9.96, "unknown_channel"],
              [69.0, 7.24, "unknown_channel"],
            ],
            type: "scatter",
            itemStyle: {
              normal: {
                label: {
                  color: "#333",
                  show: true,
                  position: "insideTop",
                  formatter: function (params, ticket, callback) {
                    var s = params.value[2];
                    return s;
                  },
                },
              },
            },
            markArea: {
              silent: true,
              label: {
                position: "insideTop",
                color: "#000000",
                show: true,
              },
              data: [
                [
                  {
                    name: "低新增低留存",
                    // x: "25%",
                    // y: "25%",
                    // type: "min",
                    coord: [0, 0],
                    itemStyle: {
                      color: "#fff2cc",
                    },
                  },
                  {
                    // coord: [50, 50], //修改范围[x轴 y轴]
                    coord: [0, 0],
                    x: "50%",
                    y: "50%",
                    // type: "max",
                  },
                ],
                [
                  {
                    name: "高新增低留存",
                    // coord: [50, 0],
                    coord: [0, 0],
                    x: "50%",
                    y: "50%",
                    // xAxis: "average",
                    // yAxis: "min",
                    itemStyle: {
                      color: "#ffcccc",
                    },
                  },
                  {
                    // coord: [100, 50],
                    coord: [0, 0],
                    x: "90%",
                    y: "86%",
                    // xAxis: "max",
                    // yAxis: "average",
                  },
                ],
                [
                  {
                    name: "低新增高留存",
                    // coord: [0, 50],
                    coord: [0, 0],
                    x: "10%",
                    y: "50%",
                    // xAxis: "min",
                    // yAxis: "average",
                    itemStyle: {
                      color: "#e2efda",
                    },
                  },
                  {
                    // coord: [50, 100],
                    coord: [50, 0],
                    x: "50%",
                    y: "12%",
                    // xAxis: "average",
                    // yAxis: "max",
                  },
                ],
                [
                  {
                    name: "高新增高留存",
                    // coord: [50, 50],
                    // xAxis: "average",
                    // yAxis: "average",
                    coord: [0, 0],
                    x: "50%",
                    y: "12%",
                    itemStyle: {
                      color: "#ddebf7",
                    },
                  },
                  {
                    // coord: [100, 100],
                    // xAxis: "max",
                    // yAxis: "max",
                    coord: [0, 0],
                    x: "90%",
                    y: "50%",
                  },
                ],
              ],
            },
          },
        ],
        tooltip: {
          formatter: function (param) {
            var value = param.data;

            return (
              value[2] +
              "<br>" +
              '<div style="border-bottom: 1px solid rgba(255,255,255,.3); font-size: 16px;"> ' +
              "<span style='display:inline-block;width:100px'>" +
              "新增用户:" +
              "</span>" +
              value[0] +
              "</div>" +
              '<div style="border-bottom: 1px solid rgba(255,255,255,.3); font-size: 16px;"> ' +
              "<span style='display:inline-block;width:100px'>" +
              "次日留存率:" +
              "</span>" +
              value[1] +
              "%" +
              "</div>"
            );
          },
        },
      },
    };
  },
  watch: {
    seriesData: {
      handler(newVal, oldVal) {
        console.log(newVal);
        if (newVal.length > 0) {
          this.option.series[0].data = newVal;
          // this.option.xAxis[0].data = this.xAxisData;
          // this.option.legend.data = this.legendData;
          var myChart = window.echarts.init(this.$refs.chartsPie);
          myChart.setOption(this.option, true);
        }
      },
      deep: true,
      immediate: true,
    },
  },
  methods: {
    handleWindowResize() {
      const main = document.getElementById("mainPie");
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
    const main = document.getElementById("mainPie");
    this.myChart = echarts.init(main);
    this.myChart.setOption(this.option);
    window.addEventListener("resize", () => {
      this.handleWindowResize();
    });
    // this.y =
    //   this.myChart.getModel().getComponent("yAxis").axis.scale._extent[1] / 2;
    // this.x =
    //   this.myChart.getModel().getComponent("xAxis").axis.scale._extent[1] / 2;
    // console.log(this.y);
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
