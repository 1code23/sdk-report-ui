<template>
  <div>
    <BlockContent title="使用时长">
      <!-- <Search @search="search" :type="['date_radio', 'channel', 'versions']" /> -->
      <Search
        @search="search"
        :customDayNum="0"
        :type="['custom_date', 'channel', 'versions']"
      />
    </BlockContent>
    <BlockContent>
      <Header>
        <div class="header-title" slot="l">
          <span class="title">单次使用时长分布</span>
          <el-popover placement="bottom-start" width="400" trigger="hover">
            <div style="width: 400px">
              您可以查看用户在任意1天内单次使用时长的分布情况，同时可以对单次使用时长的数据进行版本、渠道、分群的交叉筛选。
              <br />
              <span class="titleBlue">单次使用时长：</span>一次启动的使用时长
            </div>
            <i
              slot="reference"
              class="el-icon-question"
              style="color: #5faefd"
            ></i>
          </el-popover>
        </div>
      </Header>
      <ChartHistogram id="container1" :data="chartData1" />
      <ContractionText
        :closed.sync="detailClosed1"
        tableId="danUse"
        @downTable="downTable('danUse')"
      />
      <el-table
        v-show="!detailClosed1"
        :header-cell-style="{ background: '#F7F8FA' }"
        :data="chartData1"
        style="width: 100%"
        id="danUse"
      >
        <!-- cell-style="font-weight: 700 !important;" -->
        <el-table-column prop="use_time" label="时长"> </el-table-column>
        <el-table-column prop="StartsNum" label="启动次数" align="center">
          <template slot-scope="{ row }">
            {{ row.StartsNum | toThousands }}
          </template>
        </el-table-column>
        <el-table-column
          prop="SumStartsNumRatio"
          label="启动次数占比"
          align="right"
        >
          <template slot-scope="{ row }">
            {{ row.SumStartsNumRatio }}%
          </template>
        </el-table-column>
      </el-table>
    </BlockContent>
    <BlockContent>
      <Header>
        <div class="header-title" slot="l">
          <span class="title">日使用时长分布</span>
          <el-popover placement="bottom-start" width="400" trigger="hover">
            <div style="width: 400px">
              您可以查看用户在任意1天内日使用时长的分布情况，同时可以对日使用时长的数据进行版本、渠道、分群的交叉筛选。
              <br />
              <span class="titleBlue">日使用时长：</span
              >（用户）一天内使用应用的时长
            </div>
            <i
              slot="reference"
              class="el-icon-question"
              style="color: #5faefd"
            ></i>
          </el-popover>
        </div>
      </Header>
      <ChartHistogramDay id="container2" :data="chartData2" />
      <ContractionText
        :closed.sync="detailClosed2"
        tableId="dayUse"
        @downTable="downTable('dayUse')"
      />
      <el-table
        v-show="!detailClosed2"
        :header-cell-style="{
          background: '#F7F8FA',
        }"
        :data="chartData2"
        style="width: 100%"
        id="dayUse"
      >
        <el-table-column prop="UseTime" label="时长"> </el-table-column>
        <el-table-column prop="StartsNum" label="用户数" align="center">
          <template slot-scope="{ row }">
            {{ row.StartsNum | toThousands }}
          </template>
        </el-table-column>
        <el-table-column
          prop="SumStartsNumRatio"
          label="用户数占比"
          align="right"
        >
          <template slot-scope="{ row }">
            {{ row.SumStartsNumRatio }}%
          </template>
        </el-table-column>
      </el-table>
    </BlockContent>
  </div>
</template>

