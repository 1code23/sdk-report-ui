<template>
  <div class="newUser">
    <BlockContent>
      <Header>
        <div class="header-title" slot="l">
          <span class="title"
            >版本分布
            <el-popover placement="bottom-start" width="360" trigger="hover">
              <p>新增用户：第一次启动应用的用户（以设备为判断标准）</p>
              <p>新增账号：第一次启动应用的账号</p>
              <p>新增用户占比：某时段内新增用户占该时段活跃用户的比例</p>
              <p>
                按天、周或月查看数据可进行版本、渠道的交叉筛选，小时数据最多展示7天并且不支持筛选。周区间定义为周日至次周周六。按周（按月）显示时，界面上用每周的周日（每个月的第一日）来代表该周（该月）
              </p>
              <i class="el-icon-question" slot="reference"></i> </el-popover
          ></span>
        </div>
      </Header>
      <Search @search="search" :type="['date', 'versions']" />
    </BlockContent>
    <Contentpanel>
      <template v-slot:header>
        <p class="pageTitle mb10">
          Top10版本
          <el-popover placement="bottom-start" width="360" trigger="hover">
            <p>新增用户：第一次启动应用的用户（以设备为判断标准）</p>
            <p>新增账号：第一次启动应用的账号</p>
            <p>新增用户占比：某时段内新增用户占该时段活跃用户的比例</p>
            <p>
              按天、周或月查看数据可进行版本、渠道的交叉筛选，小时数据最多展示7天并且不支持筛选。周区间定义为周日至次周周六。按周（按月）显示时，界面上用每周的周日（每个月的第一日）来代表该周（该月）
            </p>
            <i class="el-icon-question" slot="reference"></i>
          </el-popover>
        </p>
      </template>
      <template v-slot:main>
        <div class="tabBtn">
          <div class="selectTab">
            <el-radio-group v-model="tabPosition" style="margin-bottom: 30px">
              <el-radio-button label="1">新用户</el-radio-button>
              <el-radio-button label="2">活跃用户</el-radio-button>
              <el-radio-button label="3">启动次数</el-radio-button>
            </el-radio-group>
            <div class="selectChannel" v-show="showChannel">
              <el-select v-model="selectChannel" placeholder="请选择">
                <el-option
                  v-for="item in appChannelList"
                  :key="item.app_channel"
                  :label="item.label"
                  :value="item.app_channel"
                >
                </el-option>
              </el-select>
            </div>
          </div>
        </div>
        <echartstab
          class="echartAdduser"
          :xAxisData="xAxisData"
          :seriesData="seriesData"
          :showEchart="showEchart"
          ref="userActiveData"
        ></echartstab>
      </template>
    </Contentpanel>
    <div class="tabBtn">
      <!-- <el-radio-group v-model="tabPositionday" style="margin-bottom: 30px">
        <el-radio-button label="1">今日</el-radio-button>
        <el-radio-button label="2">昨日</el-radio-button>
      </el-radio-group> -->
      <div class="export" @click="ondown()">
        <el-link :underline="false" href="####" type="primary"
          ><i class="el-icon-document"></i>导出</el-link
        >
      </div>
    </div>
    <pageTable
      class="tb"
      :columns="columns"
      :tableData="tableData"
      @page-change="handleChangePage"
    >
      <template slot-scope="{ row }" slot="Cumulative_user_of_today_version">
        <span
          >{{ row.sum_ver_cnt }}({{
            row.Cumulative_user_of_today_version
          }}%)</span
        >
      </template>
      <template slot-scope="{ row }" slot="active_cnt">
        <span>{{ row.active_cnt }}({{ row.Active_user_ratio }}%)</span>
      </template>
    </pageTable>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import {
  BlockContent,
  Header,
  Search,
} from "@/components/BlockContent/index.js";
import Contentpanel from "@/components/Contentpanel";
import pageTable from "@/components/echartsUserAnalysis/PageTable";
import echartstab from "@/components/echartsUserAnalysis/echarttab2";
import { getVersionLisst, getVersionTopLisst } from "@/api/user.js";
export default {
  components: {
    BlockContent,
    Header,
    Search,
    Contentpanel,
    pageTable,
    echartstab,
  },
  data() {
    return {
      queryModel: {
        carryApp: true,
        page: "1",
        size: "10",
      },
      showEchart: true,
      tabPosition: "1",
      tabPositionday: "1",
      dateRange: [new Date(), new Date()],
      tableData: {
        page: 1,
        size: 10,
        count: 0,
        list: [],
      },
      columns: [
        { key: "pt", label: "日期", align: "left" },
        { key: "app_vname", label: "版本", align: "left" },
        {
          slot: "Cumulative_user_of_today_version",
          label: "截至今日版本累计用户",
          align: "right",
        },
        {
          key: "sum_ver_cnt",
          label: "累计用户",
          align: "right",
        },
        { key: "new_cnt", label: "新增用户", align: "right" },
        { slot: "active_cnt", label: "活跃用户", align: "right" },
        { key: "lunch_cnt", label: "启动次数", align: "right" },
        { key: "upgrade_cnt", label: "升级用户", align: "right" },
      ],

      channel: "",
      version: "",
      seriesData: [],
      xAxisData: [],
      n: [], //新增用户数组
      l: [], //启动次数数组
      a: [], //活跃数组
      obj4: [],
      obj5: [],
      obj6: [],
      selectChannel: "", //选中的渠道
      showChannel: false,
    };
  },
  methods: {
    //一个数组分割多个数组
    group(array, subGroupLength) {
      let index = 0;
      let newArray = [];
      while (index < array.length) {
        newArray.push(array.slice(index, (index += subGroupLength)));
      }
      return newArray;
    },
    search(row) {
      this.queryModel = {
        ...this.queryModel,
        ...row,
        page: 1,
        size: 10,
        app_appid: this.appInfo.app_appid,
      };
      delete this.queryModel.date;
      delete this.queryModel.app_channel;
      console.log(this.queryModel, row);
      this.fetchList();
    },
    fetchList(res) {
      let verobj = { ...this.queryModel };
      verobj.app_channel = "all";
      delete verobj.any_date;
      getVersionLisst(verobj).then((res) => {
        console.log(res);
        this.tableData = res.data;
      });
      let par = { ...this.queryModel, size: "100000" };
      delete par.app_vname;
      delete par.any_date;
      getVersionTopLisst(par).then((res) => {
        console.log(res);
        // let pt = res.data.ptList.reverse(); //x轴坐标时间
        let pt = res.data.ptList; //x轴坐标时间
        let appVname = []; //前十个版本数组
        let lunchArray = []; //启动次数
        let activeArray = []; //活跃次数
        let newArray = []; //新增次数
        res.data.appVname.forEach((item) => {
          appVname.push(item.app_vname);
        });
        this.obj4 = [];
        this.obj5 = [];
        this.obj6 = [];
        //得到版本数组
        console.log(appVname);
        console.log(res.data.list);
        if (res.data.list) {
          let newArrList = [];
          for (let i = res.data.list.length - 1; i >= 0; i--) {
            newArrList[newArrList.length] = res.data.list[i];
          }
          console.log(newArrList);
          appVname.forEach((item1) => {
            newArrList.forEach((item) => {
              if (item.app_vname == item1) {
                lunchArray.push(item.lunch_cnt);
                activeArray.push(item.active_cnt);
                newArray.push(item.new_cnt);
              }
            });
          });
        }
        //得到版本数据
        let l = this.group(lunchArray, pt.length);
        let a = this.group(activeArray, pt.length);
        let n = this.group(newArray, pt.length);
        console.log(l);
        console.log(a);
        console.log(n);
        for (let i = 0; i < appVname.length; i++) {
          this.obj4.push({ name: appVname[i], type: "line", data: l[i] });
          this.obj5.push({
            name: appVname[i],
            type: "line",
            data: a[i],
          });
          this.obj6.push({ name: appVname[i], type: "line", data: n[i] });
        }
        if (pt.length == 0) {
          this.showEchart = false;
        } else {
          this.showEchart = true;
        }
        // this.xAxisData = pt.reverse();
        this.xAxisData = pt;
        if (this.tabPosition == "1") {
          this.seriesData = this.obj6;
        } else if (this.tabPosition == "2") {
          this.seriesData = this.obj5;
        } else if (this.tabPosition == "3") {
          this.seriesData = this.obj4;
        }
      });
    },
    handleChangePage({ page, size }) {
      this.queryModel.page = page;
      this.queryModel.size = size;
      this.fetchList();
    },
    ondown() {},
  },
  computed: {
    ...mapGetters(["appInfo", "appChannelList"]),
  },
  watch: {
    tabPosition: {
      handler(newVal, oldVal) {
        if (newVal == 1) {
          this.seriesData = this.obj6;
        } else if (newVal == 2) {
          this.seriesData = this.obj5;
        } else if (newVal == 3) {
          this.seriesData = this.obj4;
        }
      },
      deep: true,
      immediate: true,
    },
  },
  created() {
    setTimeout(() => {
      console.log(this.appInfo, this.appChannelList);
    }, 1000);
  },
};
</script>

<style lang="scss" scoped>
.chartsWpper {
  width: 100%;
  height: 500px;
  background: white;
  // margin-top: -20px;
}
.mr17 {
  margin: 0 20px;
}
.tabBtn {
  padding: 20px 20px 0;
  background: white;
  span {
    font-size: 22px;
  }
  .selectTab {
    display: flex;
    justify-content: space-between;
  }
}
.echartAdduser {
  margin-top: -20px;
}
.tb {
  padding: 0 20px 10px;
  background: white;
}
</style>
