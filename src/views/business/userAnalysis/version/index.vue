<template>
  <div>
    <div class="newUser">
      <BlockContent>
        <Header>
          <div class="header-title" slot="l">
            <span class="title"
              >版本分布
              <el-popover placement="bottom-start" width="360" trigger="hover">
                <p class="titleF">
                  <span class="titleBlue">新增用户：</span
                  >第一次启动应用的用户（以设备为判断标准）
                </p>
                <p class="titleF">
                  <span class="titleBlue">新增账号：</span>第一次启动应用的账号
                </p>
                <p class="titleF">
                  <span class="titleBlue">新增用户占比：</span
                  >某时段内新增用户占该时段活跃用户的比例
                </p>
                <p class="titleF">
                  按天、周或月查看数据可进行版本、渠道的交叉筛选，小时数据最多展示7天并且不支持筛选。周区间定义为周日至次周周六。按周（按月）显示时，界面上用每周的周日（每个月的第一日）来代表该周（该月）
                </p>
                <i
                  class="el-icon-question"
                  slot="reference"
                  style="color: #5faefd"
                ></i> </el-popover
            ></span>
          </div>
        </Header>
        <Search @search="search" :type="['date', 'versions']" ref="search" />
      </BlockContent>
      <Contentpanel>
        <template v-slot:header>
          <p class="pageTitle mb10">
            {{ headTitle }}
            <el-popover placement="bottom-start" width="360" trigger="hover">
              <p class="titleF">
                <span class="titleBlue">新增用户：</span>
                第一次启动应用的用户（以设备为判断标准）
              </p>
              <p class="titleF">
                <span class="titleBlue">新增账号：</span> 第一次启动应用的账号
              </p>
              <p class="titleF">
                <span class="titleBlue">新增用户占比：</span>
                某时段内新增用户占该时段活跃用户的比例
              </p>
              <p>
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
            <div class="selectTab">
              <Tab
                :activeId.sync="tabPosition"
                :list="tabOptionChannel"
                style="margin-bottom: 30px"
              />
              <div class="selectChannel" v-show="showChannel">
                <el-select v-model="selectChannel" placeholder="请选择">
                  <el-option
                    v-for="item in appChannelList"
                    :key="item.app_channel"
                    :label="item.label"
                    :value="item.app_channel"
                  >
                  </el-option>
                </el-select>
              </div>
            </div>
          </div>
          <echartstab
            class="echartAdduser"
            :xAxisData="xAxisData"
            :seriesData="seriesData"
            :showEchart="showEchart"
            ref="userActiveData"
          ></echartstab>
        </template>
      </Contentpanel>
      <ContractionText
        :closed.sync="detailClosed"
        tableId="VersionTable"
        @downTable="downTable('VersionTable')"
      />
      <!-- <div class="tabBtn" v-if="!detailClosed">
      <el-radio-group v-model="tabPositionday" style="margin-bottom: 30px">
        <el-radio-button label="1">今日</el-radio-button>
        <el-radio-button label="2">昨日</el-radio-button>
      </el-radio-group>
      <div class="export" @click="downTable('VersionTable')">
        <span style="font-size: 14px; color: #3882fe"
          ><i class="el-icon-document" style="margin-right: 5px"></i>导出</span
        >
      </div>
    </div> -->
      <pageTable
        v-show="!detailClosed && !showSingle"
        class="tb"
        :columns="columns"
        :tableData="tableData"
        @page-change="handleChangePage"
        id="VersionTable"
      >
        <template slot-scope="{ row }" slot="app_vname">
          <span class="titleBlue cur" @click="clickVname(row)">{{
            row.app_vname
          }}</span>
        </template>
        <template slot-scope="{ row }" slot="sum_ver_cnt">
          <span>{{ toThousands(row.sum_ver_cnt) }}</span>
        </template>
        <template slot-scope="{ row }" slot="new_cnt">
          <span>{{ toThousands(row.new_cnt) }}</span>
        </template>
        <template slot-scope="{ row }" slot="launch_cnt">
          <span>{{ toThousands(row.launch_cnt) }}</span>
        </template>
        <template slot-scope="{ row }" slot="upgrade_cnt">
          <span>{{ toThousands(row.upgrade_cnt) }}</span>
        </template>
        <template slot-scope="{ row }" slot="Cumulative_user_of_today_version">
          <span
            >{{ toThousands(row.sum_ver_cnt) }}({{
              row.Cumulative_user_of_today_version
            }}%)</span
          >
        </template>
        <template slot-scope="{ row }" slot="active_cnt">
          <span
            >{{ toThousands(row.active_cnt) }}({{
              row.Active_user_ratio
            }}%)</span
          >
        </template>
      </pageTable>
      <pageTable
        v-show="!detailClosed && showSingle"
        class="tb"
        :columns="singleColumn"
        :tableData="singleTableData"
        @page-change="handleChangePage"
        id="VersionTable"
      >
        <template slot-scope="{ row }" slot="new_cnt">
          <span>{{ toThousands(row.new_cnt) }}</span>
        </template>
        <template slot-scope="{ row }" slot="launch_cnt">
          <span>{{ toThousands(row.launch_cnt) }}</span>
        </template>
        <template slot-scope="{ row }" slot="upgrade_cnt">
          <span>{{ toThousands(row.upgrade_cnt) }}</span>
        </template>
        <template slot-scope="{ row }" slot="Cumulative_user_of_today_version">
          <span
            >{{ toThousands(row.sum_ver_cnt) }}({{
              row.Cumulative_user_of_today_version
            }}%)</span
          >
        </template>
        <template slot-scope="{ row }" slot="active_cnt">
          <span
            >{{ toThousands(row.active_cnt) }}({{
              row.Active_user_ratio
            }}%)</span
          >
        </template>
      </pageTable>
    </div>
    <div class="detailBox" v-if="showSingle">
      <!-- <div class="detailBox"> -->
      <!-- :yAxisData="yAxisSourceData"
        :seriesData="seriesSourceData"
        :TableData="sourceTableData" -->
      <Detail
        :versionName="queryModel.app_vname"
        :queryModelDetail="queryModel"
        ref="versionDetail"
      ></Detail>
    </div>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import {
  BlockContent,
  Header,
  Search,
  Tab,
} from "@/components/BlockContent/index.js";
import Contentpanel from "@/components/Contentpanel";
import pageTable from "@/components/echartsUserAnalysis/PageTable";
import echartstab from "./components/echarttab2";
import { getVersionLisst, getVersionTopLisst } from "@/api/user.js";
import ContractionText from "@/components/ContractionText";
import Detail from "./components/detail.vue";
import { toThousands } from "@/utils/index";