<script>
import {
  BlockContent,
  Header,
  Search,
  Tab,
} from "@/components/BlockContent/index.js";
import ContractionText from "@/components/ContractionText";
import ChartHistogram from "./components/ChartHistogram.vue";
import ChartHistogramDay from "./components/ChartHistogramDay.vue";
import { singleUseDuration, dayUseDuration } from "@/api/userEngagement";
export default {
  components: {
    BlockContent,
    Header,
    Tab,
    Search,
    ChartHistogram,
    ChartHistogramDay,
    ContractionText,
  },
  data() {
    return {
      queryModel: {
        carryApp: true,
        page: 1,
        size: 30,
        total: 0,
      },
      chartData1: [
        {
          use_time: "1秒-3秒",
          StartsNum: 30,
          SumStartsNumRatio: 2.25,
          pt: "2022-01-03",
        },
        {
          use_time: "4秒-10秒",
          StartsNum: 90,
          SumStartsNumRatio: 2.25,
          pt: "2022-01-03",
        },
        {
          use_time: "11秒-30秒",
          StartsNum: 50,
          SumStartsNumRatio: 2.25,
          pt: "2022-01-03",
        },
        {
          use_time: "31秒-1分",
          StartsNum: 30,
          SumStartsNumRatio: 2.25,
          pt: "2022-01-03",
        },
        {
          use_time: "1分-3分",
          StartsNum: 70,
          SumStartsNumRatio: 2.25,
          pt: "2022-01-03",
        },
        {
          use_time: "3分-10分",
          StartsNum: 70,
          SumStartsNumRatio: 2.25,
          pt: "2022-01-03",
        },
        {
          use_time: "10分-30分",
          StartsNum: 70,
          SumStartsNumRatio: 2.25,
          pt: "2022-01-03",
        },
        {
          use_time: "30分+",
          StartsNum: 100,
          SumStartsNumRatio: 2.25,
          pt: "2022-01-03",
        },
      ],
      detailClosed1: true,
      chartData2: [],
      detailClosed2: true,
    };
  },
  methods: {
    search(row) {
      this.queryModel = { ...this.queryModel, ...row };
      this.queryModel.page = 1;
      this.queryModel.any_date = this.queryModel.custom_date;
      delete this.queryModel.date;
      delete this.queryModel.start_date;
      delete this.queryModel.start_date;
      this.fetchList();
    },
    fetchList() {
      singleUseDuration(this.queryModel).then((res) => {
        this.chartData1 = res.data.list;
      });
      dayUseDuration(this.queryModel).then((res) => {
        this.chartData2 = res.data.list;
        // this.chartData2 = this.chartData1;
      });
    },
    downTable(name) {
      // window.adr.utils.downTable(name);
      let tableDatas = "";
      let columnName = [];
      if (name == "danUse") {
        singleUseDuration({ ...this.queryModel, size: 100000 }).then((res) => {
          tableDatas = res.data.list;
          tableDatas.forEach((item) => {
            item.SumStartsNumRatio = item.SumStartsNumRatio + "%";
          });
          columnName = [
            { key: "use_time", label: "时长" },
            { key: "StartsNum", label: "启动次数" },
            { key: "SumStartsNumRatio", label: "启动次数占比" },
          ];
          window.adr.exportExcel.exportExcel({
            tHeader: columnName,
            list: tableDatas,
            filename: `${this.queryModel.custom_date}-单次使用时长分布`,
          });
        });
      } else {
        dayUseDuration({ ...this.queryModel, size: 100000 }).then((res) => {
          tableDatas = res.data.list;
          tableDatas.forEach((item) => {
            item.SumStartsNumRatio = item.SumStartsNumRatio + "%";
          });

          columnName = [
            { key: "UseTime", label: "时长" },
            { key: "StartsNum", label: "用户数" },
            { key: "SumStartsNumRatio", label: "用户数占比" },
          ];
          window.adr.exportExcel.exportExcel({
            tHeader: columnName,
            list: tableDatas,
            filename: `${this.queryModel.custom_date}-日使用时长分布`,
          });
        });
      }
    },
  },
};
</script>

<style scoped lang="scss">
/deep/.el-table th.el-table__cell > .cell {
  font-weight: 600 !important;
  color: #252934 !important;
}
</style>
