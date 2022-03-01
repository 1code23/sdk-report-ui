<template>
  <div class="datePicker">
    <div class="infoTips boxz disfr ac jsb">
		<i class="el-icon-place colorB fz16"></i>
		<span>请选择对比时段的终点</span>
		<span>5/5</span>
	</div>
    <el-date-picker
      ref="datePick"
      popper-class="datePickCom"
      @change="chooseDate"
      @blur="getFocus"
      v-model="date"
      type="date"
      placeholder="选择日期"
      format="yyyy-MM-dd"
    >
    </el-date-picker>
  </div>
</template>

<script>
export default {
  data() {
    return {
      date: "",
      checkDate:[]
    };
  },
  mounted() {
    this.$refs.datePick.focus(); // 让日历组件默认触发焦点事件
  },
  methods: {
    chooseDate(val) {
      console.log(val)
      this.getFocus()
    },
    getFocus(){
      this.$refs.datePick.focus(); // 选择日期后依旧触发焦点
    }
  },
  beforeDestroy() {
    console.log("destory");
  },
};
</script>

<style lang="scss">
.datePicker {
	position: relative;
  .el-input {
	  height:40px;
    opacity: 0;
  }
  .infoTips{
	  position:absolute;
	  left:0;
	  top:0;
	  width:100%;
	  padding:0 16px;
	  height:40px;
	  border-bottom:1px solid #e5e5e5;
  }
}
.datePickCom.el-popper {
  width: 278px;
  height: 265px;
  margin: 0;
  border: none;
  box-shadow: none;
  .el-picker-panel__body {
    .el-date-picker__header {
      margin: 0;
      padding:5px  0;
	  border-bottom:1px solid #e5e5e5;
    }
  }
  .el-picker-panel__content {
    margin: 0;
    width: 100%;
    .el-date-table {
      td div {
        height: 20px;
      }
    }
  }
  .popper__arrow {
    display: none;
  }
}
</style>