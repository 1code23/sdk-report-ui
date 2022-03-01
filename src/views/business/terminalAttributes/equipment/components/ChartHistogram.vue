<template>
  <div>
    <div :id="id" v-show="data"></div>
    <el-empty v-if="!data" description="暂无数据"></el-empty>
  </div>
</template>

<script>
import { Chart } from "@antv/g2";
export default {
  props: {
    id: String,
    data: Array,
    params: Object,
  },
  watch: {
    data() {
      this.$nextTick(() => {
        this.chartWidth =
          document.querySelector(".router-view").getClientRects()[0].width - 50;
        this.handleChartData();
      });
    },
  },
  data() {
    return {
      myChart: null,
      chartWidth: "",
      chartHeight: 500,
    };
  },
  methods: {
    initChart(data) {
      data.reverse();
      let that = this;
      if (!this.myChart) {
        this.myChart = new Chart({
          container: that.id, // 指定图表容器 ID
          width: that.chartWidth,
          height: that.chartHeight, // 指定图表高度
          padding: [20, 50, 50, 80], // 上，右，下，左
        });
      } else {
        this.myChart.clear(); // 清理所有
      }
      const chart = this.myChart;
      //加载数据
      chart.data(data);
      //转条形图
      chart.coordinate().transpose();
      chart.tooltip({
        shared: true, // 表示合并当前点对应的所有数据并展示
        showTitle: false,
        showMarkers: false,
        position: "right",
        itemTpl: `<div  style="margin-bottom: 10px;">
        <span style="background-color:{color};" class="g2-tooltip-marker"></span>
        <span style="margin-right:20px"> {value}</span>
       {num}
        </div>
        `,
      });
      chart.interaction("active-region");
      chart.scale("num", {
        nice: true,
      });
      chart.axis("value", {
        tickLine: null, //不显示刻度线
      });
      chart.axis("num", {
        grid: {
          //背景网格刻度线样式
          line: {
            style: {
              lineWidth: 0.5,
              lineDash: [5, 2], //虚线
            },
          },
        },
      });
      chart
        .interval()
        .position("value*num")
        .color("pt")
        .tooltip("value*num", function (value, num) {
          return { value, num };
        });
      chart.render();
    },
    handleChartData() {
      if (!this.data) {
        return;
      }
      const { start_date, end_date, type, tab_type } = this.params;
      const data = this.data.map((item) => {
        let obj = { ...item };
        if (tab_type == "new") {
          obj.num = item.new_cnt;
          obj.name = "新增用户";
        }
        if (tab_type == "active") {
          obj.num = item.active_cnt;
          obj.name = "活跃用户";
        }
        if (tab_type == "boot") {
          obj.num = item.boot_cnt;
          obj.name = "启动次数";
        }
        obj.pt = `${start_date}~${end_date} ${obj.name}`;
        return obj;
      });
      this.initChart(data);
    },
    handleWindowResize() {
      if (this.myChart) {
        this.chartWidth =
          document.querySelector(".router-view").getClientRects()[0].width - 50;
        this.myChart.changeSize(this.chartWidth, this.chartHeight);
      }
    },
  },

  mounted() {
    window.addEventListener("resize", () => {
      this.handleWindowResize();
    });
  },
  activated() {
    window.addEventListener("resize", this.handleWindowResize);
  },
  deactivated() {
    window.removeEventListener("resize", this.handleWindowResize);
  },
};
</script>

<style></style>
