<template>
  <div class="newUser">
    <BlockContent>
      <Header>
        <div class="header-title" slot="l">
          <span class="title">新增用户 </span>
        </div>
      </Header>
      <Search @search="search" :showChVe="showChVe" />
    </BlockContent>
    <Contentpanel>
      <!-- <template v-slot:header> 新增趋势 </template> -->
      <template v-slot:header>
        <p class="pageTitle mb10">
          新增趋势
          <el-popover placement="bottom-start" width="360" trigger="hover">
            <p class="titleF">
              <span class="titleBlue">新增用户：</span>
              第一次启动应用的用户（以设备为判断标准）
            </p>
            <p class="titleF">
              <span class="titleBlue">新增账号：</span> 第一次启动应用的账号
            </p>
            <p class="titleF">
              <span class="titleBlue">新增用户占比</span>
              ：某时段内新增用户占该时段活跃用户的比例
            </p>
            <p class="titleF">
              按天、周或月查看数据可进行版本、渠道的交叉筛选，小时数据最多展示7天并且不支持筛选。周区间定义为周日至次周周六。按周（按月）显示时，界面上用每周的周日（每个月的第一日）来代表该周（该月）
            </p>
            <i
              class="el-icon-question"
              slot="reference"
              style="color: #5faefd"
            ></i>
          </el-popover>
        </p>
      </template>
      <template v-slot:main>
        <div class="tabBtn">
          <span>新增用户</span>
          <div>
            <el-radio-group v-model="date_lat" style="margin-bottom: 30px">
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
        <echartstab
          :xAxisData="xAxisData"
          :seriesData="seriesData"
          :name="name1"
          :showEchart="showEchart"
          ref="userActiveData"
        ></echartstab>
        <ContractionText
          :closed.sync="detailClosed"
          tableId="userTrend"
          @downTable="downTable(1)"
        />
        <pageTable
          class="tb"
          :columns="columns"
          :tableData="tableData"
          @page-change="handleChangePage"
          id="userTrend"
          v-show="!detailClosed"
        >
          <template slot-scope="{ row }" slot="new_count">
            <span>{{ toThousands(row.new_count) }}</span>
            <span style="margin-left: 5px">({{ row.new_ratio }}%)</span>
          </template>
        </pageTable>
      </template>
    </Contentpanel>
    <Contentpanel>
      <!-- <template v-slot:header> 新增用户质量 </template> -->
      <template v-slot:header>
        <p class="pageTitle mb10">
          <span
            style="
               {
                font-size: 22px;
                margin-right: 5px;
              }
            "
            >新增用户质量</span
          >
          <el-popover placement="bottom-start" width="360" trigger="hover">
            <p class="titleF">
              <span class="titleBlue">次日留存率：</span
              >该日的新增用户在次日仍启动应用的用户占该日新增的比例
            </p>
            <p class="titleF">
              <span class="titleBlue">只启动一次比例：</span
              >所选日期中的新增用户只在当天有启动，但是在随后的2~90天内都没有启动的占比（只支持查看2018年3月20日之后的数据)
            </p>
            <i
              class="el-icon-question"
              slot="reference"
              style="color: #5faefd"
            ></i>
          </el-popover>
        </p>
      </template>
      <template v-slot:main>
        <div class="chartsWpper1">
          <Tab :activeId.sync="activeKind" :list="tabOptionChannel" />
        </div>
        <echartstabquality
          :xAxisData="xAxisData2"
          :yxisData="yxisData2"
          :seriesData="seriesData2"
          :name="name2"
          :showEchart="showEchart"
          ref="userActiveData2"
        ></echartstabquality>
        <ContractionText
          :closed.sync="detailClosedquality"
          tableId="userQuality"
          @downTable="downTable(2)"
        />
        <pageTable
          class="tb"
          :columns="columns2"
          :tableData="tableData2"
          @page-change="handleChangePage2"
          id="userQuality"
          v-show="!detailClosedquality"
        >
          <template slot-scope="{ row }" slot="next_retained_ratio">
            <span>{{ row.next_retained_ratio }}%</span>
          </template>
        </pageTable>
      </template>
    </Contentpanel>
  </div>
</template>

<script>
import Contentpanel from "@/components/Contentpanel";
import pageTable from "@/components/echartsUserAnalysis/PageTable";
import { getNewUserList, getNewuserqualityLisst } from "@/api/user.js";
import echartstab from "./components/echarttabTrend.vue";
import echartstabquality from "./components/echarttabquality";
import { getDaysBetween } from "@/utils/index";
import ContractionText from "@/components/ContractionText";
import { toThousands } from "@/utils/index";
import {
  BlockContent,
  Header,
  Search,
  Tab,
} from "@/components/BlockContent/index.js";

