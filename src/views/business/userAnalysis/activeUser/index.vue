<template>
  <div class="newUser">
    <BlockContent>
      <Header>
        <div class="header-title" slot="l">
          <span class="title">活跃用户分析</span>
          <el-popover placement="bottom-start" width="400" trigger="hover">
            <div style="width: 400px">
              <p class="titleF">
                <span class="titleBlue">活跃用户:</span
                >启动过应用的用户（去重），启动过一次的用户即视为活跃用户，包括新用户与老用户
              </p>
              <p class="titleF">
                <span class="titleBlue">活跃构成:</span
                >活跃用户中新增用户的占比比例
              </p>
              <p class="titleF">
                <span class="titleBlue">活跃粘度:</span
                >DAU/过去7日活跃用户，DAU/过去30日活跃用户
              </p>
              <p class="titleF">
                <span class="titleBlue">过去7日活跃用户:</span
                >过去7日（不含今日）的活跃用户数（去重）
              </p>
              <p class="titleF">
                <span class="titleBlue">过去30日活跃用户:</span
                >过去30日（不含今日）的活跃用户数（去重）
              </p>
              <p class="titleF">
                <span class="titleBlue">分时活跃用户:</span
                >活跃用户在24小时中的分布情况（每小时间去重）
              </p>
              <p class="titleF">
                <span class="titleBlue">周活跃率:</span
                >周活跃用户占截止本周累计用户的比例
              </p>
              <p class="titleF">
                <span class="titleBlue">月活跃:</span
                >月活跃用户占截止本月累计用户的比例
              </p>
              <p class="titleF">
                按天、周或月查看数据可进行版本、渠道的交叉筛选。周区间定义为周日至次周周六。按周（按月）显示时，界面上用每周的周日（每个月的第一日）来代表该周（该月）
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
      <Search @search="search" :showChVe="showChVe" />
    </BlockContent>
    <Contentpanel>
      <template v-slot:header>
        <div class="headTop">
          <div>
            <Tab :activeId.sync="activeKind" :list="tabOptionChannel" />
          </div>
          <div>
            <el-radio-group v-model="queryModel.date_lat">
              <el-radio-button
                label="hour"
                :disabled="dayBetween >= 7 || queryModel.app_channel != 'all'"
                >小时</el-radio-button
              >
              <el-radio-button label="day">天</el-radio-button>
              <el-radio-button label="week" :disabled="dayBetween < 7"
                >周</el-radio-button
              >
              <el-radio-button label="month" :disabled="dayBetween < 30"
                >月</el-radio-button
              >
            </el-radio-group>
          </div>
        </div>
      </template>
      <template v-slot:main>
        <!-- <div class="chartsWpper" ref="chartsWpper"></div> -->
        <echartstab
          :xAxisData="xAxisData"
          :seriesData="seriesData"
          :yxisData="yxisData"
          :name="name1"
          :showEchart="showEchart"
          ref="userActiveData"
        ></echartstab>
      </template>
    </Contentpanel>
    <ContractionText
      :closed.sync="detailClosed"
      tableId="activeUser"
      @downTable="downTable()"
    />
    <pageTable
      v-show="!detailClosed"
      class="tb"
      :columns="columns"
      :tableData="tableData"
      @page-change="handleChangePage"
      id="activeUser"
    >
      <template slot-scope="{ row }" slot="active_cnt">
        <span>{{ toThousands(row.active_cnt) }}</span>
      </template>
      <template slot-scope="{ row }" slot="Dau_Active_7_cnt">
        <span>{{ row.Dau_Active_7_cnt }}%</span>
      </template>
      <template slot-scope="{ row }" slot="Dau_Active_30_cnt">
        <span>{{ row.Dau_Active_30_cnt }}%</span>
      </template>
      <template slot-scope="{ row }" slot="active_composition">
        <span>{{ row.active_composition }}%</span>
      </template>
    </pageTable>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import ContractionText from "@/components/ContractionText";
