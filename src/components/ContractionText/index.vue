<template>
  <div class="onclickText">
    <div class="contraction-text" @click="clickText">
      <!-- 收缩文字组件 -->
      <span class="text">{{ text }}</span>
      <i v-if="isClosed" class="el-icon-arrow-down"></i>
      <i v-else class="el-icon-arrow-up"></i>
    </div>
    <div>
      <div class="export" @click="$emit('downTable')">
        <span style="font-size: 14px; color: #3882fe"
          ><i class="el-icon-document" style="margin-right: 5px"></i>导出</span
        >
      </div>
    </div>
  </div>
</template>

<script>
import { downTable } from "@/utils/index";
export default {
  props: {
    closed: {
      type: Boolean,
      default: true,
    },
    tableId: {
      type: String,
      default: "",
    },
  },
  computed: {
    text() {
      let tex = this.isClosed ? "展开明细数据" : "收起明细数据";
      return tex;
    },
    isClosed: {
      get() {
        return this.closed;
      },
      set(val) {
        this.$emit("update:closed", val);
      },
    },
  },
  data() {
    return {
      downTable,
    };
  },
  methods: {
    clickText() {
      this.isClosed = !this.closed;
    },
  },
};
</script>

<style lang="scss" scoped>
.contraction-text {
  margin: 20px 0;
  font-size: 13px;
  color: #409eff;
  cursor: pointer;
  user-select: none;
  .text {
    margin-right: 5px;
  }
}
.onclickText {
  display: flex;
  justify-content: space-between;
  background: white;
  padding-left: 20px;
  margin-bottom: 20px;
}
</style>
