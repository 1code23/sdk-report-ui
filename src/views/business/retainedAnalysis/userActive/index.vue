<template>
  <div>
    <BlockContent>
      <Header style="margin-bottom: -20px">
        <div class="header-title" slot="l">
          <span class="title">用户活跃度 </span>
          <el-popover placement="bottom-start" width="400" trigger="hover">
            <div style="width: 400px">
              <span class="titleBlue">15日活跃成分：</span> <br /><br />
              过去15日活跃用户是将过去15天（含当天）的活跃用户去重。<br />

              报表展现每个天级时间点的过去15日活跃用户的活跃程度。<br />

              将过去15日活跃用户按照过去15天（含当天）启动的天数分为1至15组，计数并展示。<br />

              活跃1天的用户，表示这个用户在过去15天中仅有1天启动；<br />

              活}跃2天的用户，表示这个用户在过去15天中仅有2天启动；<br />

              …
              <br />
              活跃15天的用户，表示这个用户在过去15天中15天都启动了。<br />

              活跃天数越多的用户，其活跃程度越高，对APP的价值越大<br />
            </div>
            <i
              slot="reference"
              class="el-icon-question"
              style="color: #5faefd"
            ></i>
          </el-popover>
        </div>
      </Header>
    </BlockContent>
    <BlockContent>
      <el-tabs v-model="activeName" style="margin-top: -20px">
        <el-tab-pane label="当日活跃成分" name="1"></el-tab-pane>
        <el-tab-pane label="15日活跃成分" name="2"></el-tab-pane>
      </el-tabs>
      <Header>
        <el-row type="flex" align="middle" slot="l" :gutter="20">
          <el-col>
            <Tab :activeId.sync="queryModel.remain_type" :list="tabOptions" />
          </el-col>
          <el-col>
            <div class="slider">
              <el-checkbox v-model="sliderDisabled" size="mini"
                >用户成分分析：</el-checkbox
              >
              <el-slider
                style="width: 200px; margin-left: 10px; margin-top: -10px"
                :disabled="!sliderDisabled"
                input-size="mini"
                v-model="sections"
                range
                :marks="marks"
                :min="1"
                :max="15"
                @input="handleSlider"
              >
              </el-slider>
            </div>
          </el-col>
        </el-row>
      </Header>
      <div id="container"></div>
    </BlockContent>
  </div>
</template>
<script>
import { BlockContent, Header, Tab } from "@/components/BlockContent/index.js";
import EchartsMixins from "./mixins/EchartsMixins";
import {
  getUserActivity,
  getUserActivityIngredient,
} from "@/api/retainedAnalysis";
export default {
  mixins: [EchartsMixins],
  components: { BlockContent, Header, Tab },
  watch: {
    activeName() {
      this.fetchList();
    },
  },
  data() {
    return {
      activeName: "1",
      sections: [1, 7],
      sliderDisabled: false,
      marks: {
        1: "1",
        5: "5",
        10: "10",
        15: "15",
      },
      queryModel: {
        page: 1,
        size: 1000,
        carryApp: true,
        remain_type: "value",
        start_date: "2021-12-04",
        end_date: "2021-12-28",
      },
      tabOptions: [
        {
          id: "value",
          title: "绝对值",
        },
        {
          id: "rate",
          title: "百分比",
        },
      ],
      tableData: [],
    };
  },
  mounted() {
    this.fetchList();
  },
  methods: {
    fetchList() {
      let that = this;
      let obj = { ...this.queryModel };
      delete obj.remain_type;
      if (this.activeName == "1") {
        getUserActivity(obj).then((res) => {
          getData(res);
        });
      } else {
        getUserActivityIngredient(obj).then((res) => {
          getData(res);
        });
      }
      function getData(res) {
        if (res.data) {
          const { list } = res.data;
          that.tableData = list;
          console.log(list);
          that.handleG2Data(list);
        }
      }
    },
    handleSlider(val) {
      console.log(val);
    },
  },
};
</script>
<style lang="scss">
.slider {
  .el-slider__runway {
    transform-origin: 0 0;
    transform: scale(0.8);
  }
}
</style>
<style lang="scss" scope>
.export {
  color: #409eff;
  cursor: pointer;
  user-select: none;
  font-size: 13px;
}
.slider {
  display: flex;
  align-items: center;
}
</style>
