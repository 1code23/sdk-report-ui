<template>
  <div>
    <BlockContent>
      <Header>
        <div class="header-title" slot="l">
          <span class="title">页面访问路径 </span>
        </div>
      </Header>
      <div class="disfr jsb">
        <div class="header_l">
          <el-select v-model="value" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </div>
        <div class="header_r disfr jsb ac">
          <div class="mr20"><el-button>昨日</el-button></div>
          <Header style="margin-bottom: -20px">
            <div slot="l">
              <el-date-picker
                type="week"
                :editable="false"
                :clearable="false"
                placeholder="选择日期"
                v-model="WeekValue"
                :format="weekTime"
                @change="changeweek"
                :picker-options="weekOption"
              ></el-date-picker>
            </div>
          </Header>
        </div>
      </div>
    </BlockContent>
    <!-- 访问路径 -->
    <Contentpanel>
      <template v-slot:header>
        <div class="disfr jsb ac">
          <p class="pageTitle mb10">
            访问路径
            <el-popover placement="bottom-start" width="360" trigger="hover">
              <p class="titleF">
                页面访问路径描述的是用户从打开到离开应用整个过程中每一步骤的页面访问、跳转情况。页面访问路径是全量统计。如果您在Android应用中使用了Fragment页面统计功能，这里的页面包括您指定统计的activity和Fragment。页面的高度表现该页面被访问的次数，同一页面在不同步骤中用相同的颜色进行展示。每一步骤中，页面节点按照访问次数大小从上往下排列，会显示每一步总的页面访问次数、占总访问次数比例以及前后两步之间的转化率。如果页面的总会话数达到50W上限，或者单版本会话数达到10W上限，会进行日志抽样处理。
              </p>
              <i
                class="el-icon-question"
                slot="reference"
                style="color: #5faefd"
              ></i>
            </el-popover>
          </p>
          <div class="disfr jsb">
            <!-- <Tab :activeId.sync="activeKind" :list="tabOption" /> -->
            <span
              class="tabBtn"
              :class="{ activeClass: activeKind == 1 }"
              @click="tabBtn(1)"
              >描述</span
            >
            <span
              class="tabBtn"
              :class="{ activeClass: activeKind == 2 }"
              @click="tabBtn(2)"
              >原名</span
            >
          </div>
        </div>
      </template>
    </Contentpanel>
    <div style="padding: 20px; background: white; box-sizing: border-box">
      <div class="echartMain">
        <div class="disfr">
          <div class="disfr" v-for="(item, index) in pageDta" :key="index">
            <div class="topHead_item">
              <h4 class="pageNum">{{ item.page }}</h4>
              <h2 class="pageData">{{ item.pageData }}</h2>
            </div>
            <div class="topHead_item topHead_item_symbol">
              <h4 class="pageNum">{{ item.pageSymbol }}</h4>
              <h2 class="pageData">{{ item.pageRate }}</h2>
            </div>
          </div>
          <div class="topHead_item pageView">
            <h4 class="pageNum">第5页</h4>
            <h2 class="pageData">666666</h2>
          </div>
        </div>
        <div id="pathEchart" class="pathEchart"></div>
      </div>
    </div>
    <!-- 访问详情 -->
    <Contentpanel style="margin-top: 20px">
      <template v-slot:header>
        <div class="disfr jsb ac">
          <p class="pageTitle mb10">
            访问详情
            <el-popover placement="bottom-start" width="360" trigger="hover">
              <p class="titleF">
                页面访问详情展示了用户使用每个页面的使用次数、访问时长以及跳转情况，这些数据可以帮助您分析每个页面的使用情况。
              </p>
              <p class="titleF">
                <span class="titleBlue">访问次数：</span
                >用户进入当前页面的总次数
              </p>
              <p class="titleF">
                <span class="titleBlue">访问次数占比：</span
                >当前页面访问次数占全部页面访问次数的比例
              </p>
              <p class="titleF">
                <span class="titleBlue">平均访问时长：</span
                >用户每次进入当前页面的平均停留时长
              </p>
              <p class="titleF">
                <span class="titleBlue">访问时长占比：</span
                >用户在当前页面停留时间总和占用户在全体页面停留的时间总和的比例
              </p>
              <p class="titleF">
                <span class="titleBlue">跳出率：</span
                >用户从当前页面离开应用的比例
              </p>
              <p class="titleF">
                <span class="titleBlue">跳转情况：</span
                >用户从当前页面进入其他页面的概率分布情况
              </p>
              <i
                class="el-icon-question"
                slot="reference"
                style="color: #5faefd"
              ></i>
            </el-popover>
          </p>
          <div class="disfr jsb">
            <span
              style="font-size: 14px; color: #3882fe"
              class="cur"
              @click="downTable('pathDetailTable')"
              ><i class="el-icon-document" style="margin-right: 5px"></i
              >导出</span
            >
          </div>
        </div>
      </template>
      <template v-slot:main>
        <div class="mainPage">
          <pageTable
            class="tb"
            :columns="columns"
            :tableData="tableData"
            @page-change="handleChangePage"
            id="pathDetailTable"
          >
            <template slot-scope="{ row }" slot="launch_count">
              <span>{{ toThousands(row.launch_count) }}</span>
            </template>
            <template slot-scope="{ row }" slot="startupratio">
              <span>{{ row.startupratio }}%</span>
            </template>
          </pageTable>
        </div>
      </template>
    </Contentpanel>
  </div>
