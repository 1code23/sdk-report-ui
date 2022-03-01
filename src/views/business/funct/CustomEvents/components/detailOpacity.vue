<template>
  <div>
    <!-- 事件统计 -->
    <Contentpanel>
      <template v-slot:header>
        <div class="disfr jsb ac">
          <p class="pageTitle mb10">
            事件统计
            <el-popover placement="bottom-start" width="360" trigger="hover">
              <p class="titleF">
                <span class="titleBlue">消息数量：</span>
                该数值型参数被触发的次数
              </p>
              <p class="titleF">
                <span class="titleBlue">累计值：</span>
                每日触发的参数值的加和
              </p>
              <p class="titleF">
                <span class="titleBlue">单次均值：</span>
                累计值/消息数量
              </p>
              <i
                class="el-icon-question"
                slot="reference"
                style="color: #5faefd"
              ></i>
            </el-popover>
          </p>
          <Tab :activeId.sync="dataOpacity" :list="dataOpacityList" />
        </div>
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
    <div class="tabelTitle">
      <p class="pageTitle" style="color: #333">事件统计明细</p>
    </div>
    <div class="tb">
      <pageTable
        :columns="columns"
        :tableData="tableData"
        @page-change="handleChangePage"
      >
        <template slot-scope="{ row }" slot="total_cnt">
          <span>{{ row.total_cnt | toThousands }}</span>
        </template>
        <template slot-scope="{ row }" slot="mc_num">
          <span>{{ row.mc_num | toThousands }}</span>
        </template>
        <template slot-scope="{ row }" slot="rate">
          <span>{{ row.rate | toThousands }}</span>
        </template>
      </pageTable>
    </div>
    <!-- 分位数取值 -->
    <Contentpanel style="margin-top: 20px">
      <template v-slot:header>
        <div class="disfr jsb ac">
          <p class="pageTitle mb10">
            分位数取值
            <el-popover placement="bottom-start" width="360" trigger="hover">
              <p class="titleF">
                <span class="titleBlue">按次数的分位数：</span>
                当日该参数每次发生的数值由小到大排列后第p%的数值
              </p>
              <p class="titleF">
                <span class="titleBlue">按人数的分位数:</span>
                当日该参数按独立设备的累计数值由小到大排列后第p%的数值
              </p>
              <i
                class="el-icon-question"
                slot="reference"
                style="color: #5faefd"
              ></i>
            </el-popover>
          </p>
          <div>
            <el-date-picker
              v-model="quantileDate"
              type="date"
              placeholder="选择日期"
              @change="quantileDateChange"
            >
            </el-date-picker>
          </div>
        </div>
      </template>
      <template v-slot:main>
        <div class="chartsWpper1">
          <Tab :activeId.sync="quantileOpacity" :list="OpacityList" />
        </div>
        <echartstabNum
          class="quantileClass"
          :xAxisData="xAxisQuantileData"
          :seriesData="seriesQuantileData"
          :showEchart="showEchart"
          mainid="userActiveData"
        ></echartstabNum>
      </template>
    </Contentpanel>
    <!-- 分位数取值明细 -->
    <div class="tabelTitle">
      <p class="pageTitle" style="color: #333">分位数取值明细</p>
    </div>
    <div class="tb">
      <pageTable
        :columns="quantileColumns"
        :tableData="quantileTableData"
        @page-change="quantileHandleChangePage"
      >
        <template slot-scope="{ row }" slot="percent_category">
          <span>{{ row.percent_category }}%</span>
        </template>
      </pageTable>
    </div>
    <!-- 累计值贡献 -->
    <Contentpanel style="margin-top: 20px">
      <template v-slot:header>
        <div class="disfr jsb ac">
          <p class="pageTitle mb10">
            累计值贡献
            <el-popover placement="bottom-start" width="360" trigger="hover">
              <p class="titleF">
                <span class="titleBlue">按次数的累计值贡献：</span>
                （x%,y）表示单次取值小于y的所有次数的累计值贡献了总体累计值的x%
              </p>
              <p class="titleF">
                <span class="titleBlue">按人数的累计值贡献:</span>
                （x%,y）表示设备参数值加和小于y的所有设备的累计值贡献了总体累计值的x%
              </p>
              <i
                class="el-icon-question"
                slot="reference"
                style="color: #5faefd"
              ></i>
            </el-popover>
          </p>
          <div>
            <el-date-picker
              v-model="contributionDate"
              type="date"
              placeholder="选择日期"
              @change="contributionDateChange"
            >
            </el-date-picker>
          </div>
        </div>
      </template>
      <template v-slot:main>
        <div class="chartsWpper1">
          <Tab :activeId.sync="ContributionOpacity" :list="OpacityList" />
        </div>
        <echartstabNum
          class="echartAdduser"
          :xAxisData="xAxisContributionData"
          :seriesData="seriesContributionData"
          :showEchart="showEchart"
          mainid="userActiveData"
        ></echartstabNum>
      </template>
    </Contentpanel>
    <!-- 累计值贡献明细 -->
    <div class="tabelTitle">
      <p class="pageTitle" style="color: #333">累计值贡献明细</p>
    </div>
    <div class="tb">
      <pageTable
        :columns="contributionColumns"
        :tableData="contributionTableData"
        @page-change="contributionHandleChangePage"
      >
        <template slot-scope="{ row }" slot="percent_category">
          <span>{{ row.percent_category }}%</span>
        </template>
      </pageTable>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import Contentpanel from "@/components/Contentpanel";
