<template>
  <div class="newUser">
    <BlockContent>
      <Header>
        <div class="header-title" slot="l">
          <span class="title">只启动一次 </span>
          <el-popover placement="bottom-start" width="400" trigger="hover">
            <div style="width: 400px">
              <p class="titleF">
                <span class="titleBlue">只启动一次用户：</span
                >用户仅在安装日启动，在后续时间（次2日~次90日）内均无启动行为的用户。该指标可以反映出新增用户的质量以及与应用的匹配度
              </p>
              <p class="titleF">
                <span class="titleBlue">累计只启动一次用户：</span
                >截止至上上周六的新增安装用户对应的只启动一次的用户总数（每周三更新）
              </p>
              <p class="titleF">
                <span class="titleBlue">累计只启动一次用户比例：</span
                >截止至上上周六的新增安装用户对应的只启动一次的用户占比（每周三更新）
              </p>
              <p class="titleF">
                <span class="titleBlue">近期只启动一次用户：</span
                >90天前至30天前的新增安装对应的只启动一次用户总数
              </p>
              <p class="titleF">
                <span class="titleBlue">近期只启动一次比例：</span
                >90天前至30天前的新增安装对应的只启动一次用户占时段内总安装的比例
              </p>
              <p>
                距离今天越近的日期只启动一次用户比例会越大些，因为用户还没有充分的时间来完成第二次启动；反之，距离今天越远的日期只启动一次用户比例会越小些
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
    <div class="disfr jsb ac">
      <div class="accumulative disfr ac">
        <div class="lefticon disfr">
          <i
            class="el-icon-time"
            style="color: rgb(33, 150, 243); font-size: 32px; margin-right: 10%"
          ></i>
          <div>
            <p class="textName">累计只启动一次用户</p>
            <p class="textNum">0</p>
          </div>
        </div>
        <div class="rightText">
          <div>
            <p class="textName">累计只启动一次用户比例</p>
            <p class="textNum">20%</p>
          </div>
        </div>
      </div>
      <div class="recent disfr ac">
        <div class="lefticon disfr">
          <i
            class="el-icon-time"
            style="color: rgb(255, 193, 7); font-size: 32px; margin-right: 10%"
          ></i>
          <div>
            <p class="textName">近期只启动一次用户</p>
            <p class="textNum">0</p>
          </div>
        </div>
        <div class="rightText">
          <div>
            <p class="textName">近期只启动一次用户比例</p>
            <p class="textNum">20%</p>
          </div>
        </div>
      </div>
    </div>
    <Contentpanel>
      <template v-slot:header>
        <div class="headTop">
          <!-- <div>
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
          </div> -->
          <Tab :activeId.sync="tabOpacity" :list="tabOpacityList" />
        </div>
      </template>
      <template v-slot:main>
        <echartstab
          :xAxisData="xAxisData"
          :seriesData="seriesData"
          :tabOpacity="tabOpacity"
          :name="name1"
          :showEchart="showEchart"
          ref="userActiveData"
        ></echartstab>
      </template>
    </Contentpanel>
    <ContractionText
      :closed.sync="detailClosed"
      tableId="out-table"
      @downTable="downTable('out-table')"
    />
    <pageTable
      v-show="!detailClosed"
      class="tb"
      :columns="columns"
      :tableData="tableData"
      @page-change="handleChangePage"
      id="out-table"
    >
      <template slot-scope="{ row }" slot="launch_count">
        <span>{{ toThousands(row.launch_count) }}</span>
      </template>
      <template slot-scope="{ row }" slot="startupratio">
        <span>{{ row.startupratio }}%</span>
      </template>
    </pageTable>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { getNumberOfStartsLisst } from "@/api/user.js";
