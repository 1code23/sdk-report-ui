<template>
  <div>
    <BlockContent>
      <Header style="margin-bottom: -20px">
        <div class="header-title" slot="l">
          <span class="title">用户新鲜度 </span>
          <el-popover placement="bottom-start" width="400" trigger="hover">
            <div style="width: 400px">
              报表展示每天活跃用户的成分构成，并提供用户成分分析控件做进一步的分析。用户新鲜度帮您从宏观上了解每日启动用户的新老用户比以及来源结构。
              <br />
              某日的活跃用户来源于当天新增用户、1天前新增用户...30天前新增用户、30+天前新增用户。其中当天新增用户与您在当日的推广行为相关，n天前新增用户与n日前的新增用户和n日留存率有关。
            </div>
            <i
              slot="reference"
              class="el-icon-question"
              style="color: #ccc"
            ></i>
          </el-popover>
        </div>
      </Header>
    </BlockContent>
    <BlockContent>
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
                :max="30"
                @input="handleSlider"
              >
              </el-slider>
            </div>
          </el-col>
        </el-row>
        <!-- <el-row type="flex" align="middle" slot="r" :gutter="10">
          <el-col>
            <div class="export"><i class="el-icon-document"></i> 导出</div>
          </el-col>
        </el-row> -->
      </Header>
      <div id="container"></div>
    </BlockContent>
  </div>
</template>
<script>
import { BlockContent, Header, Tab } from "@/components/BlockContent/index.js";
import EchartsMixins from "./mixins/EchartsMixins";
import { getUserFreshness } from "@/api/retainedAnalysis";
export default {
  mixins: [EchartsMixins],
  components: { BlockContent, Header, Tab },
  data() {
    return {
      sections: [0, 7],
      sliderDisabled: false,
      marks: {
        0: "0",
        10: "10",
        20: "20",
        30: "30",
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
      let obj = { ...this.queryModel };
      delete obj.remain_type;
      getUserFreshness(obj).then((res) => {
        if (res.data) {
          const { list } = res.data;
          this.tableData = list;
          console.log(list);
          this.handleG2Data(list);
        }
      });
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
