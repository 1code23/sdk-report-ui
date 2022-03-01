<template>
  <div class="fc box">
    <el-form
      class="flex1"
      ref="formCustom"
      :model="formCustom"
      :rules="rules"
      label-width="120px"
      label-position="left"
      size="small"
    >
      <el-form-item label="角色名称" prop="name">
        <el-input style="width: 300px" v-model="formCustom.name"></el-input>
      </el-form-item>
      <el-form-item label="页面权限">
        <el-tree
          ref="tree"
          node-key="id"
          :data="menuList"
          :props="defaultProps"
          :default-checked-keys="defaultCheckedList"
          show-checkbox
        >
        </el-tree>
      </el-form-item>
      <el-form-item label="应用列表">
        <transer
          ref="transer"
          :list="appList"
          :defaultList="defaultAppList"
          keyCode="id"
          valueCode="name"
          @checked="handleCheckAdv"
        ></transer>
      </el-form-item>
    </el-form>
    <div class="disfr jr ac">
      <el-button size="small" @click="submit" type="primary">
        立即提交
      </el-button>
      <el-button size="small" @click="cancel" type="primary"> 取消 </el-button>
    </div>
  </div>
</template>

<script>
import { getMenuList, addRoles, rolesEdit } from "@/api/system";
import transer from "@/components/TwoTransfer";
export default {
  props: {
    menuList: {
      type: Array,
      default() {
        return [];
      },
    },
    appList: {
      type: Array,
      default() {
        return [];
      },
    },
    editData: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  components: {
    transer,
  },
  mounted() {
    if (Object.keys(this.editData).length) {
      this.dataReproduce();
    }
  },
  data() {
    const validate = (rule, value, callback) => {
      if (value == "") {
        callback(new Error("请输入!"));
      } else {
        callback();
      }
    };
    return {
      formCustom: {
        name: "",
        webRouter: [],
        appList: [],
      },
      rules: {
        name: [{ validator: validate, required: true }],
        chineseName: [{ validator: validate, required: true }],
      },
      defaultProps: {
        label: "name",
        children: "sub",
      },
      appSelect: [],
      defaultAppList: [],
      defaultCheckedList: [],
    };
  },
  methods: {
    async submit() {
      let resvalid = await this.$refs.formCustom.validate();
      if (!resvalid) return;
      this.formCustom.webRouter = this.$refs.tree
        .getCheckedKeys()
        .concat(this.$refs.tree.getHalfCheckedKeys());
      this.formCustom.appList = this.$refs.transer.getChecked();
      let params = JSON.parse(JSON.stringify(this.formCustom));
      let res;
      if (Object.keys(this.editData).length) {
        params.id = this.editData.id;
        res = await rolesEdit(params);
      } else {
        res = await addRoles(params);
      }
      if (res && res.code === 200) {
        this.$message.success(res.msg);
        this.$emit("submit");
      }
    },
    cancel() {
      this.$emit("cancel");
    },
    reset() {
      Object.keys(this.formCustom).forEach((key) => {
        this.formCustom[key] = "";
      });
    },
    dataReproduce() {
      let allLeafList = this.filterAllLeaf(this.menuList);
      this.formCustom.name = this.editData.name;
      this.defaultCheckedList = this.editData.webRouter.filter((i) =>
        allLeafList.includes(i)
      );
      this.defaultAppList = this.editData.appList;
    },
    filterAllLeaf(list, leafList = []) {
      list.forEach((item) => {
        if (item.sub && item.sub.length !== 0) {
          this.filterAllLeaf(item.sub, leafList);
        } else {
          leafList.push(item.id);
        }
      });
      return leafList;
    },
    handleCheckAdv() {
      console.log("1");
    },
  },
};
</script>

<style lang="scss" scoped>
.box {
  width: 100%;
  height: 100%;
  padding-left: 5px;
}
</style>
