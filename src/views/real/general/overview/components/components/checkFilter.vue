<template>
  <div class="checkFilter fc">
    <el-input
      class="filterInp fz12"
      placeholder="搜索渠道名称"
      v-model="filterText"
    >
      <template slot="append">
        <div class="disfr ac jsb inpAppend">
          <i class="el-icon-search"></i>
          <span>{{ secList.length }}/10</span>
        </div>
      </template>
    </el-input>
    <div class="checkContent flex1">
      <el-checkbox-group v-model="secList" @change="changeData">
        <el-checkbox
          :label="a[dataKey]"
          v-for="(a, b) in filterList"
          :key="b"
          :disabled="secList.length > 9 && !secList.includes(a[dataKey])"
          >{{ a[dataLabel] }}</el-checkbox
        >
      </el-checkbox-group>
    </div>
  </div>
</template>

<script>
export default {
  name: "checkFilter",
  props: {
    list: {
      typeof: Array,
      default: () => {
        return [];
      },
    },
    checkList: {
      typeof: Array,
      default: () => {
        return [];
      },
    },
    dataKey: {
      typeof: String,
      default: "key",
    },
    dataLabel: {
      typeof: String,
      default: "label",
    },
  },
  data() {
    return {
      filterText: "",
      secList: [],
    };
  },
  computed: {
    filterList() {
      return this.list.filter((item) => {
        return item[this.dataLabel].search(this.filterText) > -1;
      });
    },
  },
  mounted() {
    this.secList = this.checkList;
  },
  methods: {
    changeData(val) {
      this.$emit("update:checkList", val);
      this.$emit("change", val);
    },
  },
};
</script>

<style lang="scss" scoped>
.checkFilter {
  height: 100%;
  /deep/.filterInp {
    border-bottom: 1px solid #e5e5e5;
    .el-input__inner {
      height: 40px;
      border: none;
    }
    .el-input-group__append {
      width: 50px;
      border: none;
      background: transparent;
      padding: 0 16px 0 0;
    }
  }
  /deep/.checkContent {
    overflow-y: scroll;
    .el-checkbox {
      box-sizing: border-box;
      width: 100%;
      height: 28px;
      padding: 0 16px;
      line-height: 28px;
      margin-right: 0 !important;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
}
</style>
