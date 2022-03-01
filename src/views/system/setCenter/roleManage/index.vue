<template>
  <div class="roleManage">
    <p class="header tl">
      <el-button type="primary" icon="plus" size="mini" @click="addRole"
        >添加角色</el-button
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
    <el-drawer :title="dialogName" width="70%" :visible.sync="drawer">
      <!-- <el-drawer
      :append-to-body="true"
      v-model="drawer"
      title="新建角色"
      size="60%"
    > -->
      <model
        v-if="drawer"
        :menuList="menuList"
        :appList="appList"
        @submit="submitForm"
        @cancel="drawer = false"
        :editData="editData"
      ></model>
    </el-drawer>
  </div>
</template>

<script>
import pageTable from "@/components/pageTable1";
import model from "./model";
import {
  roleManageList,
  getMenuList,
  appManageList,
  rolesInfo,
  rolesDel,
} from "@/api/system";
export default {
  components: {
    pageTable,
    model,
  },
  data() {
    return {
      dialogName: "",
      columns: [
        { key: "name", label: "角色名", align: "center" },
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
        list: [
          {
            name: "11",
            description: "这是111",
          },
          {
            name: "22",
            description: "这是222",
          },
        ],
      },
      menuList: [],
      appList: [],
      editData: {},
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
      this.roleList({ page, size });
    },
    handleOperate() {},
    init() {
      this.roleList();
    },
    async roleList(params = {}) {
      let reqParsms = {
        page: 1,
        size: 10,
        ...this.searchData,
        ...params,
      };
      let res = await roleManageList(reqParsms);
      if (res) {
        this.tableData = res.data;
      }
    },
    async addRole() {
      this.dialogName = "新建角色";
      Promise.all([getMenuList(), appManageList({ page: 1, size: 100 })]).then(
        (res) => {
          console.log(res[0], res[1]);
          this.menuList = res[0].data;
          res[1].data.list.forEach((element) => {
            element.show = true;
          });
          this.appList = res[1].data.list;
          this.drawer = true;
        }
      );
    },
    submitForm() {
      this.drawer = false;
      this.init();
    },
    async edit(row) {
      this.dialogName = "编辑角色";
      Promise.all([
        getMenuList(),
        appManageList({ page: 1, size: 100 }),
        rolesInfo({ id: row.id }),
      ]).then((res) => {
        this.menuList = res[0].data;
        res[1].data.list.forEach((element) => {
          element.show = true;
        });
        this.appList = res[1].data.list;
        let info = res[2].data;
        this.editData = info;
        this.drawer = true;
      });
    },
    async del(row) {
      console.log(row);
      let res = await rolesDel({ id: row.id });
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
