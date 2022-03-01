<template>
  <div class="roleManage">
    <p class="header tl">
      <el-button type="primary" icon="plus" size="mini" @click="addUser"
        >添加用户</el-button
      >
    </p>
    <pageTable
      :columns="columns"
      :tableData="tableData"
      @page-change="handleChangePage"
    >
      <template v-slot:operation="slotProp">
        <div>
          <el-tag
            size="mini"
            class="mhor10 pointer"
            @click="edit(slotProp.row)"
            style="cursor: pointer"
            >编辑</el-tag
          >
          <el-tag
            size="mini"
            class="mhor10 pointer"
            type="danger"
            @click="del(slotProp.row)"
            style="cursor: pointer"
            >删除</el-tag
          >
        </div>
      </template>
    </pageTable>
    <!-- <el-dialog :append-to-body="true" v-model="drawer" title="新建用户" center> -->
    <el-dialog
      :append-to-body="true"
      :visible.sync="drawer"
      :title="dialogName"
      center
    >
      <model
        v-if="drawer"
        :roleList="roleList"
        @submit="submitForm"
        @cancel="drawer = false"
        :editData="editData"
      ></model>
    </el-dialog>
  </div>
</template>

<script>
import pageTable from "@/components/pageTable1";
import model from "./model";
import { userList, roleManageList, userInfo, delUser } from "@/api/system";
export default {
  components: {
    pageTable,
    model,
  },
  data() {
    return {
      dialogName: "新建用户",
      columns: [
        { key: "name", label: "用户名", align: "center" },
        { slot: "operation", label: "操作", width: "200px", align: "center" },
      ],
      drawer: false,
      searchData: {
        keyword: "",
      },
      tableData: {
        page: 1,
        size: 10,
        total: 100,
        list: [],
      },
      editData: {},
      roleList: [],
    };
  },
  watch: {
    drawer(val) {
      if (!val) {
        this.editData = {};
      }
    },
  },
  created() {
    this.init();
  },
  methods: {
    handleChangePage({ page, size }) {
      this.userList({ page, size });
    },
    handleOperate() {},
    init() {
      this.userList();
    },
    async userList(params = {}) {
      let reqParsms = {
        page: 1,
        size: 10,
        ...this.searchData,
        ...params,
      };
      let res = await userList(reqParsms);
      if (res) {
        this.tableData = res.data;
      }
    },
    async addUser() {
      this.dialogName = "新建用户";
      let res = await roleManageList({ page: 1, size: 100 });
      this.roleList = res.data.list;
      this.drawer = true;
    },
    submitForm() {
      this.drawer = false;
      this.init();
    },
    async edit(row) {
      this.dialogName = "编辑用户";
      Promise.all([
        userInfo({ id: row.id }),
        roleManageList({ page: 1, size: 100 }),
      ]).then((res) => {
        this.roleList = res[1].data.list;
        let info = res[0].data;
        console.log(info);
        this.editData = info;
        this.drawer = true;
      });
    },
    async del(row) {
      let res = await delUser({ id: row.id });
      if (res) {
        this.init();
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.header {
  padding: 0 15px;
  height: 50px;
  line-height: 50px;
  background: linear-gradient(221deg, #f7f8fa, #f7f8fa);
}
</style>