export default {
  components: {
    BlockContent,
    Header,
    Search,
    Contentpanel,
    pageTable,
    echartstab,
    ContractionText,
    Tab,
    Detail,
  },
  data() {
    return {
      toThousands,
      detailClosed: false,
      headTitle: "Top10版本",
      queryModel: {
        carryApp: true,
        page: "1",
        size: "10",
      },
      singleQueryModel: {
        carryApp: true,
        page: "1",
        size: "10",
      },
      showEchart: true,
      tabPosition: "1",
      tabPositionday: "1",
      dateRange: [new Date(), new Date()],
      tableData: {
        page: 1,
        size: 10,
        count: 0,
        list: [],
      },
      columns: [
        { key: "pt", label: "日期", align: "left", sortable: true, width: 100 },
        {
          slot: "app_vname",
          label: "版本",
          align: "center",
        },
        {
          slot: "Cumulative_user_of_today_version",
          label: "截至今日版本累计用户",
          align: "center",
          sortable: true,
          width: 190,
        },
        {
          slot: "sum_ver_cnt",
          label: "累计用户",
          align: "center",
          sortable: true,
        },
        { slot: "new_cnt", label: "新增用户", align: "center", sortable: true },
        {
          slot: "active_cnt",
          label: "活跃用户",
          align: "center",
          sortable: true,
        },
        {
          slot: "launch_cnt",
          label: "启动次数",
          align: "center",
          sortable: true,
        },
        {
          slot: "upgrade_cnt",
          label: "升级用户",
          align: "center",
          sortable: true,
        },
      ],
      singleColumn: [
        { key: "pt", label: "日期", align: "left", sortable: true },
        { slot: "new_cnt", label: "新增用户", align: "center", sortable: true },
        {
          slot: "active_cnt",
          label: "活跃用户",
          align: "center",
          sortable: "true",
        },
        {
          slot: "launch_cnt",
          label: "启动次数",
          align: "center",
          sortable: true,
        },
        {
          slot: "upgrade_cnt",
          label: "升级用户",
          align: "center",
          sortable: true,
        },
      ],
      singleTableData: {
        page: 1,
        size: 10,
        count: 0,
        list: [],
      },
      channel: "",
      version: "",
      seriesData: [],
      xAxisData: [],
      n: [], //新增用户数组
      l: [], //启动次数数组
      a: [], //活跃数组
      selectChannel: "", //选中的渠道
      showChannel: false,
      showSingle: false,
      tabOptionChannel: [
        {
          id: "1",
          title: "新增用户",
        },
        {
          id: "2",
          title: "活跃用户",
        },
        {
          id: "3",
          title: "启动次数",
        },
      ], //渠道
    };
  },
  methods: {
    search(row) {
      this.queryModel = {
        ...this.queryModel,
        ...row,
        page: 1,
        size: 10,
        app_appid: this.appInfo.app_appid,
      };
      delete this.queryModel.date;
      delete this.queryModel.app_channel;
      delete this.queryModel.custom_date;
      if (row.app_vname == "all") {
        this.headTitle = "Top10版本";
        this.showSingle = false;
      } else {
        this.headTitle = row.app_vname + "版本";
        this.showSingle = true;
        this.$nextTick(() => {
          this.$refs.versionDetail.init();
        });
      }
      this.fetchList();
    },
    fetchList() {
      let verobj = { ...this.queryModel };
      verobj.app_channel = "all";
      delete verobj.any_date;
      getVersionLisst(verobj).then((res) => {
        // console.log(res);
        this.tableData = res.data;
        if (this.showSingle) {
          this.singleTableData = res.data;
          let Nlist = [];
          let Alist = [];
          let Llist = [];
          res.data.list.forEach((item) => {
            Nlist.push(item.new_cnt);
            Alist.push(item.active_cnt);
            // Llist.push(item.lunch_cnt);
            Llist.push(item.launch_cnt);
          });
          this.n = [
            {
              name: res.data.app_vname,
              type: "line",
              data: Nlist.reverse(),
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
          this.a = [
            {
              name: res.data.app_vname,
              type: "line",
              data: Alist.reverse(),
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
          this.l = [
            {
              name: res.data.app_vname,
              type: "line",
              data: Llist.reverse(),
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
          if (this.tabPosition == "1") {
            this.seriesData = this.n;
          } else if (this.tabPosition == "2") {
            this.seriesData = this.a;
          } else if (this.tabPosition == "3") {
            this.seriesData = this.l;
          }
        }
      });
      if (!this.showSingle) {
        let par = { ...this.queryModel, size: "100000" };
        delete par.app_vname;
        delete par.any_date;
        getVersionTopLisst(par).then((res) => {
          // console.log(res);
          // let pt = res.data.ptList.reverse(); //x轴坐标时间
          let pt = res.data.ptList; //x轴坐标时间
          let appVname = []; //前十个版本数组
          let lunchArray = []; //启动次数
          let activeArray = []; //活跃次数
          let newArray = []; //新增次数
          res.data.appVname.forEach((item) => {
            appVname.push(item.app_vname);
          });
          //得到版本数组
          // console.log(appVname);
          // console.log(res.data.list);
          if (res.data.list) {
            let newArrList = [];
            for (let i = res.data.list.length - 1; i >= 0; i--) {
              newArrList[newArrList.length] = res.data.list[i];
            }
            // console.log(newArrList);
            appVname.forEach((item1) => {
              newArrList.forEach((item) => {
                if (item.app_vname == item1) {
                  lunchArray.push(item.lunch_cnt);
                  activeArray.push(item.active_cnt);
                  newArray.push(item.new_cnt);
                }
              });
            });
            // 数据分割1
            let appVnames = [];
            appVname.forEach((item) => {
              appVnames.push({ app_vname: item });
            });
            const vnameAllList = appVnames.map((a) => {
              let list = [];
              newArrList.map((l) => {
                if (l.app_vname === a) {
                  list.push(l);
                }
              });
              a.list = list;
              return a;
            });
            // console.log(vnameAllList);
            const serviceData = vnameAllList.map((v) => {
              let obj = {
                name: v.app_vname,
                data: [],
                type: "line",
              };
              obj.data = pt.map((pt) => {
                let item = null;
                newArrList.map((l) => {
                  if (l.pt === pt && v.app_vname === l.app_vname) {
                    item = l.new_cnt;
                    // if (this.tabPosition == "1") {
                    //   item = l.new_cnt;
                    //   this.n = l.new_cnt;
                    // } else if (this.tabPosition == "2") {
                    //   item = l.active_cnt;
                    //   this.a = l.active_cnt;
                    // } else if (this.tabPosition == "3") {
                    //   item = l.lunch_cnt;
                    //   this.l = l.lunch_cnt;
                    // }
                  }
                });
                return item;
              });
              return obj;
            });
            this.n = serviceData;
            const serviceDataA = vnameAllList.map((v) => {
              let obj = {
                name: v.app_vname,
                data: [],
                type: "line",
              };
              obj.data = pt.map((pt) => {
                let item = null;
                newArrList.map((l) => {
                  if (l.pt === pt && v.app_vname === l.app_vname) {
                    item = l.active_cnt;
                  }
                });
                return item;
              });
              return obj;
            });
            this.a = serviceDataA;
            const serviceDataL = vnameAllList.map((v) => {
              let obj = {
                name: v.app_vname,
                data: [],
                type: "line",
              };
              obj.data = pt.map((pt) => {
                let item = null;
                newArrList.map((l) => {
                  if (l.pt === pt && v.app_vname === l.app_vname) {
                    item = l.launch_cnt;
                  }
                });
                return item;
              });
              return obj;
            });
            this.l = serviceDataL;
            if (this.tabPosition == "1") {
              this.seriesData = serviceData;
            } else if (this.tabPosition == "2") {
              this.seriesData = serviceDataA;
            } else if (this.tabPosition == "3") {
              this.seriesData = serviceDataL;
            }
          }
          this.xAxisData = pt;
        });
      }
    },
    handleChangePage({ page, size }) {
      this.queryModel.page = page;
      this.queryModel.size = size;
      this.fetchList();
    },
    downTable(name) {
      // window.adr.utils.downTable(name);
      let tableDatas = "";
      getVersionLisst({
        ...this.queryModel,
        app_channel: "all",
        size: 100000,
      }).then((res) => {
        tableDatas = res.data;
        if (!this.detailClosed && !this.showSingle) {
          tableDatas.list.forEach((item) => {
            item.sum_ver_cnt =
              item.sum_ver_cnt +
              "(" +
              item.Cumulative_user_of_today_version +
              "%)";
            item.active_cnt =
              item.active_cnt + "(" + item.Active_user_ratio + "%)";
          }),
            window.adr.exportExcel.exportExcel({
              tHeader: this.columns,
              list: tableDatas.list,
              filename: `${this.queryModel.start_date}-${this.queryModel.end_date}-Top10版本`,
            });
        } else {
          tableDatas.list.forEach((item) => {
            item.active_cnt =
              item.active_cnt + "(" + item.Active_user_ratio + "%)";
          }),
            window.adr.exportExcel.exportExcel({
              tHeader: this.singleColumn,
              list: tableDatas.list,
              filename: `${this.queryModel.start_date}-${this.queryModel.end_date}-${this.queryModel.app_vname}版本`,
            });
        }
      });
    },
    clickVname(row) {
      this.$refs.search.queryModel.app_vname = row.app_vname;
      this.$refs.search.search();
    },
  },
  computed: {
    ...mapGetters(["appInfo", "appChannelList"]),
  },
  watch: {
    tabPosition: {
      handler(newVal, oldVal) {
        if (newVal == 1) {
          this.seriesData = this.n;
        } else if (newVal == 2) {
          this.seriesData = this.a;
        } else if (newVal == 3) {
          this.seriesData = this.l;
        }
      },
      deep: true,
      immediate: true,
    },
  },
  created() {
    // setTimeout(() => {
    //   console.log(this.appInfo, this.appChannelList);
    // }, 1000);
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
.echartAdduser {
  margin-top: -20px;
}
.tb {
  padding: 0 20px 10px;
  background: white;
}
/deep/.el-table {
  font-family: "Roboto-Regular", sans-serif;
  font-size: 12px;
}
</style>
