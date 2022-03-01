<template>
  <div class="block-header">
    <span v-if="title" class="title">{{ title }}</span>
    <div><slot name="l" /></div>
    <div><slot name="r" /></div>
  </div>
</template>

<script>
export default {
  name: "BlockHeader",
  props: {
    title: String,
  },
};
</script>

<style lang="scss" scoped>
.block-header {
  display: grid;
  justify-content: space-between;
  grid-template-columns: repeat(2, auto);
  align-items: center;
  padding-bottom: 20px;
  .title {
    font-size: 16px;
    color: #333333;
    margin-right: 5px;
    // font-weight: bold;
  }
}
</style>
