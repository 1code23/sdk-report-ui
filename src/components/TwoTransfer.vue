<template>
  <div class="two-transfer">
    <div class="card">
      <el-input
        placeholder="输入关键字进行过滤"
        size="mini"
        v-model="filterText"
        class="mb10"
      >
      </el-input>
      <div>
        <el-checkbox
          v-show="filterText.trim().length < 1"
          :indeterminate="isIndeterminate"
          v-model="checkAll"
          @change="handleCheckAllChange"
          >全选</el-checkbox
        >
      </div>
      <el-checkbox-group v-model="checkedList" @change="handleChecked">
        <el-checkbox
          v-for="item in list"
          v-show="item.show"
          :key="item[keyCode]"
          :label="item[keyCode]"
          >{{ item[valueCode] }}</el-checkbox
        >
      </el-checkbox-group>
    </div>
    <el-icon><arrow-right-bold /></el-icon>
    <div class="card">
      <el-checkbox-group v-model="checkedList" @change="handleChangeList">
        <el-checkbox
          v-for="item in listChecked"
          :key="item[keyCode]"
          :label="item[keyCode]"
          >{{ item[valueCode] }}</el-checkbox
        >
      </el-checkbox-group>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    keyCode: {
      default: "key",
    },
    valueCode: {
      default: "name",
    },
    list: {
      type: Array,
      default() {
        return [];
      },
    },
    defaultList: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  data() {
    return {
      checkedList: [],
      pkData: [],
      filterText: "",
      isIndeterminate: false,
      checkAll: false,
    };
  },
  computed: {
    listChecked() {
      let list = [];
      this.list.forEach((item) => {
        if (this.checkedList.includes(item[this.keyCode])) {
          list.push(item);
        }
      });
      return list;
    },
    checkedAllList1() {
      return this.list.map((i) => i[this.keyCode]);
    },
  },
  methods: {
    handleChecked(value) {
      const checkedCount = value.length;
      this.checkAll = checkedCount == this.list.length;
      this.isIndeterminate =
        checkedCount > 0 && checkedCount < this.list.length;
    },
    handleChangeList(list) {
      this.checkedList = list;
    },
    handleCheckAllChange(val) {
      this.checkedList = val ? this.checkedAllList1 : [];
      this.isIndeterminate = false;
    },
    getChecked() {
      return this.checkedList;
    },
  },
  watch: {
    filterText(val) {
      if (val.trim().length > 0) {
        this.list.forEach((item) => {
          item.show = item.name.indexOf(val.trim()) >= 0 ? true : false;
        });
      } else {
        this.list.forEach((item) => {
          item.show = true;
        });
      }
    },
    defaultList(defaultList) {
      this.checkedList = defaultList;
    },
    list(val) {
      val.forEach((item) => {
        item.show = true;
      });
      return val;
    },
  },
};
</script>
<style scoped lang="scss">
.two-transfer {
  display: flex;
  align-items: center;
}
.card {
  width: 200px;
  height: 200px;
  padding: 5px;
  border: 1px solid #dedede;
  overflow: auto;
  display: flex;
  flex-direction: column;
  /deep/.el-checkbox {
    width: 85%;
  }
}
</style>
