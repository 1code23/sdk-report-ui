<template>
  <div>
    <BlockContent title="变化系数趋势" style="padding-bottom: 0" />
    <BlockContent>
      <Header>
        <div class="header-title" slot="l">
          <span class="title">变化系数</span>
          <el-popover placement="bottom-start" width="400" trigger="hover">
            <div style="width: 400px; font-size: 12px">
              为了更好地衡量您的App的用户质量，我们定义了几个系数来帮助您对App的用户进行分析和对比。
              <br />
              您也可以通过用户成分转化页面来了解这些系数的定义。 <br />
              新增系数：当周新增占上周活跃的比例 <br />
              回流系数：上周流失用户在当周回流的部分占上周活跃的比例 <br />
              留存系数：上周活跃用户在本周仍旧活跃的部分占上周活跃的比例 <br />
              平衡系数：当周活跃用户中的老用户部分占上周活跃用户的比例，平衡系数=回流系数+留存系数
              <br />
              变化系数：活跃用户的变化情况，即当周活跃用户相对于上周活跃的变化，变化系数=新增系数+平衡系数
            </div>
            <i
              slot="reference"
              class="el-icon-question"
              style="color: #ccc"
            ></i>
          </el-popover>
        </div>
        <Tab slot="r" :list="tabOptions" :activeId.sync="queryModel.type" />
      </Header>
      <!-- <div id="container"></div>
      <div id="container1"></div> -->
      <div class="chartsWpper" ref="chartsZom" id="mainZom"></div>
    </BlockContent>
  </div>
</template>

