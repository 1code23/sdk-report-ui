<template>
  <div>
    <BlockContent style="margin-bottom: 20px">
      <Header
        ><div class="header-title" slot="l">
          <span
            class="title"
            style="font-weight: 800; color: #252934; font-size: 18px"
            >渠道明细数据<i
              class="el-icon-s-management"
              style="margin-left: 10px"
            ></i>
          </span></div
      ></Header>
      <!-- 渠道 -->
      <Header style="margin-bottom: -20px">
        <div slot="l">
          <el-select
            v-model="appChannel"
            @change="channelChange"
            placeholder="请选择"
            filterable
            style="width: 50%"
          >
            <el-option
              v-for="item in channelOptions"
              :key="item.app_channel"
              :label="item.label"
              :value="item.app_channel"
            >
            </el-option>
          </el-select>
        </div>
        <div slot="r" class="disfr">
          <Tab
            :activeId.sync="queryModel.dateid"
            :list="dateOptions"
            class="mr10"
          />
          <el-date-picker
            size="mini"
            v-model="timeRange"
            type="daterange"
            :clearable="false"
            range-separator="~"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            class="mr10"
            @change="changeDate"
          >
          </el-date-picker>
        </div>
      </Header>
    </BlockContent>
    <BlockContent style="margin-bottom: -20px; background: #f7f8fa">
      <Header>
        <div class="header-title" slot="l">
          <span class="title" style="font-weight: 800; color: #252934"
            >渠道趋势对比</span
          >
        </div>
        <!-- 版本选择 -->
        <el-select
          v-model="queryModel.app_vname"
          placeholder="请选择"
          filterable
          @change="changeVersion"
          slot="r"
          style="width: 50%; margin-left: 50%"
          class="channelSelect versionSlect"
        >
          <el-option
            v-for="item in versionList"
            :key="item.app_vname"
            :label="item.label"
            :value="item.app_vname"
          >
          </el-option>
        </el-select>
      </Header>
    </BlockContent>
    <div class="areaChart">
      <Tab :activeId.sync="queryModel.id" :list="tabOptions" />
      <div ref="projectButton" style="margin: 20px 0">
        <el-popover
          v-model="visible"
          trigger="manual"
          @show="show"
          @hide="hide"
          placement="bottom-start"
          popper-class="ChanBox"
        >
          <div class="inputDeep">
            <div class="channelInput">
              <el-input
                v-model="stateDate"
                placeholder="搜索渠道名称"
                suffix-icon="el-icon-search"
              ></el-input>
              <!-- <span
                >{{ this.selectChannelId.length }}/{{
                  this.channelList.length
                }}</span
              > -->
              <span>{{ this.selectChannelId.length }}/15</span>
            </div>
            <div class="checkboxChannel">
              <div v-for="item in channelList" :key="item.label">
                <el-checkbox
                  v-model="item.state"
                  :label="item.label"
                  v-show="item.isshow"
                  @change="checkChannel"
                  style="margin: 3px 3px 3px 8px"
                  :disabled="item.disabled"
                ></el-checkbox>
              </div>
            </div>
          </div>

          <div slot="reference" type="primary" @click="clkChannelinput">
            <el-tooltip
              class="item"
              effect="light"
              :content="channelString"
              placement="top-start"
            >
              <el-input v-model="channelString" class="channelbox"
                ><i class="el-icon-collection ic" slot="suffix"></i
              ></el-input>
            </el-tooltip>
          </div>
        </el-popover>
      </div>
      <echartstab
        :xAxisData="xAxisData"
        :seriesData="seriesData"
        :showEchart="showEchart"
        :tabOpcity="tabOpcity"
      ></echartstab>
    </div>
    <BlockContent
      style="background: #f7f8fa; margin-top: 20px; margin-bottom: -20px"
    >
      <Header>
        <div class="header-title" slot="l">
          <span class="title" style="font-weight: 800; color: #252934"
            >渠道矩阵分析
          </span>
          <el-popover placement="bottom-start" width="400" trigger="hover">
            <div style="width: 400px">
              可通过矩阵分析了解各个渠道的价值，在您推广平台选择时也可选择高转化高偏好的渠道作为重点渠道
            </div>
            <i slot="reference" class="el-icon-info" style="color: #ccc"></i>
          </el-popover>
        </div>
      </Header>
    </BlockContent>
    <div class="channelEchart">
      <p class="channelTitle">
        横轴：新增用户（日均）<span>纵轴：次日留存率（日均）</span>
      </p>
    </div>
    <echartstat :seriesData="statSeriesData"></echartstat>
    <BlockContent
      style="background: #f7f8fa; margin-top: 20px; margin-bottom: -20px"
    >
      <Header
        ><div class="header-title" slot="l">
          <span class="title" style="font-weight: 800; color: #252934"
            >渠道明细数据
          </span>
        </div>
        <div class="export" @click="downTables()" slot="r">
          <span style="font-size: 14px; color: #3882fe"
            ><i class="el-icon-document" style="margin-right: 5px"></i
            >导出</span
          >
        </div></Header
      >
    </BlockContent>
    <pageTable
      :columns="columns"
      :tableData="tableData"
      @page-change="handleChangePage"
    >
      <template slot-scope="{ row }" slot="app_channel">
        <span @click="goDetail(row)" class="cur" style="color: #3b82fe"
          >{{ row.app_channel }}
        </span>
      </template>
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
      <template slot-scope="{ row }" slot="sum_cnt_rate">
        <span>{{ row.sum_cnt | toThousands }}({{ row.sum_cnt_rate }}%) </span>
      </template>
    </pageTable>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import moment from "moment";
