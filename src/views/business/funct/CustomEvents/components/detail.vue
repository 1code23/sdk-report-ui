<template>
  <div class="newUser">
    <BlockContent>
      <Header>
        <div class="header-title" slot="l">
          <span class="title">自定义事件</span>
        </div>
      </Header>
      <div class="disfr jsb">
        <div class="disfr jsb">
          <el-select
            style="width: 100%"
            @change="searchh"
            v-model="event_vname"
            placeholder="请选择"
          >
            <el-option
              v-for="(item, index) in eventList"
              :key="index"
              :label="item.label"
              :value="item.event_vname"
            >
            </el-option>
          </el-select>
          <Tab
            :activeId.sync="tabOpacity"
            :list="TabOpacityList"
            style="margin-left: 20px"
          />
        </div>
        <Search @search="search" v-show="showStr" />
      </div>
    </BlockContent>
    <div v-show="showStr">
      <Contentpanel v-if="showStr">
        <template v-slot:header>
          <p class="pageTitle mb10">
            事件统计
            <el-popover placement="bottom-start" width="360" trigger="hover">
              <p class="titleF">
                <span class="titleBlue">事件消息数：</span> 事件被触发的次数
              </p>
              <p class="titleF">
                <span class="titleBlue">消息数/启动次数：</span>
                平均每次启动被触发的次数
              </p>
              <p class="titleF">
                <span class="titleBlue">独立用户数：</span>
                每日触发事件的独立用户数（以设备为判断标准）
              </p>
              <p class="titleF">
                <span class="titleBlue">持续时长：</span> 事件持续的时间长度
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
            <!-- <div class="selectChannel" v-show="showChannel">
              <el-select v-model="selectChannel" placeholder="请选择">
                <el-option
                  v-for="item in appChannelList"
                  :key="item.app_channel"
                  :label="item.label"
                  :value="item.app_channel"
                >
                </el-option>
              </el-select>
            </div> -->
          </div>
          <echartstab
            class="echartAdduser"
            :xAxisData="xAxisData"
            :seriesData="seriesData"
            :showEchart="showEchart"
            mainid="userActiveData"
          ></echartstab>
        </template>
      </Contentpanel>
      <!-- 事件统计明细 -->
      <div class="tabelTitle" v-if="showStr">
        <p class="pageTitle mb10" style="color: #333">事件统计明细</p>
        <p class="titleBlue cur" @click="downTable('eventdetailList')">
          <i class="el-icon-document"></i
          ><span style="font-size: 14px">导出</span>
        </p>
      </div>
      <div class="tb" v-if="showStr">
        <pageTable
          :columns="columns"
          :tableData="tableData"
          @page-change="handleChangePage"
          id="eventdetailList"
        >
          <template slot-scope="{ row }" slot="total_cnt">
            <span>{{ row.total_cnt | toThousands }}</span>
          </template>
          <template slot-scope="{ row }" slot="rate">
            <span>{{ row.rate | toThousands }}</span>
          </template>
          <template slot-scope="{ row }" slot="active_cnt">
            <span>{{ row.active_cnt | toThousands }}</span>
          </template>
        </pageTable>

        <div class="distributionlTitle" v-show="StrNum">
          <div class="selectChannel">
            <el-select v-model="selectChannel" placeholder="请选择">
              <el-option
                v-for="item in appChannelList"
                :key="item.app_channel"
                :label="item.label"
                :value="item.app_channel"
              >
              </el-option>
            </el-select>
            <el-popover
              placement="bottom-start"
              width="360"
              trigger="hover"
              style="margin-left: 10px"
            >
              <p class="titleF">
                您可以为事件设置参数，丰富自定义统计的内容，每个事件至多同时传100个参数，每个参数至多有1000个取值。
              </p>

              <i
                class="el-icon-question"
                slot="reference"
                style="color: #5faefd"
              ></i>
            </el-popover>
          </div>
          <div class="selectTab">
            <Tab
              :activeId.sync="tabTypeId"
              :list="tabType"
              style="margin-right: 15px"
            />
            <p class="titleBlue" @click="downTable('distributionlList')">
              <i class="el-icon-document"></i
              ><span style="font-size: 14px">导出</span>
            </p>
          </div>
        </div>
        <pageTable
          :columns="distributionlcolumns"
          :tableData="distributionltableData"
          @page-change="handleChangePage"
          id="distributionlList"
          v-show="!showDetailTrend && StrNum"
        >
          <template slot-scope="{ row }" slot="active_composition">
            <span>{{ row.active_composition }}%</span>
          </template>
          <el-table-column fixed="right" label="趋势" align="center">
            <template slot-scope="{ row }">
              <span @click="addEditBtn(row)">趋势</span>
            </template>
          </el-table-column>
        </pageTable>
      </div>
      <div class="detailTrend" v-if="showDetailTrend && showStr">
        <div style="background: white; height: 40px" class="as">
          <span class="cur TrendBack" @click="showDetailTrend = false"
            >趋势</span
          >
          <div class="TrendLine"></div>
          <span>Um_Key_PartID</span>
        </div>
        <echartstab
          :xAxisData="xAxisTrendData"
          :seriesData="seriesTrendData"
          :showEchart="showEchart"
          mainid="detailTrend"
        ></echartstab>
      </div>
    </div>
    <div v-show="!showStr">
      <detailOpacity
        ref="detailOpacity"
        :eventName="event_vname"
      ></detailOpacity>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { BlockContent, Header, Search } from "./index.js";
