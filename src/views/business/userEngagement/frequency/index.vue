<template>
  <div>
    <BlockContent title="使用频率">
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
          <span class="title">日启动次数分布</span>
          <el-popover placement="bottom-start" width="400" trigger="hover">
            <div style="width: 400px">
              您可以查看用户启动次数的分布情况，同时可以对启动次数的数据进行版本、渠道、分群的交叉筛选。
              <br /><br />
              <span class="titleBlue">日启动次数：</span
              >（用户）一天内启动应用的次数
              <br />
            </div>
            <i
              slot="reference"
              class="el-icon-question"
              style="color: #5faefd"
            ></i>
          </el-popover>
        </div>
      </Header>
      <ChartHistogram id="container" :data="chartData" type="day" />
      <ContractionText
        :closed.sync="detailClosed"
        tableId="frequency"
        @downTable="downTable('frequency')"
      />
      <el-table
        v-show="!detailClosed"
        :header-cell-style="{ background: '#F7F8FA' }"
        :data="chartData"
        :pt="ptDay"
        style="width: 100%"
        id="frequency"
      >
        <el-table-column prop="launch_count" label="启动次数">
        </el-table-column>
        <el-table-column prop="active_cnt" label="用户数" align="center">
          <template slot-scope="{ row }">
            {{ row.active_cnt | toThousands }}
          </template>
        </el-table-column>
        <el-table-column
          prop="SumStartsNumRatio"
          label="用户数比例"
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
          <span class="title">周启动次数分布</span>
          <el-popover placement="bottom-start" width="400" trigger="hover">
            <div style="width: 400px">
              您可以查看用户启动次数的分布情况，同时可以对启动次数的数据进行版本、渠道、分群的交叉筛选。
              <br /><br />
              <span class="titleBlue">周启动次数：</span
              >（用户）一个自然周内启动应用的次数
              <br />
            </div>
            <i
              slot="reference"
              class="el-icon-question"
              style="color: #5faefd"
            ></i>
          </el-popover>
        </div>
      </Header>
      <ChartHistogram
        id="containerweek"
        :data="chartDataWeek"
        :pt="ptWeek"
        type="week"
      />
      <ContractionText
        :closed.sync="detailClosedWeek"
        tableId="chartDataWeek"
        @downTable="downTable('chartDataWeek')"
      />
      <el-table
        v-show="!detailClosedWeek"
        :header-cell-style="{ background: '#F7F8FA' }"
        :data="chartDataWeek"
        style="width: 100%"
        id="chartDataWeek"
      >
        <el-table-column prop="launch_count" label="启动次数">
        </el-table-column>
        <el-table-column prop="active_cnt" label="用户数" align="center">
          <template slot-scope="{ row }">
            {{ row.active_cnt | toThousands }}
          </template>
        </el-table-column>
        <el-table-column
          prop="SumStartsNumRatio"
          label="用户数比例"
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
          <span class="title">月启动次数分布</span>
          <el-popover placement="bottom-start" width="400" trigger="hover">
            <div style="width: 400px">
              您可以查看用户启动次数的分布情况，同时可以对启动次数的数据进行版本、渠道、分群的交叉筛选。
              <br /><br />
              <span class="titleBlue">月启动次数：</span
              >（用户）一个自然月内启动应用的次数
              <br />
            </div>
            <i
              slot="reference"
              class="el-icon-question"
              style="color: #5faefd"
            ></i>
          </el-popover>
        </div>
      </Header>
      <ChartHistogram
        id="containermonth"
        :data="chartDataMonth"
        :pt="ptMonth"
        type="month"
      />
      <ContractionText
        :closed.sync="detailClosedMonth"
        tableId="chartDataMonth"
        @downTable="downTable('chartDataMonth')"
      />
      <el-table
        v-show="!detailClosedMonth"
        :header-cell-style="{ background: '#F7F8FA' }"
        :data="chartDataMonth"
        style="width: 100%"
        id="chartDataMonth"
      >
        <el-table-column prop="launch_count" label="启动次数">
        </el-table-column>
        <el-table-column prop="active_cnt" label="用户数" align="center">
          <template slot-scope="{ row }">
            {{ row.active_cnt | toThousands }}
          </template>
        </el-table-column>
        <el-table-column
          prop="SumStartsNumRatio"
          label="用户数比例"
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
import { useFrequency } from "@/api/userEngagement";
export default {
  components: {
    BlockContent,
    Header,
    Tab,
    Search,
    ChartHistogram,
    ContractionText,
  },
  watch: {
    "queryModel.date_lat"() {
      this.search();
    },
  },
  data() {
    return {
      queryModel: {
        carryApp: true,
        date_lat: "day",
        page: 1,
        size: 30,
        total: 0,
      },
      chartData: [
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
      chartDataWeek: [],
      chartDataMonth: [],
      detailClosed: true,
      detailClosedWeek: true,
      detailClosedMonth: true,
      ptDay: "",
      ptWeek: "",
      ptMonth: "",
    };
  },
  methods: {
    search(row) {
      this.queryModel = { ...this.queryModel, ...row };
      this.queryModel.page = 1;
      this.queryModel.any_date = this.queryModel.custom_date;
      delete this.queryModel.date;
      delete this.queryModel.start_date;
      delete this.queryModel.end_date;
      this.fetchList();
    },
    fetchList() {
      let dayparams = { ...this.queryModel };
      dayparams.date_lat = "day";
      let weekparams = { ...this.queryModel };
      weekparams.date_lat = "week";
      let monthparams = { ...this.queryModel };
      monthparams.date_lat = "month";
      useFrequency(dayparams).then((res) => {
        this.chartData = res.data.list;
      });
      useFrequency(weekparams).then((res) => {
        this.chartDataWeek = res.data.list;
        this.ptWeek = res.data.monthStratAndEnd;
      });
      useFrequency(monthparams).then((res) => {
        this.chartDataMonth = res.data.list;
        this.ptMonth = res.data.monthStratAndEnd;
      });
    },
    downTable(name) {
      // window.adr.utils.downTable(name);
      let tableDatas = "";
      let columnName = [];
      let dayparams = { ...this.queryModel };
      if (name == "frequency") {
        useFrequency({ ...dayparams, date_lat: "day", size: 100000 }).then(
          (res) => {
            tableDatas = res.data.list;
            tableDatas.forEach((item) => {
              item.SumStartsNumRatio = item.SumStartsNumRatio + "%";
            });
            columnName = [
              { key: "launch_count", label: "启动次数" },
              { key: "active_cnt", label: "用户数" },
              { key: "SumStartsNumRatio", label: "用户数比例" },
            ];
            window.adr.exportExcel.exportExcel({
              tHeader: columnName,
              list: tableDatas,
              filename: `${this.queryModel.custom_date}-日启动次数分布`,
            });
          }
        );
      } else if (name == "chartDataWeek") {
        useFrequency({ ...dayparams, date_lat: "week", size: 100000 }).then(
          (res) => {
            tableDatas = res.data.list;
            tableDatas.forEach((item) => {
              item.SumStartsNumRatio = item.SumStartsNumRatio + "%";
            });
            columnName = [
              { key: "launch_count", label: "启动次数" },
              { key: "active_cnt", label: "用户数" },
              { key: "SumStartsNumRatio", label: "用户数比例" },
            ];
            window.adr.exportExcel.exportExcel({
              tHeader: columnName,
              list: tableDatas,
              filename: `${this.queryModel.custom_date}-周启动次数分布`,
            });
          }
        );
      } else {
        useFrequency({ ...dayparams, date_lat: "month", size: 100000 }).then(
          (res) => {
            tableDatas = res.data.list;
            tableDatas.forEach((item) => {
              item.SumStartsNumRatio = item.SumStartsNumRatio + "%";
            });
            columnName = [
              { key: "launch_count", label: "启动次数" },
              { key: "active_cnt", label: "用户数" },
              { key: "SumStartsNumRatio", label: "用户数比例" },
            ];
            window.adr.exportExcel.exportExcel({
              tHeader: columnName,
              list: tableDatas,
              filename: `${this.queryModel.custom_date}-月启动次数分布`,
            });
          }
        );
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
