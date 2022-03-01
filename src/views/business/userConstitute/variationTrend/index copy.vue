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
      <div id="container"></div>
      <div id="container1"></div>
    </BlockContent>
  </div>
</template>

<script>
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
    console.log(this.chartBtmData);
  },
  methods: {
    getCoefficientOfVariation() {
      getCoefficientOfVariation(this.queryModel).then((res) => {
        // this.chartBtmData = res.data.list;
        let Y = Object.keys(res.data.ptList);
        let V = Object.values(res.data.ptList);
        let allPtList = [];
        for (let i = 0; i < Y.length; i++) {
          allPtList.push({ year: Y[i], value: V[i] });
        }
        console.log(allPtList);

        if (!this.myChart) {
          this.initChart(allPtList, res.data.list);
        } else {
          let arr = allPtList.map((c) => {
            c.month = c.year.substring(5);
            return c;
          });
          // let arr = [{ month: "01-17", value: 100, year: "2021-01-17" }];
          this.view1.changeData(arr);
          this.view2.changeData(arr);
        }
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

<style></style>
