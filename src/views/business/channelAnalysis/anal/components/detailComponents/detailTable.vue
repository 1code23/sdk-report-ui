<template>
  <el-table
    :data="tableData"
    :header-cell-style="{ background: '#F7F8FA', fontWeight: '700' }"
    class="analDetailTable"
    :cell-class-name="cellClassName"
    style="width: 100%"
    header-row-class-name="headerRow fw7"
    id="useIntervalTable"
  >
    <el-table-column
      v-for="item in columns"
      :key="item.key ? item.key : item.slot"
      :prop="item.key"
      :label="item.label"
      :align="item.align"
    >
      <!-- <template slot-scope="scope">
        <span style="margin-left: 10px" v-if="item.key == 'SumCntRatio'"
          >{{ scope.row.SumCntRatio }}%</span
        >
        <span style="margin-left: 10px" v-else>{{ scope.row[item.key] }}</span>
      </template> -->
    </el-table-column>
  </el-table>
</template>

<script>
export default {
  data() {
    return {
      tableData: [
        {
          time: "2022-12-01",
          users: "张三",
          a: "1",
          b: "2",
          c: "3",
          d: "4",
          e: "5",
          f: "6",
          g: "7",
          h: "8",
          i: "9",
        },
      ],
      columns: [
        {
          label: "时间",
          key: "time",
          align: "",
        },
        {
          label: "渠道新增用户数",
          key: "users",
          align: "",
        },
        {
          label: "1天后",
          key: "a",
          align: "right",
        },
        {
          label: "2天后",
          key: "b",
          align: "right",
        },
        {
          label: "3天后",
          key: "c",
          align: "right",
        },
        {
          label: "4天后",
          key: "d",
          align: "right",
        },
        {
          label: "5天后",
          key: "e",
          align: "right",
        },
        {
          label: "6天后",
          key: "f",
          align: "right",
        },
        {
          label: "7天后",
          key: "g",
          align: "right",
        },
        {
          label: "14天后",
          key: "h",
          align: "right",
        },
        {
          label: "30天后",
          key: "i",
          align: "right",
        },
      ],
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      for (var i = 0; i < 10; i++) {
        let obj = {};
        Object.keys(this.tableData[0]).forEach((i) => {
          obj[i] = (Math.random() * 10 * 10).toFixed(2);
        });
        this.tableData.push(obj);
      }
    },
    cellClassName({ row, columnIndex, column }) {
      console.log();
      let key = column.property;
      let str = "";
      if (columnIndex > 1) {
        str += "borderCell ";
      }
      if (columnIndex > 1 && row[key] > 50) {
        str += "qianlan";
      }
      if (columnIndex > 1 && row[key] > 40 && row[key] < 50) {
        str += "qianlanhui";
      }
      return str;
    },
  },
};
</script>

<style lang="scss" scoped>
.analDetailTable.el-table {
  /deep/th.el-table__cell {
    > div {
      font-weight: 700;
    }
  }
  /deep/.el-table__cell {
    font-size: 12px;
    color: black;
    font-weight: 700;
    background: white;
    > div {
      line-height: 22px;
    }
  }
}
</style>
<style lang="scss" >
.qianlan {
  //负数
  background: #3b82fe99 !important;
  div {
    font-size: 12px;
  }
}
.qianlanhui {
  background: #b1cdff !important;
  div {
    font-size: 12px;
  }
}
.borderCell {
  border-right: 1px solid #ebeef5;
  border-bottom: 1px solid #ebeef5;
}
</style>