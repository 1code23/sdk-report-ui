<template>
  <div>
    <BlockContent title="设备终端">
      <Header>
        <Tab
          slot="l"
          style="margin-bottom: -20px"
          :activeId.sync="queryModel.type"
          :list="tabOptions"
        />
        <Search
          style="margin-bottom: -20px"
          slot="r"
          @search="search"
          justify="end"
        />
      </Header>
    </BlockContent>
    <BlockContent style="margin-bottom: 0">
      <Header>
        <div class="header-title" slot="l">
          <span class="title">Top10{{ typeText }} </span>
          <el-popover placement="bottom-start" width="400" trigger="hover">
            <div style="width: 400px">
              您可以查看在指定时段（1天、7天、30天）内用户的分布情况，并可以进行版本、渠道和分群的交叉筛选。
              <br />
              筛选只展示昨日及之前的数据，启动次数指标只支持昨日之前的查询。
            </div>
            <i
              slot="reference"
              class="el-icon-question"
              style="color: #5faefd"
            ></i>
          </el-popover>
        </div>
      </Header>
      <Header>
        <Tab
          slot="l"
          style="margin-bottom: -20px"
          :activeId.sync="queryModel.tab_type"
          :list="tabOptions1"
        />
      </Header>
      <ChartHistogram id="container" :data="chartData" :params="queryModel" />
    </BlockContent>
    <!-- <BlockContent title="数据明细"> -->
    <ContractionText
      :closed.sync="detailClosed"
      tableId="regional"
      @downTable="downTable('regional')"
    />
    <BlockContent v-show="!detailClosed">
      <el-table
        id="regional"
        :header-cell-style="{ background: '#F7F8FA' }"
        :data="tableData"
        style="width: 100%; margin-bottom: 20px"
      >
        <el-table-column prop="value" :label="typeText" align="left">
          <template slot-scope="{ row }">
            <el-button
              type="text"
              v-if="row.code"
              @click="openCityDialog(row.code)"
              >{{ row.value }}</el-button
            >
            <span v-else>{{ row.value }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="new_cnt" label="新增用户" align="center">
          <template slot-scope="{ row }">
            {{ row.new_cnt | toThousands }}
          </template>
        </el-table-column>
        <el-table-column prop="new_rate" label="新增用户占比" align="center">
          <template slot-scope="{ row }"> {{ row.new_rate }}% </template>
        </el-table-column>
        <el-table-column prop="active_cnt" label="活跃用户" align="center">
          <template slot-scope="{ row }">
            {{ row.active_cnt | toThousands }}
          </template>
        </el-table-column>
        <el-table-column prop="active_rate" label="活跃用户占比" align="center">
          <template slot-scope="{ row }"> {{ row.active_rate }}% </template>
        </el-table-column>
        <el-table-column prop="boot_cnt" label="启动次数" align="center">
          <template slot-scope="{ row }">
            {{ row.boot_cnt | toThousands }}
          </template>
        </el-table-column>
        <el-table-column prop="boot_rate" label="启动次数占比" align="right">
          <template slot-scope="{ row }"> {{ row.boot_rate }}% </template>
        </el-table-column>
      </el-table>
      <el-row type="flex" justify="end">
        <Pagination
          v-show="queryModel.total > 0"
          :total="queryModel.total"
          :page.sync="queryModel.page"
          :limit.sync="queryModel.size"
          @pagination="getList"
        />
      </el-row>
    </BlockContent>
    <el-dialog title="数据详情" :visible.sync="cityDialogShow" width="60%">
      <el-table
        :header-cell-style="{ background: '#F7F8FA' }"
        :data="cityTableList"
        style="width: 100%; margin-bottom: 20px; height: 500px"
      >
        <el-table-column prop="value" label="城市" align="left">
          <template slot-scope="{ row }">
            <span>{{ row.value }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="new_cnt" label="新增用户" align="center">
          <template slot-scope="{ row }">
            {{ row.new_cnt | toThousands }}
          </template>
        </el-table-column>
        <el-table-column prop="new_rate" label="新增用户占比" align="center">
          <template slot-scope="{ row }"> {{ row.new_rate }}% </template>
        </el-table-column>
        <el-table-column prop="active_cnt" label="活跃用户" align="center">
          <template slot-scope="{ row }">
            {{ row.active_cnt | toThousands }}
          </template>
        </el-table-column>
        <el-table-column prop="active_rate" label="活跃用户占比" align="center">
          <template slot-scope="{ row }"> {{ row.active_rate }}% </template>
        </el-table-column>
        <el-table-column prop="boot_cnt" label="启动次数" align="center">
          <template slot-scope="{ row }">
            {{ row.boot_cnt | toThousands }}
          </template>
        </el-table-column>
        <el-table-column prop="boot_rate" label="启动次数占比" align="right">
          <template slot-scope="{ row }"> {{ row.boot_rate }}% </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>
<script>
import {
  BlockContent,
  Header,
  Tab,
  Search,
} from "@/components/BlockContent/index.js";
import Pagination from "@/components/Pagination";
import ChartHistogram from "../equipment/components/ChartHistogram.vue";
import { topList, getList, getCityList } from "@/api/terminalAttributes";
import ContractionText from "@/components/ContractionText";
export default {
  components: {
    BlockContent,
    Header,
    Tab,
    Search,
    ChartHistogram,
    Pagination,
    ContractionText,
  },
  watch: {
    "queryModel.type"() {
      this.search();
    },
    "queryModel.tab_type"() {
      this.topList();
    },
  },
  computed: {
    typeText() {
      return this.tabOptions.find((t) => t.id === this.queryModel.type).title;
    },
  },
  data() {
    return {
      detailClosed: false,
      queryModel: {
        page: 1,
        size: 30,
        carryApp: true,
        type: "areaid",
        tab_type: "new",
        start_date: "",
        end_date: "",
        total: 0,
      },
      tabOptions: [
        {
          id: "areaid",
          title: "省市",
        },
      ],
      tabOptions1: [
        {
          id: "new",
          title: "新增用户",
        },
        {
          id: "active",
          title: "活跃用户",
        },
        {
          id: "boot",
          title: "启动次数",
        },
      ],
      chartData: [],
      tableData: [],
      cityDialogShow: false,
      queryModel1: {
        carryApp: true,
        code: "",
      },
      cityTableList: [],
    };
  },
  methods: {
    search(row) {
      this.queryModel = { ...this.queryModel, ...row };
      this.queryModel.page = 1;
      delete this.queryModel.date;
      console.log(this.queryModel);
      this.fetchList();
    },
    topList() {
      topList(this.queryModel).then((res) => {
        this.chartData = res.data.list;
      });
    },
    getList() {
      getList(this.queryModel).then((res) => {
        const { list, count } = res.data;
        this.tableData = list;
        this.queryModel.total = count;
      });
    },
    fetchList() {
      this.topList();
      this.getList();
    },
    openCityDialog(code) {
      this.cityDialogShow = true;
      this.queryModel1.code = code;
      this.getCityList();
    },
    getCityList() {
      const { start_date, end_date, app_vname, app_channel } = this.queryModel;
      this.queryModel1.start_date = start_date;
      this.queryModel1.end_date = end_date;
      this.queryModel1.app_vname = app_vname;
      this.queryModel1.app_channel = app_channel;
      getCityList(this.queryModel1).then((res) => {
        const { list = [], count } = res.data;
        this.cityTableList = list;
        this.queryModel1.total = count;
      });
    },
    downTable(name) {
      // window.adr.utils.downTable(name);
      let obj = { ...this.queryModel, size: 100000 };
      let columnName = [
        { key: "value", label: "省市" },
        { key: "new_cnt", label: "新增用户" },
        { key: "new_rate", label: "新增用户占比" },
        { key: "active_cnt", label: "活跃用户" },
        { key: "active_rate", label: "活跃用户占比" },
        { key: "boot_cnt", label: "启动次数" },
        { key: "boot_rate", label: "启动次数占比" },
      ];
      getList(obj).then((res) => {
        let tableDatas = res.data.list;
        tableDatas.forEach((item) => {
          item.new_rate = item.new_rate + "%";
          item.active_rate = item.active_rate + "%";
          item.boot_rate = item.boot_rate + "%";
        });

        window.adr.exportExcel.exportExcel({
          tHeader: columnName,
          list: tableDatas,
          filename: `${this.queryModel.start_date}-${this.queryModel.end_date}-设备终端-地域`,
        });
      });
    },
  },
};
</script>
<style lang="scss">
.slider {
  .el-slider__runway {
    transform-origin: 0 0;
    transform: scale(0.8);
  }
}
</style>
<style lang="scss" scope>
.export {
  color: #409eff;
  cursor: pointer;
  user-select: none;
  font-size: 13px;
}
.slider {
  display: flex;
  align-items: center;
}
.el-table th.el-table__cell > .cell {
  font-weight: 600 !important;
  color: #252934 !important;
}
</style>
