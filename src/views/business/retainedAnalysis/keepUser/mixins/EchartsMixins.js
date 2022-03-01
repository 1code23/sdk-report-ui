import * as echarts from "echarts";
import {
  newUserRemainGraph,
  activeUserRemainGraph,
} from "@/api/retainedAnalysis";
export default {
  watch: {
    "queryModel.index"() {
      this.initChart(this.queryModel);
    },
  },
  data() {
    return {
      myChart: null,
      option: {
        grid: {
          left: "4%",
          right: "4%",
          top: "4%",
          bottom: "5%",
          containLabel: true,
        },
        xAxis: {
          type: "category",
          //边界差距，false紧贴
          boundaryGap: false,
          data: [
            "2021-12-21",
            "2021-12-22",
            "2021-12-23",
            "2021-12-24",
            "2021-12-25",
            "2021-12-26",
            "2021-12-27",
          ],
          axisLine: {
            lineStyle: {
              color: "#999999",
            },
          },
        },
        yAxis: {
          type: "value",
          // 背景水平线
          splitLine: {
            show: true,
            lineStyle: {
              color: "#eeeeee",
              type: "dashed",
              width: 1,
            },
          },
          //y轴样式
          axisLine: {
            lineStyle: {
              color: "#999999",
            },
          },
        },
        series: [
          {
            name: "新增用户",
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
            data: [150, 230, 224, 218, 135, 147, 260],
            type: "line",
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
  activated() {
    window.addEventListener("resize", this.handleWindowResize);
  },
  deactivated() {
    window.removeEventListener("resize", this.handleWindowResize);
  },
  mounted() {
    const main = document.getElementById("main");
    this.myChart = echarts.init(main);
    window.addEventListener("resize", () => {
      this.handleWindowResize();
    });
  },
  methods: {
    handleWindowResize() {
      const main = document.getElementById("main");
      if (main) {
        this.myChart.resize();
      }
    },
    initChart(params) {
      let _this = this;
      if (params.index == 1) {
        newUserRemainGraph(params).then((res) => {
          handleData(res.data);
        });
      } else {
        activeUserRemainGraph(params).then((res) => {
          handleData(res.data);
        });
      }
      function handleData(data) {
        let xData = [],
          seriesData = [],
          seriesName = `${params.index}天后留存率`;
        const { list } = data;
        xData = list.dates;
        seriesData = list.items[2].data;
        _this.option.xAxis.data = xData;
        _this.option.series[0].name = seriesName;
        _this.option.series[0].data = seriesData;
        _this.myChart.setOption(_this.option);
      }
    },
  },
};
