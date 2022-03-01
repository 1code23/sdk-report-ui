<template>
  <div class="userInterval">
    <BlockContent title="使用间隔">
      <Search
        @search="search"
        :customDayNum="-29"
        :type="['custom_date', 'channel', 'versions']"
      />
    </BlockContent>
    <div class="panel">
      <Header>
        <div slot="l">
          <span class="title">使用间隔分布</span>
          <el-popover placement="right-start" width="300" trigger="hover">
            <div style="" class="headerTip">
              <p>
                您可以查看任意30天内用户相邻两次启动间隔的分布情况，并可以进行版本、渠道及分群的筛选。
              </p>
              <p>
                <span class="titleBlue">使用间隔：</span
                >同一用户相邻两次启动间隔的时间长度。在固定的查询时段内，若用户A仅在第2天、第3天、第7天启动过应用，则“1天”和“4天”的计数分别加1；若用户B仅在第4天启动过三次应用，则“0-24h”的计数加2；若用户C仅第10天启动过一次应用，则“首次”的计数加1
              </p>
              <p>
                <span class="titleBlue">首次：</span
                >在固定的查询时段内只启动过一次的用户记为首次
              </p>
            </div>
            <i
              slot="reference"
              class="el-icon-question"
              style="color: #5faefd"
            ></i>
          </el-popover>
        </div>
      </Header>
      <pdPanel>
        <chartPanel id="container" :data="chartData1"> </chartPanel>
        <ContractionText
          class="disfr"
          :closed.sync="detailClosed1"
          @downTable="downTable('useIntervalTable')"
        >
        </ContractionText>
        <el-table
          v-if="!detailClosed1"
          :header-cell-style="{ background: '#F7F8FA' }"
          :data="chartData1"
          class="useIntervalTable"
          style="width: 100%"
          header-row-class-name="headerRow fw7"
          id="useIntervalTable"
        >
          <el-table-column
            v-for="item in columns"
            :key="item.key ? item.key : item.slot"
            :prop="item.key"
            :label="item.label"
            :align="item.align"
          >
            <template slot-scope="scope">
              <span v-if="item.slot == 'cnt'">{{
                scope.row.cnt | toThousands
              }}</span>
              <span style="margin-left: 10px" v-if="item.key == 'SumCntRatio'"
                >{{ scope.row.SumCntRatio }}%</span
              >
              <span style="margin-left: 10px" v-else>{{
                scope.row[item.key]
              }}</span>
            </template>
          </el-table-column>
        </el-table>
      </pdPanel>
    </div>
  </div>
</template>

<script>
import { BlockContent, Search } from "@/components/BlockContent/index.js";
import { pdPanel, Header } from "@/components/greyPanel/index.js";
import chartPanel from "./components/chartPanel.vue";
import { useInterval } from "@/api/userEngagement";
import ContractionText from "@/components/ContractionText";
export default {
  components: {
    pdPanel,
    Header,
    BlockContent,
    Search,
    chartPanel,
    ContractionText,
  },
  data() {
    return {
      chartData1: [],
      queryModel: {
        carryApp: true,
        page: 1,
        size: 30,
        total: 0,
      },
      detailClosed1: false,
      columns: [
        {
          label: "使用间隔",
          key: "diff_time",
          align: "",
        },
        {
          label: "启动次数",
          slot: "cnt",
          align: "right",
        },
        {
          label: "启动次数占比",
          key: "SumCntRatio",
          align: "right",
        },
      ],
    };
  },
  methods: {
    search(val) {
      this.queryModel = { ...this.queryModel, ...val };
      this.queryModel.page = 1;
      this.queryModel.date = val.custom_date;
      this.fetchList();
    },
    async fetchList() {
      let res = await useInterval(this.queryModel);
      let data = res.data.list;
      this.chartData1 = data;
    },
    downTable(name) {
      // let sheetName = `${adr
      //   .mom(this.queryModel.date)
      //   .add(-7, "days")
      //   .format("YYYY-MM-DD")}~${this.queryModel.date}使用间隔`;
      // adr.utils.downTableCusName(name, sheetName);
      useInterval({ ...this.queryModel, size: 100000 }).then((res) => {
        let tableDatas = res.data.list;
        tableDatas.forEach((item) => {
          item.SumCntRatio = item.SumCntRatio + "%";
        });
        let columnName = [
          { key: "diff_time", label: "使用间隔" },
          { key: "cnt", label: "启动次数" },
          { key: "SumCntRatio", label: "启动次数占比" },
        ];
        window.adr.exportExcel.exportExcel({
          tHeader: columnName,
          list: tableDatas,
          filename: `${this.queryModel.start_date}-${this.queryModel.end_date}-使用间隔分布`,
        });
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.userInterval {
}
.headerTip {
  color: #666;
  font-size: 12px;
  line-height: 2;
}
.useIntervalTable {
  /deep/.headerRow {
    div {
      font-weight: 700 !important;
    }
    color: black;
  }
}
</style>
