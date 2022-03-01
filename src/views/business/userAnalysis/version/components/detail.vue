<template>
  <div>
    <BlockContent>
      <Header>
        <div class="header-title" slot="l">
          <span class="title"
            >版本用户来源
            <el-popover placement="bottom-start" width="360" trigger="hover">
              <p class="titleF">
                版本用户包括升级用户和新增用户两部分，版本用户来源可以帮您了解版本的用户构成情况。这里展示的是Top10渠道或版本的数据
              </p>
              <p class="titleF">
                <span class="titleBlue">升级用户渠道:</span
                >老用户升级到该版本的更新渠道
              </p>
              <p class="titleF">
                <span class="titleBlue">升级用户版本：</span
                >老用户升级到该版本前使用的应用版本
              </p>
              <i
                class="el-icon-question"
                slot="reference"
                style="color: #5faefd"
              ></i> </el-popover
          ></span>
        </div>
      </Header>
      <div class="VnameTab">
        <Tab
          :activeId.sync="tabPosition"
          :list="tabOptionChannel"
          style="margin-bottom: 30px"
        />
        <Tab
          :activeId.sync="tabPositionDate"
          :list="tabOptionChannelDate"
          style="margin-bottom: 30px"
        />
      </div>
      <div class="lengthwaysBar" ref="lengthwaysBar" id="lengthwaysBar"></div>
      <ContractionText
        :closed.sync="detailPageTableClosed"
        tableId="VersionTableSource"
        @downTable="downTable('VersionTableSource')"
        class="actionText"
      />
      <pageTable
        v-show="!detailPageTableClosed"
        class="tb"
        :columns="singleColumn"
        :tableData="singleTableData"
        @page-change="handleChangePage"
        id="VersionTableSource"
      >
        <template slot-scope="{ row }" slot="sum_user">
          <span>{{ toThousands(row.sum_user) }}</span>
        </template>
        <template slot-scope="{ row }" slot="ratio">
          <span>{{ row.ratio }}%</span>
        </template>
      </pageTable>
    </BlockContent>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import moment from "moment";
import { BlockContent, Header, Tab } from "@/components/BlockContent/index.js";
import pageTable from "@/components/echartsUserAnalysis/PageTable";
import ContractionText from "@/components/ContractionText";
import { getVersionDetail } from "@/api/user.js";
import { toThousands } from "@/utils/index";

