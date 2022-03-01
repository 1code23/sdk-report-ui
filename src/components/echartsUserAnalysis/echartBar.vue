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
    selected: {
      //是否隐藏图例其中的某个
      type: Object,
      default() {
        return {};
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
        tooltip: {
          trigger: "axis",
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: "shadow", // 默认为直线，可选为：'line' | 'shadow'
          },
          formatter: "",
        },
        legend: {
          data: [],
          selected: {},
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true,
        },
        xAxis: [
          {
            type: "category",
            data: [],
            // data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
          },
        ],
        yAxis: [
          {
            type: "value",
            axisLabel: {
              show: true,
              interval: "auto",
              formatter: "{value}",
            },
            show: true,
          },
        ],
        series: [],
        //      series: [
        //     {
        //         name: '邮件营销',
        //         type: 'bar',
        //         stack: '广告',
        //         data: [120, 132, 101, 134, 90, 230, 210]
        //     },
        //     {
        //         name: '联盟广告',
        //         type: 'bar',
        //         stack: '广告',
        //         data: [220, 182, 191, 234, 290, 330, 310]
        //     },
        //     {
        //         name: '视频广告',
        //         type: 'bar',
        //         stack: '广告',
        //         data: [150, 232, 201, 154, 190, 330, 410]
        //     },

        // ]
      },
    };
  },
  watch: {
    seriesData: {
      handler(newVal, oldVal) {
        console.log(newVal);
        if (newVal.length > 0) {
          if (this.showForm) {
            this.option.yAxis[0].axisLabel.formatter = "{value}";
            this.option.tooltip.formatter = "";
          } else {
            this.option.yAxis[0].axisLabel.formatter = "{value} %";
            this.option.tooltip.formatter = function (val) {
              let s = val[0].name + "<br>";
              for (var i = 0; i < val.length; i++) {
                s +=
                  "<span style='width:145px;display:inline-block'>" +
                  val[i].marker +
                  val[i].seriesName +
                  "</span>" +
                  val[i].value +
                  "%" +
                  "<br>";
              }
              return s;
            };
          }
          this.option.series = newVal;
          this.option.xAxis[0].data = this.xAxisData;
          this.option.legend.data = this.legendData;
          this.option.legend.selected = this.selected;
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
