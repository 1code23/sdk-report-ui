<template>
  <div :id="id" class="chartPanel" style="height: 500px"></div>
</template>

<script>
export default {
  props: {
    id: String,
    data: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  watch: {
    data() {
      this.$nextTick(() => {
        this.initChart();
      });
    },
  },
  data() {
    return {
      myChart: null,
      chartHeight: 500,
      option: {
        color: ["#42a6f5"],
        grid: {
          left: 10,
          right: 10,
          containLabel: true,
        },
        tooltip: {
          borderWidth: 0,
          trigger: "axis",
          axisPointer: {
            type: "shadow", // 'shadow' as default; can also be 'line' or 'shadow'
            shadowStyle: {
              // color:"rgb(240, 243, 249,0.5)",
              width: 60,
            },
          },
        },
        xAxis: {
          type: "category",
          boundaryGap: true, //是否线条靠近边缘
          data: [],
          axisTick: {
            alignWithLabel: true,
          },
          axisLine: {
            lineStyle: {
              color: "#cecece",
            },
          },
          axisLabel: {
            color: "#696969",
          },
        },
        yAxis: {
          type: "value",
          data: [],
          splitLine: {
            show: true,
            lineStyle: {
              type: "dashed",
            },
          },
        },
        legend: {
          show: true,
          itemWidth: 8,
          itemHeight: 8,
          bottom: 30,
        },
        series: [],
      },
    };
  },
  methods: {
    initChart() {
      // console.log(this.data);
      let data = [...this.data];
      console.log(data);
      let obj = {
        xAxis: [],
        data: [],
        name: `${data[0].start_d}~${data[0].end_d}`,
      };
      data.forEach((a, b) => {
        obj.xAxis.push(a.diff_time);
        obj.data.push(a.cnt);
      });
      console.log(obj);
      var chartDom = document.getElementById(this.id);
      var myChart = window.echarts.init(chartDom);
      this.option.xAxis.data = obj.xAxis;
      this.option.tooltip.formatter = function (val) {
        let s = "";
        for (var i = 0; i < val.length; i++) {
          s += `<div style='width:145px;display:flex;justify-content: space-between;'>
            <span>${val[i].marker}${val[0].name}</span>
            <span>${val[0].value}</span>
            </div>`;
        }
        return s;
      };
      this.option.series[0] = {
        data: obj.data,
        name: obj.name,
        type: "bar",
        barMaxWidth: 45,
      };
      console.log(this.option);
      myChart.setOption(this.option);
      this.myChart = myChart;
    },
    handleWindowResize() {
      const main = document.getElementById(this.id);
      if (main) {
        this.myChart.resize();
      }
    },
  },
  mounted() {
    window.addEventListener("resize", () => {
      this.handleWindowResize();
    });
  },
};
</script>

<style></style>