import Contentpanel from "@/components/Contentpanel";
import echartstab from "./components/echarttab2";
import pageTable from "@/components/echartsUserAnalysis/PageTable";
import ContractionText from "@/components/ContractionText";
import { Tab } from "@/components/BlockContent/index.js";
import { toThousands, getDaysBetween } from "@/utils/index";
import FileSaver from "file-saver";
import XLSX from "xlsx";
import {
  BlockContent,
  Header,
  Search,
} from "@/components/BlockContent/index.js";
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
  data() {
    return {
      toThousands,
      getDaysBetween,
      showChVe: true,
      dayBetween: "",
      detailClosed: false,
      showEchart: true,
      queryModel: {
        carryApp: true,
        date_lat: "day",
        activeKind: "1",
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
      columns: [
        { key: "pt", label: "日期", align: "left" },
        { slot: "launch_count", label: "新增用户", align: "center" },
        { slot: "launch_count1", label: "只启动一次用户", align: "center" },
        { slot: "startupratio", label: "只启动一次用户比例", align: "right" },
      ],
      options: [],
      optionsVersion: [],
      channel: "",
      version: "",
      name1: "启动次数",
      seriesData: [],
      xAxisData: [],
      tabOpacity: "1",
      tabOpacityList: [
        {
          id: "1",
          title: "百分比",
        },
        {
          id: "2",
          title: "绝对值",
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
      delete this.queryModel.activeKind;
      delete this.queryModel2.activeKind;
      this.dayBetween = this.getDaysBetween(
        this.queryModel.start_date,
        this.queryModel.end_date
      );
      // console.log(this.queryModel);
      this.fetchList(); //启动次数折线图
      this.fetchList1(); //启动次数表格分页
    },
    fetchList(res) {
      let obj = { ...this.queryModel, size: "100000" };
      if (obj.date_lat == "hour") {
        this.showChVe = false;
      } else {
        this.showChVe = true;
      }
      // getNumberOfStartsLisst(obj).then((res) => {
      //   // console.log(res);
      //   // this.tableData = res.data;
      //   let launch_count = [];
      //   let pt = [];
      //   if (res.data.list) {
      //     res.data.list.forEach((item) => {
      //       launch_count.push(item.launch_count);
      //       if (
      //         this.queryModel.date_lat == "week" ||
      //         this.queryModel.date_lat == "month"
      //       ) {
      //         pt.push(item.pt.substring(0, 10));
      //       } else {
      //         pt.push(item.pt);
      //       }
      //     });
      //   }
      //   if (pt.length == 0 || launch_count.length == 0) {
      //     this.showEchart = false;
      //   } else {
      //     this.showEchart = true;
      //   }
      //   this.xAxisData = pt.reverse();
      //   this.seriesData = launch_count.reverse();
      //   // this.$refs.userActiveData.init();
      // });
      getNumberOfStartsLisst(obj).then((res) => {
        // console.log(res);
        this.newArrayList = [];
        this.activeArrayList = [];
        this.viscosityArrayList = [];
        var activeList = [];
        var newList = [1, 2, 3, 4, 5, 6, 4];
        var viscosityList = [1, 2, 3, 4, 5, 6, 4];
        var TviscosityList = [7, 6, 8, 9, 7, 6, 9];
        let pt = [];
        if (res.data.list) {
          res.data.list.forEach((item) => {
            // newList.push(item.active_cnt); //活跃数
            activeList.push(item.active_composition); //活跃构成
            // viscosityList.push(item.Dau_Active_7_cnt); //活跃粘度
            // TviscosityList.push(item.Dau_Active_30_cnt); //活跃粘度
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
              name: "只启动一次",
              type: "line",
              data: newList.reverse(),
              areaStyle: {
                color: "#409EFF",
                opacity: 0.9,
                origin: "start",
              },
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
              symbol: "none",
            },
          ];
          var obj2 = [
            {
              name: "只启动一次",
              type: "line",
              data: viscosityList.reverse(),
              areaStyle: {
                color: "#409EFF",
                opacity: 0.9,
                origin: "start",
              },
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
              symbol: "none",
            },
            {
              name: "新增用户",
              type: "line",
              // areaStyle: {},
              areaStyle: {
                color: "rgb(255,193,102)",
                opacity: 0.7,
                origin: "start",
              },

              data: TviscosityList.reverse(),
              lineStyle: {
                //线条样式
                color: "rgb(255,193,102)",
                width: 2,
              },
              itemStyle: {
                // 转折点样式
                borderWidth: 1,
                // borderColor: "#409EFF",
                color: "rgb(255,193,102)",
              },
              symbol: "none",
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
        // // if (this.activeKind == "1") {
        // //   this.seriesData = obj1;
        // // } else if (this.activeKind == "2") {
        // //   this.seriesData = obj;
        // // } else {
        // this.seriesData = obj2;
        // // }
        if (this.tabOpacity == 1) {
          this.seriesData = obj1;
        } else if (this.tabOpacity == 2) {
          this.seriesData = obj2;
        }
      });
    },
    fetchList1(res) {
      getNumberOfStartsLisst(this.queryModel).then((res) => {
        // console.log(res);
        this.tableData = res.data;
      });
    },
    handleChangePage({ page, size }) {
      this.queryModel.page = page;
      this.queryModel.size = size;
      this.fetchList1();
    },
    ondown() {
      /* 从表生成工作簿对象 */
      let wb = XLSX.utils.table_to_book(document.querySelector("#out-table"));
      /* 获取二进制字符串作为输出 */
      var wbout = XLSX.write(wb, {
        bookType: "xlsx",
        bookSST: true,
        type: "array",
      });
      try {
        FileSaver.saveAs(
          //Blob 对象表示一个不可变、原始数据的类文件对象。
          //Blob 表示的不一定是JavaScript原生格式的数据。
          //File 接口基于Blob，继承了 blob 的功能并将其扩展使其支持用户系统上的文件。
          //返回一个新创建的 Blob 对象，其内容由参数中给定的数组串联组成。
          new Blob([wbout], { type: "application/octet-stream" }),
          //设置导出文件名称
          "sheetjs.xlsx"
        );
      } catch (e) {
        if (typeof console !== "undefined") console.log(e, wbout);
      }
      return wbout;
    },
    downTable(name) {
      window.adr.utils.downTable(name);
    },
  },
  computed: {
    ...mapGetters(["appInfo"]),
  },
  watch: {
    "queryModel.date_lat"(newval, oldval) {
      this.queryModel.date_lat = newval;
      // this.queryModel2.date_lat = newval;
      this.fetchList();
      this.fetchList1();
    },
    tabOpacity(newVal, oldVal) {
      if (newVal == 1) {
        this.seriesData = this.newArrayList;
      } else if (newVal == 2) {
        this.seriesData = this.viscosityArrayList;
      }
    },
  },
  created() {
    console.log(this.appInfo);
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
.headTop {
  display: flex;
  justify-content: flex-end;
}
/deep/.el-table {
  font-family: "Roboto-Regular", sans-serif;
  font-size: 12px;
}
.accumulative,
.recent {
  width: 46%;
  padding: 20px;
  background: rgb(255, 255, 255);
  height: 106px;
  border-radius: 2px 2px 0px 0px;
  margin-bottom: 20px;
}
.lefticon,
.rightText {
  width: 48%;
  .textName {
    font-size: 14px;
    color: #666;
  }
  .textNum {
    font-size: 24px;
    color: #333;
    line-height: 36px;
  }
}
</style>
<style>
.paneHeader {
  background: white !important;
}
</style>
