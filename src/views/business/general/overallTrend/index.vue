<template>
  <div>
    <BlockContent>
      <Header>
        <div class="header-title" slot="l">
          <span class="title"
            >整体趋势
            <el-popover placement="bottom-start" width="360" trigger="hover">
              <p class="titleF">
                <span class="titleBlue">新增用户(7日平均)：</span>
                最近7日（不含今日）每日新增用户的平均值
              </p>
              <p class="titleF">
                <span class="titleBlue">新用户次日留存率(7日平均)：</span>
                最近7日（不含今日/昨日）新增用户次日留存率的平均值
              </p>
              <p class="titleF">
                <span class="titleBlue">使用时长(7日平均)：</span>
                最近7日（不含今日）用户每日使用时长的平均值
              </p>
              <p class="titleF">
                <span class="titleBlue">活跃用户(7日平均)：</span>
                最近7日（不含今日）每日活跃用户的平均值
              </p>
              <p class="titleF">
                <span class="titleBlue">7日总活跃用户数（去重）：</span>
                最近7日（不含今日）活跃用户的总数（去重）
              </p>
              <p class="titleF">
                <span class="titleBlue">30日总活跃用户数（去重）：</span>
                最近30日（不含今日）活跃用户的总数（去重）
              </p>
              <p class="titleF">
                <span class="titleBlue">累计用户数：</span>
                截止到当前时间，启动过应用的所有独立用户（去重，以设备为判断标准）
              </p>
              <p class="titleF">
                <span class="titleBlue">总崩溃率：</span> 每日错误数/启动次数
              </p>
              <i
                class="el-icon-question"
                slot="reference"
                style="color: #5faefd"
              ></i> </el-popover
          ></span>
        </div>
      </Header>
    </BlockContent>
    <!-- 平均值数据 -->
    <div class="averageData">
      <div class="averageData_left">
        <div class="userAverageData_T disfr jsb">
          <div class="jsb disfr ac" style="width: 47%">
            <div class="userAverageData_T_top">
              <p class="userTitle">新增用户(7日平均)</p>
              <p class="userNum">{{ toThousands(averData.avg_new_count) }}</p>
              <p class="userTitle">
                同比 {{ averData.avg_new_count_ratio }}%<i
                  class="el-icon-top"
                  style="font-weight: 600; color: red; font-size: 20px"
                  v-show="averData.avg_new_count_ratio > 0"
                ></i>
                <i
                  class="el-icon-bottom"
                  style="font-weight: 600; color: green; font-size: 20px"
                  v-show="averData.avg_new_count_ratio < 0"
                ></i>
              </p>
            </div>
            <div class="df">
              <span
                class="iconfont icon-bim_diyirencheng fontIcon"
                style="color: #59f"
              ></span>
            </div>
          </div>
          <div class="jsb disfr ac" style="width: 47%">
            <div class="userAverageData_T_top">
              <p class="userTitle">活跃用户(7日平均)</p>
              <p class="userNum">{{ toThousands(averData.avg_active_cnt) }}</p>
              <p class="userTitle">
                同比 {{ averData.avg_active_cnt_ratio }}%<i
                  class="el-icon-top"
                  style="font-weight: 600; color: red; font-size: 20px"
                  v-show="averData.avg_active_cnt_ratio > 0"
                ></i>
                <i
                  class="el-icon-bottom"
                  style="font-weight: 600; color: green; font-size: 20px"
                  v-show="averData.avg_active_cnt_ratio < 0"
                ></i>
              </p>
            </div>
            <div class="df">
              <span
                class="iconfont icon-fanshe fontIcon"
                style="color: #fda"
              ></span>
            </div>
          </div>
        </div>
        <div class="userAverageData_B disfr jsb">
          <div class="jsb disfr ac" style="width: 47%">
            <div class="userAverageData_B_bottom">
              <p class="userTitle">新用户次日留存率(7日平均)</p>
              <p class="userNum">{{ averData.avg_remain_count }}%</p>
              <p class="userTitle">
                同比 {{ averData.avg_remain_count_ratio }}%<i
                  class="el-icon-top"
                  style="font-weight: 600; color: red; font-size: 20px"
                  v-show="averData.avg_remain_count_ratio > 0"
                ></i>
                <i
                  class="el-icon-bottom"
                  style="font-weight: 600; color: green; font-size: 20px"
                  v-show="averData.avg_remain_count_ratio < 0"
                ></i>
              </p>
            </div>
            <div class="df">
              <span
                class="iconfont icon-liucunfenxi fontIcon"
                style="color: green"
              ></span>
            </div>
          </div>
          <div class="jsb disfr ac" style="width: 47%">
            <div class="userAverageData_B_bottom">
              <p class="userTitle">使用时长(7日平均)</p>
              <p class="userNum">
                {{ this.changeDateTime(averData.avg_sum_use_time) }}
              </p>
              <p class="userTitle">
                同比 {{ averData.avg_sum_use_time_ratio }}%<i
                  class="el-icon-top"
                  style="font-weight: 800; color: red; font-size: 20px"
                  v-show="averData.avg_sum_use_time_ratio > 0"
                ></i>
                <i
                  class="el-icon-bottom"
                  style="font-weight: 800; color: green; font-size: 20px"
                  v-show="averData.avg_sum_use_time_ratio < 0"
                ></i>
              </p>
            </div>
            <div class="df">
              <span
                class="iconfont icon-shijian fontIcon"
                style="color: red"
              ></span>
            </div>
          </div>
        </div>
      </div>
      <div class="averageData_right">
        <div class="userAverageData_T disfr jsb">
          <div class="jsb disfr ac" style="width: 47%">
            <div class="userAverageData_T_top">
              <p class="userTitle">近7日总活跃用户数</p>
              <p class="userNum">{{ toThousands(averData.active_7_cnt) }}</p>
              <p class="userTitle">
                同比 {{ averData.active_7_cnt_ratio }}%<i
                  class="el-icon-top"
                  style="font-weight: 600; color: red; font-size: 20px"
                  v-show="averData.active_7_cnt_ratio > 0"
                ></i>
                <i
                  class="el-icon-bottom"
                  style="font-weight: 600; color: green; font-size: 20px"
                  v-show="averData.active_7_cnt_ratio < 0"
                ></i>
              </p>
            </div>
            <div class="df">
              <span
                class="iconfont icon-rili1 fontIcon"
                style="color: #59f"
              ></span>
            </div>
          </div>
          <div class="jsb disfr ac" style="width: 47%">
            <div class="userAverageData_T_top">
              <p class="userTitle">近30日总活跃用户数</p>
              <p class="userNum">{{ toThousands(averData.active_30_cnt) }}</p>
              <p class="userTitle">
                同比 {{ averData.active_30_cnt_ratio }}%<i
                  class="el-icon-top"
                  style="font-weight: 600; color: red; font-size: 20px"
                  v-show="averData.active_30_cnt_ratio > 0"
                ></i>
                <i
                  class="el-icon-bottom"
                  style="font-weight: 600; color: green; font-size: 20px"
                  v-show="averData.active_30_cnt_ratio < 0"
                ></i>
              </p>
            </div>
            <div class="df">
              <span
                class="iconfont icon-rili fontIcon"
                style="color: #fda"
              ></span>
            </div>
          </div>
        </div>
        <div class="userAverageData_B disfr jsb">
          <div class="jsb disfr ac" style="width: 47%">
            <div class="userAverageData_B_bottom">
              <p class="userTitle">累计用户数</p>
              <p class="userNum">{{ toThousands(averData.sum_cnt) }}</p>
            </div>
            <div class="df">
              <span
                class="iconfont icon-202yonghu_yonghu3 fontIcon"
                style="color: green"
              ></span>
            </div>
          </div>
          <div class="jsb disfr ac" style="width: 47%">
            <div class="userAverageData_B_bottom">
              <p class="userTitle">昨日崩溃率</p>
              <p class="userNum">{{ averData.yesterday_collapse_rate }}%</p>
            </div>
            <div class="df">
              <span
                class="iconfont icon-gantanhao-xianxingsanjiaokuang fontIcon"
                style="color: red"
              ></span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 折线图、表格 -->
    <div style="margin-top: 50px">
      <Contentpanel>
        <template v-slot:header>
          <div class="block">
            <el-date-picker
              style="width: 19%; height: 90%"
              :clearable="false"
              v-model="selectDate"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              unlink-panels
              :picker-options="pickerOptions"
              @change="changeDate"
            >
            </el-date-picker>
          </div>
        </template>
        <template v-slot:main>
          <div class="tabBtn">
            <div class="selectTab">
              <Tab
                :activeId.sync="tabPosition"
                :list="tabOptionAll"
                style="background: white"
              />
            </div>
          </div>
          <echartstab
            class="echartAdduser"
            :xAxisData="xAxisData"
            :seriesData="seriesData"
            :yxisData="yxisData2"
            :showEchart="true"
            :name="name"
            ref="userActiveData"
          ></echartstab>
          <ContractionText
            :closed.sync="detailClosed"
            tableId="entiretyTrend"
            @downTable="downTable('entiretyTrend')"
          />
          <pageTable
            v-show="!detailClosed"
            class="tb"
            :columns="columns"
            :tableData="tableData"
            @page-change="handleChangePage"
            id="entiretyTrend"
          >
            <template slot-scope="{ row }" slot="new_count">
              <span>{{ toThousands(row.new_count) }}</span>
            </template>
            <template slot-scope="{ row }" slot="active_cnt">
              <span>{{ toThousands(row.active_cnt) }}</span>
            </template>
            <template slot-scope="{ row }" slot="launch_count">
              <span>{{ toThousands(row.launch_count) }}</span>
            </template>
            <template slot-scope="{ row }" slot="sum_user">
              <span>{{ toThousands(row.sum_user) }}</span>
            </template>
            <template slot-scope="{ row }" slot="collapse">
              <span>{{ toThousands(row.collapse) }}</span>
            </template>
            <template slot-scope="{ row }" slot="collapse_rate">
              <span>{{ row.collapse_rate }}%</span>
            </template>
            <template slot-scope="{ row }" slot="retained_next_day_rate">
              <span>{{ row.retained_next_day_rate }}%</span>
            </template>
            <template slot-scope="{ row }" slot="dan_use_time">
              <span>{{ changeDateTime(row.dan_use_time) }} </span>
            </template>
            <template slot-scope="{ row }" slot="day_use_time">
              <span>{{ changeDateTime(row.day_use_time) }} </span>
            </template>
          </pageTable>
        </template>
      </Contentpanel>
    </div>
    <!-- Top版本渠道 -->
    <div class="versionChannel">
      <div class="versionBox">
        <div class="versionBox_t">
          <div class="versionBox_t_left">
            <span class="title"
              >Top版本
              <el-popover placement="bottom-start" width="360" trigger="hover">
                <p>
                  展示昨日新增、活跃、累计用户排名Top10版本和其它版本的占比情况；通过详情可以跳转到版本分布页面。
                </p>
                <p>通过饼图可以查看具体版本。</p>

                <i class="el-icon-question" slot="reference"></i> </el-popover
            ></span>
          </div>
          <div class="versionBox_t_right">
            <span @click="godetail(1)" style="color: #2196f3" class="cur"
              >详情</span
            >
          </div>
        </div>
        <div class="versionBox_select">
          <Tab :activeId.sync="queryModel.activeId" :list="tabOptions" />
          <echartPie :seriesData="seriesPieData" idd="main1"></echartPie>
        </div>
      </div>
      <div class="channelBox">
        <div class="versionBox_t">
          <div class="versionBox_t_left">
            <span class="title"
              >Top渠道
              <el-popover placement="bottom-start" width="360" trigger="hover">
                <p>
                  展示昨日新增、活跃、累计用户排名Top
                  10渠道和其它渠道的占比情况；通过详情可以跳转到渠道分布页面。
                </p>
                <p>通过饼图可以查看具体渠道。</p>

                <i class="el-icon-question" slot="reference"></i> </el-popover
            ></span>
          </div>
          <div class="versionBox_t_right">
            <span @click="godetail(2)" style="color: #2196f3" class="cur"
              >详情</span
            >
          </div>
        </div>
        <div class="versionBox_select">
          <Tab :activeId.sync="queryModelChannel.activeId" :list="tabOptions" />
          <echartPie :seriesData="seriesPieChannelData" idd="main2"></echartPie>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import moment from "moment";
