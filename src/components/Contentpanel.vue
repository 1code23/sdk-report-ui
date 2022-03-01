<template>
  <div class="contentpanel tl">
    <div class="paneHeader">
      <slot name="header"></slot>
    </div>
    <div class="panelMain">
      <slot name="main"></slot>
    </div>
  </div>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped>
.paneHeader {
  background: rgb(247, 248, 250);
  padding: 12px 20px;
  border-radius: 2px 2px 0px 0px;
}
</style>
