<template>
  <div class="newUser">
    <BlockContent>
      <Header>
        <div class="header-title" slot="l">
          <span class="title">启动次数 </span>
          <el-popover placement="bottom-start" width="400" trigger="hover">
            <div style="width: 400px">
              <p class="titleF">
                <span class="titleBlue">启动次数：</span
                >打开应用视为启动。完全退出或后台运行超过30s后再次进入应用，视为一次新启动。开发过程中可以通过setSessionContinueMills来自定义两次启动的间隔，默认30s
              </p>
              <p class="titleF">
                <span class="titleBlue">启动次数占比：</span
                >某日/周/月的启动次数占所选时间段总启动次数的比例
              </p>
              <p>
                按天、周或月查看数据可进行版本、渠道的交叉筛选，小时数据最多展示7天并且不支持筛选。周区间定义为周日至次周周六。按周（按月）显示时，界面上用每周的周日（每个月的第一日）来代表该周（该月）
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
        <echartstab
          :xAxisData="xAxisData"
          :seriesData="seriesData"
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
import echartstab from "./components/echarttab";
import pageTable from "@/components/echartsUserAnalysis/PageTable";
import ContractionText from "@/components/ContractionText";
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
        { slot: "launch_count", label: "启动次数", align: "right" },
        { slot: "startupratio", label: "启动占比", align: "right" },
      ],
      options: [],
      optionsVersion: [],
      channel: "",
      version: "",
      name1: "启动次数",
      seriesData: [],
      xAxisData: [],
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
      getNumberOfStartsLisst(obj).then((res) => {
        // console.log(res);
        // this.tableData = res.data;
        let launch_count = [];
        let pt = [];
        if (res.data.list) {
          res.data.list.forEach((item) => {
            launch_count.push(item.launch_count);
            if (
              this.queryModel.date_lat == "week" ||
              this.queryModel.date_lat == "month"
            ) {
              pt.push(item.pt.substring(0, 10));
            } else {
              pt.push(item.pt);
            }
          });
        }
        if (pt.length == 0 || launch_count.length == 0) {
          this.showEchart = false;
        } else {
          this.showEchart = true;
        }
        this.xAxisData = pt.reverse();
        this.seriesData = launch_count.reverse();
        // this.$refs.userActiveData.init();
      });
    },
    fetchList1(res) {
      getNumberOfStartsLisst(this.queryModel).then((res) => {
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
      // window.adr.utils.downTable(name);
      getNumberOfStartsLisst({ ...this.queryModel, size: 100000 }).then(
        (res) => {
          let tableDatas = res.data;
          tableDatas.list.forEach((item) => {
            item.startupratio = item.startupratio + "%";
          }),
            console.log(tableDatas.list);
          window.adr.exportExcel.exportExcel({
            tHeader: this.columns,
            list: tableDatas.list,
            filename: `${this.queryModel.start_date}-${this.queryModel.end_date}-启动次数`,
          });
        }
      );
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
</style>
