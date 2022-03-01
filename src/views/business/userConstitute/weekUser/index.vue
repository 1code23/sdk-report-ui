<template>
  <div>
    <BlockContent>
      <Header title="用户构成" style="font-size: 16px !import"></Header>
    </BlockContent>
    <!-- 柱形图、表格 -->
    <div>
      <Contentpanel>
        <template v-slot:header>
          <div class="block">
            <span class="title"
              >用户构成
              <el-popover placement="bottom-start" width="360" trigger="hover">
                <p class="titleF">
                  用户构成报表展示的是对周活跃用户数据进行的成分分解，并通过历史数据预测未来数据变化趋势的模型。该模型帮助您对应用后续的用户活跃和留存等进行科学预测，并制定有效的规划和目标。用户构成报表中的周定义为周日至周六。
                </p>
                <p class="titleF">
                  绝对值展示的是各用户成分的数量，百分比展示的是活跃用户各成分占周活跃用户的比例。
                </p>
                <p class="titleF">
                  <span class="titleBlue">本周回流用户：</span
                  >上周未启动过应用，本周启动应用的活跃用户
                </p>
                <p class="titleF">
                  <span class="titleBlue">连续活跃n周用户：</span
                  >连续n周，每周至少启动过一次应用的活跃用户（第n+1周启动过）
                </p>
                <p class="titleF">
                  <span class="titleBlue">忠诚用户：</span
                  >连续活跃5周及以上的用户
                </p>
                <p class="titleF">
                  <span class="titleBlue">连续活跃用户：</span
                  >连续活跃2周及以上的用户
                </p>
                <p class="titleF">
                  <span class="titleBlue">近期流失用户：</span
                  >连续n周（2≤n≤4）没有启动过应用的用户（第n+1周没有启动过）
                </p>
                <i
                  class="el-icon-question"
                  slot="reference"
                  style="color: #5faefd"
                ></i> </el-popover
            ></span>
          </div>
        </template>
        <template v-slot:main>
          <div class="tabBtn">
            <Tab :activeId.sync="queryModel.activeId" :list="tabOptions" />
          </div>
          <echartBar
            class="echartAdduser"
            :xAxisData="xAxisData"
            :seriesData="seriesData"
            :legendData="legendData"
            :selected="selected"
            :showForm="showForm"
            ref="userActiveData"
          ></echartBar>
          <div class="tabelBtn">
            <div class="block">
              <span class="title"
                >周用户构成明细
                <el-popover
                  placement="bottom-start"
                  width="360"
                  trigger="hover"
                >
                  <p class="titleF">
                    <span class="titleBlue">本周回流用户：</span
                    >上周未启动过应用，本周启动应用的活跃用户
                  </p>
                  <p class="titleF">
                    <span class="titleBlue">连续活跃n周用户：</span
                    >连续n周，每周至少启动过一次应用的活跃用户（第n+1周启动过）
                  </p>
                  <p class="titleF">
                    <span class="titleBlue">忠诚用户：</span
                    >连续活跃5周及以上的用户
                  </p>
                  <p class="titleF">
                    <span class="titleBlue">连续活跃用户：</span
                    >连续活跃2周及以上的用户
                  </p>
                  <p class="titleF">
                    <span class="titleBlue"> 近期流失用户：</span
                    >连续n周（2≤n≤4）没有启动过应用的用户（第n+1周没有启动过）
                  </p>
                  <p class="titleF">
                    <span class="titleBlue">周活跃用户：</span
                    >当周启动过应用的用户(去重)
                  </p>
                  <i
                    class="el-icon-question"
                    slot="reference"
                    style="color: #5faefd"
                  ></i> </el-popover
              ></span>
            </div>
            <div class="export" @click="downTables('userConstitute')">
              <span style="font-size: 14px; color: #3882fe"
                ><i class="el-icon-document" style="margin-right: 5px"></i
                >导出</span
              >
            </div>
          </div>
          <pageTable
            class="tb"
            :columns="columns"
            :tableData="tableData"
            v-show="showRatio"
            id="userConstitute"
          >
            <template slot-scope="{ row }" slot="start_d">
              <span>{{ row.start_d }}——{{ row.end_d }}</span>
            </template>
            <template slot-scope="{ row }" slot="new_user">
              <span>{{ row.new_user | toThousands }}</span>
            </template>
            <template slot-scope="{ row }" slot="active_week_2">
              <span>{{ row.active_week_2 | toThousands }}</span>
            </template>
            <template slot-scope="{ row }" slot="active_week_3">
              <span>{{ row.active_week_3 | toThousands }}</span>
            </template>
            <template slot-scope="{ row }" slot="active_week_4">
              <span>{{ row.active_week_4 | toThousands }}</span>
            </template>
            <template slot-scope="{ row }" slot="backflow_week">
              <span>{{ row.backflow_week | toThousands }}</span>
            </template>
            <template slot-scope="{ row }" slot="loyal_user">
              <span>{{ row.loyal_user | toThousands }}</span>
            </template>
            <template slot-scope="{ row }" slot="drain_user">
              <span>{{ row.drain_user | toThousands }}</span>
            </template>
            <template slot-scope="{ row }" slot="active_week">
              <span>{{ row.active_week | toThousands }}</span>
            </template>
          </pageTable>
          <pageTable
            class="tb"
            :columns="columnsRatio"
            :tableData="tableDataRatio"
            v-show="!showRatio"
          >
            <template slot-scope="{ row }" slot="start_d">
              <span>{{ row.start_d }}——{{ row.end_d }}</span>
            </template>
            <template slot-scope="{ row }" slot="new_user_ratio">
              <span>{{ row.new_user_ratio }}%</span>
            </template>
            <template slot-scope="{ row }" slot="backflow_week_ratio">
              <span>{{ row.backflow_week_ratio }}%</span>
            </template>
            <template slot-scope="{ row }" slot="active_week_2_ratio">
              <span>{{ row.active_week_2_ratio }}%</span>
            </template>
            <template slot-scope="{ row }" slot="active_week_3_ratio">
              <span>{{ row.active_week_3_ratio }}%</span>
            </template>
            <template slot-scope="{ row }" slot="active_week_4_ratio">
              <span>{{ row.active_week_4_ratio }}%</span>
            </template>
            <template slot-scope="{ row }" slot="loyal_user_ratio">
              <span>{{ row.loyal_user_ratio }}%</span>
            </template>
          </pageTable>
        </template>
      </Contentpanel>
    </div>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import { BlockContent, Header, Tab } from "@/components/BlockContent/index.js";
