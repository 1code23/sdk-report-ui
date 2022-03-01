import { Chart } from "@antv/g2";
export default {
  watch: {
    "queryModel.remain_type"() {
      this.initG2(this.resultList);
    },
    sliderDisabled() {
      this.handleG2Data(this.tableData);
    },
    sections() {
      this.handleG2Data(this.tableData);
    },
  },
  data() {
    return {
      myChart: null,
      chartWidth: "",
      chartHeight: 630,
      colorList: [],
      resultList: [], //处理好的数组
    };
  },
  methods: {
    //处理G2数据
    handleG2Data(list) {
      let data = [];
      let colorList = [];
      list.map((item, ii) => {
        let sum = 0;
        let itemData = item.data;
        if (this.sliderDisabled) {
          itemData = itemData.slice(this.sections[0], this.sections[1]);
        }
        sum = itemData.reduce((pre, cur) => pre + cur);
        itemData.map((d, dd) => {
          let da = {
            name: this.formatText(dd + this.sections[0]), // 当t天前新增名称
            pt: item.pt, //日期
            value: d, //数值
            ratio: Number(((d / sum) * 100).toFixed(2)) || 0, //默认占全部的百分比，可变
            sum: sum, //总和 可变
            sumName: this.sliderDisabled
              ? this.formatSumText()
              : "当日全部活跃",
          };
          data.push(da);
        });
        colorList.push(`hsl(${181 + ii}deg,63%,66%)`);
      });
      this.resultList = data;
      console.log(data);
      this.colorList = colorList;
      this.initG2(data);
    },
    formatSumText() {
      return `${this.formatText(this.sections[0])}至${this.formatText(
        this.sections[1]
      )}的当天活跃用户`;
    },
    formatText(val) {
      if (val == 0) {
        return "在当天新增";
      } else if (val == 31) {
        return "在30+天前新增";
      } else {
        return `在${val}天前新增`;
      }
    },
    initG2(data = []) {
      let that = this;
      if (!this.myChart) {
        // Step 1: 创建 Chart 对象
        this.myChart = new Chart({
          container: "container", // 指定图表容器 ID
          width: that.chartWidth,
          height: that.chartHeight, // 指定图表高度
          padding: [20, 50, 150, 50], // 上，右，下，左
        });
      } else {
        this.myChart.clear(); // 清理所有
      }
      const chart = this.myChart;
      //加载数据
      chart.data(data);
      chart.scale("pt", {
        range: [0, 1],
      });
      // 自定义图例样式
      // https://antv-g2.gitee.io/zh/docs/api/general/legend
      chart.legend(false);
      // 开启缩略轴组件
      chart.option("slider", {
        height: 100,
      });
      //开启提示
      chart.tooltip({
        showCrosshairs: true,
        position: "right",
        itemTpl: `
        <div style="margin-bottom: 10px;">
        <p  style="margin-bottom: 5px;">{name}(占{sumName}比):</p> 
        <p>{value}({ratio}%)</p> </br> 
        <p style="margin-bottom: 5px;">{sumName}:</p>
        <p>{sum}</p>
        </div>
        `,
      });
      //切换绝对值和百分比显示
      let position = "pt*value";
      if (this.queryModel.remain_type !== "value") {
        position = "pt*ratio";
      }
      //创建图形
      chart
        .area({ sortable: true })
        .adjust("stack")
        .position(position)
        .color("name", this.colorList)
        .style({
          fillOpacity: 1,
        })
        .tooltip(
          "name*pt*value*ratio*sum*sumName",
          function (name, pt, value, ratio, sum, sumName) {
            return {
              name: name,
              value: value,
              ratio: ratio,
              sum: sum,
              sumName: sumName,
            };
          }
        );
      chart.render();
    },
    handleWindowResize() {
      this.chartWidth =
        document.querySelector(".router-view").getClientRects()[0].width - 50;
      this.myChart.changeSize(this.chartWidth, this.chartHeight);
    },
  },
  mounted() {
    this.chartWidth =
      document.querySelector(".router-view").getClientRects()[0].width - 50;
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
