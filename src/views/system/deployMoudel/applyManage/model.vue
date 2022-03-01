<template>
  <div>
    <el-form
      ref="formCustom"
      :model="formCustom"
      :rules="rules"
      label-width="120px"
      label-position="left"
      inline
      size="small"
    >
      <el-form-item label="应用名称" prop="name">
        <el-input v-model="formCustom.name"></el-input>
      </el-form-item>
      <el-form-item label="应用名称(中文)" prop="appName">
        <el-input v-model="formCustom.appName"></el-input>
      </el-form-item>
    </el-form>
    <div class="disfr jr ac">
      <el-button size="small" @click="submit" type="primary">
        立即提交
      </el-button>
      <el-button size="small" @click="reset"> 重置 </el-button>
    </div>
  </div>
</template>

<script>
import { appAdd, editApp } from "@/api/system";
export default {
  props: {
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
        appName: "",
      },
      rules: {
        name: [{ validator: validate, required: true }],
        appName: [{ validator: validate, required: true }],
      },
      isEdit: false,
    };
  },
  mounted() {
    if (Object.keys(this.editData).length) {
      this.isEdit = true;
      this.formCustom.name = this.editData.name;
      this.formCustom.appName = this.editData.appName;
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
        res = await editApp(params);
      } else {
        res = await appAdd(params);
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

<style></style>
