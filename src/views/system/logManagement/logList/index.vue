<template>
  <div>
    <el-row :gutter="10" class="searchHead">
      <el-col :span="5"
        ><el-date-picker
          size="small"
          type="date"
          value-format="yyyy-MM-dd"
          v-model="searchData.start_date"
          placeholder="请输入开始时间"
        ></el-date-picker
      ></el-col>
      <el-col :span="5"
        ><el-date-picker
          size="small"
          type="date"
          value-format="yyyy-MM-dd"
          v-model="searchData.end_date"
          placeholder="请输入结束时间"
        ></el-date-picker
      ></el-col>
      <!-- <el-col :span="4">
        <el-select
          size="small"
          clearable
          v-model="searchData.type"
          placeholder="请选择动作"
        >
          <el-option
            v-for="item in typeList"
            :key="item.key"
            :value="item.key"
            :label="item.value"
          ></el-option>
        </el-select>
      </el-col> -->
      <!-- <el-col :span="4"
        ><el-input
          size="small"
          v-model="searchData.action"
          placeholder="请输入模块/用户/IP"
        ></el-input
      ></el-col> -->
      <el-col :span="4"
        ><el-button
          size="small"
          type="primary"
          icon="el-icon-search"
          @click="handleSearch()"
          >查询</el-button
        ></el-col
      >
    </el-row>
    <PageTable
      style="margin-top: 20px"
      :columns="columns"
      :tableData="tableData"
      @page-change="handleChangePage"
    >
      <!-- <template slot="type" slot-scope="{ row }">
        {{ row.type | typeDesc(typeList) }}
      </template> -->
      <el-table-column label="操作" width="180px" align="center">
        <template slot-scope="{ row }">
          <el-button
            type="text"
            @click="handleOperate('view', row)"
            v-if="row.data !== ''"
            >查看数据</el-button
          >
        </template>
      </el-table-column>
    </PageTable>
    <el-dialog width="30%" :visible.sync="visible" title="查看数据">
      <div style="line-height: 2; max-height: 500px">{{ detailData.data }}</div>
    </el-dialog>
  </div>
</template>
<script>
import PageTable from "@/components/PageTable.vue";
import { getLogList, queryDateById } from "./indexServe";
import { dateFormat } from "@/utils/index";
const typeList = [
  { key: 1, value: "访问" },
  { key: 2, value: "操作" },
  { key: 0, value: "非法访问" },
];
export default {
  components: { PageTable },
  mounted() {
    let starts = new Date().getTime() - 7 * 24 * 60 * 60 * 1000;
    this.searchData.end_date = dateFormat("YYYY-mm-dd", new Date());
    this.searchData.start_date = dateFormat("YYYY-mm-dd", new Date(starts));
    this.init();
  },
  data() {
    return {
      typeList,
      searchData: { start_date: "", end_date: "" },
      tableData: {
        list: [],
        total: "0",
      },
      columns: [
        { key: "latency", label: "耗时" },
        { key: "roleName", label: "角色名" },
        { key: "userName", label: "用户名" },
        { key: "ip", label: "IP" },
        // { slot: "type", label: "类型" },
        { key: "url", label: "URL" },
        { key: "createdAt", label: "创建时间" },
        { key: "statusCode", label: "状态码" },
        { key: "method", label: "方法名" },
      ],
      visible: false,
      operationType: "", // 记录当前操作模式
      detailData: {},
      roleList: [], //所有角色列表
    };
  },
  methods: {
    // 事件监听
    handleChangePage({ page, size }) {
      this.getTableList({ page, size });
    },
    handleOperate(operationType, row) {
      this.visible = true;
      this.operationType = operationType;
      this.detailData = row;
      // this.queryDateById({ id: row.id });
    },
    handleSearch() {
      this.getTableList({ page: 1 });
    },
    // 后端请求
    async getTableList(params) {
      const res = await getLogList({
        page: 1,
        size: 10,
        ...this.searchData,
        ...params,
      });
      if (res && res.code == 200) {
        this.tableData = res.data;
        console.log(this.tableData);
        return res.data;
      }
    },
    async queryDateById(params) {
      const res = await queryDateById(params);
      if (res && res.code == 0) {
        this.$set(this.detailData, "info", res.data);
      }
    },
    // 其他
    init() {
      this.getTableList();
    },
  },
};
</script>
<style lang="scss" scoped>
.searchHead {
  margin: 20px 0;
}
</style>
