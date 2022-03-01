<template>
  <div class="channelAddDetail">
    <Header>
      <div slot="l">
        <span class="fz16 fw7">渠道新增细分</span>
      </div>
      <div slot="r">
        <span
          class="timeBtn fw7 pointer"
          :class="{ colorB: dateVal === -8 }"
          @click="time(-8)"
          >过去7天</span
        >
        <span
          class="timeBtn fw7 pointer"
          :class="{ colorB: dateVal === -31 }"
          @click="time(-31)"
          >过去30天</span
        >
        <span class="pointer blueHover colorGrey fw7" @click="downTable">
          <i class="el-icon-document"></i>导出数据
        </span>
      </div>
    </Header>
    <pdPanel style="margin-bottom: 16px; padding-bottom: 0">
      <el-radio-group class="channelsRadios" v-model="channelRadio" size="mini">
        <el-radio-button
          v-for="(a, b) in channelTypes"
          :key="b"
          :label="a.id"
          >{{ a.title }}</el-radio-button
        >
      </el-radio-group>
      <div ref="rect" class="barContainer dashedLine"></div>
      <contractionDetail
        class="disfr"
        :closed.sync="detailClosed1"
        label="渠道明细"
      ></contractionDetail>
      <!-- <el-table
        v-if="detailClosed1"
        :header-cell-style="{
          background: '#F7F8FA',
          fontWeight: '700',
          color: 'black',
        }"
        :data="tableData"
        class="channelAddDetailTable"
        style="width: 100%"
        header-row-class-name="headerRow fw7"
        id="channelAddDetailTable"
      >
        <el-table-column
          v-for="item in columns"
          :key="item.key ? item.key : item.slot"
          :prop="item.key"
          :label="item.label"
          :align="item.align"
        >
          <template slot-scope="scope">
            <span style="margin-left: 10px" v-if="item.key == 'new_count_rate'"
              >{{ scope.row[item.key] }}%</span
            >
            <span style="margin-left: 10px" v-if="item.key == 'new_rate'"
              >{{ scope.row[item.key] }}%</span
            >
            <span style="margin-left: 10px" v-else>{{
              scope.row[item.key]
            }}</span>
          </template>
        </el-table-column>
      </el-table> -->
      <pageTable
        class="tb"
        :columns="columns"
        :tableData="tableData"
        @page-change="handleChangePage"
        id="channelAddDetailTable"
        v-show="!detailClosed1"
      >
        <template slot-scope="{ row }" slot="new_rate">
          <span>{{ row.new_rate }}%</span>
        </template>
        <template slot-scope="{ row }" slot="new_count_rate">
          <span>{{ row.new_count_rate }}%</span>
        </template>
      </pageTable>
    </pdPanel>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import {
  pdPanel,
  Header,
  contractionDetail,
} from "@/components/greyPanel/index.js";
import detailTable from "./detailTable.vue";
// import { getChannelVersionAnalysis } from "@/api/channelAnalysis.js";
import { getList, getChannel } from "@/api/terminalAttributes";
import pageTable from "@/components/echartsUserAnalysis/PageTable";
export default {
  components: {
    Header,
    detailTable,
    pdPanel,
    contractionDetail,
    pageTable,
  },
  computed: {
    ...mapGetters(["appInfo", "appChannelList", "appVnameList"]),
  },
  data() {
    return {
      channelRadio: "1",
      channelTypes: [
        {
          id: "1",
          title: "设备",
        },
        {
          id: "2",
          title: "国家/地区",
        },
        {
          id: "3",
          title: "省市",
        },
        {
          id: "4",
          title: "版本",
        },
      ],
      detailClosed1: false,
      option: {
        color: ["#5dd4a8"],
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow",
          },
        },
        grid: {
          left: "0",
          right: "0",
          bottom: "20",
          containLabel: true,
        },
        xAxis: {
          type: "value",
          show: false,
        },
        yAxis: {
          type: "category",
          data: ["Brazil", "Indonesia", "USA", "India", "China", "World"],
          axisTick: {
            show: false,
          },
          axisLine: {
            lineStyle: {
              color: "#b0b8c3",
            },
          },
        },
        series: [
          {
            name: "2011",
            type: "bar",
            barWidth: 8,
            label: {
              show: true,
              position: "right",
            },
            data: [18203, 23489, 29034, 104970, 131744, 630230],
          },
        ],
      },
      tableData: {},
      columns: [
        {
          label: "设备",
          key: "value",
          align: "",
        },
        {
          label: "新增用户",
          key: "new_cnt",
          align: "right",
        },
        {
          label: "新增用户占比",
          slot: "new_rate",
          align: "right",
        },
      ],
      dateRange: [],
      dateVal: -8,
      queryModel: {
        app_vname: "all",
        type: "areaid",
        page: "1",
        size: "10",
      },
      // queryModelVname: {
      //   page: "1",
      //   size: "10",
      // },
    };
  },
  mounted() {
    (this.nowDate = adr.mom(new Date()).format("YYYY/MM/DD")),
      (this.dateRange = [
        adr.mom(new Date()).add(-8, "days").format("YYYY-MM-DD"),
        adr.mom(new Date()).add(-1, "days").format("YYYY-MM-DD"),
      ]);
    this.init();
  },
  methods: {
    init() {
      this.getData();
      this.getDataTabel();
      // this.getChannelTrendList();
    },
    time(val) {
      this.dateVal = val;
      (this.nowDate = adr.mom(new Date()).format("YYYY/MM/DD")),
        (this.dateRange = [
          adr.mom(new Date()).add(val, "days").format("YYYY-MM-DD"),
          adr.mom(new Date()).add(-1, "days").format("YYYY-MM-DD"),
        ]);
      if (this.channelRadio == 1) {
        this.getData();
        this.getDataTabel();
      } else if (this.channelRadio == 3) {
        this.getCityList();
        this.getCityListTabel();
      } else if (this.channelRadio == 4) {
        this.getChannelList();
        this.getChannelListTabel();
      }
    },
    // 设备图表
    async getData() {
      let params = {
        app_appid: this.appInfo.app_appid,
        app_channel: this.$route.params.id,
        start_date: this.dateRange[0],
        end_date: this.dateRange[1],
        ...this.queryModel,
        type: "model",
        page: 1,
        size: 10,
      };
      // let res = await getChannelVersionAnalysis(params);
      let res = await getList(params);
      if (res) {
        // this.tableData = res.data;
        let myChart = window.echarts.init(this.$refs.rect);
        this.option.yAxis.data = res.data.list.map((i) => i.value);
        this.option.series[0].data = res.data.list.map((i) => i.new_cnt);
        this.option.yAxis.data.reverse();
        this.option.series[0].data.reverse();
        myChart.setOption(this.option);
        // this.option.yAxis.data = list.map((i) => i.app_vname);
        // this.option.series[0].data = list.map((i) => i.new_count);
      }
    },
    // 设备表格
    async getDataTabel() {
      let params = {
        app_appid: this.appInfo.app_appid,
        app_channel: this.$route.params.id,
        start_date: this.dateRange[0],
        end_date: this.dateRange[1],
        ...this.queryModel,
        type: "model",
      };
      // let res = await getChannelVersionAnalysis(params);
      let res = await getList(params);
      if (res) {
        this.tableData = res.data;
      }
    },
    downTable() {
      adr.utils.downTableCusName("channelAddDetailTable", "渠道新增细分");
    },
    // 省市图表
    getCityList() {
      let params = {
        ...this.queryModel,
        app_appid: this.appInfo.app_appid,
        app_channel: this.$route.params.id,
        start_date: this.dateRange[0],
        end_date: this.dateRange[1],
        page: 1,
        size: 10,
      };
      getList(params).then((res) => {
        this.tableData = res.data;
        let myChart = window.echarts.init(this.$refs.rect);
        this.option.yAxis.data = res.data.list.map((i) => i.value);
        this.option.series[0].data = res.data.list.map((i) => i.new_cnt);
        this.option.yAxis.data.reverse();
        this.option.series[0].data.reverse();
        myChart.setOption(this.option);
      });
    },
    // 省市表格
    getCityListTabel() {
      let params = {
        ...this.queryModel,
        app_appid: this.appInfo.app_appid,
        app_channel: this.$route.params.id,
        start_date: this.dateRange[0],
        end_date: this.dateRange[1],
      };
      getList(params).then((res) => {
        this.tableData = res.data;
      });
    },
    // 版本图表
    getChannelList() {
      let params = {
        app_appid: this.appInfo.app_appid,
        app_channel: this.$route.params.id,
        start_date: this.dateRange[0],
        end_date: this.dateRange[1],
        page: 1,
        size: 10,
      };
      getChannel(params).then((res) => {
        // this.tableData = res.data;
        let myChart = window.echarts.init(this.$refs.rect);
        this.option.yAxis.data = res.data.list.map((i) => i.app_vname);
        this.option.series[0].data = res.data.list.map((i) => i.new_count);
        this.option.yAxis.data.reverse();
        this.option.series[0].data.reverse();
        myChart.setOption(this.option);
      });
    },
    // 版本表格
    getChannelListTabel() {
      let params = {
        ...this.queryModel,
        app_appid: this.appInfo.app_appid,
        app_channel: this.$route.params.id,
        start_date: this.dateRange[0],
        end_date: this.dateRange[1],
      };
      getChannel(params).then((res) => {
        this.tableData = res.data;
      });
    },
    handleChangePage({ page, size }) {
      this.queryModel.page = page;
      this.queryModel.size = size;
      // this.queryModelVname.page = size;
      // this.queryModelVname.size = size;
      // this.getCityList();
      // this.getCityListTabel();
      if (this.channelRadio == 1) {
        this.getDataTabel();
      } else if (this.channelRadio == 3) {
        this.getCityListTabel();
      } else if (this.channelRadio == 4) {
        this.getChannelListTabel();
      }
    },
  },
  watch: {
    channelRadio(newVal, oldVal) {
      if (newVal == 1) {
        this.queryModel.page = 1;
        this.queryModel.size = 10;
        this.getData();
        this.getDataTabel();
        this.columns = [
          {
            label: "设备",
            key: "value",
            align: "",
          },
          // key: "new_count",
          {
            label: "新增用户",
            key: "new_cnt",
            align: "right",
          },
          {
            label: "新增用户占比",
            // slot: "new_count_rate",
            slot: "new_rate",
            align: "right",
          },
        ];
      } else if (newVal == 3) {
        this.queryModel.page = 1;
        this.queryModel.size = 10;
        this.getCityList();
        this.getCityListTabel();
        this.columns = [
          {
            label: "省市",
            key: "value",
            align: "",
          },
          {
            label: "新增用户",
            key: "new_cnt",
            align: "right",
          },
          {
            label: "新增用户占比",
            slot: "new_rate",
            align: "right",
          },
        ];
      } else if (newVal == 4) {
        this.queryModel.page = 1;
        this.queryModel.size = 10;
        this.getChannelList();
        this.getChannelListTabel();
        this.columns = [
          {
            label: "版本",
            key: "app_vname",
            align: "",
          },
          {
            label: "新增用户",
            key: "new_count",
            align: "right",
          },
          {
            label: "新增用户占比",
            slot: "new_count_rate",
            align: "right",
          },
        ];
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.channelAddDetail {
  .barContainer {
    width: 100%;
    height: 500px;
  }
  .dashedLine {
    border-bottom: 1px dashed #e5e5e5;
  }
  /deep/.channelsRadios {
    .el-radio-button:last-child .el-radio-button__inner {
      border-radius: 0;
    }
    .el-radio-button:first-child .el-radio-button__inner {
      border-radius: 0;
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
  .colorB {
    color: #3b82fe;
  }
  .channelAddDetailTable.el-table {
    /deep/th.el-table__cell {
      > div {
        font-weight: 700;
      }
    }
    /deep/.el-table__cell {
      font-size: 12px;
      color: black;
      font-weight: 700;
      background: white;
      > div {
        color: black;
        line-height: 22px;
      }
    }
  }
}
</style>
