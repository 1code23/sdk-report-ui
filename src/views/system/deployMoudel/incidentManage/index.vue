<template>
  <div class="roleManage">
    <labelTitle>
      <el-row :gutter="20">
        <el-col :span="18">
          <el-button type="primary" icon="plus" size="mini" @click="addApp"
            >添加事件</el-button
          >
        </el-col>
        <el-col :span="6">
          <div class="fillBox disfr ac jsb">
            <el-input
              size="mini"
              v-model="keyword"
              placeholder="输入事件名称查询"
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
import {
  getEventList,
  getEventListdelete,
  getEventListupdate,
  getEventListAdd,
} from "@/api/common.js";
export default {
  components: {
    pageTable,
    model,
    labelTitle,
  },
  data() {
    return {
      dialogName: "",
      app_appid: "123456",
      columns: [
        { key: "id", label: "ID", align: "center", sortable: true },
        { key: "event_name", label: "事件名称", align: "center" },
        { key: "event_name_cn", label: "事件名称(中文)", align: "center" },
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
          this.appManageList();
        }, 800);
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
        keyword: this.keyword,
        ...params,
        app_appid: this.app_appid,
      };
      let res = await getEventList(reqParsms);
      console.log(res);
      if (res.code == 200) {
        this.tableData = res.data;
        console.log(this.tableData);
      }
    },
    addApp() {
      this.dialogName = "新增事件";
      this.dialogVisible = true;
    },
    submitForm() {
      this.dialogVisible = false;
      this.init();
    },
    async edit(row) {
      this.dialogName = "编辑事件";
      // let res = await appInfo({ id: row.id });
      // let obj = {
      //   app_appid: this.app_appid,
      //   id: row.id,
      //   event_name_cn: row.event_name_cn,
      //   event_name: row.event_name,
      // };
      // let res = await getEventListupdate(obj);
      // let info = res.data;
      // this.editData = info;
      this.editData = row;
      this.dialogVisible = true;
    },
    async del(row) {
      console.log(row);
      let res = await getEventListdelete({
        id: row.id,
        app_appid: this.app_appid,
      });
      if (res) {
        this.init();
      }
    },
  },
};
</script>

<style lang="scss" scoped></style>
