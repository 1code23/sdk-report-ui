<template>
  <div class="analDetail">
    <BlockContent style="margin-bottom: 16px; padding: 14px 10px">
      <i
        class="el-icon-arrow-left mr10 pointer"
        style="padding-right: 10px; border-right: 1px solid #f0f1f3"
        @click="backIndex"
      ></i>
      <el-select
        class="channelSelect"
        v-model="appChannel"
        @change="channelChange"
        placeholder="请选择"
        filterable
      >
        <el-option
          v-for="item in channelOptions"
          :key="item.app_channel"
          :label="item.label"
          :value="item.app_channel"
        >
        </el-option>
      </el-select>
    </BlockContent>
    <div class="panel">
      <Header>
        <div slot="l">
          <span class="fz16 fw7">渠道趋势</span>
        </div>
        <div slot="r">
          <el-select
            class="channelSelect versionSlect"
            v-model="queryModel.appVname"
            @change="channelChangeAppVname"
            placeholder="请选择"
            filterable
          >
            <el-option
              v-for="item in appVnameLists"
              :key="item.app_vname"
              :label="item.label"
              :value="item.app_vname"
            >
            </el-option>
          </el-select>
          <span
            class="timeBtn fw7 pointer"
            :class="[isOnclick == 1 ? 'onclickClass' : '']"
            @click="isOnclicks(1)"
            >过去七天</span
          >
          <span
            class="timeBtn fw7 pointer"
            :class="[isOnclick == 2 ? 'onclickClass' : '']"
            @click="isOnclicks(2)"
            >过去30天</span
          >
          <el-date-picker
            size="mini"
            v-model="timeRange"
            type="daterange"
            range-separator="~"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            class="channelDatarange mr10"
            @change="changeDate"
          >
          </el-date-picker>
          <span class="pointer blueHover colorGrey fw7" @click="downTable">
            <i class="el-icon-document"></i>导出数据
          </span>
        </div>
      </Header>
      <pdPanel style="margin-bottom: 16px; padding-bottom: 0">
        <el-radio-group class="userRadios" v-model="userRadios" size="mini">
          <el-radio-button v-for="(a, b) in trendTabs" :key="b" :label="a.id">{{
            a.title
          }}</el-radio-button>
        </el-radio-group>
        <div class="contrast">
          <el-popover
            popper-class="pickerCycle"
            placement="bottom-start"
            width="160"
            v-model="cyclebtn"
          >
            <pickerContainer v-if="cyclebtn"></pickerContainer>
            <div class="cyclebtn disfr ac jsb" slot="reference">
              <span>对比分析</span>
              <i class="el-icon-document-copy fz16 colorGrey" />
            </div>
          </el-popover>
        </div>
        <!-- <chartLine class="dashedLine"></chartLine> -->
        <echartstab
          :xAxisData="xAxisData"
          :seriesData="seriesData"
          :showEchart="showEchart"
          :tabOpcity="userRadios"
        ></echartstab>
        <contractionDetail
          class="disfr"
          :closed.sync="detailClosed1"
          label="明细数据"
        ></contractionDetail>
        <pageTable
          :columns="columns"
          :tableData="tableData"
          id="channelTrend"
          v-show="!detailClosed1"
          @page-change="handleChangePage"
        >
          <template slot-scope="{ row }" slot="new_count">
            <span>{{ row.new_count | toThousands }} </span>
          </template>
          <template slot-scope="{ row }" slot="active_cnt">
            <span>{{ row.active_cnt | toThousands }} </span>
          </template>
          <template slot-scope="{ row }" slot="launch_count">
            <span>{{ row.launch_count | toThousands }} </span>
          </template>
          <template slot-scope="{ row }" slot="dan_use_time">
            <span>{{ changeDateTime(row.dan_use_time) }} </span>
          </template>
          <template slot-scope="{ row }" slot="day_use_time">
            <span>{{ changeDateTime(row.day_use_time) }} </span>
          </template>
          <template slot-scope="{ row }" slot="avg_remain_count">
            <span>{{ row.avg_remain_count }}% </span>
          </template>
        </pageTable>
      </pdPanel>

      <channelActive></channelActive>
      <retainedDetail></retainedDetail>
      <channelAddDetail></channelAddDetail>
    </div>
  </div>
