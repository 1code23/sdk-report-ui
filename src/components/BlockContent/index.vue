<template>
  <div class="block-content">
    <Header v-if="title" :title="title" />
    <slot />
    <!-- 内容块容器 -->
  </div>
</template>

<script>
import Header from "./header.vue";
export default {
  name: "BlockContent",
  components: { Header },
  props: {
    title: String,
  },
};
</script>
<style lang="scss">
.block-content {
  .el-input__inner {
    border-radius: 0 !important;
  }
}
</style>
<style lang="scss" scoped>
.block-content {
  padding: 20px;
  box-sizing: border-box;
  background: white;
  margin-bottom: 20px;
  &:last-child {
    margin-bottom: 0;
  }
}
</style>