import { BlockContent, Header, Tab } from "@/components/BlockContent/index.js";
import echartstab from "./echarttab2";
import echartstat from "@/components/echartsUserAnalysis/echartStat";
import {
  getChannelTrendComparisonList,
  getChannelMatrixAnalysisList,
  getChannelDataDetailsAnalysisList,
} from "@/api/channelAnalysis.js";
import pageTable from "@/components/echartsUserAnalysis/PageTable";
import { changeDateTime } from "@/utils/index.js";
export default {
  components: {
    BlockContent,
    Header,
    Tab,
    echartstab,
    echartstat,
    pageTable,
  },
  computed: {
    ...mapGetters(["appInfo", "appChannelList", "appVnameList"]),
  },
  data() {
    return {
      visible: false,
      showChannelArray: false,
      stateDate: "",
      channelString: "",
      channelList: [],
      changeDateTime,
      timeRange: [new Date().getTime() - 7 * 24 * 60 * 60 * 1000, new Date()],
      queryModel: {
        page: "1",
        size: "10",
        carryApp: true,
        app_channel: "all",
        app_vname: "all",
        id: "1",
        channelid: "1",
        dateid: "2",
      },
      channelOptions: [
        {
          app_channel: "all",
          label: "全部渠道",
        },
      ],
      versionList: [{ app_vname: "all", label: "全部版本" }],
      selectChannelId: [],
      appChannel: "all",
      type: ["date"],
      type1: ["date", "channel", "versions"],
      tabOptions: adr.constant.tabOptions,
      dateOptions: [
        {
          id: "1",
          title: "今天",
          // disabled: true,
        },
        {
          id: "2",
          title: "过去7天",
        },
        {
          id: "3",
          title: "过去30天",
        },
      ],
      seriesData: [],
      statSeriesData: [],
      xAxisData: [],
      showEchart: true,
      tabOpcity: "1",
      showSingle: true,
      tableData: {
        page: 1,
        size: 10,
        list: [],
      },
      columns: [
        { key: "pt", label: "日期", align: "center", sortable: true },
        {
          slot: "app_channel",
          label: "渠道名称",
          align: "center",
          sortable: true,
        },
        {
          slot: "new_count",
          label: "新增用户",
          align: "center",
          sortable: true,
        },
        {
          slot: "active_cnt",
          label: "活跃用户",
          align: "center",
          sortable: true,
        },
        {
          slot: "launch_count",
          label: "启动次数",
          align: "center",
          sortable: true,
        },
        {
          slot: "dan_use_time",
          label: "平均单次使用时长",
          align: "center",
          sortable: true,
        },
        {
          slot: "day_use_time",
          label: "平均日使用时长",
          align: "center",
          sortable: true,
        },
        {
          slot: "sum_cnt_rate",
          label: "累计用户占比%",
          align: "center",
          sortable: true,
        },
      ],
      vnameAllList: "",
      appdata: "",
    };
  },
  methods: {
    show() {
      document.addEventListener("click", this.hidePanel, false);
    },
    hide() {
      document.removeEventListener("click", this.hidePanel, false);
    },
    hidePanel(e) {
      if (!this.$refs.projectButton.contains(e.target)) {
        this.visible = false;
        this.hide();
      }
    },
    clkChannelinput() {
      this.showChannelArray = true;
      this.visible = !this.visible;
    },
    fetchList() {
      let verobj = { ...this.queryModel };
      verobj.start_date = moment(this.timeRange[0]).format("YYYY-MM-DD");
      verobj.end_date = moment(this.timeRange[1]).format("YYYY-MM-DD");
      delete verobj.any_date;
      delete verobj.channelid;
      delete verobj.dateid;
      delete verobj.id;
      this.gettrend(verobj);
      getChannelMatrixAnalysisList(verobj).then((res) => {
        this.statSeriesData = [];
        res.data.list.forEach((item) => {
          this.statSeriesData.push([
            item.new_count,
            item.avg_remain_count,
            item.app_channel,
          ]);
        });
      });
      getChannelDataDetailsAnalysisList(verobj).then((res) => {
        console.log(res);
        this.tableData = res.data;
      });
    },
    handleChangePage({ page, size }) {
      this.queryModel.page = page;
      this.queryModel.size = size;
      this.fetchList();
    },
    changeVersion(val) {
      this.queryModel.app_vname = val;
      this.fetchList();
    },
    //选择渠道(折线图)
    // changeChannel(val) {
    //   console.log(val);
    //   if (val.length == 0) {
    //     this.$message.success("不能为空");
    //   } else {
    //     this.queryModel.app_channel = val.toString();
    //     let verobj = { ...this.queryModel };
    //     delete verobj.any_date;
    //     this.gettrend(verobj);
    //   }
    // },
    selechVname(vnameAllList, ptList, list, type) {
      // 已选中的数组，x轴数组 所有数组，数据分类按钮
      // console.log(vnameAllList, ptList, list, type);
      let VNA = vnameAllList.map((v) => {
        let obj = {
          name: v.appchannel,
          data: [],
          type: "line",
        };
        obj.data = ptList.map((pt) => {
          let item = null;
          switch (type) {
            case "1":
              list.map((l) => {
                if (l.pt === pt && v.appchannel === l.app_channel) {
                  item = l.new_count;
                }
              });
              break;
            case "2":
              list.map((l) => {
                if (l.pt === pt && v.appchannel === l.app_channel) {
                  item = l.active_cnt;
                }
              });
              break;
            case "3":
              list.map((l) => {
                if (l.pt === pt && v.appchannel === l.app_channel) {
                  item = l.launch_count;
                }
              });
              break;
            case "4":
              list.map((l) => {
                if (l.pt === pt && v.appchannel === l.app_channel) {
                  item = l.dan_use_time;
                }
              });
              break;
            case "5":
              list.map((l) => {
                if (l.pt === pt && v.appchannel === l.app_channel) {
                  item = l.day_use_time;
                }
              });
              break;
            case "6":
              list.map((l) => {
                if (l.pt === pt && v.appchannel === l.app_channel) {
                  item = l.avg_remain_count;
                }
              });
              break;
          }
          return item;
        });
        return obj;
      });
      return VNA;
    },
    gettrend(verobj) {
      verobj.start_date = moment(this.timeRange[0]).format("YYYY-MM-DD");
      verobj.end_date = moment(this.timeRange[1]).format("YYYY-MM-DD");
      delete verobj.channelid;
      delete verobj.dateid;
      delete verobj.id;
      getChannelTrendComparisonList(verobj).then((res) => {
        this.appdata = res.data;
        this.xAxisData = res.data.ptList;
        this.selectChannelId = []; //已选择的渠道名称数组
        // 数据处理
        let ch = res.data.choiceList;
        this.vnameAllList = ch.map((a) => {
          this.selectChannelId.push(a.appchannel);
          let list = [];
          res.data.list.map((l) => {
            if (l.app_channel === a.appchannel) {
              list.push(l);
            }
          });
          a.list = list;
          return a;
        });
        this.channelString = this.selectChannelId.toString();
        // this.channelList.forEach((item1) => {
        //   if (this.selectChannelId.indexOf(item1.app_channel) != -1) {
        //     item1.state = true;
        //   }
        // });
        if (this.selectChannelId.length == 15) {
          this.channelList.forEach((item1) => {
            if (this.selectChannelId.indexOf(item1.app_channel) != -1) {
              item1.state = true;
              item1.disabled = false;
            } else {
              item1.disabled = true;
            }
          });
        } else {
          this.channelList.forEach((item1) => {
            if (this.selectChannelId.indexOf(item1.app_channel) != -1) {
              item1.state = true;
              item1.disabled = false;
            } else {
              item1.disabled = false;
            }
          });
        }
        let serData = this.selechVname(
          this.vnameAllList,
          res.data.ptList,
          res.data.list,
          this.queryModel.id
        );
        this.seriesData = serData;
      });
    },
    channelChange(key) {
      this.$router.push(`/business/channelAnalysis/anal/detail/${key}`);
    },
    checkChannel(val) {
      let channelList = [];
      // let channelStateList = [];
      this.channelList.forEach((item) => {
        if (item.state) {
          channelList.push(item.app_channel);
          // channelStateList.push(item.state);
          this.queryModel.app_channel = channelList.toString();
          this.channelString = this.queryModel.app_channel;
          // channelStateList.push(item.state);
        }
      });
      let verobj = { ...this.queryModel };
      // if (channelStateList.length == 0) {
      //   let sd = [];
      //   this.channelList.slice(0, 5).forEach((item) => {
      //     verobj.app_channel = sd.push(item.app_channel);
      //   });
      //   this.channelString = "对比分析";
      //   verobj.app_channel = sd.toString();
      // }
      delete verobj.any_date;
      this.gettrend(verobj);
    },
    changeDate() {
      this.fetchList();
    },
    goDetail(val) {
      this.$router.push(
        `/business/channelAnalysis/anal/detail/${val.app_channel}`
      );
    },
    downTables() {
      let verobj = { ...this.queryModel };
      verobj.start_date = moment(this.timeRange[0]).format("YYYY-MM-DD");
      verobj.end_date = moment(this.timeRange[1]).format("YYYY-MM-DD");
      getChannelDataDetailsAnalysisList({
        ...verobj,
        size: 100000,
      }).then((res) => {
        let tableDatas = res.data;
        tableDatas.list.forEach((item) => {
          item.dan_use_time = changeDateTime(item.dan_use_time);
          item.day_use_time = changeDateTime(item.day_use_time);
          item.sum_cnt_rate = item.sum_cnt + "(" + item.sum_cnt_rate + "%)";
        }),
          window.adr.exportExcel.exportExcel({
            tHeader: this.columns,
            list: tableDatas.list,
            filename: `${verobj.start_date}~${verobj.end_date}-渠道明细数据`,
          });
      });
    },
  },
  watch: {
    "queryModel.id": {
      handler(newVal, oldVal) {
        this.seriesData = [];
        switch (newVal) {
          case "1":
            // this.EachSeriesData(this.selectChannelId, this.Nlist);
            this.tabOpcity = "1";
            break;
          case "2":
            this.tabOpcity = "1";
            break;
          case "3":
            this.tabOpcity = "1";
            break;
          case "4":
            this.tabOpcity = "2";
            break;
          case "5":
            this.tabOpcity = "3";
            break;
          case "6":
            this.tabOpcity = "4";
            break;
          default:
            this.tabOpcity = "1";
        }
        this.seriesData = this.selechVname(
          this.vnameAllList,
          this.appdata.ptList,
          this.appdata.list,
          newVal
        );
      },
    },
    "queryModel.dateid": {
      handler(newVal, oldVal) {
        switch (newVal) {
          case "1":
            this.timeRange = [new Date(), new Date()];
            break;
          case "2":
            this.timeRange = [
              new Date().getTime() - 7 * 24 * 60 * 60 * 1000,
              new Date(),
            ];
            break;
          case "3":
            this.timeRange = [
              new Date().getTime() - 30 * 24 * 60 * 60 * 1000,
              new Date(),
            ];
            break;
        }
        this.fetchList();
      },
    },
    stateDate: {
      handler(newVal, oldVal) {
        this.channelList.forEach((item) => {
          if (item.label.indexOf(newVal) != -1) {
            item.isshow = true;
          } else {
            item.isshow = false;
          }
        });
      },
    },
  },
  async created() {
    const appChannelList = await this.$store.dispatch("app/getAppChannel");
    const appVnameList = await this.$store.dispatch("app/getAppVname");
    this.channelOptions = [...this.channelOptions, ...appChannelList];
    this.versionList = [...this.versionList, ...appVnameList];
    this.channelList = appChannelList.map((item) => {
      let obj = { ...item };
      obj.isshow = true;
      obj.state = false;
      return obj;
    });
    this.fetchList();
  },
};
</script>
<style lang="scss" scoped>
.checkboxChannel {
  height: 300px;
  width: 260px;
  overflow-y: scroll;
  box-sizing: border-box;
  position: absolute;
  z-index: 2;
  background: white;
}
.checkboxChannel::-webkit-scrollbar-thumb {
  background: rgb(237, 239, 244);
}
.checkboxChannel::-webkit-scrollbar-track-piece {
  background: rgb(255, 255, 255);
}