import pageTable from "@/components/echartsUserAnalysis/PageTable";
import Contentpanel from "@/components/Contentpanel";
import { getUserCompositionWeekList } from "@/api/userConstitute.js";
import echartBar from "@/components/echartsUserAnalysis/echartBar";
import { toThousands, downTable } from "@/utils/index";
export default {
  components: { BlockContent, Header, pageTable, Contentpanel, Tab, echartBar },
  computed: {
    ...mapGetters(["appInfo"]),
  },
  data() {
    return {
      toThousands,
      downTable,
      queryModel: {
        carryApp: true,
        page: 1,
        size: 10,
        activeId: 1,
        app_appid: "",
      },
      showRatio: true,
      tabOptions: [
        {
          id: 1,
          title: "绝对值",
        },
        {
          id: 2,
          title: "百分比",
        },
      ],
      columns: [
        { slot: "start_d", label: "时间", align: "center", width: "200" },
        { slot: "new_user", label: "新用户", align: "right" },
        { slot: "backflow_week", label: "本周回流用户", align: "right" },
        {
          slot: "active_week_2",
          label: "连续活跃2周用户",
          align: "right",
        },
        {
          slot: "active_week_3",
          label: "连续活跃3周用户",
          align: "right",
        },
        {
          slot: "active_week_4",
          label: "连续活跃4周用户",
          align: "right",
        },
        { slot: "loyal_user", label: "忠诚用户", align: "right" },
        { slot: "drain_user", label: "近期流失用户", align: "right" },
        { slot: "active_week", label: "周活跃用户", align: "right" },
      ],
      columnsRatio: [
        { slot: "start_d", label: "时间", align: "left", width: "200" },
        { slot: "new_user_ratio", label: "新用户", align: "right" },
        { slot: "backflow_week_ratio", label: "本周回流用户", align: "right" },
        {
          slot: "active_week_2_ratio",
          label: "连续活跃2周用户",
          align: "right",
        },
        {
          slot: "active_week_3_ratio",
          label: "连续活跃3周用户",
          align: "right",
        },
        {
          slot: "active_week_4_ratio",
          label: "连续活跃4周用户",
          align: "right",
        },
        { slot: "loyal_user_ratio", label: "忠诚用户", align: "center" },
      ],
      tableData: {
        page: 1,
        size: 10,
        count: 0,
        list: [],
      },
      tableDataRatio: {
        page: 1,
        size: 10,
        count: 0,
        list: [],
      },
      xAxisData: [],
      seriesData: [],
      legendData: [],
      selected: {},
      showForm: true,
      s: [],
      s_ratio: [],
    };
  },
  methods: {
    init() {
      let obj = { ...this.queryModel };
      delete obj.activeId;
      getUserCompositionWeekList(obj).then((res) => {
        console.log(res);
        this.tableData = res.data;
        this.tableData.count = res.data.list.length;
        this.tableDataRatio = res.data;
        this.tableDataRatio.count = res.data.list.length;
        let pt = [];
        let newUserArray = [];
        let backWeekArray = [];
        let activeTwoWeekArray = [];
        let activeThreeWeekArray = [];
        let activeFourWeekArray = [];
        let loyalArray = [];
        let drainArray = [];
        // 百分比
        let newUserRatioArray = [];
        let backWeekRatioArray = [];
        let activeTwoWeekRatioArray = [];
        let activeThreeWeekRatioArray = [];
        let activeFourWeekRatioArray = [];
        let loyalRatioArray = [];

        res.data.list.forEach((item) => {
          pt.push(item.start_d);
          newUserArray.push(item.new_user);
          backWeekArray.push(item.backflow_week);
          activeTwoWeekArray.push(item.active_week_2);
          activeThreeWeekArray.push(item.active_week_3);
          activeFourWeekArray.push(item.active_week_4);
          loyalArray.push(item.loyal_user);
          drainArray.push(item.drain_user);
          // 百分比
          newUserRatioArray.push(item.new_user_ratio);
          backWeekRatioArray.push(item.backflow_week_ratio);
          activeTwoWeekRatioArray.push(item.active_week_2_ratio);
          activeThreeWeekRatioArray.push(item.active_week_3_ratio);
          activeFourWeekRatioArray.push(item.active_week_4_ratio);
          loyalRatioArray.push(item.loyal_user_ratio);
        });
        this.s = [
          {
            name: "新用户",
            type: "bar",
            stack: "广告",
            data: newUserArray.reverse(),
          },
          {
            name: "本周回流用户",
            type: "bar",
            stack: "广告",
            data: backWeekArray.reverse(),
          },
          {
            name: "连续活跃2周用户",
            type: "bar",
            stack: "广告",
            data: activeTwoWeekArray.reverse(),
          },
          {
            name: "连续活跃3周用户",
            type: "bar",
            stack: "广告",
            data: activeThreeWeekArray.reverse(),
          },
          {
            name: "连续活跃4周用户",
            type: "bar",
            stack: "广告",
            data: activeFourWeekArray.reverse(),
          },
          {
            name: "忠诚用户",
            type: "bar",
            stack: "广告",
            data: loyalArray.reverse(),
          },
          {
            name: "近期流失用户",
            type: "bar",
            stack: "广告",
            data: drainArray.reverse(),
          },
        ];
        this.s_ratio = [
          {
            name: "新用户",
            type: "bar",
            stack: "广告",
            data: newUserRatioArray.reverse(),
          },
          {
            name: "本周回流用户",
            type: "bar",
            stack: "广告",
            data: backWeekRatioArray.reverse(),
          },
          {
            name: "连续活跃2周用户",
            type: "bar",
            stack: "广告",
            data: activeTwoWeekRatioArray.reverse(),
          },
          {
            name: "连续活跃3周用户",
            type: "bar",
            stack: "广告",
            data: activeThreeWeekRatioArray.reverse(),
          },
          {
            name: "连续活跃4周用户",
            type: "bar",
            stack: "广告",
            data: activeFourWeekRatioArray.reverse(),
          },
          {
            name: "忠诚用户",
            type: "bar",
            stack: "广告",
            data: loyalArray.reverse(),
          },
        ];
        if (this.queryModel.activeId == 1) {
          this.s.forEach((item) => {
            this.legendData.push(item.name);
          });
          this.selected = { 近期流失用户: false };
          this.seriesData = this.s;
        } else if (this.queryModel.activeId == 2) {
          this.s_ratio.forEach((item) => {
            this.legendData.push(item.name);
          });
          this.seriesData = this.s_ratio;
        }
        this.xAxisData = pt.reverse();
      });
    },
    downTables() {
      getUserCompositionWeekList({ ...this.queryModel, size: 100000 }).then(
        (res) => {
          let tableDatas = res.data;
          let headLlist = this.columns;
          if (this.queryModel.activeId == 2) {
            tableDatas.list.forEach((item) => {
              item.start_d = item.start_d + "-" + item.end_d;
              item.new_user_ratio = item.new_user_ratio + "%";
              item.backflow_week_ratio = item.backflow_week_ratio + "%";
              item.active_week_2_ratio = item.active_week_2_ratio + "%";
              item.active_week_3_ratio = item.active_week_3_ratio + "%";
              item.active_week_4_ratio = item.active_week_4_ratio + "%";
              item.loyal_user_ratio = item.loyal_user_ratio + "%";
            }),
              (headLlist = this.columnsRatio);
          } else {
            tableDatas.list.forEach((item) => {
              item.start_d = item.start_d + "-" + item.end_d;
            });
          }
          window.adr.exportExcel.exportExcel({
            tHeader: headLlist,
            list: tableDatas.list,
            filename: `${tableDatas.list[0].start_d}~${
              tableDatas.list[tableDatas.list.length - 1].end_d
            }-周用户构成明细`,
          });
        }
      );
    },
  },
  created() {
    this.queryModel.app_appid = this.appInfo.app_appid;
    this.init();
  },
  watch: {
    "queryModel.activeId": {
      handler(newVal, oldVal) {
        if (newVal == 1) {
          this.showForm = true;
          this.showRatio = true;
          this.seriesData = this.s;
        } else if (newVal == 2) {
          this.showForm = false;
          this.showRatio = false;
          this.seriesData = this.s_ratio;
          console.log(this.seriesData);
        }
      },
      deep: true,
      immediate: true,
    },
  },
};
</script>
<style lang="scss" scoped>
.tabBtn {
  background: white;
  padding: 15px 20px;
  box-sizing: border-box;
}
.tabelBtn {
  display: flex;
  justify-content: space-between;
  padding: 10px 20px 0;
  align-items: center;
  box-sizing: border-box;
  background: white;
}
.tb {
  margin-bottom: 30px;
  background: white;
  padding: 0 20px;
}
/deep/.el-table {
  font-family: "Roboto-Regular", sans-serif;
  font-size: 12px;
}
</style>
