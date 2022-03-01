<template>
  <div class="configWrap">
    <configTable @init="init" :menu="menu"></configTable>
  </div>
</template>

<script>
import configTable from "@/views/configMenu/configTable.vue";
export default {
  data() {
    return {
      menu: [],
    };
  },
  components: {
    configTable,
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      this.$http("get", "/menu/all").then(({ data }) => {
        this.initMenu(data.data);
        this.menu = data.data;
      });
    },
    initMenu(menu, Oindex = 0) {
      menu.forEach((item) => {
        item.comType = "button";
        item.nextcomType = "button";
        if (Oindex < 3) {
          item.comType = "page";
        }
        if (Oindex < 2) {
          item.nextcomType = "page";
        }

        if (item.sub) {
          this.initMenu(item.sub, Oindex + 1);
        }
      });
    },
  },
};
</script>

<style lang="scss">
body {
  background: white;
}
.configWrap {
  padding: 100px;
}
</style>
