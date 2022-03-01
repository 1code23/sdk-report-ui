import { Chart, registerInteraction } from "@antv/g2";
// import G2 from "@antv/g2";
export default {
  watch: {
    // "queryModel.type"() {
    //   this.initChart(this.chartBtmData);
    //   console.log(this.chartBtmData);
    // },
  },
  data() {
    return {
      myChart: null,
      myChart1: null,
      chartWidth: "",
      chartHeight: 500,
      chartData: [
        { country: "Asia", year: "1750", value: 502 },
        { country: "Asia", year: "1800", value: 635 },
        { country: "Asia", year: "1850", value: 809 },
        { country: "Asia", year: "1900", value: 5268 },
        { country: "Asia", year: "1950", value: 4400 },
        { country: "Asia", year: "1999", value: 3634 },
        { country: "Asia", year: "2050", value: 947 },
        { country: "Africa", year: "1750", value: 106 },
        { country: "Africa", year: "1800", value: 107 },
        { country: "Africa", year: "1850", value: 111 },
        { country: "Africa", year: "1900", value: 1766 },
        { country: "Africa", year: "1950", value: 221 },
        { country: "Africa", year: "1999", value: 767 },
        { country: "Africa", year: "2050", value: 133 },
        { country: "Europe", year: "1750", value: 163 },
        { country: "Europe", year: "1800", value: 203 },
        { country: "Europe", year: "1850", value: 276 },
        { country: "Europe", year: "1900", value: 628 },
        { country: "Europe", year: "1950", value: 547 },
        { country: "Europe", year: "1999", value: 729 },
        { country: "Europe", year: "2050", value: 408 },
        { country: "Oceania", year: "1750", value: 200 },
        { country: "Oceania", year: "1800", value: 200 },
        { country: "Oceania", year: "1850", value: 200 },
        { country: "Oceania", year: "1900", value: 460 },
        { country: "Oceania", year: "1950", value: 230 },
        { country: "Oceania", year: "1999", value: 300 },
        { country: "Oceania", year: "2050", value: 300 },
      ],
      chartBtmData: [
        {
          // year: "2021-01-03",
          // new_coefficient_ratio: "新增系数",
          // value: 17552,
          // Backflow_Coefficient_ratio: "回流系数",
          // Bvalue: 17553,
          // remain_coefficient_ratio: "留存系数",
          // Rvalue: 17554,
          // balance_coefficient_ratio: "平衡系数",
          // BAvalue: 17555,
          // change_coefficient_ratio: "变化系数",
          // Cvalue: 17536,
        },
        // {
        //   year: "2021-01-03",
        //   new_coefficient_ratio: "新增系数",
        //   value: 17552,
        // },
        // {
        //   year: "2021-01-03",
        //   new_coefficient_ratio: "新增",
        //   value: 17552,
        // },
        // {
        //   year: "2021-01-10",
        //   new_coefficient_ratio: "新增系数",
        //   value: 17659,
        // },
        // {
        //   year: "2021-01-10",
        //   new_coefficient_ratio: "新增",
        //   value: 17935,
        // },
        {
          year: "2021-01-10",
          value: 17892,
        },
        {
          year: "2021-01-17",
          value: 18639,
        },
        {
          year: "2021-01-24",
          value: 19998,
        },
        {
          year: "2021-01-31",
          value: 20029,
        },
        {
          year: "2021-02-07",
          value: 19943,
        },
        {
          year: "2021-02-14",
          value: 19879,
        },
        {
          year: "2021-02-21",
          value: 19981,
        },
        {
          year: "2021-02-28",
          value: 19971,
        },
        {
          year: "2021-03-07",
          value: 19848,
        },
        {
          year: "2021-03-14",
          value: 19765,
        },
        {
          year: "2021-03-21",
          value: 14530,
        },
        {
          year: "2021-03-28",
          value: 13440,
        },
        {
          year: "2021-04-04",
          value: 13536,
        },
        {
          year: "2021-04-11",
          value: 13544,
        },
        {
          year: "2021-04-18",
          value: 13421,
        },
        {
          year: "2021-04-25",
          value: 13558,
        },
        {
          year: "2021-05-02",
          value: 13504,
        },
        {
          year: "2021-05-09",
          value: 20982,
        },
        {
          year: "2021-05-16",
          value: 9297,
        },
        {
          year: "2021-05-23",
          value: 13514,
        },
        {
          year: "2021-05-30",
          value: 12244,
        },
        {
          year: "2021-06-06",
          value: 16956,
        },
        {
          year: "2021-06-13",
          value: 18391,
        },
        {
          year: "2021-06-20",
          value: 19634,
        },
        {
          year: "2021-06-27",
          value: 18145,
        },
        {
          year: "2021-07-04",
          value: 19080,
        },
        {
          year: "2021-07-11",
          value: 19104,
        },
        {
          year: "2021-07-18",
          value: 19727,
        },
        {
          year: "2021-07-25",
          value: 19919,
        },
        {
          year: "2021-08-01",
          value: 19999,
        },
        {
          year: "2021-08-08",
          value: 19844,
        },
        {
          year: "2021-08-15",
          value: 19879,
        },
        {
          year: "2021-08-22",
          value: 19000,
        },
        {
          year: "2021-08-29",
          value: 25720,
        },
        {
          year: "2021-09-05",
          value: 62585,
        },
        {
          year: "2021-09-12",
          value: 73763,
        },
        {
          year: "2021-09-19",
          value: 87265,
        },
        {
          year: "2021-09-26",
          value: 46989,
        },
        {
          year: "2021-10-03",
          value: 21898,
        },
        {
          year: "2021-10-10",
          value: 21958,
        },
        {
          year: "2021-10-17",
          value: 22328,
        },
        {
          year: "2021-10-24",
          value: 22742,
        },
        {
          year: "2021-10-31",
          value: 21295,
        },
        {
          year: "2021-11-07",
          value: 21814,
        },
        {
          year: "2021-11-14",
          value: 21991,
        },
        {
          year: "2021-11-21",
          value: 22558,
        },
        {
          year: "2021-11-28",
          value: 19427,
        },
        {
          year: "2021-12-05",
          value: 20681,
        },
        {
          year: "2021-12-12",
          value: 21097,
        },
        {
          year: "2021-12-19",
          value: 21192,
        },
        {
          year: "2021-12-26",
          value: 19637,
        },
      ],
    };
  },
  methods: {
    initChart(val, detailList) {
      console.log(val, detailList);
      // const data = this.chartBtmData.map((c) => {
      const data = val.map((c) => {
        c.month = c.year.substring(5);
        return c;
      });
      const detailData = detailList.map((c) => {
        c.month = c.start_d.substring(5);
        return c;
      });

      // console.log(data);
      let that = this;
      // 定义新的交互
      registerInteraction("other-filter", {
        showEnable: [
          { trigger: "plot:mouseenter", action: "cursor:crosshair" },
          { trigger: "mask:mouseenter", action: "cursor:move" },
          { trigger: "plot:mouseleave", action: "cursor:default" },
          { trigger: "mask:mouseleave", action: "cursor:crosshair" },
        ],
        start: [
          {
            trigger: "plot:mousedown",
            isEnable(context) {
              return !context.isInShape("mask");
            },
            action: ["x-rect-mask:start", "x-rect-mask:show"],
          },
          { trigger: "mask:dragstart", action: "x-rect-mask:moveStart" },
        ],
        processing: [
          {
            trigger: "plot:mousemove",
            action: ["x-rect-mask:resize"],
          },
          { trigger: "mask:drag", action: "x-rect-mask:move" },
          {
            trigger: "mask:change",
            action: [
              "element-range-highlight:highlight",
              "sibling-x-filter:filter", //数据处理
            ],
          },
        ],
        end: [
          {
            trigger: "plot:mouseup",
            action: "x-rect-mask:end",
            callback(context) {
              console.log("------框选结束");
              console.log(context);
            },
          },
          // { trigger: "plot:mouseleave", action: "x-rect-mask:end" },
          {
            trigger: "mask:dragend",
            action: ["x-rect-mask:moveEnd"],
            callback(context) {
              console.log("------拖动结束");
              console.log(context);
              // const { event } = context;
              // const delegateObject = event.target.get("delegateObject");
              // const component = delegateObject.component;
              // const value = component.getValue(); // 选中的文本范围
              // console.log(value);
            },
          },
        ],
        rollback: [
          {
            trigger: "dblclick",
            action: ["x-rect-mask:hide"],
          },
        ],
      });
      if (!this.myChart) {
        this.myChart = new Chart({
          container: "container",
          width: that.chartWidth,
          height: that.chartHeight, // 指定图表高度
          defaultInteractions: [],
        });
      } else {
        this.myChart.clear(); // 清理所有
      }
      // this.myChart = new Chart({
      //   container: "container",
      //   width: that.chartWidth,
      //   height: that.chartHeight, // 指定图表高度
      //   defaultInteractions: [],
      //   renderer: "svg",
      // });
      const chart = this.myChart;
      const view1 = chart.createView({
        region: {
          start: {
            x: 0,
            y: 0,
          },
          end: {
            x: 1,
            y: 0.7,
          },
        },
      });
      view1.scale("year", {
        tickCount: 5,
        range: [0, 1],
      });
      view1.interaction("tooltip");
      view1.data(data);
      // view1.area().position("year*new_user_week");
      // view1.line().position("year*new_user_week");
      const view2 = chart.createView({
        region: {
          start: {
            x: 0,
            y: 0.75,
          },
          end: {
            x: 1,
            y: 1,
          },
        },
      });

      // view2.tooltip(false);
      view1.tooltip({
        // showMarkers: false, 不显示小点
        showCrosshairs: true, //显示辅助线
        position: "right",
        itemTpl: `
        <div style="margin-bottom: 10px;">
        <p style="margin-bottom: 5px;">新增系数：{new_coefficient_ratio}</p>
        <p style="margin-bottom: 5px;">回流系数：{Backflow_Coefficient_ratio}</p>
        <p style="margin-bottom: 5px;">留存系数：{remain_coefficient_ratio}</p>
        <p style="margin-bottom: 5px;">平衡系数：{balance_coefficient_ratio}</p>
        <p style="margin-bottom: 5px;">变化系数：{change_coefficient_ratio}</p>
        </div>
        `,
      });
      view2.data(data);
      view2.axis("value", false);
      view2.interaction("other-filter", { extra: "hello world" });
      view2.interval().position("month*value").color("rgb(164, 164, 164)");
      view2.interaction("other-filter", {
        style: {
          lineWidth: 1,
          stroke: "red",
          fill: "red",
          fillOpacity: 0.9,
        },
        // onBrushmove() {
        //   chart.hideTooltip();
        // },
      });
      // view2.on("element:mouseup", (ev) => {
      //   const target = ev.target;
      //   const delegateObject = target.get("delegateObject");
      //   const component = delegateObject.component;
      //   const value = component.getValue(); // 选中的文本范围
      //   console.log(value);
      // });
      //创建图形
      view1
        .area({ sortable: true })
        .adjust("stack")
        .position("month*value")
        // .color("name", this.colorList)
        // .color("new_coefficient_ratio", ["#eeff77", "blue"])
        .style({
          fillOpacity: 1,
        })
        .tooltip(
          "new_coefficient_ratio*Backflow_Coefficient_ratio*remain_coefficient_ratio*balance_coefficient_ratio*change_coefficient_ratio",
          function (
            new_coefficient_ratio,

            Backflow_Coefficient_ratio,

            remain_coefficient_ratio,

            balance_coefficient_ratio,

            change_coefficient_ratio
          ) {
            // let sumNameText = "";
            // if (!that.sliderDisabled) {
            //   if (that.activeName == "1") {
            //     sumNameText = `(即${pt}活跃用户)`;
            //   } else {
            //     let day = 24 * 60 * 60 * 1000;
            //     let before15 = moment(new Date(pt).getTime() - day * 15).format(
            //       "YYYY-MM-DD"
            //     );
            // sumNameText = `${new_coefficient_ratio}:${value}`;
            //   }
            // }
            return {
              Backflow_Coefficient_ratio,

              remain_coefficient_ratio,

              balance_coefficient_ratio,

              change_coefficient_ratio,

              new_coefficient_ratio,
            };
          }
        );
      this.view1 = view1;
      this.view2 = view2;
      chart.render();
    },
    // initChart2(val, detailList) {
    //   console.log(val);
    //   console.log(G2);
    //   const chart = new G2.Chart({
    //     container: "container", // 指定图表容器 ID
    //     forceFit: true,
    //     height: 400,
    //     animate: false,
    //     padding: [100, 40, 50, 80],
    //   });
    //   chart.source(val);
    //   chart.area().position("year*sold").color("genre");
    //   chart.render();
    //   const chart2 = new G2.Chart({
    //     container: "container1",
    //     forceFit: true,
    //     height: 100,
    //     padding: [5, 40, 60, 80],
    //   });
    //   chart2.source(val, {});
    //   chart2.tooltip(false);
    //   chart2.axis("price", false);
    //   chart2
    //     .interval()
    //     .position("year*sold")
    //     .active(false)
    //     .shape("smooth")
    //     .opacity(0.85);
    //   chart2.render();
    //   chart2.interact("brush", {
    //     style: {
    //       lineWidth: 0,
    //       stroke: "red",
    //       fill: "#73D3D5",
    //       fillOpacity: 0.3,
    //     },
    //     type: "X",
    //     draggable: true,
    //     inPlot: false,
    //     onBrushmove(ev) {
    //       console.log(ev);
    //       // const { date } = ev;
    //       // ds.setState("dates", date);
    //     },
    //     onDragmove(ev) {
    //       // const { date } = ev;
    //       // ds.setState("dates", date);
    //     },
    //   });
    // },
    chartTop() {
      const data = this.chartData;
      let that = this;
      if (!this.myChart) {
        this.myChart = new Chart({
          container: "container",
          width: that.chartWidth,
          height: that.chartHeight, // 指定图表高度
          padding: [20, 50, 170, 80], // 上，右，下，左
        });
      } else {
        this.myChart.clear(); // 清理所有
      }
      const chart = this.myChart;
      //加载数据
      chart.data(data);
      chart.scale("year", {
        type: "linear",
        tickInterval: 50,
      });
      chart.scale("value", {
        nice: true,
      });
      chart.tooltip({
        showCrosshairs: true,
        shared: true,
      });
      chart.option("slider", {
        height: 100,
        trendCfg: {
          data: [1, 2],
        },
      });
      chart.area().adjust("stack").position("year*value").color("country");
      chart.line().adjust("stack").position("year*value").color("country");
      chart.render();
    },
    //窗口监听方法
    handleWindowResize() {
      if (this.myChart) {
        this.chartWidth =
          document.querySelector(".router-view").getClientRects()[0].width - 50;
        this.myChart.changeSize(this.chartWidth, this.chartHeight);
      }
    },
  },
  mounted() {
    this.chartWidth =
      document.querySelector(".router-view").getClientRects()[0].width - 50;
    window.addEventListener("resize", () => {
      this.myChart.resize();
    });
    // this.initChart();
  },
  activated() {
    window.addEventListener("resize", this.handleWindowResize);
  },
  deactivated() {
    window.removeEventListener("resize", this.handleWindowResize);
  },
};
