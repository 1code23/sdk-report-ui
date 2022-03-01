<template>
  <div>
    <BlockContent>
      <Header>
        <div class="header-title" slot="l">
          <span class="title">留存用户 </span>
          <el-popover placement="bottom-start" width="400" trigger="hover">
            <div style="width: 400px">
              某段时间内的新增用户（活跃用户），经过一段时间后，又继续使用应用的被认作是留存用户；这部分用户占当时新增用户（活跃用户）的比例即是留存率。例如，5月份新增用户200，这200人在6月份启动过应用的有100人，7月份启动过应用的有80人，8月份启动过应用的有50人；则5月新增用户一个月后的留存率是50%，两个月后的留存率是40%，三个月后的留存率是25%。<br />
              <br />
              注：“活跃用户留存”仅支持查看2018年4月1日之后的留存情况
            </div>
            <i
              slot="reference"
              class="el-icon-question"
              style="color: #ccc"
            ></i>
          </el-popover>
        </div>
      </Header>
      <Search @search="search" />
    </BlockContent>
    <BlockContent>
      <Header>
        <el-row type="flex" align="middle" slot="l">
          <Tab :activeId.sync="queryModel.activeId" :list="tabOptions" />
          <p class="hint">
            <i class="el-icon-warning-outline"></i>
            想看特定操作的用户留存？试试“自定义留存”
          </p>
        </el-row>
        <el-row type="flex" align="middle" slot="r" :gutter="10">
          <el-col>
            <Tab :activeId.sync="queryModel.activeId1" :list="tabOptions1"
          /></el-col>
          <el-col>
            <el-row type="flex" align="middle">
              <Tab
                :activeId.sync="queryModel.remain_type"
                :list="tabOptions2"
              />
              <p class="hint">
                <el-popover
                  placement="bottom-start"
                  width="400"
                  trigger="hover"
                >
                  <div style="width: 400px">
                    留存率：某段时间内的新增用户（活跃用户），经过一段时间后，又继续使用应用的比例
                    <br />
                    <br />
                    留存数：某段时间内的新增用户（活跃用户），经过一段时间后，又继续使用应用的用户数
                  </div>
                  <i
                    slot="reference"
                    class="el-icon-question"
                    style="color: #ccc"
                  ></i>
                </el-popover>
              </p>
            </el-row>
          </el-col>
          <el-col>
            <div class="export" @click="downTable('userKeep')">
              <i class="el-icon-document"></i> 导出
            </div>
          </el-col>
        </el-row>
      </Header>
      <el-table
        id="userKeep"
        :data="tableData"
        border
        style="width: 100%; margin-bottom: 20px"
        :cell-style="cellStyle"
        :header-cell-style="{
          background: '#F7F8FA',
          color: '#5a5a5a',
          fontWeight: 'bold',
        }"
      >
        <!-- :cell-style="cellStyle" -->
        <el-table-column prop="pt" label="时间" align="center">
        </el-table-column>
        <el-table-column
          :prop="queryModel.activeId == 1 ? 'new_cnt' : 'active'"
          :label="queryModel.activeId == 1 ? '新增用户' : '活跃用户'"
          align="center"
        >
          <template slot-scope="{ row }">
            {{ (row.new_cnt || row.active) | toThousands }}
          </template>
        </el-table-column>
        <el-table-column prop="remain_1_cnt" label="1天后" align="center">
          <!-- <template slot-scope="{ row }">
            <span :class="{ cellgrey: row.remain_1_cnt != '0%' }"
              >{{ row.remain_1_cnt }}
            </span>
          </template> -->
        </el-table-column>
        <el-table-column prop="remain_2_cnt" label="2天后" align="center">
        </el-table-column>
        <el-table-column prop="remain_3_cnt" label="3天后" align="center">
        </el-table-column>
        <el-table-column prop="remain_4_cnt" label="4天后" align="center">
        </el-table-column>
        <el-table-column prop="remain_5_cnt" label="5天后" align="center">
        </el-table-column>
        <el-table-column prop="remain_6_cnt" label="6天后" align="center">
        </el-table-column>
        <el-table-column prop="remain_7_cnt" label="7天后" align="center">
        </el-table-column>
        <el-table-column prop="remain_14_cnt" label="14天后" align="center">
        </el-table-column>
        <el-table-column prop="remain_30_cnt" label="30天后" align="center">
        </el-table-column>
      </el-table>
      <el-row type="flex" justify="end">
        <Pagination
          v-show="queryModel.total > 0"
          :total="queryModel.total"
          :page.sync="queryModel.page"
          :limit.sync="queryModel.size"
          @pagination="fetchList"
        />
      </el-row>
      <Header
        style="
          margin-top: 20px;
          border-top: 1px solid #eeeeee;
          padding-top: 20px;
        "
      >
        <div class="header-title" slot="l">
          <span class="title">留存趋势</span>
        </div>
        <div slot="r">
          <el-select
            style="width: 100px"
            v-model="queryModel.index"
            placeholder="请选择"
          >
            <el-option
              v-for="item in daysOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </div>
      </Header>
      <div id="main" style="width: 100%; height: 400px"></div>
    </BlockContent>
  </div>