<script>
import * as echarts from "echarts";
import { BlockContent, Header, Tab } from "@/components/BlockContent/index.js";
import ChartMixins from "./mixins/ChartMixins";
import { getCoefficientOfVariation } from "@/api/userConstitute";
// import G2 from './123.js';
import moment from "moment";
export default {
  mixins: [ChartMixins],
  components: {
    BlockContent,
    Header,
    Tab,
  },
  data() {
    return {
      queryModel: {
        carryApp: true,
        type: "active",
        // type: "loyal",
        start_d: "",
        end_d: "",
      },
      tabOptions: [
        {
          id: "active",
          title: "活跃用户",
        },
        {
          id: "loyal",
          title: "忠诚用户",
        },
      ],
      option: {
        tooltip: {
          trigger: "axis",
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: "shadow", // 默认为直线，可选为：'line' | 'shadow'
          },
          // formatter: "",
        },
        legend: {
          bottom: "18%",
          show: true,
        },
        grid: [
          {
            top: "5%",
            width: "95%",
            bottom: "25%",
            left: 0,
            containLabel: true,
            padding: [10, 10, 10, 10],
          },
          {
            top: "88%",
            width: "94%",
            bottom: 0,
            left: "4%",
            // right: "4%",
            containLabel: true,
            padding: [10, 10, 10, 10],
          },
        ],
        xAxis: [
          {
            // type: "value",
            type: "category",
            data: [],
            splitLine: {
              show: false,
            },
            boundaryGap: false, // 不留白，从原点开始
          },
          {
            // type: "value",
            type: "category",
            data: [],
            gridIndex: 1,
            splitLine: {
              show: false,
            },
          },
        ],
        yAxis: [
          {
            type: "value",
            axisLine: {
              //y轴
              show: false,
            },
            axisTick: {
              //y轴刻度线
              show: false,
            },
            splitLine: {
              //网格线
              show: false,
            },
          },
          {
            gridIndex: 1,
            type: "value",
            show: true,
            axisLine: {
              //y轴
              show: false,
            },
            axisTick: {
              //y轴刻度线
              show: false,
            },
            splitLine: {
              //网格线
              show: false,
            },
            axisLabel: {
              //y轴数据
              formatter: function () {
                return "";
              },
            },
          },
        ],
        dataZoom: [
          {
            type: "inside",
            filterMode: "empty",
            start: 87,
            end: 100,
          },
          {
            // type: "slider",
            filterMode: "empty",
            start: 87,
            end: 100,
            dataBackground: {
              lineStyle: {
                opacity: 0,
              },
              areaStyle: {
                opacity: 0,
                color: "#73D3D5",
              },
            },
            selectedDataBackground: {
              lineStyle: {
                opacity: 0,
              },
              areaStyle: {
                opacity: 0,
              },
            },
            bottom: 23,
            height: 50,
            left: "4%",
            right: "4%",
          },
        ],
        series: [
          {
            name: "新增系数",
            type: "line",
            areaStyle: {},
            data: [
              // 1, 2, 3, 4, 5, 6, 7, 8, 9, 11, 12, 23, 34, 4, 56, 56, 6, 7, 34,
              // 56, 75, 34, 12, 34, 33, 65, 23, 46, 12,
            ],
            // data: [],
          },
          {
            name: "回流系数",
            type: "line",
            areaStyle: {},
            data: [8, 9, 11, 12, 23, 34, 4, 56, 56, 6, 7],
          },
          {
            name: "留存系数",
            type: "line",
            areaStyle: {},
            data: [2, 3, 4, 5, 6, 7, 8, 9, 11, 12, 23, 34, 4],
          },
          {
            name: "平衡系数",
            type: "line",
            areaStyle: {},
            data: [56, 75, 34, 12, 34, 33, 65, 23, 46, 12],
          },
          {
            name: "变化系数",
            type: "line",
            areaStyle: {},
            data: [12, 23, 34, 4, 56, 56, 6],
          },
          // 滑块数据
          {
            xAxisIndex: 1,
            yAxisIndex: 1,
            // name: "Direct",
            type: "bar",
            // data: [10, 52, 200, 334, 300, 330, 220, 100, 200, 300],
            data: [],
            show: false,
            itemStyle: {
              //通常情况下：
              normal: { color: "#73D3D5" },
            },
            tooltip: {
              show: false,
            },
          },
        ],
      },
    };
  },
  created() {
    const now = new Date();
    const start_d = `${now.getFullYear() - 1}-${
      now.getMonth() + 1
    }-${now.getDate()}`;
    const end_d = now;
    this.queryModel.start_d = moment(start_d).format("YYYY-MM-DD");
    this.queryModel.end_d = moment(end_d).format("YYYY-MM-DD");
  },
  mounted() {
    this.getCoefficientOfVariation();
    const main = document.getElementById("mainZom");
    this.myChart = echarts.init(main);
    this.myChart.setOption(this.option);
  },
  methods: {
    getCoefficientOfVariation() {
      getCoefficientOfVariation(this.queryModel).then((res) => {
        let chartBtmData = res.data.list;
        // console.log(allPtList);
        let allPtList = [];
        let mX = []; //上方折线图x轴数据
        let mNY = []; //上方折线图y轴新增字段数据
        let mBY = []; //上方折线图y轴回流字段数据
        let mRY = []; //上方折线图y轴留存字段数据
        let mBAY = []; //上方折线图y轴平衡字段数据
        let mCHY = []; //上方折线图y轴变化字段数据
        let sliderX = []; //滑块x轴数据
        let sliderY = []; //滑块y轴数据
        chartBtmData.forEach((item) => {
          allPtList.push({ year: item.start_d, value: item.new_user_week });
          mX.push(item.start_d.substring(5));
          mNY.push(item.new_coefficient_ratio);
          mBY.push(item.Backflow_Coefficient_ratio);
          mRY.push(item.remain_coefficient_ratio);
          mBAY.push(item.balance_coefficient_ratio);
          mCHY.push(item.change_coefficient_ratio);
        });
        allPtList.forEach((item) => {
          sliderX.push(item.year);
          sliderY.push(item.value);
        });
        this.option.series[5].data = sliderY;
        this.option.xAxis[1].data = sliderX;
        this.option.xAxis[0].data = mX;
        this.option.series[0].data = mNY;
        this.option.series[1].data = mBY;
        this.option.series[2].data = mRY;
        this.option.series[3].data = mBAY;
        this.option.series[4].data = mCHY;

        this.myChart.setOption(this.option);
        //  this.option.series[0].data = [
        //   1, 2, 3, 4, 5, 6, 7, 8, 9, 11, 12, 23, 34, 4, 56, 56, 6, 7, 34, 56,
        //   75, 34, 12, 34, 33, 65, 23, 46, 12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 11, 12,
        //   23, 34, 4, 56, 56, 6, 7, 34, 56, 75, 34, 12, 34, 33, 65, 23, 46, 12,
        // ];

        // if (!this.myChart) {
        //   this.initChart(allPtList, res.data.list);
        // } else {
        //   let arr = allPtList.map((c) => {
        //     c.month = c.year.substring(5);
        //     return c;
        //   });
        //   // let arr = [{ month: "01-17", value: 100, year: "2021-01-17" }];
        //   this.view1.changeData(arr);
        //   this.view2.changeData(arr);
        // }
      });
    },
  },
  watch: {
    "queryModel.type"() {
      this.getCoefficientOfVariation();
    },
  },
};
</script>

<style lang="scss" scoped>
.chartsWpper {
  width: 100%;
  height: 500px;
  background: white;
}
</style>