.areaChart {
  background: white;
  padding: 20px;
  box-sizing: border-box;
  .selectChannel {
    margin-top: 30px;
  }
}
.channelEchart {
  background: white;
  .channelTitle {
    font-size: 12px;
    padding: 20px;
    color: #6b798e;
  }
}
/deep/.el-input {
  height: 30px;
}
/deep/.el-input--small .el-input__inner {
  height: 30px;
  line-height: 30px;
}
/deep/ .el-input--small {
  font-size: 12px;
}
/deep/.el-select__tags-text {
  display: inline-block;
  max-width: 65px;
  overflow: hidden;
  // overflow: "no-content";
  text-overflow: ellipsis;
  white-space: nowrap;
}
/deep/.channelbox .el-input__inner {
  border: none;
  border-bottom: 1px solid rgb(95, 94, 94);
  border-radius: 0;
  cursor: pointer !important;
}
.channelbox {
  width: 20%;
  span {
    display: flex;
    align-items: center;
  }
}
/deep/.channelbox span {
  display: flex;
  align-items: center;
}
.channelbox:focus {
  outline: none;
}
.inputDeep {
  position: relative;
  margin-top: 8px;
  .channelInput {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 260px;
    box-sizing: border-box;
    padding-right: 5px;
    border-bottom: 1px solid rgb(237, 239, 244);
    span {
      font-size: 14px;
      margin-left: 10px;
    }
    /deep/.el-input {
      width: 85% !important;
    }
    /deep/ .el-input__inner {
      border: none;
    }
  }
}
/deep/ .el-date-editor--daterange.el-input__inner {
  width: 200px;
}
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
/deep/.el-range-editor--mini .el-range-input {
  cursor: pointer !important;
}
</style>
<style lang="scss">
.ChanBox.el-popover {
  padding: 0;
}
.el-tooltip__popper.is-light {
  border: 1px solid rgb(218, 213, 213) !important;
  border-radius: 0;
}
</style>
