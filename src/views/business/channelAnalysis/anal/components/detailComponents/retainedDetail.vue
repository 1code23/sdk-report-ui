<template>
  <div class="retainedDetail">
    <Header>
      <div slot="l">
        <span class="fz16 fw7">渠道新增留存明细</span>
      </div>
      <div slot="r">
        <span
          class="timeBtn fw7 pointer"
          :class="{ colorB: dateVal === -8 }"
          @click="time(-8)"
          >过去7天</span
        >
        <span
          class="timeBtn fw7 pointer"
          :class="{ colorB: dateVal === -31 }"
          @click="time(-31)"
          >过去30天</span
        >
        <span
          class="timeBtn fw7 pointer"
          :class="{ colorB: valueType === 'rate' }"
          @click="changeValType('rate')"
          >留存率</span
        >
        <span
          class="timeBtn fw7 pointer"
          :class="{ colorB: valueType === 'value' }"
          @click="changeValType('value')"
          >留存数</span
        >
        <span class="pointer blueHover colorGrey fw7" @click="downTable">
          <i class="el-icon-document"></i>导出数据
        </span>
      </div>
    </Header>
    <pdPanel style="margin-bottom: 16px">
      <el-table
        :data="tableData"
        :header-cell-style="{ background: '#F7F8FA', fontWeight: '700' }"
        class="analDetailTable"
        :cell-class-name="cellClassName"
        style="width: 100%"
        header-row-class-name="headerRow fw7"
        id="retainedDetailTable"
      >
        <el-table-column
          v-for="item in columns"
          :key="item.key ? item.key : item.slot"
          :prop="item.key"
          :label="item.label"
          :align="item.align"
        >
          <template slot-scope="scope" >
            <span style="margin-left: 10px" v-if="valueType == 'rate'">{{ scope.row[item.key] }}%</span>
            <span style="margin-left: 10px" v-else>{{ scope.row[item.key] }}</span>
          </template>
        </el-table-column>
      </el-table>
    </pdPanel>
  </div>
</template>

<script>
import {
  pdPanel,
  Header,
  contractionDetail,
} from "@/components/greyPanel/index.js";
import detailTable from "./detailTable.vue";
import { getNewUserRemain } from "@/api/retainedAnalysis";
import { mapGetters } from "vuex";
export default {
  components: {
    pdPanel,
    Header,
    contractionDetail,
    detailTable,
  },
  computed: {
    ...mapGetters(["appInfo", "appChannelList", "appVnameList"]),
  },
  data() {
    return {
      dateRange: [],
      tableData: [
        {
          pt: "2022-12-01",
          new_cnt: "张三",
          remain_1_cnt: "1",
          remain_2_cnt: "2",
          remain_3_cnt: "3",
          remain_4_cnt: "4",
          remain_5_cnt: "5",
          remain_6_cnt: "6",
          remain_7_cnt: "7",
          remain_14_cnt: "8",
          remain_30_cnt: "9",
        },
      ],
      columns: [
        {
          label: "时间",
          key: "pt",
          align: "",
        },
        {
          label: "渠道新增用户数",
          key: "new_cnt",
          align: "",
        },
        {
          label: "1天后",
          key: "remain_1_cnt",
          align: "right",
        },
        {
          label: "2天后",
          key: "remain_2_cnt",
          align: "right",
        },
        {
          label: "3天后",
          key: "remain_3_cnt",
          align: "right",
        },
        {
          label: "4天后",
          key: "remain_4_cnt",
          align: "right",
        },
        {
          label: "5天后",
          key: "remain_5_cnt",
          align: "right",
        },
        {
          label: "6天后",
          key: "remain_6_cnt",
          align: "right",
        },
        {
          label: "7天后",
          key: "remain_7_cnt",
          align: "right",
        },
        {
          label: "14天后",
          key: "remain_14_cnt",
          align: "right",
        },
        {
          label: "30天后",
          key: "remain_30_cnt",
          align: "right",
        },
      ],
      dateVal: -8,
      valueType: "rate",
    };
  },
  mounted() {
    (this.nowDate = adr.mom(new Date()).format("YYYY/MM/DD")),
      (this.dateRange = [
        adr.mom(new Date()).add(-8, "days").format("YYYY-MM-DD"),
        adr.mom(new Date()).add(-1, "days").format("YYYY-MM-DD"),
      ]);
    this.init();
  },
  methods: {
    init() {
      this.getData();
    },
    async getData() {
			this.tableData=[]
      let params = {
        start_date: this.dateRange[0],
        end_date: this.dateRange[1],
        app_appid: this.appInfo.app_appid,
        app_channel: this.$route.params.id,
        app_vname: "all",
        remain_type: this.valueType,
        page: 1,
        size: 5000,
      };
      getNewUserRemain(params).then((res) => {
        let list = res.data.list;
        console.log(list);
        if (res) {
          this.tableData = list ? list : [];
        }
      });
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
    time(val) {
      this.dateVal = val;
      (this.nowDate = adr.mom(new Date()).format("YYYY/MM/DD")),
        (this.dateRange = [
          adr.mom(new Date()).add(val, "days").format("YYYY-MM-DD"),
          adr.mom(new Date()).add(-1, "days").format("YYYY-MM-DD"),
        ]);
      this.getData();
    },
    changeValType(val) {
      this.valueType = val;
      this.getData();
    },
		downTable(){
			adr.utils.downTableCusName("retainedDetailTable", "渠道新增留存明细");
		}
  },
};
</script>
<style lang="scss" scoped>
.retainedDetail {
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
  .timeBtn {
    display: inline-block;
    height: 20px;
    margin: 0;
    padding: 0 15px;
    color: #252934;
    line-height: 20px;
    &:hover {
      color: #3b82fe;
    }
  }
  .colorB {
    color: #3b82fe;
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