</template>
<script>
import * as echarts from "echarts";
import Contentpanel from "@/components/Contentpanel";
import pageTable from "@/components/echartsUserAnalysis/PageTable";
import moment from "moment";
import {
  BlockContent,
  Header,
  Search,
  Tab,
} from "@/components/BlockContent/index.js";
import { downTable, getMon, getDateString, getDay } from "@/utils/index";
import myMinix from "./pagePathMinix";
export default {
  components: {
    BlockContent,
    Header,
    Search,
    Tab,
    Contentpanel,
    pageTable,
  },
  mixins: [myMinix],
  data() {
    return {
      getMon,
      weekTime: "",
      WeekValue: new Date(),
      weekOption: this.banWeek(),
      // custom_date: new Date() - 24 * 60 * 60 * 1000,
      custom_date: new Date(),
      queryModel: { page: 1, size: 10 },
      value: "",
      options: [
        {
          value: "1",
          label: "路径1",
        },
        {
          value: "2",
          label: "路径2",
        },
      ],
      value2: "",
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        },
        shortcuts: [
          {
            text: "今天",
            onClick(picker) {
              picker.$emit("pick", new Date());
            },
          },
        ],
      },
      activeKind: "1",
      tabOption: [
        {
          id: "1",
          title: "描述",
        },
        {
          id: "1",
          title: "原名",
        },
      ],
      columns: [
        { key: "pt", label: "页面(Activity/Fragment)", align: "left" },
        { key: "launch_count", label: "描述", align: "center" },
        { key: "launch_count1", label: "访问次数(占比)", align: "center" },
        { key: "startupratio", label: "平均访问时长(占比)", align: "center" },
        { key: "startupratio1", label: "跳出率", align: "center" },
      ],
      tableData: {
        page: 1,
        size: 10,
        count: 0,
        list: [{ pt: "Ac_Main", startupratio: "169,498" }],
      },
      downTable,
    };
  },
  methods: {
    //当前周的开始日期和结束日期
    changeweek(val) {
      let startTime = "";
      let endTime = "";
      startTime = getDateString(val.valueOf() - 86400000); // 时间戳转字符串
      endTime = getDateString(val.valueOf() + 5 * 86400000);
      this.weekTime =
        moment(startTime).format("YYYY-MM-DD") +
        "~" +
        moment(endTime).format("YYYY-MM-DD");
    },
    // 当前周不可选
    banWeek() {
      return {
        //将自然周的起始日改为周一开始
        firstDayOfWeek: 7,
        //禁止选择当前周
        disabledDate(time) {
          let day = Date.now();
          let limit = getMon(day);
          let limitTime = new Date(limit);
          return time.getTime() > limitTime.getTime() - 8.64e7;
        },
      };
    },
    search(val, type) {
      // let params = { ...this.queryModel };
      // params.custom_date = moment(params.custom_date).format("YYYY-MM-DD");
    },
    tabBtn(val) {
      this.activeKind = val;
    },
    handleChangePage({ page, size }) {
      this.queryModel.page = page;
      this.queryModel.size = size;
      // this.fetchList1();
    },
    handleWindowResize() {
      const main = document.getElementById("pathEchart");
      if (main) {
        this.myChart.resize();
      }
    },
  },
  activated() {
    window.addEventListener("resize", this.handleWindowResize);
  },
  deactivated() {
    window.removeEventListener("resize", this.handleWindowResize);
  },
  mounted() {
    const main = document.getElementById("pathEchart");
    this.myChart = echarts.init(main);
    this.myChart.setOption(this.option);
    window.addEventListener("resize", () => {
      this.handleWindowResize();
    });
  },
  created() {
    let date = new Date();
    if (this.banWeek()) {
      date = new Date(getDay(-7));
      this.WeekValue = date;
    } else {
      date = new Date();
    }
    date.setDate(date.getDate() - date.getDay() + 1);
    let begin =
      date.getFullYear() +
      "-" +
      (date.getMonth() + 1) +
      "-" +
      date.getDate() +
      " 00:00:00";
    // console.log(begin); //当前日期所在周的第一天
    this.changeweek(new Date(begin));
  },
};
</script>
<style lang="scss" scoped>
.tabBtn_l,
.tabBtn {
  padding: 8px 15px;
  display: inline-block;
  font-size: 13px;
  border: 1px solid #e1e4e8;
}
.activeClass {
  border: 1px solid #3b82fe;
}
.tb {
  margin-bottom: 30px;
  background: white;
  padding: 20px;
}
.echartMain {
  background: #fff;
  // margin-bottom: 20px;
  padding: 24px;
  box-sizing: border-box;
  overflow: auto;
  .pathEchart {
    width: 462px;
    // width: 1200px;
    height: 500px;
  }
  .topHead_item {
    width: 130px;
    height: 58px;
    background: #f5f5f5;
    color: #252934;
    padding-top: 7px;
    text-align: center;
    box-sizing: border-box;
    .pageNum {
      font-size: 14px;
      height: 20px;
    }
    .pageData {
      font-size: 20px;
      height: 20px;
    }
  }
  .topHead_item_symbol {
    width: 202px;
    padding-top: 10px;
    background: white;
    .pageNum {
      font-size: 20px;
    }
    .pageData {
      color: #04a7fe;
    }
  }
  .pageView {
    min-width: 130px;
  }
}
.header_l {
  width: 9%;
}
.el-date-editor.el-input {
  width: 210px;
}
</style>
<style>
.paneHeader {
  background: rgb(247, 248, 250) !important;
}
</style>