import {
  BlockContent,
  Header,
  Search,
  Tab,
} from "@/components/BlockContent/index.js";
import Contentpanel from "@/components/Contentpanel";
// import echartstab from "./components/echartsUserAnalysis/echarttab2";
import echartstab from "./components/echarttab2";
import pageTable from "@/components/echartsUserAnalysis/PageTable";
import { getDaysBetween, toThousands } from "@/utils/index";
import { getactiveUserTrendLisst } from "@/api/user.js";

export default {
  components: {
    BlockContent,
    Header,
    Search,
    echartstab,
    pageTable,
    Contentpanel,
    ContractionText,
    Tab,
  },
  computed: {
    ...mapGetters(["appInfo"]),
  },
  created() {},
  data() {
    return {
      toThousands,
      showChVe: true,
      getDaysBetween,
      dayBetween: "",
      detailClosed: false,
      queryModel: {
        carryApp: true,
        date_lat: "day",
        page: "1",
        size: "10",
      },
      activeKind: "1",
      dateRange: [new Date(), new Date()],
      tableData: {
        page: 1,
        size: 10,
        total: 0,
        list: [],
      },
      columns: [
        { key: "pt", label: "日期", align: "center" },
        { slot: "active_cnt", label: "活跃用户数", align: "center" },
        {
          slot: "active_composition",
          label: "活跃构成(新用户占比)",
          align: "center",
        },
        {
          slot: "Dau_Active_7_cnt",
          label: "DAU/过去7日活跃用户",
          align: "center",
        },
        {
          slot: "Dau_Active_30_cnt",
          label: "DAU/过去30日活跃用户",
          align: "center",
        },
      ],
      options: [],
      channel: "",
      version: "",
      name1: "活跃用户",
      seriesData: [],
      xAxisData: [],
      yxisData: "",
      showEchart: true,
      activeArrayList: [], //活跃构成数组
      newArrayList: [], //活跃用户数组
      viscosityArrayList: [], //活跃粘度数组
      tabOptionChannel: [
        {
          id: "1",
          title: "活跃趋势",
        },
        {
          id: "2",
          title: "活跃构成",
        },
        {
          id: "3",
          title: "活跃粘度",
        },
        // {
        //   id: "4",
        //   title: "分时活跃用户",
        // },
        // {
        //   id: "5",
        //   title: "周活跃率",
        // },
        // {
        //   id: "6",
        //   title: "月活跃率",
        // },
      ], //渠道
    };
  },
  watch: {
    //   tabPosition(newval, oldval) {
    // let obj={carryApp：true}
    //     getNewUserList(obj).then((res) => {
    //       console.log(res);
    //     });
    //   },
    "queryModel.date_lat"(newval, oldval) {
      this.queryModel.date_lat = newval;
      // this.queryModel2.date_lat = newval;
      this.fetchList();
      this.fetchList1();
    },
    activeKind: {
      handler(newVal, oldVal) {
        if (newVal == "1") {
          this.seriesData = [];
          this.yxisData = "1";
          this.seriesData = this.newArrayList;
        } else if (newVal == "2") {
          // console.log(this.activeArrayList);
          this.yxisData = "2";
          this.seriesData = this.activeArrayList;
        } else if (newVal == "3") {
          // console.log(this.viscosityArrayList);
          this.yxisData = "3";
          this.seriesData = this.viscosityArrayList;
          // console.log(this.seriesData);
        }
      },
      deep: true,
      immediate: true,
    },
  },
  methods: {
    search(row) {
      this.queryModel = { ...this.queryModel, ...row };
      this.queryModel2 = { ...this.queryModel, ...row };
      delete this.queryModel.date;
      delete this.queryModel2.date;
      delete this.queryModel.custom_date;
      delete this.queryModel2.custom_date;
      delete this.queryModel.any_date;
      delete this.queryModel2.any_date;
      // console.log(this.queryModel);
      this.dayBetween = this.getDaysBetween(
        this.queryModel.start_date,
        this.queryModel.end_date
      );
      this.fetchList1(); //活跃用户折线图
      this.fetchList(); //活跃用户表格分页
    },
    fetchList(res) {
      getactiveUserTrendLisst(this.queryModel).then((res) => {
        // console.log(res);
        this.tableData = res.data;
      });
    },
    fetchList1(res) {
      let obj = { ...this.queryModel, size: "100000" };
      if (obj.date_lat == "hour") {
        this.showChVe = false;
      } else {
        this.showChVe = true;
      }
      getactiveUserTrendLisst(obj).then((res) => {
        // console.log(res);
        this.newArrayList = [];
        this.activeArrayList = [];
        this.viscosityArrayList = [];
        var activeList = [];
        var newList = [];
        var viscosityList = [];
        var TviscosityList = [];
        let pt = [];
        if (res.data.list) {
          res.data.list.forEach((item) => {
            newList.push(item.active_cnt); //活跃数
            activeList.push(item.active_composition); //活跃构成
            viscosityList.push(item.Dau_Active_7_cnt); //活跃粘度
            TviscosityList.push(item.Dau_Active_30_cnt); //活跃粘度
            if (
              this.queryModel.date_lat == "week" ||
              this.queryModel.date_lat == "month"
            ) {
              pt.push(item.pt.substring(0, 10));
            } else {
              pt.push(item.pt);
            }
          });
          var obj = [
            {
              name: "活跃构成",
              type: "line",
              data: activeList.reverse(),
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
            },
          ];
          var obj1 = [
            {
              name: "活跃用户",
              type: "line",
              data: newList.reverse(),
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
            },
          ];
          var obj2 = [
            {
              name: "DAU/过去7日活跃用户",
              type: "line",
              data: viscosityList.reverse(),
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
            },
            {
              name: "DAU/过去30日活跃用户",
              type: "line",
              data: TviscosityList.reverse(),
            },
          ];
          this.activeArrayList = obj;
          this.newArrayList = obj1;
          this.viscosityArrayList = obj2;
        }
        if (pt.length == 0) {
          this.showEchart = false;
        } else {
          this.showEchart = true;
        }
        this.xAxisData = pt.reverse();
        if (this.activeKind == "1") {
          this.seriesData = obj1;
        } else if (this.activeKind == "2") {
          this.seriesData = obj;
        } else if (this.activeKind == "3") {
          this.seriesData = obj2;
        }
      });
    },
    handleChangePage({ page, size }) {
      this.queryModel.page = page;
      this.queryModel.size = size;
      this.fetchList();
    },
    downTable(name) {
      // window.adr.utils.downTable(name);
      getactiveUserTrendLisst({ ...this.queryModel, size: 100000 }).then(
        (res) => {
          let tableDatas = res.data;
          tableDatas.list.forEach((item) => {
            item.Dau_Active_7_cnt = item.Dau_Active_7_cnt + "%";
            item.Dau_Active_30_cnt = item.Dau_Active_30_cnt + "%";
            item.active_composition = item.active_composition + "%";
          }),
            window.adr.exportExcel.exportExcel({
              tHeader: this.columns,
              list: tableDatas.list,
              filename: `${this.queryModel.start_date}-${this.queryModel.end_date}-活跃用户分析`,
            });
        }
      );
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
.mr17 {
  margin: 0 20px;
}
.tb {
  padding: 0 20px 10px;
  background: white;
}

.headTop {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.tabBtn {
  padding: 20px 20px 0;
  background: white;
  span {
    font-size: 22px;
  }
  .selectTab {
    display: flex;
    justify-content: space-between;
  }
}
/deep/.el-table {
  font-family: "Roboto-Regular", sans-serif;
  font-size: 12px;
}
</style>
