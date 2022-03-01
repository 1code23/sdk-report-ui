<template>
  <div>
    <el-form
      class="formCustom"
      ref="formCustom"
      :model="formCustom"
      :rules="rules"
      label-width="120px"
      label-position="left"
      size="small"
    >
      <el-form-item label="用户名称" prop="name">
        <el-input
          v-model="formCustom.name"
          placeholder="请输入用户名称"
        ></el-input>
      </el-form-item>
      <el-form-item label="账号" prop="account">
        <el-input
          v-model="formCustom.account"
          placeholder="请输入账号"
        ></el-input>
      </el-form-item>
      <el-form-item label="所属权限分组" prop="roleId">
        <el-select v-model="formCustom.roleId" placeholder="请选择所属权限">
          <el-option
            v-for="item in roleList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="密码" :prop="isEdit ? '' : 'password'">
        <el-input
          type="password"
          v-model="formCustom.password"
          placeholder="请输入密码"
        ></el-input>
      </el-form-item>
    </el-form>
    <div class="disfr jr ac" style="display: flex; justify-content: center">
      <el-button size="small" @click="submit" type="primary">
        立即提交
      </el-button>
      <el-button size="small" @click="cancel"> 取消 </el-button>
    </div>
  </div>
</template>

<script>
import { addUser, editUser } from "@/api/system";
export default {
  props: {
    roleList: {
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
        account: "",
        roleId: "",
        password: "",
      },
      rules: {
        name: [{ validator: validate, required: true }],
        account: [{ validator: validate, required: true }],
        roleId: [{ validator: validate, required: true }],
        password: [{ validator: validate, required: true }],
      },
      isEdit: false,
    };
  },
  mounted() {
    if (Object.keys(this.editData).length) {
      this.isEdit = true;
      this.formCustom.name = this.editData.name;
      this.formCustom.account = this.editData.account;
      this.formCustom.roleId = this.editData.roleId;
    }
  },
  methods: {
    async submit() {
      let resvalid = await this.$refs.formCustom.validate();
      if (!resvalid) return;
      let params = JSON.parse(JSON.stringify(this.formCustom));
      let res;
      if (Object.keys(this.editData).length) {
        params.id = this.editData.id;
        res = await editUser(params);
      } else {
        res = await addUser(params);
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
  },
};
</script>

<style lang="scss" scoped>
.formCustom {
  padding: 0 10%;
  /deep/ .el-input__inner,
  .el-select {
    width: 100%;
  }
}
</style>
