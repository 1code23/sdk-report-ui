<template>
  <div class="newUser">
    <div v-if="showdetail">
      <BlockContent>
        <Header>
          <div class="header-title" slot="l">
            <span class="title">自定义事件</span>
          </div>
        </Header>
        <Search @search="search" :type="['date', 'channel', 'versions']" />
      </BlockContent>
      <Contentpanel>
        <template v-slot:header>
          <div class="headTop">
            <div>事件列表</div>
            <div @click="downTables('eventTable')" class="cur">
              <span style="font-size: 14px; color: #3882fe">导出</span>
            </div>
          </div>
        </template>
        <template v-slot:main>
          <div class="mainPage">
            <pageTable
              class="tb"
              :columns="columns"
              :tableData="tableData"
              @page-change="handleChangePage"
              id="eventTable"
            >
              <template slot-scope="{ row }" slot="mc_eid">
                <span
                  ><i
                    class="el-icon-star-on"
                    style="font-size: 20px; color: #2196f3"
                  ></i
                  >{{ row.mc_eid }}</span
                >
              </template>
              <template slot-scope="{ row }" slot="active_composition">
                <span>{{ row.active_composition }}%</span>
              </template>
              <template slot-scope="{ row }" slot="total_cnt">
                <span>{{ row.total_cnt | toThousands }}</span>
              </template>
              <template slot-scope="{ row }" slot="active_cnt">
                <span>{{ row.active_cnt | toThousands }}</span>
              </template>
              <el-table-column label="操作" width="180px" align="center">
                <template slot-scope="{ row }">
                  <el-button
                    type="text"
                    @click="handleOperate(row)"
                    v-if="row.data !== ''"
                    >查看数据</el-button
                  >
                </template>
              </el-table-column>
            </pageTable>
          </div>
        </template>
      </Contentpanel>
    </div>
    <!-- 详情页面 -->
    <!-- <div class="showdetail" v-if="!showdetail">
      <detail :rowData="rowData"></detail>
    </div> -->
    <!-- 详情页面 -->
  </div>
</template>

<script>
import {
  BlockContent,
  Header,
  Search,
} from "@/components/BlockContent/index.js";
import pageTable from "@/components/echartsUserAnalysis/PageTable";
import Contentpanel from "@/components/Contentpanel";
import detail from "./detail.vue";
import { getEventList } from "@/api/funct.js";
import { downTable } from "@/utils/index";
export default {
  components: {
    BlockContent,
    Header,
    Search,
    pageTable,
    Contentpanel,
    detail,
  },

  created() {
    this.showdetail = true;
  },
  data() {
    return {
      downTable,
      showdetail: false,
      queryModel: {
        carryApp: true,
        page: "1",
        size: "10",
      },
      activeKind: "1",
      dateRange: [new Date(), new Date()],
      tableData: {
        page: 1,
        size: 10,
        list: [],
      },
      columns: [
        { key: "pt", label: "日期", align: "left", sortable: true },
        { slot: "mc_eid", label: "事件ID", align: "center", sortable: true },
        {
          key: "mc_eid_cn",
          label: "事件名称",
          align: "center",
          sortable: true,
        },
        {
          slot: "total_cnt",
          label: "消息数",
          align: "center",
          sortable: true,
        },
        {
          slot: "active_cnt",
          label: "独立用户数",
          align: "center",
          sortable: true,
        },
      ],
    };
  },

  methods: {
    search(row) {
      this.queryModel = { ...this.queryModel, ...row, event_name: "all" };
      delete this.queryModel.date;
      delete this.queryModel.any_date;
      delete this.queryModel.custom_date;
      console.log(this.queryModel);
      this.fetchList();
    },
    handleChangePage({ page, size }) {
      this.queryModel.page = page;
      this.queryModel.size = size;
      this.fetchList();
    },
    fetchList() {
      getEventList(this.queryModel).then((res) => {
        console.log(res);
        if (res.code == 200) {
          // this.$message.success(res.msg);
          this.tableData = res.data;
        }
      });
    },
    handleOperate(row) {
      // console.log(row);
      // this.rowData = row;
      // this.showdetail = false;
      this.$router.push(`/business/funct/CustomEvents/detail/${row.mc_eid}`);
      // this.$router.push({
      //   path: `/business/funct/CustomEvents/detail/${row.mc_eid}`,
      //   query: { id: row.mc_eid },
      // });
    },
    downTables() {
      getEventList({ ...this.queryModel, size: 100000 }).then((res) => {
        let tableDatas = res.data;
        window.adr.exportExcel.exportExcel({
          tHeader: this.columns,
          list: tableDatas.list,
          filename: `${this.queryModel.start_date}-${this.queryModel.end_date}-事件列表`,
        });
      });
    },
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
.showdetail {
  width: 100%;
}
.tb {
  margin-bottom: 30px;
  background: white;
  padding: 20px;
}
</style>
