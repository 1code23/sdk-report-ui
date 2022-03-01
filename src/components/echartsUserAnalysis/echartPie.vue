<template>
  <div class="newUser">
    <template>
      <!-- <div class="chartsWpper" ref="chartsPie" id="mainPie"></div> -->
      <div class="chartsWpper" ref="chartsPie" :id="idd"></div>
    </template>
  </div>
</template>

<script>
import * as echarts from "echarts";
export default {
  props: {
    seriesName: {
      type: String,
      default() {
        return "";
      },
    },
    seriesData: {
      type: Array,
      default() {
        return [];
      },
    },
    idd: {
      type: String,
      default() {
        return "";
      },
    },
  },
  data() {
    return {
      option: {
        // title: {
        //   text: "Referer of a Website",
        //   subtext: "Fake Data",
        //   left: "center",
        // },
        tooltip: {
          trigger: "item",
          formatter: function (data) {
            var str =
              data.marker +
              data.data.name +
              "：" +
              data.data.value +
              "  |  占比" +
              "：" +
              data.data.ratio +
              "%";
            return str;
          },
        },
        legend: {
          icon: "circle",
          bottom: 20,
          left: 0,
          // algin: "left",
          // width: 580,
          // width: "100%",
          // itemGap: 15,
          // lineHeight: 12,
          itemWidth: 12, // 设置宽度
          itemHeight: 12, // 设置高度
          padding: [0, 0, 0, 0],
          // formatter: ["{a|{name}}"].join("\n"),
          // textStyle: {
          //   rich: {
          //     a: {
          //       width: 140,
          //       // width: "85%",
          //       fontSize: 14,
          //       lineHeight: 12,
          //       textAlign: "center",
          //     },
          //   },
          // },
        },
        series: [
          {
            name: "Access From",
            type: "pie",
            radius: ["30%", "50%"],
            center: ["40%", "40%"],
            minAngle: 10, // 设置每块扇形的最小占比
            label: {
              normal: {
                formatter: function (data) {
                  var s = data.data.name + ":" + data.data.ratio + "%";
                  return s;
                },
              },
            },
            data: [
              // { value: 1048, name: "Search Engine" },
              // { value: 735, name: "Direct" },
              // { value: 580, name: "Email" },
              // { value: 484, name: "Union Ads" },
              // { value: 300, name: "Video Ads" },
            ],
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)",
              },
            },
          },
        ],
      },
    };
  },
  watch: {
    seriesData: {
      handler(newVal, oldVal) {
        // console.log(newVal);
        if (newVal.length > 0) {
          this.option.series[0].data = newVal;
          this.option.series[0].name = this.seriesName;
          // console.log(this.option.series[0].name);
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
      // const main = document.getElementById("mainPie");
      const main = document.getElementById(this.idd);
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
    // const main = document.getElementById("mainPie");
    const main = document.getElementById(this.idd);
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
