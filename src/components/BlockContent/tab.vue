<template>
  <div class="block-tab">
    <span
      class="tab"
      :class="{
        disabled: item.disabled,
        active: activeTabId === item.id,
        'no-border': !border,
      }"
      @click="handleClickTab(item)"
      v-for="(item, index) in list"
      :key="index"
      >{{ item.title }}</span
    >
  </div>
</template>

<script>
export default {
  props: {
    /**
     * {
     *    title:'新用户留存',
     *    id:1,
     *    disabled: true,
     * }
     */
    list: {
      type: Array,
      default: () => {
        return [];
      },
    },
    activeId: [String, Number],
    border: {
      type: Boolean,
      default: true,
    },
  },
  computed: {
    activeTabId: {
      get() {
        return this.activeId;
      },
      set(val) {
        this.$emit("update:activeId", val);
      },
    },
  },
  data() {
    return {};
  },
  created() {},
  methods: {
    handleClickTab(item) {
      if (item.disabled) return;
      this.activeTabId = item.id;
    },
  },
};
</script>

<style lang="scss" scoped>
.block-tab {
  // margin: 20px 0;
  display: table;
  border-collapse: collapse;
  box-sizing: border-box;
  .tab {
    // height: 35px;
    position: relative;
    display: table-cell;
    white-space: nowrap;
    padding: 8px 20px;
    font-size: 13px;
    border: 1px solid #eeeeee;
    cursor: pointer;
    user-select: none;
    box-sizing: border-box;
    color: #333333;
    &.active {
      display: block;
      border: 1px solid #409eff;
      font-weight: bold;
    }
    &.disabled {
      cursor: not-allowed;
      filter: grayscale(1);
      opacity: 0.3;
    }
    &:not(.active):hover {
      color: #93cdff;
    }
    &.active.no-border {
      color: #409eff;
    }
    &.no-border {
      border: none;
      border-right: 1px solid #f8f8f8;
      padding: 6px 10px;
    }
    &.no-border:last-child {
      border-right: none;
    }
  }
}
</style>