export default {
  components: { BlockContent, Header, Tab, pageTable, ContractionText },
  props: {
    versionName: {
      type: String,
      default() {
        return "";
      },
    },
    queryModelDetail: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  data() {
    return {
      detailPageTableClosed: false,
      toThousands,
      tabPosition: "new",
      tabPositionDate: "1",
      queryModel: {
        carryApp: true,
        page: "1",
        size: "10",
      },
      tabOptionChannel: [
        {
          id: "new",
          title: "新增用户渠道分布",
        },
        {
          id: "channel",
          title: "活跃升级用户渠道分布",
        },
        {
          id: "version",
          title: "升级用户版本来源",
        },
      ], //版本用户来源
      tabOptionChannelDate: [
        {
          id: "1",
          title: "昨天",
        },
        {
          id: "2",
          title: "过去七天",
        },
        {
          id: "3",
          title: "过去30天",
        },
      ], //版本用户日期
      singleColumn: [
        { key: "user_source", label: "渠道", align: "left" },
        { slot: "sum_user", label: "新增用户", align: "right" },
        {
          slot: "ratio",
          label: "升级用户比例",
          align: "right",
        },
      ],
      singleTableData: {
        page: 1,
        size: 10,
        count: 0,
        list: [],
      },
      myChart: null,
      chartWidth: "",
      chartHeight: 500,
      option: {
        color: ["rgb(64,165,245)"],
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow",
          },
        },
        legend: {
          // data: ["2011年", ],
          bottom: "10",
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "10%",
          containLabel: true,
        },
        xAxis: {
          type: "value",
          boundaryGap: [0, 0.01],
          splitLine: {
            show: true,
            lineStyle: {
              type: "dashed",
              width: 1.2,
              color: "rgb(237, 239, 244)",
            },
          },
        },
        yAxis: {
          type: "category",
          // name: "2011年",
          data: [],
          axisTick: {
            //x轴刻度相关设置
            alignWithLabel: true,
          },
        },
        series: [
          {
            name: "",
            type: "bar",
            data: [],
          },
        ],
      },
      start_date: moment(
        new Date().getTime() - 30 * 24 * 60 * 60 * 1000
      ).format("YYYY-MM-DD"),
      end_date: moment(new Date().getTime() - 1 * 24 * 60 * 60 * 1000).format(
        "YYYY-MM-DD"
      ),
    };
  },
  methods: {
    init() {
      let obj = {
        ...this.queryModelDetail,
        type: this.tabPosition,
        start_date: this.start_date,
        end_date: this.end_date,
        page: this.queryModel.page,
        size: this.queryModel.size,
      };
      getVersionDetail(obj).then((res) => {
        // console.log(res);
        let yAxisSourceData = [];
        let seriesSourceData = [];
        res.data.list.forEach((item) => {
          yAxisSourceData.push(item.user_source);
          seriesSourceData.push(item.sum_user);
        });
        this.singleTableData = res.data;
        this.option.yAxis.data = yAxisSourceData.reverse();
        this.option.series[0].data = seriesSourceData.reverse();
        this.option.series[0].name = this.versionName;
        var myChart = window.echarts.init(this.$refs.lengthwaysBar);
        myChart.setOption(this.option);
        // console.log(res.data);
      });
    },
    handleChangePage({ page, size }) {
      this.queryModel.page = page;
      this.queryModel.size = size;
      this.init();
    },
    downTable(name) {
      // window.adr.utils.downTable(name);
      let obj = {
        ...this.queryModelDetail,
        type: this.tabPosition,
        start_date: this.start_date,
        end_date: this.end_date,
        page: this.queryModel.page,
        size: this.queryModel.size,
      };
      getVersionDetail({ ...obj, size: 100000 }).then((res) => {
        let tableDatas = res.data;
        tableDatas.list.forEach((item) => {
          item.ratio = item.ratio + "%";
        }),
          window.adr.exportExcel.exportExcel({
            tHeader: this.singleColumn,
            list: tableDatas.list,
            filename: `${obj.start_date}-${obj.end_date}-版本用户来源`,
          });
      });
    },
  },
  computed: {
    ...mapGetters(["appInfo", "appChannelList"]),
  },
  watch: {
    tabPosition: {
      handler(newVal, oldVal) {
        if (newVal) {
          this.init();
        }
      },
      deep: true,
      immediate: true,
    },
    tabPositionDate: {
      handler(newVal, oldVal) {
        if (newVal == "1") {
          this.start_date = moment(
            new Date().getTime() - 1 * 24 * 60 * 60 * 1000
          ).format("YYYY-MM-DD");
        } else if (newVal == "2") {
          this.start_date = moment(
            new Date().getTime() - 7 * 24 * 60 * 60 * 1000
          ).format("YYYY-MM-DD");
        } else if (newVal == "3") {
          this.start_date = moment(
            new Date().getTime() - 30 * 24 * 60 * 60 * 1000
          ).format("YYYY-MM-DD");
        }
        this.init();
      },
      // deep: true,
      // immediate: true,
    },
  },
  mounted() {
    var myChart = window.echarts.init(this.$refs.lengthwaysBar);
    myChart.setOption(this.option);
  },
  created() {
    // setTimeout(() => {
    //   console.log(this.appInfo, this.appChannelList);
    // }, 1000);
  },
};
</script>

<style lang="scss" scoped>
.VnameTab {
  display: flex;
  justify-content: space-between;
}
.actionText {
  padding-left: 0;
}
.lengthwaysBar {
  width: 100%;
  height: 500px;
  background: white;
  // padding-right: 30px;
  // box-sizing: border-box;
}
</style>
