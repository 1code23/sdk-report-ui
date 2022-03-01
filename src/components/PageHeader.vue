<template>
  <div class="pageHeader tl mb16">
    <slot></slot>
  </div>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped>
.pageHeader {
  padding: 12px 20px;
  background: rgb(255, 255, 255);
  border-radius: 0px 0px 2px 2px;
  margin-bottom: 16px;
  .pageTitle {
    margin-bottom: 16px;
  }
}
</style>