import { BlockContent, Header, Tab } from "@/components/BlockContent/index.js";
import Contentpanel from "@/components/Contentpanel";
// import echartstab from "@/components/echartsUserAnalysis/echarttab";
import echartstab from "./components/echarttab.vue";
import echartPie from "@/components/echartsUserAnalysis/echartPie";
import { getDetailList, getTopList, getOverlList } from "@/api/general.js";
import pageTable from "@/components/echartsUserAnalysis/PageTable";
import { mapGetters } from "vuex";
import { toThousands, changeDateTime } from "@/utils/index";
import ContractionText from "@/components/ContractionText";
export default {
  components: {
    BlockContent,
    Header,
    Contentpanel,
    echartstab,
    echartPie,
    pageTable,
    Tab,
    ContractionText,
  },
  computed: {
    ...mapGetters(["appInfo"]),
  },
  data() {
    return {
      detailClosed: true,
      pickerOptions: adr.constant.pickerOptions, //日期快捷键
      toThousands,
      changeDateTime,
      selectDate: [new Date().getTime() - 7 * 24 * 60 * 60 * 1000, new Date()],
      tabPosition: "1",
      xAxisData: [],
      seriesData: [],
      yxisData2: "1",
      queryModel: {
        page: "1",
        size: "10",
        app_appid: "",
        activeId: 1,
      },
      queryModelChannel: {
        page: "1",
        size: "10",
        app_appid: "",
        activeId: 1,
      }, //渠道
      columns: [
        { key: "pt", label: "日期", align: "center" },
        { slot: "new_count", label: "新增用户数", align: "center" },
        { slot: "active_cnt", label: "活跃用户数", align: "center" },
        { slot: "launch_count", label: "启动次数", align: "center" },
        { slot: "sum_user", label: "累计用户数", align: "center" },
        { slot: "collapse", label: "崩溃数", align: "center" },
        { slot: "collapse_rate", label: "崩溃率", align: "center" },
        {
          slot: "retained_next_day_rate",
          label: "次日留存率",
          align: "center",
        },
        {
          slot: "dan_use_time",
          label: "平均单次使用时长",
          align: "center",
          width: 120,
        },
        {
          slot: "day_use_time",
          label: "平均日使用时长",
          align: "center",
          width: 120,
        },
      ],
      averData: {},
      name: "新增用户",
      tableData: {
        page: 1,
        size: 10,
        count: 0,
        list: [],
      },
      newCountList: [],
      activeCountList: [],
      launchCountList: [],
      sumCountList: [],
      collapseCountList: [],
      collapseRateCountList: [],
      nextdayCountList: [],
      averUseCountList: [],
      activeUserCountList: [],
      averdayUseCountList: [],
      averdayLaunchCountList: [],
      tabOptions: [
        {
          id: 1,
          title: "新增用户",
        },
        {
          id: 2,
          title: "活跃用户",
        },
        {
          id: 3,
          title: "累计用户",
        },
      ], //版本 渠道 Tab
      tabOptionAll: adr.constant.tabOptionAll, //趋势图表Tab
      newUserList: [],
      newUserChannelList: [],
      seriesPieData: [],
      seriesPieChannelData: [],
    };
  },
  created() {
    this.queryModel.app_appid = this.appInfo.app_appid;
    this.queryModelChannel.app_appid = this.appInfo.app_appid;
    this.init();
  },
  methods: {
    init() {
      this.detailData();
      this.detailTabelData();
      this.getOverlList();
      this.getTopList();
      this.getTopChannelList();
    },
    // 版本
    getTopList() {
      var secmun = 1;
      if (this.queryModel.activeId == 1) {
        secmun = "new";
      } else if (this.queryModel.activeId == 2) {
        secmun = "active";
      } else {
        secmun = "sum";
      }
      let obj = {
        any_date: moment(new Date().getTime() - 1 * 24 * 60 * 60 * 1000).format(
          "YYYY-MM-DD"
        ),
        firstmenu: "version",
        secondarymenu: secmun,
        app_appid: this.queryModel.app_appid,
      };
      getTopList(obj).then((res) => {
        // console.log(res);
        this.newUserList = [];
        if (res.data.list) {
          res.data.list.forEach((item) => {
            this.newUserList.push({
              value: item.cnt,
              name: item.name,
              ratio: item.cnt_ratio,
            });
          });
          this.seriesPieData = this.newUserList;
        }
      });
    },
    // 渠道
    getTopChannelList() {
      var secmunChannel = 1;
      if (this.queryModelChannel.activeId == 1) {
        secmunChannel = "new";
      } else if (this.queryModelChannel.activeId == 2) {
        secmunChannel = "active";
      } else {
        secmunChannel = "sum";
      }
      let obj = {
        any_date: moment(new Date().getTime() - 1 * 24 * 60 * 60 * 1000).format(
          "YYYY-MM-DD"
        ),
        firstmenu: "channel",
        secondarymenu: secmunChannel,
        app_appid: this.queryModelChannel.app_appid,
      };
      getTopList(obj).then((res) => {
        // console.log(res);
        this.newUserChannelList = [];
        if (res.data.list) {
          res.data.list.forEach((item) => {
            this.newUserChannelList.push({
              value: item.cnt,
              name: item.name,
              ratio: item.cnt_ratio,
            });
          });
          this.seriesPieChannelData = this.newUserChannelList;
        }
      });
    },
    // 7日平均值
    getOverlList() {
      getOverlList({
        // any_date: moment(this.selectDate[0]).format("YYYY-MM-DD"),
        app_appid: this.queryModel.app_appid,
      }).then((res) => {
        // console.log(res);
        this.averData = res.data.list;
      });
    },
    //折线图
    detailData() {
      let obj = {
        ...this.queryModel,
        start_date: moment(this.selectDate[0]).format("YYYY-MM-DD"),
        end_date: moment(this.selectDate[1]).format("YYYY-MM-DD"),
        page: "1",
        size: "100000",
      };
      delete obj.activeId;
      getDetailList(obj).then((res) => {
        // console.log(res);
        this.newCountList = [];
        this.activeCountList = [];
        this.launchCountList = [];
        this.sumCountList = [];
        this.collapseCountList = [];
        this.collapseRateCountList = [];
        this.nextdayCountList = [];
        this.averUseCountList = [];
        this.xAxisData = [];
        if (res.data.list) {
          res.data.list.forEach((item) => {
            this.xAxisData.push(item.pt);
            this.newCountList.push(item.new_count);
            this.activeCountList.push(item.active_cnt);
            this.launchCountList.push(item.launch_count);
            this.sumCountList.push(item.sum_user);
            this.collapseCountList.push(item.collapse);
            this.collapseRateCountList.push(item.collapse_rate);
            this.nextdayCountList.push(item.retained_next_day_rate);
            this.averUseCountList.push(item.dan_use_time);
            this.activeUserCountList.push(item.active_user_composition);
            this.averdayUseCountList.push(item.day_use_time);
            // this.averdayUseCountList.push(
            //   this.secondsFormat(item.day_use_time)
            // );
            // this.averdayUseCountList.push(
            //   moment(item.day_use_time).format("h:mm:ss")
            // );
            this.averdayLaunchCountList.push(item.day_launch_count);
          });
          this.newCountList.reverse();
          this.activeCountList.reverse();
          this.launchCountList.reverse();
          this.sumCountList.reverse();
          this.collapseCountList.reverse();
          this.collapseRateCountList.reverse();
          this.nextdayCountList.reverse();
          this.averUseCountList.reverse();
          this.activeUserCountList.reverse();
          this.averdayUseCountList.reverse();
          this.averdayLaunchCountList.reverse();
          this.xAxisData = this.xAxisData.reverse();
          switch (this.tabPosition) {
            case "1":
              this.yxisData2 = "1";
              this.seriesData = this.newCountList;
              break;
            case "2":
              this.yxisData2 = "2";
              this.seriesData = this.activeCountList;
              break;
            case "3":
              this.yxisData2 = "3";
              this.seriesData = this.launchCountList;
              break;
            case "4":
              this.yxisData2 = "4";
              this.seriesData = this.sumCountList;
              break;
            case "5":
              this.yxisData2 = "5";
              this.seriesData = this.collapseCountList;
              break;
            case "6":
              this.yxisData2 = "6";
              this.seriesData = this.collapseRateCountList;
              break;
            case "7":
              this.yxisData2 = "7";
              this.seriesData = this.nextdayCountList;
              break;
            case "8":
              this.yxisData2 = "8";
              this.seriesData = this.averUseCountList;
              break;
            case "9":
              this.yxisData2 = "1";
              this.seriesData = this.activeUserCountList;
              break;
            case "10":
              this.yxisData2 = "10";
              this.seriesData = this.averdayUseCountList;
              break;
            case "11":
              this.yxisData2 = "1";
              this.seriesData = this.averdayLaunchCountList;
              break;
          }
        }
      });
    },
    //详情表格分页
    detailTabelData() {
      let obj = {
        ...this.queryModel,
        start_date: moment(this.selectDate[0]).format("YYYY-MM-DD"),
        end_date: moment(this.selectDate[1]).format("YYYY-MM-DD"),
      };
      delete obj.activeId;
      getDetailList(obj).then((res) => {
        this.tableData = res.data;
      });
    },
    changeDate(val) {
      this.selectDate = val;
      this.detailTabelData();
      this.detailData();
    },
    handleChangePage({ page, size }) {
      this.queryModel.page = page;
      this.queryModel.size = size;
      this.detailTabelData();
    },
    godetail(val) {
      if (val == 1) {
        this.$router.push({ path: "/business/userAnalysis/version" });
      } else if (val == 2) {
        this.$router.push({ path: "/business/channelAnalysis/anal" });
      }
    },
    downTable(name) {
      // window.adr.utils.downTable(name);
      let obj = {
        ...this.queryModel,
        start_date: moment(this.selectDate[0]).format("YYYY-MM-DD"),
        end_date: moment(this.selectDate[1]).format("YYYY-MM-DD"),
      };
      getDetailList({ ...obj, size: 100000 }).then((res) => {
        let tableDatas = res.data;
        tableDatas.list.forEach((item) => {
          item.collapse_rate = item.collapse_rate + "%";
          item.retained_next_day_rate = item.retained_next_day_rate + "%";
          item.dan_use_time = changeDateTime(item.dan_use_time);
          item.day_use_time = changeDateTime(item.day_use_time);
        }),
          window.adr.exportExcel.exportExcel({
            tHeader: this.columns,
            list: tableDatas.list,
            filename: `${obj.start_date}-${obj.end_date}-整体趋势`,
          });
      });
    },
  },
  watch: {
    tabPosition: {
      handler(newVal, oldVal) {
        switch (newVal) {
          case "1":
            this.yxisData2 = "1";
            this.name = "新增用户";
            this.seriesData = this.newCountList;
            break;
          case "2":
            this.yxisData2 = "2";
            this.name = "活跃用户";
            this.seriesData = this.activeCountList;
            break;
          case "3":
            this.yxisData2 = "3";
            this.name = "启动次数";
            this.seriesData = this.launchCountList;
            break;
          case "4":
            this.yxisData2 = "4";
            this.name = "累计用户";
            this.seriesData = this.sumCountList;
            break;
          case "5":
            this.yxisData2 = "5";
            this.name = "崩溃数";
            this.seriesData = this.collapseCountList;
            break;
          case "6":
            this.yxisData2 = "6";
            this.name = "崩溃率";
            this.seriesData = this.collapseRateCountList;
            break;
          case "7":
            this.yxisData2 = "7";
            this.name = "新增用户次日留存率";
            this.seriesData = this.nextdayCountList;
            break;
          case "8":
            this.yxisData2 = "8";
            this.name = "平均单次使用时长";
            this.seriesData = this.averUseCountList;
            break;
          case "9":
            this.yxisData2 = "1";
            this.name = "活跃用户构成";
            this.seriesData = this.activeUserCountList;
            break;
          case "10":
            this.yxisData2 = "10";
            this.name = "平均日使用时长";
            this.seriesData = this.averdayUseCountList;
            break;
          case "11":
            this.yxisData2 = "1";
            this.name = "平均日启动次数";
            this.seriesData = this.averdayLaunchCountList;
            break;
        }
      },
      // deep: true,
      // immediate: true,
    },
    "queryModel.activeId": {
      handler(newVal, oldVal) {
        this.getTopList();
      },
    },
    "queryModelChannel.activeId": {
      handler(newVal, oldVal) {
        this.getTopChannelList();
      },
    },
    "appInfo.app_appid"(val) {
      if (val) {
        this.queryModel.app_appid = val;
        this.init();
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.header-title {
  height: 10px;
  line-height: 10px;
}
.averageData {
  margin-bottom: 30px;
  width: 100%;
  height: 230px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 20px;
  .averageData_left,
  .averageData_right {
    width: 50%;
    height: 100%;
    padding: 25px 0 25px 25px;
    background: white;
    .userAverageData_B {
      margin-top: 50px;
    }
  }
  .averageData_left {
    margin-right: 12px;
  }
  .averageData_right {
    margin-left: 12px;
  }
  .userNum {
    font-size: 24px;
    color: #333;
    margin: 8px 0;
  }
  .userTitle {
    font-size: 14px;
    color: #666;
  }
}
.versionChannel {
  display: flex;
  justify-content: space-between;
  margin-top: 15px;
  margin-bottom: 35px;
  .versionBox,
  .channelBox {
    width: 48%;
    background: white;
    .versionBox_t {
      display: flex;
      justify-content: space-between;
      padding: 15px 10px;
      background: rgb(247, 248, 250);
    }
    .versionBox_select {
      margin: 20px 0 0 20px;
    }
  }
}
.tabBtn {
  background: white;
  padding: 20px;
}
.fontIcon {
  font-size: 30px;
  margin-left: 10%;
}
.df {
  display: flex;
  justify-content: flex-end;
  padding-right: 6%;
}
/deep/ .el-range-editor--small .el-range-input {
  cursor: pointer !important;
}
</style>