</template>

<script>
import moment from "moment";
import { BlockContent, Tab, Search } from "@/components/BlockContent/index.js";
import {
  pdPanel,
  Header,
  contractionDetail,
} from "@/components/greyPanel/index.js";
import { mapGetters } from "vuex";
import pickerContainer from "./pickerContainer";
import chartLine from "./detailComponents/chartLine.vue";
import retainedDetail from "./detailComponents/retainedDetail.vue";
import channelAddDetail from "./detailComponents/channelAddDetail.vue";
import channelActive from "./detailComponents/channelActive.vue";
import echartstab from "./echarttab";
import pageTable from "@/components/echartsUserAnalysis/PageTable";
import { getChannelTrend } from "@/api/channelAnalysis";
import { changeDateTime } from "@/utils/index.js";
import {
  getChannelTrendComparisonList,
  getChannelMatrixAnalysisList,
  getChannelDataDetailsAnalysisList,
} from "@/api/channelAnalysis.js";

export default {
  components: {
    BlockContent,
    Header,
    Tab,
    Search,
    pdPanel,
    pickerContainer,
    chartLine,
    contractionDetail,
    retainedDetail,
    channelAddDetail,
    channelActive,
    echartstab,
    pageTable,
  },
  data() {
    return {
      changeDateTime,
      xAxisData: [],
      seriesData: [],
      showEchart: true,
      tabOpcity: "1",
      channelOptions: [
        {
          app_channel: "all",
          label: "全部渠道",
        },
      ],
      appVnameLists: [{ app_vname: "all", label: "全部版本" }],
      appChannel: null,
      queryModel: {
        appChannel: "",
        appVname: "",
      },

      timeradio: "",
      timeRange: [new Date().getTime() - 7 * 24 * 60 * 60 * 1000, new Date()],
      userRadios: "1",
      trendTabs: adr.constant.trendTabs,
      cyclebtn: false,
      detailClosed1: false,
      isOnclick: 0,
      columns: [
        {
          label: "日期",
          key: "pt",
          align: "left",
        },
        {
          label: "新增用户",
          slot: "new_count",
          align: "center",
        },
        {
          label: "活跃用户",
          slot: "active_cnt",
          align: "center",
        },
        {
          label: "启动次数",
          slot: "launch_count",
          align: "center",
        },
        {
          label: "平均单次使用时长",
          slot: "dan_use_time",
          align: "center",
        },
        {
          label: "平均日使用时长",
          slot: "day_use_time",
          align: "center",
        },
        {
          label: "新增次日留存率",
          slot: "avg_remain_count",
          align: "right",
        },
      ],
      tableData: {
        page: 1,
        size: 10,
        count: 0,
        list: [],
      },
      page: 1,
      size: 10,
    };
  },
  computed: {
    ...mapGetters(["appInfo", "appChannelList", "appVnameList"]),
  },
  mounted() {
    this.appChannel = this.$route.params.id;
    this.init();
  },
  methods: {
    backIndex() {
      this.$router.go(-1);
    },
    goNext() {},
    async init() {
      await this.$store.dispatch("app/getAppChannel");
      await this.$store.dispatch("app/getAppVname");
      this.channelOptions = [...this.channelOptions, ...this.appChannelList];
      this.appVnameLists = [...this.appVnameLists, ...this.appVnameList];
      this.queryModel.appVname = this.appVnameLists[0].app_vname;
      this.getChannelTrendList();
      this.getChannelTrendTabel();
    },
    async getLineData() {
      let params = {
        start_date: this.timeRange[0],
        end_date: this.timeRange[1],
        app_channel: this.appChannel,
        app_vname: this.queryModel.appVname,
        app_appid: this.appInfo.app_appid,
      };
      let res = await getChannelTrendComparisonList({});
      console.log(res);
    },
    channelChange(key) {
      this.$router.replace(`/business/channelAnalysis/anal/detail/${key}`);
    },
    channelChangeAppVname(val) {
      this.queryModel.appVname = val;
      this.getChannelTrendList();
      this.getChannelTrendTabel();
    },
    isOnclicks(val) {
      if (val == 1) {
        this.timeRange = [
          new Date().getTime() - 7 * 24 * 60 * 60 * 1000,
          new Date() - 1 * 24 * 60 * 60 * 1000,
        ];
      } else {
        this.timeRange = [
          new Date().getTime() - 30 * 24 * 60 * 60 * 1000,
          new Date() - 1 * 24 * 60 * 60 * 1000,
        ];
      }
      this.isOnclick = val;
      this.getChannelTrendList();
      this.getChannelTrendTabel();
    },
    changeDate() {
      this.isOnclick = 0;
      this.getChannelTrendList();
      this.getChannelTrendTabel();
    },
    // 渠道趋势图表
    getChannelTrendList() {
      let params = {
        start_date: moment(this.timeRange[0]).format("YYYY-MM-DD"),
        end_date: moment(this.timeRange[1]).format("YYYY-MM-DD"),
        app_channel: this.appChannel,
        app_vname: this.queryModel.appVname,
        app_appid: this.appInfo.app_appid,
        contrast: "all",
        page: 1,
        size: 100000,
      };
      let NArray = [];
      let AcArray = [];
      let LArray = [];
      let DanArray = [];
      let DayArray = [];
      let ZArray = [];
      getChannelTrend(params).then((res) => {
        this.xAxisData = [];
        this.seriesData = [{ data: [1, 2, 3], name: "cehs", type: "line" }];
        res.data.list.forEach((item) => {
          this.xAxisData.push(item.pt);
          NArray.push(item.new_count);
          AcArray.push(item.active_cnt);
          LArray.push(item.launch_count);
          DanArray.push(item.dan_use_time);
          DayArray.push(item.day_use_time);
          ZArray.push(item.avg_remain_count);
        });
        this.xAxisData = this.xAxisData.reverse();
        this.N = [
          {
            data: NArray.reverse(),
            name: res.data.list[0].app_channel,
            type: "line",
            lineStyle: {
              //线条样式
              color: "#409EFF",
              width: 2,
            },
            itemStyle: {
              // 转折点样式
              borderWidth: 1,
              color: "#409EFF",
            },
          },
        ];
        this.A = [
          {
            data: AcArray.reverse(),
            name: res.data.list[0].app_channel,
            type: "line",
            lineStyle: {
              //线条样式
              color: "#409EFF",
              width: 2,
            },
            itemStyle: {
              // 转折点样式
              borderWidth: 1,
              color: "#409EFF",
            },
          },
        ];
        this.L = [
          {
            data: LArray.reverse(),
            name: res.data.list[0].app_channel,
            type: "line",
            lineStyle: {
              //线条样式
              color: "#409EFF",
              width: 2,
            },
            itemStyle: {
              // 转折点样式
              borderWidth: 1,
              color: "#409EFF",
            },
          },
        ];
        this.Dan = [
          {
            data: DanArray.reverse(),
            name: res.data.list[0].app_channel,
            type: "line",
            lineStyle: {
              //线条样式
              color: "#409EFF",
              width: 2,
            },
            itemStyle: {
              // 转折点样式
              borderWidth: 1,
              color: "#409EFF",
            },
          },
        ];
        this.Day = [
          {
            data: DayArray.reverse(),
            name: res.data.list[0].app_channel,
            type: "line",
            lineStyle: {
              //线条样式
              color: "#409EFF",
              width: 2,
            },
            itemStyle: {
              // 转折点样式
              borderWidth: 1,
              color: "#409EFF",
            },
          },
        ];
        this.Z = [
          {
            data: ZArray.reverse(),
            name: res.data.list[0].app_channel,
            type: "line",
            lineStyle: {
              //线条样式
              color: "#409EFF",
              width: 2,
            },
            itemStyle: {
              // 转折点样式
              borderWidth: 1,
              color: "#409EFF",
            },
          },
        ];
        if (this.userRadios == "1") {
          this.seriesData = this.N;
        }
        if (this.userRadios == "2") {
          this.seriesData = this.A;
        }
        if (this.userRadios == "3") {
          this.seriesData = this.L;
        }
        if (this.userRadios == "4") {
          this.seriesData = this.Dan;
        }
        if (this.userRadios == "5") {
          this.seriesData = this.Day;
        }
        if (this.userRadios == "6") {
          this.seriesData = this.Z;
        }
      });
    },
    // 渠道趋势表格
    getChannelTrendTabel() {
      let params = {
        start_date: moment(this.timeRange[0]).format("YYYY-MM-DD"),
        end_date: moment(this.timeRange[1]).format("YYYY-MM-DD"),
        app_channel: this.appChannel,
        app_vname: this.queryModel.appVname,
        app_appid: this.appInfo.app_appid,
        contrast: "all",
        page: this.page,
        size: this.size,
      };
      getChannelTrend(params).then((res) => {
        this.tableData = res.data;
      });
    },
    handleChangePage({ page, size }) {
      this.page = page;
      this.size = size;
      this.getChannelTrendTabel();
    },
    downTable() {
      adr.utils.downTableCusName("channelTrend", "渠道趋势");
    },
  },
  watch: {
    userRadios: {
      handler(newVal, oldVal) {
        if (newVal == 1) {
          this.seriesData = this.N;
        } else if (newVal == 2) {
          this.seriesData = this.A;
        } else if (newVal == 3) {
          this.seriesData = this.L;
        } else if (newVal == 4) {
          this.seriesData = this.Dan;
        } else if (newVal == 5) {
          this.seriesData = this.Day;
        } else if (newVal == 6) {
          this.seriesData = this.Z;
        }
      },
    },
  },
};
</script>

