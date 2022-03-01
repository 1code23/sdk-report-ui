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
      <el-form-item label="事件名称" prop="event_name">
        <el-input v-model="formCustom.event_name"></el-input>
      </el-form-item>
      <el-form-item label="事件中文名称" prop="event_name_cn">
        <el-input v-model="formCustom.event_name_cn"></el-input>
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
import { getEventListAdd, getEventListupdate } from "@/api/common.js";
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
        event_name: "",
        event_name_cn: "",
      },
      rules: {
        event_name: [{ validator: validate, required: true }],
        event_name_cn: [{ validator: validate, required: true }],
      },
      isEdit: false,
    };
  },
  mounted() {
    if (Object.keys(this.editData).length) {
      this.isEdit = true;
      console.log(this.editData);
      this.formCustom.event_name = this.editData.event_name;
      this.formCustom.event_name_cn = this.editData.event_name_cn;
    }
  },
  methods: {
    async submit() {
      let resvalid = await this.$refs.formCustom.validate();
      if (!resvalid) return;
      let params = JSON.parse(JSON.stringify(this.formCustom));
      let res;
      params.app_appid = "123456";
      params.event_name = this.formCustom.event_name;
      params.event_name_cn = this.formCustom.event_name_cn;
      if (Object.keys(this.editData).length) {
        params.id = this.editData.id;
        res = await getEventListupdate(params);
      } else {
        res = await getEventListAdd(params);
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