import { Tab } from "@/components/BlockContent/index.js";
import echartstab from "./echarttab2";
import echartstabNum from "./echartNum";
import {
  getEventDetailNumGraph,
  getEventDetailRealTimeNum,
  getEventDetailNumQuantile,
  getEventDetailNumQuantileGraph,
  getEventDetailNumTotality,
  getEventDetailNumTotalityGraph,
} from "@/api/funct.js";
import pageTable from "@/components/echartsUserAnalysis/PageTable";
export default {
  components: {
    Contentpanel,
    Tab,
    echartstab,
    echartstabNum,
    pageTable,
  },
  computed: {
    ...mapGetters(["appInfo"]),
  },
  props: {
    params: {
      type: Object,
      default() {
        return {};
      },
    },
    eventName: {
      type: String,
      default() {
        return "";
      },
    },
  },
  data() {
    return {
      contributionDate: new Date(), //累计贡献日期
      contributionColumns: [
        {
          slot: "percent_category",
          label: "贡献值",
          align: "left",
          width: "600px",
        },
        { key: "cnt", label: "取值", align: "center" },
      ],
      contributionTableData: {
        page: 1,
        size: 10,
        list: [{ mc_eid: "12" }],
      },
      quantileDate: new Date(), //分位数日期
      quantileColumns: [
        {
          slot: "percent_category",
          label: "分位数",
          align: "left",
          width: "600px",
        },
        { key: "cnt", label: "取值", align: "center" },
      ],
      quantileTableData: {
        page: 1,
        size: 10,
        list: [{ mc_eid: "12" }],
      },
      columns: [
        { key: "pt", label: "日期", align: "left", width: "600px" },
        { slot: "total_cnt", label: "消息数量", align: "right" },
        {
          slot: "mc_num",
          label: "累计值",
          align: "right",
        },
        { slot: "rate", label: "单次均值", align: "right" },
      ],
      tableData: {
        page: 1,
        size: 10,
        list: [{ mc_eid: "12" }],
      },
      showEchart: true,
      seriesData: [],
      xAxisData: [], //事件统计
      dataOpacity: "1",
      dataOpacityList: [
        {
          id: "1",
          title: "实时",
        },
        {
          id: "2",
          title: "日",
        },
      ],
      activeKind: "1",
      tabOptionChannel: [
        {
          id: "1",
          title: "消息数量",
        },
        {
          id: "2",
          title: "累计值",
        },
        {
          id: "3",
          title: "单次均值",
        },
      ],
      seriesQuantileData: [],
      xAxisQuantileData: [], //分位数
      quantileOpacity: "1",
      seriesContributionData: [],
      xAxisContributionData: [], //贡献值
      ContributionOpacity: "1",
      OpacityList: [
        {
          id: "1",
          title: "次数",
        },
        // {
        //   id: "2",
        //   title: "设备",
        // },
      ],
      queryModel: {
        page: 1,
        size: 10,
      },
      total_cntArray: [], //事件统计消息数量
      mc_numArray: [], //事件统计累计值
      rateArray: [], //事件统计单次均值
      frequencyQuantile: [], //分位数--次数
      equipmentQuantile: [], //分位数--设备
      frequencyContribution: [], //贡献值--次数
      equipmentContribution: [], //贡献值--设备
      paramsData: "", //请求参数
    };
  },
  methods: {
    init() {
      this.paramsData = {
        ...this.queryModel,
        event_name: this.$route.params.id,
        app_appid: this.appInfo.app_appid,
      };
      this.getEventDetailNumGraph({ ...this.paramsData }); // 数值 图表
      this.getEventDetailRealTimeNum({ ...this.paramsData }); // 数值 表格
      this.getEventDetailNumQuantileGraph({
        ...this.paramsData,
        data: this.quantileDate,
      }); // 数值 分位数取值图表
      this.getEventDetailNumQuantile({
        ...this.paramsData,
        data: this.quantileDate,
      }); // 数值 分位数表格
      this.getEventDetailNumTotalityGraph({
        ...this.paramsData,
        data: this.contributionDate,
      }); // 数值 累计值贡献取值图表
      this.getEventDetailNumTotality({
        ...this.paramsData,
        data: this.contributionDate,
      }); // 数值 累计值贡献表格
    },
    // 数值 事件统计表格
    getEventDetailRealTimeNum(obj) {
      getEventDetailRealTimeNum(obj).then((res) => {
        this.tableData = res.data;
      });
    },
    // 数值 事件统计明细图表
    getEventDetailNumGraph(obj) {
      getEventDetailNumGraph(obj).then((res) => {
        this.xAxisData = res.data.list.dates;
        let array = res.data.list.items;
        let total_cntList = JSON.parse(JSON.stringify(array));
        let mc_numList = JSON.parse(JSON.stringify(array));
        let rateList = JSON.parse(JSON.stringify(array));
        total_cntList.forEach((item) => {
          item.type = "line";
          item.data = item.total_cnt;
        });
        this.total_cntArray = total_cntList;
        mc_numList.forEach((item) => {
          item.type = "line";
          item.data = item.mc_num;
        });
        this.mc_numArray = mc_numList;
        rateList.forEach((item) => {
          item.type = "line";
          item.data = item.rate;
        });
        this.rateArray = rateList;
        if (this.activeKind == "1") {
          this.seriesData = this.total_cntArray;
        } else if (this.activeKind == "2") {
          this.seriesData = this.mc_numArray;
        } else if (this.activeKind == "3") {
          this.seriesData = this.rateArray;
        }
        // this.xAxisData = [1, 2, 3, 4, 5];
        // this.seriesData = [
        //   { name: "消息数量", type: "line", data: [1, 2, 3, 3, 5] },
        // ];
      });
    },
    // 数值 分位数取值表格
    getEventDetailNumQuantile(obj) {
      getEventDetailNumQuantile(obj).then((res) => {
        this.quantileTableData = res.data;
      });
    },
    // 数值 分位数取值明细图表
    getEventDetailNumQuantileGraph(obj) {
      getEventDetailNumQuantileGraph(obj).then((res) => {
        this.xAxisQuantileData = res.data.list.dates;
        this.seriesQuantileData = [
          {
            name: this.eventName,
            type: "line",
            data: res.data.list.items,
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
        // 切换数据
        // let array = res.data.list.items;
        // let total_cntList = JSON.parse(JSON.stringify(array));
        // let rateList = JSON.parse(JSON.stringify(array));
        // total_cntList.forEach((item) => {
        //   item.type = "line";
        //   item.data = item.total_cnt;
        // });
        // this.frequencyQuantile = total_cntList;
        // rateList.forEach((item) => {
        //   item.type = "line";
        //   item.data = item.rate;
        // });
        // this.equipmentQuantile = rateList;
        // if (this.activeKind == "1") {
        //   this.seriesQuantileData = this.frequencyQuantile;
        // } else if (this.activeKind == "2") {
        //   this.seriesQuantileData = this.equipmentQuantile;
        // }
        // 切换数据
        // this.xAxisData = [1, 2, 3, 4, 5];
        // this.seriesData = [
        //   { name: "消息数量", type: "line", data: [1, 2, 3, 3, 5] },
        // ];
      });
    },
    // 数值 累计值贡献表格
    getEventDetailNumTotality(obj) {
      getEventDetailNumTotality(obj).then((res) => {
        this.contributionTableData = res.data;
      });
    },
    // 数值 累计值贡献明细图表
    getEventDetailNumTotalityGraph(obj) {
      getEventDetailNumTotalityGraph(obj).then((res) => {
        this.xAxisContributionData = res.data.list.dates;
        this.seriesContributionData = [
          {
            name: this.eventName,
            type: "line",
            data: res.data.list.items,
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
        // 切换数据
        // let array = res.data.list.items;
        // let total_cntList = JSON.parse(JSON.stringify(array));
        // let rateList = JSON.parse(JSON.stringify(array));
        // total_cntList.forEach((item) => {
        //   item.type = "line";
        //   item.data = item.total_cnt;
        // });
        // this.frequencyContribution = total_cntList;
        // rateList.forEach((item) => {
        //   item.type = "line";
        //   item.data = item.rate;
        // });
        // this.equipmentContribution = rateList;
        // if (this.activeKind == "1") {
        //   this.seriesContributionData = this.frequencyContribution;
        // } else if (this.activeKind == "2") {
        //   this.seriesContributionData = this.equipmentContribution;
        // }
        // 切换数据
        // this.xAxisData = [1, 2, 3, 4, 5];
        // this.seriesData = [
        //   { name: "消息数量", type: "line", data: [1, 2, 3, 3, 5] },
        // ];
      });
    },
    // 事件统计表格分页
    handleChangePage({ page, size }) {
      // this.queryModel.page = page;
      // this.queryModel.size = size;
      let obj = { ...this.paramsData, page: page, size: size };
      this.getEventDetailRealTimeNum(obj);
    },
    // 分位数表格分页
    quantileHandleChangePage({ page, size }) {
      let obj = { ...this.paramsData, page: page, size: size };
      this.getEventDetailNumQuantile(obj);
    },
    // 累计值贡献表格分页
    contributionHandleChangePage({ page, size }) {
      let obj = { ...this.paramsData, page: page, size: size };
      this.getEventDetailNumTotality(obj);
    },
    // 分位数切换事件
    quantileDateChange(val) {
      this.quantileDate = adr.mom(val).format("YYYY-MM-DD");
      this.getEventDetailNumQuantile({
        ...this.paramsData,
        start_date: this.quantileDate,
      });
      this.getEventDetailNumQuantileGraph({
        ...this.paramsData,
        start_date: this.quantileDate,
      });
    },
    // 累计值贡献切换事件
    contributionDateChange(val) {
      this.contributionDate = adr.mom(val).format("YYYY-MM-DD");
      this.getEventDetailNumTotality({
        ...this.paramsData,
        start_date: this.contributionDate,
      });
      this.getEventDetailNumTotalityGraph({
        ...this.paramsData,
        start_date: this.contributionDate,
      });
    },
  },
  watch: {
    // 事件统计切换数据字段
    activeKind: {
      handler(newVal, oldVal) {
        if (newVal == 1) {
          this.seriesData = this.total_cntArray;
        } else if (newVal == 2) {
          this.seriesData = this.mc_numArray;
        } else if (newVal == 3) {
          this.seriesData = this.rateArray;
        }
      },
      deep: true,
      immediate: true,
    },
    // 分位数切换数据字段
    quantileOpacity: {
      handler(newVal, oldVal) {
        if (newVal == 1) {
          this.seriesQuantileData = this.total_cntArray;
        } else if (newVal == 2) {
          this.seriesQuantileData = this.rateArray;
        }
      },
      deep: true,
      immediate: true,
    },
    // 累计贡献值切换数据字段
    ContributionOpacity: {
      handler(newVal, oldVal) {
        if (newVal == 1) {
          this.seriesContributionData = this.total_cntArray;
        } else if (newVal == 2) {
          this.seriesContributionData = this.rateArray;
        }
      },
      deep: true,
      immediate: true,
    },
    // dataOpacity(newVal, oldVal) {
    //   if (newVal == 1) {
    //     this.getEventDetailStrGraph(); //字符串型 事件统计图标
    //     this.getEventDetailStr(); //字符串型 事件统计表格
    //     this.showStr = true;
    //   } else {
    //     this.showStr = false;
    //     this.$refs.detailOpacity.init(this.queryModel);
    //     // this.getEventDetailRealTimeNum();//数值型 实时
    //     // this.getEventDetailNumGraph(); //数值型 实时图表
    //     // this.getEventDetailNum(); //数值型

    //     // this.xAxisData = [];
    //     // this.seriesData = [];
    //   }
    // },
  },
};
</script>

<style lang="scss" scoped>
.paneHeader {
  background: rgb(247, 248, 250) !important;
}
.chartsWpper1 {
  background: white;
  padding: 20px;
}
.tabelTitle {
  background: rgb(247, 248, 250);
  padding: 20px;
  margin-top: 10px;
}
.tb {
  background: white;
  padding: 15px;
}
</style>
<style>
.el-date-editor.el-input,
.el-date-editor.el-input__inner {
  width: 150px;
}
</style>
