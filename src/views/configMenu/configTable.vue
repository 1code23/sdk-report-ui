<template>
  <div class="box">
    <div class="tl">
      <el-button
        type="primary"
        size="mini"
        @click="addItem({ id: 0 })"
        v-if="parentId == undefined"
        >新增</el-button
      >
      <el-button
        type="primary"
        size="mini"
        @click="refresh()"
        v-if="parentId == undefined"
        >刷新</el-button
      >
    </div>

    <el-table :data="menu" style="width: 100%">
      <el-table-column type="expand">
        <template #default="props">
          <configTable
            :menu="props.row.sub"
            v-if="props.row.sub && props.row.sub.length"
            :parentId="props.row.id"
            @init="emitEvt"
          ></configTable>
        </template>
      </el-table-column>
      <el-table-column label="名称" prop="name"> </el-table-column>
      <el-table-column label="路由" prop="webRouter"> </el-table-column>
      <el-table-column label="操作" prop="desc">
        <template #default="props">
          <el-button
            type="danger"
            icon="Delete"
            circle
            size="mini"
            @click="deleteItem(props.row)"
          ></el-button>
          <el-button
            type="primary"
            icon="Edit"
            circle
            size="mini"
            @click="editItem(props.row)"
          ></el-button>
          <el-button
            type="primary"
            icon="Plus"
            circle
            size="mini"
            @click="addItem(props.row)"
          ></el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-drawer
      title="配置"
      :closable="false"
      width="70%"
      :mask-closable="true"
      class="more-drawe"
      v-model="drawerShow"
    >
      <el-form label-width="120px">
        <el-form-item label="名称">
          <el-input
            v-model="formCustom.name"
            size="small"
            placeholder="请输入相关名称"
            style="display: inline-block; width: 500px"
          ></el-input>
        </el-form-item>
        <el-form-item label="权限接口">
          <el-input
            v-model="formCustom.permissions"
            type="textarea"
            size="small"
            placeholder="请输入相关名称"
            style="display: inline-block; width: 500px"
          ></el-input>
        </el-form-item>
        <el-form-item label="路由">
          <el-input
            v-model="formCustom.webRouter"
            size="small"
            placeholder="请输入相关名称"
            style="display: inline-block; width: 500px"
          ></el-input>
        </el-form-item>
        <div v-if="(nextcomType == 'button' && !ifEdit) || comType == 'button'">
          <!-- <el-form-item label="按钮名称"  >
								<el-input v-model="formCustom.action[0]"  size="small" placeholder="按钮名称" style="display: inline-block;width:500px"></el-input>
							</el-form-item> -->
          <el-form-item label="执行方法">
            <el-input
              v-model="formCustom.action[1]"
              size="small"
              placeholder="执行方法"
              style="display: inline-block; width: 500px"
            ></el-input>
          </el-form-item>
          <el-form-item label="按钮类型">
            <el-select
              v-model="formCustom.action[2]"
              placeholder="按钮类型"
              size="mini"
              style="display: inline-block; width: 500px"
            >
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
      <div class="disfr ac jfd">
        <el-button style="width: 200px" size="mini" @click="drawerShow = false"
          >取消</el-button
        >
        <el-button
          style="width: 200px"
          size="mini"
          type="primary"
          @click="createAdslot"
          >确认</el-button
        >
      </div>
    </el-drawer>
  </div>
</template>
<script>
import configTable from "@/views/configMenu/configTable.vue";
export default {
  components: {
    configTable,
  },
  name: "configTable",
  props: ["menu", "parentId"],
  data() {
    return {
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
    };
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
  computed: {
    nextcomType() {
      return this.menu.length ? this.menu[0].nextcomType : "";
    },
    comType() {
      return this.menu.length ? this.menu[0].comType : "";
    },
  },
  methods: {
    refresh() {
      this.$http("get", "/cache/role");
    },
    emitEvt() {
      // this.$emit("init")
    },
    async deleteItem(val) {
      this.$alert("操作不可逆，确认删除吗", "提示", {
        confirmButtonText: "确定",
        type: "warning",
        callback: async (action) => {
          if (action == "confirm") {
            let res = await this.$http("delete", "/hidden/menu/del", {
              id: val.id,
            });
            if (res.data.code == 200) {
              this.menu.splice(
                this.menu.findIndex((item) => item.id == val.id),
                1
              );
            }
          }
        },
      });
    },
    async editItem(val) {
      let { data } = await this.$http("get", "/hidden/menu/info", {
        id: val.id,
      });
      if (data.code == 200) {
        this.formCustom = data.data;
        this.formCustom.action = data.data.action.split("&");
        this.ifEdit = true;
        this.drawerShow = true;
      }
    },
    addItem(val) {
      this.drawerShow = true;
      this.formCustom.parentId = val.id;
    },
    async createAdslot(val) {
      let params = JSON.parse(JSON.stringify(this.formCustom));
      params.action = params.action.join("&");
      console.log(params);
      if (this.ifEdit) {
        let res = await this.$http("put", "/hidden/menu/update", params);
        if (res.data.code == 200) {
          this.drawerShow = false;
        }
        return;
      }
      let res = await this.$http("post", "/hidden/menu/creat", params);
      if (res.data.code == 200) {
        params.id = res.data.data.id;
        if (this.menu.findIndex((item) => item.id == params.parentId) != -1)
          this.menu[
            this.menu.findIndex((item) => item.id == params.parentId)
          ].sub.push(params);
        else this.menu.push(params);
        this.drawerShow = false;
      }
    },
  },
};
</script>
<style lang="scss">
.el-table__expanded-cell[class*="cell"] {
  padding: 20px 0px 20px 45px;
  // background:rgb(253, 233, 188);
}
</style>
