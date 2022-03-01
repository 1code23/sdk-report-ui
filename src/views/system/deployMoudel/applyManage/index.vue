<template>
  <div class="roleManage">
    <labelTitle>
      <el-row :gutter="20">
        <el-col :span="18">
          <el-button type="primary" icon="plus" size="mini" @click="addApp"
            >添加应用</el-button
          >
        </el-col>
        <el-col :span="6">
          <div class="fillBox disfr ac jsb">
            <el-input
              size="mini"
              v-model="keyword"
              placeholder="输入应用名称查询"
            ></el-input>
          </div>
        </el-col>
      </el-row>
    </labelTitle>
    <pageTable
      :columns="columns"
      :tableData="tableData"
      @page-change="handleChangePage"
    >
      <!-- @selection-change="handleSelectionChange" -->
      <template v-slot:operation="slotProp">
        <div>
          <el-tag size="mini" class="mhor10 pointer" @click="edit(slotProp.row)"
            >编辑</el-tag
          >
          <el-tag
            size="mini"
            class="mhor10 pointer"
            type="danger"
            @click="del(slotProp.row)"
            >删除</el-tag
          >
        </div>
      </template>
    </pageTable>
    <el-dialog :visible.sync="dialogVisible" :title="dialogName" width="30%">
      <model
        :editData="editData"
        @submit="submitForm"
        v-if="dialogVisible"
      ></model>
    </el-dialog>
  </div>
</template>

<script>
import pageTable from "@/components/pageTable1";
import labelTitle from "@/components/labelTitle";
import model from "./model";
import { appManageList, delApp, appInfo, appfunctList } from "@/api/system";
export default {
  components: {
    pageTable,
    model,
    labelTitle,
  },
  data() {
    return {
      dialogName: "",
      columns: [
        { key: "id", label: "ID", align: "center", sortable: true },
        { key: "name", label: "应用名称", align: "center" },
        { key: "appName", label: "应用名称(中文)", align: "center" },
        // { key: "createTime", label: "创建时间", align: "center" },
        // { key: "updateTime", label: "更新时间", align: "center" },
        { slot: "operation", label: "操作", align: "center" },
      ],
      // searchData: {
      //   keyword: "",
      // },

      dialogVisible: false,
      tableData: {
        page: 1,
        size: 10,
        count: 0,
        list: [],
      },
      editData: {},
      timer: "",
      keyword: "",
    };
  },
  mounted() {
    this.init();
  },
  watch: {
    dialogVisible(val) {
      if (!val) {
        this.editData = {};
      }
    },
    keyword: {
      handler() {
        if (this.timer) {
          clearTimeout(this.timer);
        }
        this.timer = setTimeout(() => {
          if (this.keyword) {
            this.appfunctList();
          }
          this.appManageList();
          // this.appfunctList();
        }, 1000);
      },
      deep: true,
    },
  },
  methods: {
    init() {
      this.appManageList();
    },
    handleChangePage({ page, size }) {
      this.appManageList({ page, size });
    },
    async appManageList(params = {}) {
      let reqParsms = {
        page: 1,
        size: 10,
        // keyword: this.keyword,
        ...params,
      };

      let res = await appManageList(reqParsms);
      console.log(res);
      if (res.code == 200) {
        this.tableData = res.data;
        console.log(this.tableData);
      }
    },
    async appfunctList(params = {}) {
      let reqParsms = {
        page: 1,
        size: 10,
        keyword: this.keyword,
        ...params,
      };

      let res = await appfunctList(reqParsms);
      console.log(res);
      if (res.code == 200) {
        this.tableData = res.data;
        console.log(this.tableData);
      }
    },
    addApp() {
      this.dialogName = "新增应用";
      this.dialogVisible = true;
    },
    submitForm() {
      this.dialogVisible = false;
      this.init();
    },
    async edit(row) {
      this.dialogName = "编辑应用";
      let res = await appInfo({ id: row.id });
      let info = res.data;
      this.editData = info;
      this.dialogVisible = true;
    },
    async del(row) {
      console.log(row);
      let res = await delApp({ id: row.id });
      if (res) {
        this.init();
      }
    },
  },
};
</script>

<style lang="scss" scoped></style>
