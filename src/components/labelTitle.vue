<template>
  <p class="header tl">
    <slot></slot>
  </p>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped>
.header {
  padding: 0 15px;
  height: 50px;
  line-height: 50px;
  background: linear-gradient(221deg, #f7f8fa, #f7f8fa);
}
</style>