<style lang="scss" scoped>
.analDetail {
  font-size: 12px;
  /deep/.channelSelect {
    height: 24px;
    width: 132px;
    .el-input__inner {
      border: none;
      border-bottom: 1px solid #c4c9d2;
      color: black;
      font-weight: 700;
      font-size: 16px;
      border-radius: 0;
      line-height: 30px;
      height: 30px;
    }
  }
  /deep/.versionSlect {
    .el-input__inner {
      font-size: 12px;
      background: transparent;
    }
  }

  .timeBtn {
    display: inline-block;
    height: 20px;
    margin: 0;
    padding: 0 15px;
    color: #252934;
    line-height: 20px;
    &:hover {
      color: #3b82fe;
    }
  }
  .onclickClass {
    color: #3b82fe;
  }
  /deep/.channelDatarange {
    width: 200px;
    background: transparent;
    border: none;
    border-radius: 0;
    border-bottom: 1px solid #c4c9d2;
    .el-range-input {
      background: transparent;
    }
  }
  /deep/.userRadios {
    .el-radio-button:last-child .el-radio-button__inner {
      border-radius: 0;
    }
    .el-radio-button:first-child .el-radio-button__inner {
      border-radius: 0;
    }
  }
  .contrast {
    padding-top: 20px;
    .cyclebtn {
      padding: 0 0 0 4px;
      width: 78px;
      font-size: 12px;
      height: 28px;
      cursor: pointer;
      border-bottom: 1px solid #6b798e;
    }
  }
  .dashedLine {
    border-bottom: 1px dashed #e5e5e5;
  }
}
</style>
<style lang="scss">
.pickerCycle.el-popover {
  width: 400px !important;
  padding: 0;
}
</style>