export default {
  components: {
    Contentpanel,
    pageTable,
    echartstab,
    echartstabquality,
    ContractionText,
    BlockContent,
    Header,
    Search,
    Tab,
  },
  data() {
    return {
      toThousands,
      detailClosed: false,
      detailClosedquality: false,
      getDaysBetween,
      showEchart: "",
      showChVe: true,
      date_lat: "day",
      queryModel: {
        carryApp: true,
        date_lat: "day",
        page: "1",
        size: "10",
      },
      queryModel2: {
        carryApp: true,
        date_lat: "day",
        page: "1",
        size: "10",
      },
      dateRange: [new Date(), new Date()],
      tableData: {
        page: 1,
        size: 10,
        total: 0,
        list: [],
      },
      tableData2: {
        page: 1,
        size: 10,
        total: 0,
        list: [],
      },
      columns: [
        { key: "pt", label: "日期", align: "left" },
        { slot: "new_count", label: "新用户(占比)", align: "right" },
      ],
      columns2: [
        { key: "pt", label: "日期", align: "left" },
        { slot: "next_retained_ratio", label: "次日留存率", align: "right" },
      ],
      options: [],
      optionsVersion: [],
      name1: "新用户",
      seriesData: [],
      xAxisData: [],
      name2: "次日留存率",
      seriesData2: [],
      xAxisData2: [],
      yxisData2: "",
      dayBetween: "",
      activeKind: "1",
      tabOptionChannel: [
        {
          id: "1",
          title: "次日留存率",
        },
      ],
    };
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
      this.dayBetween = this.getDaysBetween(
        this.queryModel.start_date,
        this.queryModel.end_date
      );
      this.fetchList();
    },
    fetchList() {
      this.getNewUserList(); //新增用户折线图
      this.getNewUserList1(); //新增用户表格分页
      this.getNewuserqualityLisst(); //新增用户质量折线图
      this.getNewuserqualityLisst1(); //新增用户质量表格分页
    },
    handleChangePage({ page, size }) {
      this.queryModel.page = page;
      this.queryModel.size = size;
      this.getNewUserList1();
    },
    handleChangePage2({ page, size }) {
      this.queryModel2.page = page;
      this.queryModel2.size = size;
      this.getNewuserqualityLisst1();
    },
    getNewUserList() {
      let obj = { ...this.queryModel };
      obj.size = "100000";
      if (obj.date_lat == "hour") {
        this.showChVe = false;
      } else {
        this.showChVe = true;
      }
      getNewUserList(obj).then((res) => {
        // console.log(res);
        let new_count = [];
        let pt = [];
        if (res.data.list) {
          res.data.list.forEach((item) => {
            new_count.push(item.new_count);
            if (this.date_lat == "week" || this.date_lat == "month") {
              pt.push(item.pt.substring(0, 10));
            } else {
              pt.push(item.pt);
            }
          });
        }
        if (pt.length == 0 || new_count.length == 0) {
          this.showEchart = false;
        } else {
          this.showEchart = true;
        }
        // if (this.date_lat == "hour") {
        //   pt.reverse();
        //   new_count.reverse();
        // }
        this.xAxisData = pt.reverse();
        this.seriesData = new_count.reverse();
      });
    },
    getNewUserList1() {
      getNewUserList(this.queryModel).then((res) => {
        // console.log(res);
        this.tableData = res.data;
      });
    },
    getNewuserqualityLisst() {
      let obj = { ...this.queryModel2 };
      obj.size = "100000";
      getNewuserqualityLisst(obj).then((res) => {
        // console.log(res);
        let new_count = [];
        let pt = [];
        if (res.data.list) {
          res.data.list.forEach((item) => {
            new_count.push(item.next_retained_ratio);
            pt.push(item.pt);
          });
        }
        this.xAxisData2 = pt.reverse();
        this.seriesData2 = new_count.reverse();
        this.yxisData2 = "{value}%";
        // console.log(this.seriesData2);
      });
    },
    getNewuserqualityLisst1() {
      getNewuserqualityLisst(this.queryModel2).then((res) => {
        this.tableData2 = res.data;
      });
    },
    downTable(type) {
      // window.adr.utils.downTable(name);
      if (type == 1) {
        getNewUserList({ ...this.queryModel, size: 100000 }).then((res) => {
          let tableDatas = res.data;
          tableDatas.list.forEach((item) => {
            item.new_count = item.new_count + "(" + item.new_ratio + "%)";
          }),
            window.adr.exportExcel.exportExcel({
              tHeader: this.columns,
              list: tableDatas.list,
              filename: `${this.queryModel.start_date}-${this.queryModel.end_date}-新增用户趋势`,
            });
        });
      } else {
        getNewuserqualityLisst({ ...this.queryModel2, size: 100000 }).then(
          (res) => {
            let tableDatas = res.data;
            tableDatas.list.forEach((item) => {
              item.next_retained_ratio = item.next_retained_ratio + "%";
            }),
              window.adr.exportExcel.exportExcel({
                tHeader: this.columns2,
                list: tableDatas.list,
                filename: `${this.queryModel2.start_date}-${this.queryModel2.end_date}-新增用户质量`,
              });
          }
        );
      }
    },
  },
  watch: {
    date_lat(newval, oldval) {
      this.queryModel.date_lat = newval;
      // this.queryModel2.date_lat = newval;
      // this.fetchList();
      this.getNewUserList();
      this.getNewUserList1();
    },
  },
  computed: {
    // ...mapGetters(["appInfo"]),
  },
};
</script>

<style lang="scss" scoped>
.export {
  color: #409eff;
  cursor: pointer;
  user-select: none;
  font-size: 13px;
  height: 50px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding-right: 20px;
}
.mr17 {
  margin: 0 20px;
}
.tabBtn {
  display: flex;
  justify-content: space-between;
  padding-top: 20px;
  padding: 20px 20px 0;
  background: white;
  span {
    font-size: 18px;
  }
}
.tb {
  margin-bottom: 30px;
  background: white;
  padding: 0 20px;
}
.chartsWpper1 {
  background: white;
  padding: 20px;
}
/deep/.el-table {
  font-family: "Roboto-Regular", sans-serif;
  font-size: 12px;
}
</style>
