<template>
  <div>
    <el-table
      border
      stripe
      :data="tableData.list"
      style="width: 100%"
      :row-key="rowKey"
      :height="height"
      @select="handleSelect"
      @selection-change="handleSelectionChange"
    >
      <slot name="prefix"></slot>
      <el-table-column
        v-for="item in columns"
        :key="item.key ? item.key : item.slot"
        :prop="item.key"
        :label="item.label"
        :fixed="item.fixed"
        :sortable="item.sortable"
        :width="item.width"
        :align="item.align ? item.align : 'left'"
      >
        <template #default="{ row }">
          <span v-if="item.key">{{ row[item.key] }}</span>
          <slot v-if="item.slot" :name="item.slot" :row="row"></slot>
        </template>
      </el-table-column>
      <slot></slot>
    </el-table>
    <el-pagination
      class="pagination-wapper"
      @size-change="handleSizeChange"
      @current-change="handleChangePage"
      :current-page="parseInt(tableData.page)"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="parseInt(tableData.size)"
      layout=" sizes, prev, pager, next, jumper"
      :total="parseInt(tableData.count)"
    >
    </el-pagination>
  </div>
</template>
<script>
export default {
  props: {
    rowKey: {
      type: String,
      default: "id",
    },
    columns: {
      required: true,
      type: Array,
      default() {
        return [];
      },
    },
    tableData: {
      required: true,
      type: Object,
      default() {
        return {
          page: 1,
          size: 10,
          count: 0,
          list: [],
        };
      },
    },
    height: {
      type: String,
    },
  },
  mounted() {},
  methods: {
    handleSizeChange(size) {
      this.$emit("page-change", { page: 1, size });
    },
    handleChangePage(page) {
      this.$emit("page-change", { page, size: this.tableData.size });
    },
    handleSelect(selection, row) {
      this.$emit("select", selection, row);
    },
    handleSelectionChange(selection) {
      this.$emit("selection-change", selection);
    },
  },
};
</script>
<style scoped lang="scss">
.pagination-wapper {
  text-align: right;
  margin-top: 10px;
}
</style>
