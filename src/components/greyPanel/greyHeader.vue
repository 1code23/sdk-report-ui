<template>
  <div class="greyHeader">
    <span v-if="title" class="title">{{ title }}</span>
    <div><slot name="l" /></div>
    <div><slot name="r" /></div>
  </div>
</template>

<script>
export default {
  name: "greyHeader",
  props: {
    title: String,
  },
};
</script>

<style lang="scss" scoped>
.greyHeader {
  display: grid;
  justify-content: space-between;
  grid-template-columns: repeat(2, auto);
  align-items: center;

  padding-bottom: 20px;
  background: rgb(247, 248, 250);
  padding: 12px 20px;
  border-radius: 2px 2px 0px 0px;
}
</style>
