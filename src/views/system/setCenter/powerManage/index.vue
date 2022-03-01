<template>
  <div class="box">
    <div class="tl">
      <el-button
        class="tr"
        type="primary"
        size="mini"
        @click="addItem({ id: 0 })"
        >新增</el-button
      >
      <el-button class="tr" type="primary" size="mini" @click="refresh()"
        >刷新</el-button
      >
    </div>

    <el-table
      :data="menu"
      style="width: 100%"
      row-key="id"
      :expand-row-keys="menuIDArray"
      border
      :indent="40"
      :tree-props="{ children: 'sub' }"
    >
      <el-table-column label="名称" prop="name"> </el-table-column>
      <el-table-column label="路由" prop="webRouter">
        <template slot-scope="{ row }">
          <span v-if="row.comType == 'page'">{{ row.webRouter }}</span>
          <span v-else style="margin-left: 20px">{{
            getButtonName(row.action.split("&&")[1] || "")
          }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" prop="desc" width="150" align="center">
        <template #default="props">
          <el-button
            type="danger"
            icon="el-icon-delete"
            circle
            size="mini"
            @click="deleteItem(props.row)"
          ></el-button>
          <el-button
            type="primary"
            icon="el-icon-edit"
            circle
            size="mini"
            @click="editItem(props.row)"
          ></el-button>
          <el-button
            type="primary"
            icon="el-icon-plus"
            circle
            size="mini"
            @click="addItem(props.row)"
          ></el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-drawer
      title="配置"
      :visible.sync="drawerShow"
      :size="500"
      direction="rtl"
    >
      <div style="padding: 20px">
        <el-form label-width="auto">
          <el-form-item label="名称">
            <el-input
              v-model="formCustom.name"
              size="small"
              placeholder="请输入相关名称"
            ></el-input>
          </el-form-item>
          <el-form-item label="权限接口">
            <el-input
              v-model="formCustom.permissions"
              type="textarea"
              size="small"
              placeholder="请输入相关名称"
            ></el-input>
          </el-form-item>
          <el-form-item label="路由" v-if="comType !== 'button'">
            <el-input
              v-model="formCustom.webRouter"
              size="small"
              placeholder="请输入相关名称"
            ></el-input>
          </el-form-item>
          <el-form-item label="图标" v-if="comType !== 'button'">
            <el-input
              v-model="formCustom.icon"
              size="small"
              placeholder="请输入相关图标"
            ></el-input>
          </el-form-item>
          <div
            v-if="(nextcomType == 'button' && !ifEdit) || comType == 'button'"
          >
            <el-form-item label="执行方法">
              <el-input
                v-model="formCustom.action[1]"
                size="small"
                placeholder="执行方法"
              ></el-input>
            </el-form-item>
            <el-form-item label="按钮类型">
              <el-select v-model="formCustom.action[2]" placeholder="按钮类型">
                <el-option
                  v-for="(item, index) in configMenuBtn"
                  :key="index"
                  :label="item.name"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </div>
        </el-form>
        <el-row type="flex" justify="end">
          <el-button @click="drawerShow = false">取消</el-button>
          <el-button type="primary" @click="createAdslot">确认</el-button>
        </el-row>
      </div>
    </el-drawer>
  </div>
</template>

<script>
// import configTable from "@/views/system/setCenter/powerManage/configTable.vue";
import {
  getMenuAll,
  getroleList,
  editroleList,
  deleteroleList,
  updateroleList,
  createroleList,
} from "@/api/common.js";
export default {
  components: {
    // configTable,
  },
  watch: {
    drawerShow(val) {
      if (!val) {
        this.formCustom = {
          name: "",
          parentId: "",
          webRouter: "",
          permissions: "",
          icon: "",
          action: Array.from({ length: 3 }, () => ""),
        };
        this.ifEdit = false;
      }
    },
    "formCustom.name": function (val) {
      this.formCustom.action[0] = val;
    },
  },
  data() {
    return {
      menu: [],
      menuIDArray: [],
      drawerShow: false,
      formCustom: {
        name: "",
        parentId: "",
        webRouter: "",
        permissions: "",
        icon: "",
        action: Array.from({ length: 3 }, () => ""),
      },
      configMenuBtn: [
        {
          name: "操作",
          value: "operation",
        },
        {
          name: "查询",
          value: "query",
        },
        {
          name: "下载",
          value: "downLoad",
        },
        {
          name: "创建",
          value: "create",
        },
        {
          name: "其他",
          value: "other",
        },
      ],
      createId: "",
      ifEdit: false,
      nextcomType: "",
      comType: "",
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    getButtonName(val) {
      if (!val) {
        return "";
      }
      const item = this.configMenuBtn.find((c) => c.value === val);
      return item.name;
    },
    init() {
      getMenuAll({}).then((data) => {
        this.menu = this.initMenu(data.data);
        console.log(this.menu);
        this.menuIDArray = [];
        this.menu.forEach((item) => {
          this.menuIDArray.push(item.id.toString());
        });
        console.log(this.menuIDArray);
      });
    },
    initMenu(menu, Oindex = 0) {
      let menuList = [];
      menu.forEach((item) => {
        item.comType = "button";
        item.nextcomType = "button";
        if (Oindex < 3) {
          item.comType = "page";
        }
        if (Oindex < 2) {
          item.nextcomType = "page";
        }

        if (item.sub) {
          this.initMenu(item.sub, Oindex + 1);
        }
        menuList.push(item);
      });
      return menuList;
    },
    refresh() {
      // this.$http("get", "/cache/role");
      getroleList({}).then((res) => {
        console.log(res);
      });
      this.init();
    },
    emitEvt() {
      // this.init()
    },
    async deleteItem(val) {
      this.$alert("操作不可逆，确认删除吗", "提示", {
        confirmButtonText: "确定",
        type: "warning",
        callback: async (action) => {
          if (action == "confirm") {
            // let res = await this.$http("delete", "/hidden/menu/del", {
            //   id: val.id,
            // });
            let res = await deleteroleList({ id: val.id });
            if (res.code == 200) {
              this.init();
            }
          }
        },
      });
    },
    async editItem(val) {
      // let { data } = await this.$http("get", "/hidden/menu/info", {
      //   id: val.id,
      // });
      let data = await editroleList({ id: val.id });
      console.log(data.data);
      if (data.code == 200) {
        this.formCustom = { ...data.data };
        this.formCustom.action = data.data.action.split("&");
        this.$set(this.formCustom, "webRouter", data.data.web_router);
        // this.formCustom.webRouter = data.data.web_router;
        this.ifEdit = true;
        this.drawerShow = true;
        this.nextcomType = val.nextcomType;
        this.comType = val.comType;
      }
    },
    addItem(val) {
      this.drawerShow = true;
      this.formCustom.parentId = val.id;
      this.nextcomType = val.nextcomType;
      this.comType = val.comType;
    },
    async createAdslot(val) {
      let params = JSON.parse(JSON.stringify(this.formCustom));
      params.action = params.action.join("&");
      console.log(params);
      if (this.ifEdit) {
        // let res = await this.$http("put", "/hidden/menu/update", params);
        let res = await updateroleList(params);
        console.log(res);
        if (res.code == 200) {
          // this.init();
          this.drawerShow = false;
          this.init();
        }
        return;
      }
      // let res = await this.$http("post", "/hidden/menu/creat", params);
      let res = await createroleList(params);
      if (res.code == 200) {
        params.id = res.data.id;
        if (this.menu.findIndex((item) => item.id == params.parentId) != -1)
          this.menu[
            this.menu.findIndex((item) => item.id == params.parentId)
          ].sub.push(params);
        else this.menu.push(params);
        this.init();
        this.drawerShow = false;
      }
    },
  },
};
</script>

<style lang="scss">
.box {
  .el-drawer__header {
    font-size: 16px !important;
  }
}
</style>
<style lang="scss" scoped>
.el-table__expanded-cell[class*="cell"] {
  padding: 20px 0px 20px 45px;
  // background:rgb(253, 233, 188);
}
.tl {
  // padding: 20px 0;
}
.tr {
  margin-top: 20px;
  margin-bottom: 20px;
}
.celltest {
  margin-left: 30px !important;
}
</style>