import pageTable from "@/components/echartsUserAnalysis/PageTable";
import Contentpanel from "@/components/Contentpanel";
import {
  getEventDetailStr,
  getEventDetailStrGraph,
  getEventList,
  getEventDetailNum,
  getEventDetailRealTimeNum,
  getEventDetailNumGraph,
} from "@/api/funct.js";
import echartstab from "./echarttab2";
import { downTable } from "@/utils/index";
import { Tab } from "@/components/BlockContent/index.js";
import detailOpacity from "./detailOpacity";
export default {
  components: {
    BlockContent,
    Header,
    Search,
    Tab,
    pageTable,
    Contentpanel,
    echartstab,
    detailOpacity,
  },
  computed: {
    ...mapGetters(["appInfo"]),
  },
  watch: {
    activeKind: {
      handler(newVal, oldVal) {
        if (newVal == 1) {
          this.seriesData = this.a;
        } else if (newVal == 2) {
          this.seriesData = this.b;
        } else if (newVal == 3) {
          this.seriesData = this.c;
        }
        //  else if (newVal == 4) {
        //   this.seriesData = this.d;
        // }
      },
      deep: true,
      immediate: true,
    },
    tabOpacity(newVal, oldVal) {
      this.xAxisData = [];
      this.seriesData = [];
      if (newVal == 2) {
        this.getEventDetailStrGraph(); //字符串型 事件统计图标
        this.getEventDetailStr(); //字符串型 事件统计表格
        this.showStr = true;
      } else {
        this.showStr = false;
        this.$refs.detailOpacity.init(this.queryModel);
        // this.getEventDetailRealTimeNum();//数值型 实时
        // this.getEventDetailNumGraph(); //数值型 实时图表
        // this.getEventDetailNum(); //数值型
      }
    },
  },
  data() {
    return {
      tabOpacity: "1", //数值 字符串
      TabOpacityList: [
        {
          id: "1",
          title: "数值型",
        },
        {
          id: "2",
          title: "字符串型",
        },
      ],
      showStr: false,
      StrNum: false,
      downTable,
      event_vname: "",
      eventList: [
        { label: "START_DOWNLOAD", event_vname: "START_DOWNLOAD" },
        { label: "START_DOWNLOAD1", event_vname: "START_DOWNLOAD1" },
      ],
      activeKind: "1",
      tabOptionChannel: [
        {
          id: "1",
          title: "消息数量",
        },
        {
          id: "2",
          title: "消息数/启动次数",
        },
        {
          id: "3",
          title: "独立用户数",
        },
        // {
        //   id: "4",
        //   title: "消息时长",
        // },
      ],
      tabTypeId: "1",
      tabType: [
        {
          id: "1",
          title: "次数分布",
        },
        {
          id: "2",
          title: "时长分布",
        },
      ],
      a: [],
      b: [],
      c: [],
      d: [],
      showEchart: true,
      seriesData: [],
      xAxisData: [],
      seriesTrendData: [],
      xAxisTrendData: [],
      queryModel: {
        carryApp: true,
        page: "1",
        size: "10",
      },
      dateRange: [new Date(), new Date()],
      tableData: {
        page: 1,
        size: 10,
        list: [],
      },
      columns: [
        { key: "pt", label: "日期", align: "left", width: "600px" },
        { slot: "total_cnt", label: "消息数量", align: "right" },
        {
          slot: "rate",
          label: "消息数/启动次数",
          align: "right",
        },
        { slot: "active_cnt", label: "独立用户数", align: "right" },
        // { key: "mc_eid_cn", label: "消息时长", align: "right" },
      ],
      distributionltableData: {
        page: 1,
        size: 10,
        list: [{ mc_eid_cn: "12" }],
      },
      distributionlcolumns: [
        { slot: "mc_eid", label: "日期", align: "left", width: "600px" },
        { key: "sum_total_cnt", label: "参考值", align: "center" },
        {
          key: "total_cnt",
          label: "消息数量",
          align: "center",
        },
        { key: "active_cnt", label: "占比", align: "center" },
      ],
      appChannelList: [{ label: "活动一", app_channel: "1" }],
      selectChannel: "1",
      showDetailTrend: false,
      isshowStr: false,
    };
  },

  methods: {
    search(row) {
      this.queryModel = {
        ...this.queryModel,
        ...row,
        app_appid: this.appInfo.app_appid,
        event_name: this.event_vname,
      };
      delete this.queryModel.date;
      // this.fetchList();
      // this.$refs.detailOpacity.init(this.queryModel);
      // this.getEventDetailStrGraph(); //字符串型 事件统计图标
      // this.getEventDetailStr(); //字符串型 事件统计表格
      // this.getEventDetailNum(); //数值型
      // this.getEventDetailRealTimeNum(); //数值型 实时
      // this.getEventDetailNumGraph(); //数值型 实时图表
    },
    // 字符串事件统计明细表格分页
    handleChangePage({ page, size }) {
      this.queryModel.page = page;
      this.queryModel.size = size;
      this.getEventDetailStr();
      // this.fetchList();
    },
    // fetchList() {
    //   getEventList(this.queryModel).then((res) => {
    //     console.log(res);
    //     if (res.code == 200) {
    //       // this.$message.success(res.msg);
    //       // this.tableData = res.data;
    //       // this.a = [];
    //       // this.b = [];
    //       // this.c = [];
    //       // this.d = [];
    //       // this.xAxisData = [1, 2, 3, 4, 5];
    //       // this.a = [{ name: "消息数量", type: "line", data: [1, 2, 3, 3, 5] }];
    //       // this.b = [
    //       //   { name: "消息数/启动次数", type: "line", data: [2, 2, 3, 3, 5] },
    //       // ];
    //       // this.c = [
    //       //   { name: "独立用户数", type: "line", data: [3, 2, 3, 3, 5] },
    //       // ];
    //       // this.d = [{ name: "消息时长", type: "line", data: [3, 2, 3, 3, 5] }];
    //       // if (this.activeKind == "1") {
    //       //   this.seriesData = this.c;
    //       // } else if (this.activeKind == "2") {
    //       //   this.seriesData = this.b;
    //       // } else if (this.activeKind == "3") {
    //       //   this.seriesData = this.a;
    //       // } else if (this.activeKind == "4") {
    //       //   this.seriesData = this.d;
    //       // }
    //     }
    //   });
    // },
    // 数值
    // getEventDetailNum() {
    //   console.log(this.queryModel);
    //   getEventDetailNum(this.queryModel).then((res) => {
    //     console.log(res);
    //   });
    // },
    // 数值--实时
    // getEventDetailRealTimeNum() {
    //   let obj = { ...this.queryModel };
    //   delete obj.app_channel;
    //   delete obj.app_vname;
    //   delete obj.start_date;
    //   delete obj.end_date;
    //   console.log(obj);
    //   getEventDetailRealTimeNum(obj).then((res) => {
    //     console.log(res);
    //   });
    // },
    // 数值--实时图表
    // getEventDetailNumGraph() {
    //   getEventDetailNumGraph(this.queryModel).then((res) => {
    //     this.xAxisData = res.data.list.dates;
    //     let array = res.data.list.items;
    //     let total_cntList = JSON.parse(JSON.stringify(array));
    //     let mc_numList = JSON.parse(JSON.stringify(array));
    //     let rateList = JSON.parse(JSON.stringify(array));
    //     total_cntList.forEach((item) => {
    //       item.type = "line";
    //       item.data = item.total_cnt;
    //     });
    //     this.a = total_cntList;
    //     mc_numList.forEach((item) => {
    //       item.type = "line";
    //       item.data = item.mc_num;
    //     });
    //     this.b = mc_numList;
    //     rateList.forEach((item) => {
    //       item.type = "line";
    //       item.data = item.rate;
    //     });
    //     this.c = rateList;
    //     if (this.activeKind == "1") {
    //       this.seriesData = this.a;
    //     } else if (this.activeKind == "2") {
    //       this.seriesData = this.b;
    //     } else if (this.activeKind == "3") {
    //       this.seriesData = this.c;
    //     }
    //   });
    // },
    // 字符串 事件统计图标
    getEventDetailStrGraph() {
      getEventDetailStrGraph(this.queryModel).then((res) => {
        // this.disposeStatistics(res.data.list);
        this.xAxisData = res.data.dates;
        this.a = [
          {
            name: "消息数量",
            type: "line",
            data: res.data.list.count_cnt,
            itemStyle: {
              normal: {
                color: "#2196f3", //折点颜色
                lineStyle: {
                  color: "#2196f3", //折线颜色
                },
              },
            },
          },
        ];
        this.b = [
          {
            name: "消息数/启动次数",
            type: "line",
            data: res.data.list.rate,
            itemStyle: {
              normal: {
                color: "#2196f3", //折点颜色
                lineStyle: {
                  color: "#2196f3", //折线颜色
                },
              },
            },
          },
        ];
        this.c = [
          {
            name: "独立用户数",
            type: "line",
            data: res.data.list.active_cnt,
            itemStyle: {
              normal: {
                color: "#2196f3", //折点颜色
                lineStyle: {
                  color: "#2196f3", //折线颜色
                },
              },
            },
          },
        ];
        if (this.activeKind == "1") {
          this.seriesData = this.a;
        } else if (this.activeKind == "2") {
          this.seriesData = this.b;
        } else if (this.activeKind == "3") {
          this.seriesData = this.c;
        }
      });
    },
    // 字符串 事件统计表格
    getEventDetailStr() {
      let obj = { ...this.queryModel };
      getEventDetailStr(this.queryModel).then((res) => {
        this.tableData = res.data;
      });
    },
    // handleOperate(row) {
    //   console.log(row);
    // },
    // 趋势按钮
    // addEditBtn(row) {
    //   // console.log(row);
    //   this.showDetailTrend = !this.showDetailTrend;
    //   // getEventList(this.queryModel).then((res) => {
    //   //   this.seriesTrendData = [
    //   //     { name: "独立用户数", type: "line", data: [1, 2, 1, 3, 5] },
    //   //   ];
    //   //   this.xAxisTrendData = [1, 2, 3, 4, 5];
    //   // });
    //   let that = this;
    //   that.$nextTick(() => {
    //     this.seriesTrendData = [
    //       { name: "独立用户数", type: "line", data: [1, 2, 1, 3, 5] },
    //     ];
    //     that.xAxisTrendData = [1, 2, 3, 4, 5];
    //   });
    // },
    // disposeStatistics(res) {
    //   this.a = [];
    //   this.b = [];
    //   this.c = [];
    //   // this.d = [];
    //   let total_cnt = [];
    //   let rate = [];
    //   let active_cnt = [];
    //   console.log(res);
    //   this.xAxisData = [];
    //   res.forEach((item) => {
    //     this.xAxisData.push(item.pt);
    //     total_cnt.push(item.total_cnt);
    //     rate.push(item.rate);
    //     active_cnt.push(item.active_cnt);
    //   });

    //   this.a = [{ name: "消息数量", type: "line", data: total_cnt }];
    //   this.b = [{ name: "消息数/启动次数", type: "line", data: rate }];
    //   this.c = [{ name: "独立用户数", type: "line", data: active_cnt }];
    //   // this.d = [{ name: "消息时长", type: "line", data: [3, 2, 3, 3, 5] }];
    //   if (this.activeKind == "1") {
    //     this.seriesData = this.a;
    //   } else if (this.activeKind == "2") {
    //     this.seriesData = this.b;
    //   } else if (this.activeKind == "3") {
    //     this.seriesData = this.c;
    //   } else if (this.activeKind == "4") {
    //     // this.seriesData = this.d;
    //   }
    // },
    searchh(val) {
      this.$router.push(`/business/funct/CustomEvents/detail/${val}`);
    },
  },
  created() {
    this.event_vname = this.$route.params.id;
  },
  mounted() {
    this.$refs.detailOpacity.init();
  },
};
</script>

<style lang="scss" scoped>
.headTop {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 40px;
}

.tabelTitle {
  display: flex;
  justify-content: space-between;
  background: rgb(247, 248, 250);
  padding: 20px;
  margin-top: 10px;
}
.tb {
  background: white;
  padding: 15px;
}
.chartsWpper1 {
  background: white;
  padding: 20px;
}
.distributionlTitle {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.selectTab {
  display: flex;
  align-items: center;
  margin: 40px 30px 20px 20px;
}
.detailTrend {
  width: 97%;
  margin: 20px auto;
}
.as {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  padding: 10px 10px 10px 2%;
}
.TrendBack {
  color: #2196f3;
  font-size: 16px;
  display: flex;
}
.TrendLine {
  display: inline-block;
  height: 90%;
  width: 2px;
  background: rgb(217, 217, 217);
  margin: 0 10px;
}
</style>
