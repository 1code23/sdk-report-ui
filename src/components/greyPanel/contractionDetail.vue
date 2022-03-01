<template>
  <div class="onclickText">
    <div class="contraction-text" @click="clickText">
      <!-- 收缩文字组件 -->
      <i
        class="iconfont icon-xiajiantou-tianchong mr10 fz12"
        :class="{'upIcon':isClosed}"
      ></i>
      <span class="text">{{ label?label:text }}</span>
    </div>
    <div>
      <slot name="r"></slot>
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
    label: {
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
  font-size: 13px;
  .iconfont {
    font-size: 12px;
    color:gray;
    display:inline-block;
    transition:all 0.5s;
    line-height: 24px;
  }
  .upIcon{
      display:inline-block;transform:rotate(180deg);
  }
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
  padding: 12px 0 12px 12px;
}
</style>
