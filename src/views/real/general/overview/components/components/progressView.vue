<template>
  <div>
    <el-progress
      type="circle"
      :percentage="progressNumber"
      :width="20"
      :show-text="false"
      :stroke-width="2"
    ></el-progress>
  </div>
</template>
<script>
export default {
  data() {
    return {
      progressNumber: 0,
      timer: "",
    };
  },
  mounted() {
    let _this = this; // 声明一个变量指向Vue实例this，保证作用域一致
    this.timer = setInterval(() => {
      if (_this.progressNumber >= 99) {
        _this.progressNumber = 0;
      } else {
        _this.progressNumber = _this.progressNumber + 1;
      }
    }, 1000 * 3);
  },
  beforeDestroy() {
    if (this.timer) {
      clearInterval(this.timer); // 在Vue实例销毁前，清除我们的定时器
    }
  },
};
</script>
<style lang="scss" scoped></style>