</template>

<script>
import {
  BlockContent,
  Header,
  Search,
  Tab,
} from "@/components/BlockContent/index.js";
import Pagination from "@/components/Pagination";
import { mapGetters } from "vuex";
import { getNewUserRemain, getActiveUserRemain } from "@/api/retainedAnalysis";
import EchartsMixins from "./mixins/EchartsMixins";
import { downTable } from "@/utils/index";
export default {
  components: { BlockContent, Header, Search, Tab, Pagination },
  computed: {
    ...mapGetters(["appInfo"]),
  },
  mixins: [EchartsMixins],
  watch: {
    "queryModel.remain_type"() {
      this.search();
    },
    "queryModel.activeId"() {
      this.search();
    },
  },
  data() {
    return {
      downTable,
      queryModel: {
        carryApp: true,
        remain_type: "rate",
        page: 1,
        size: 30,
        total: 0,
        activeId: 1,
        activeId1: 1,
        index: 1,
      },

      tabOptions: [
        {
          id: 1,
          title: "新用户留存",
        },
        {
          id: 2,
          title: "活跃用户留存",
        },
      ],
      tabOptions1: [
        {
          id: 1,
          title: "天",
        },
        {
          id: 2,
          title: "周",
          disabled: true,
        },
        {
          id: 3,
          title: "月",
          disabled: true,
        },
      ],
      tabOptions2: [
        {
          id: "rate",
          title: "留存率",
        },
        {
          id: "value",
          title: "留存数",
        },
      ],
      daysOptions: [
        { id: 1, name: "1天后" },
        { id: 3, name: "3天后" },
        { id: 7, name: "7天后" },
        { id: 30, name: "30天后" },
      ],
      tableData: [],
    };
  },
  methods: {
    cellStyle(row, column, rowIndex, columnIndex) {
      if (row.column.label == "1天后" && row.row.remain_1_cnt != "0%") {
        return "background:#e6f7ff";
      }
      if (row.column.label == "2天后" && row.row.remain_2_cnt != "0%") {
        return "background:#e6f7ff";
      }
      if (row.column.label == "3天后" && row.row.remain_3_cnt != "0%") {
        return "background:#e6f7ff";
      }
      if (row.column.label == "4天后" && row.row.remain_4_cnt != "0%") {
        return "background:#e6f7ff";
      }
      if (row.column.label == "5天后" && row.row.remain_5_cnt != "0%") {
        return "background:#e6f7ff";
      }
      if (row.column.label == "6天后" && row.row.remain_6_cnt != "0%") {
        return "background:#e6f7ff";
      }
      if (row.column.label == "7天后" && row.row.remain_7_cnt != "0%") {
        return "background:#e6f7ff";
      }
      if (row.column.label == "14天后" && row.row.remain_14_cnt != "0%") {
        return "background:#e6f7ff";
      }
      if (row.column.label == "30天后" && row.row.remain_30_cnt != "0%") {
        return "background:#e6f7ff";
      }
    },

    search(row) {
      this.queryModel = { ...this.queryModel, ...row };
      this.queryModel.page = 1;
      delete this.queryModel.date;
      console.log(this.queryModel);
      this.fetchList();
    },
    fetchList() {
      let _this = this;
      if (this.queryModel.activeId == 1) {
        getNewUserRemain(this.queryModel).then((res) => {
          if (res.data) {
            handleData(res.data);
          }
        });
      } else {
        getActiveUserRemain(this.queryModel).then((res) => {
          if (res.data) {
            handleData(res.data);
          }
        });
      }
      //数据处理
      function handleData(data) {
        let { list, count } = data;
        list.forEach((item) => {
          for (const key in item) {
            //率 加上 '%'
            if (_this.queryModel.remain_type === "rate") {
              if (key.indexOf("_cnt") !== -1) {
                item[key] =
                  Number(item[key].toString().match(/^\d+(?:\.\d{0,2})?/)) +
                  "%";
                // item[key] = item[key] + "%";
                // if (item[key] == "0%") {
                //   item[key] = "";
                // }
              }
              if (key.indexOf("new_cnt") !== -1) {
                item[key] = item[key].substring(0, item[key].length - 1);
              }
            }
          }
          return item;
        });
        _this.tableData = list;
        _this.queryModel.total = count;
      }
      this.initChart(this.queryModel);
    },
  },
};
</script>

<style lang="scss" scoped>
.hint {
  font-size: 12px;
  color: #999999;
  margin-left: 10px;
}
.export {
  color: #409eff;
  cursor: pointer;
  user-select: none;
  font-size: 13px;
}

.cellgrey {
  background: red;
  display: inline-block;
  width: 100%;
  height: 100%;
  box-shadow: 0 0 10px 10px red;
}
</style>
