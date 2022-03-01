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
  },
  watch: {
    data() {
      this.$nextTick(() => {
        this.chartWidth =
          document.querySelector(".router-view").getClientRects()[0].width - 50;
        this.initChart();
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
    initChart() {
      const data = this.data || [];
      let that = this;
      if (!this.myChart) {
        this.myChart = new Chart({
          container: that.id, // 指定图表容器 ID
          width: that.chartWidth,
          height: that.chartHeight, // 指定图表高度
          padding: [20, 50, 50, 50], // 上，右，下，左
        });
      } else {
        this.myChart.clear(); // 清理所有
      }
      const chart = this.myChart;
      //加载数据
      chart.data(data);
      // chart.scale("UseTime", {
      //   alias: "销售额(万)",
      //   nice: true,
      // });
      chart.tooltip({
        shared: true, // 表示合并当前点对应的所有数据并展示
        showTitle: false,
        showMarkers: false,
        position: "right",
        itemTpl: `<div  style="margin-bottom: 10px;">
        <span style="background-color:{color};" class="g2-tooltip-marker"></span>
        <span style="margin-right:20px"> {UseTime}</span>
       {StartsNum}
        </div>
        `,
      });
      chart.interaction("active-region");
      chart
        .interval()
        .position("UseTime*StartsNum")
        .color("pt")
        .tooltip("UseTime*StartsNum", function (UseTime, StartsNum) {
          return { UseTime, StartsNum };
        });
      chart.render();
    },
    handleChartData() {},
    handleWindowResize() {
      this.chartWidth =
        document.querySelector(".router-view").getClientRects()[0].width - 50;
      this.myChart.changeSize(this.chartWidth, this.chartHeight);
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
