<template>
  <div>
    <!-- <BlockContent>
      <div class="t-title">
        <p>上午好</p>
        <p class="hint">今天是陪你度过的第2131天</p>
      </div>
    </BlockContent> -->
    <div class="tab-list" style="margin-top: 20px">
      <div class="tab-item" v-for="item in tabList" :key="item.title">
        <img class="back-img" :src="item.backImgUrl" alt="" />
        <div class="item">
          <div class="title">
            <i
              class="iconfont icon-bim_diyirencheng"
              style="font-size: 1.5rem; opacity: 0.8"
            ></i>
            {{ item.title }}
            <el-popover placement="top-start" width="250" trigger="hover">
              <p class="hint">{{ item.hint }}</p>
              <i class="el-icon-warning" slot="reference"></i>
            </el-popover>
          </div>
          <p>
            今日 <span class="num">{{ item.today | toThousands }}</span>
          </p>
          <p>
            昨日 <span class="num">{{ item.yesterday | toThousands }}</span>
          </p>
        </div>
      </div>
    </div>
    <BlockContent>
      <Header>
        <div slot="l" class="header-title">
          <span class="title">应用列表</span>
          <el-popover placement="top-start" width="400" trigger="hover">
            <div class="hint">
              展示了应用全体及分组的明细数据；支持应用置顶；在管理页面可进行应用分组。
            </div>
            <i slot="reference" class="el-icon-info" style="color: #ccc"></i>
          </el-popover>
        </div>
        <div slot="r">
          <Tab :list="optionList" :activeId="1" :border="false" />
        </div>
      </Header>
      <el-table
        :header-cell-style="{
          background: '#F7F8FA',
        }"
        :data="tableData"
        style="width: 100%"
      >
        <!-- <el-table-column prop="UseTime" label="平台"> </el-table-column> -->
        <el-table-column prop="app_name" label="应用名">
          <template slot-scope="{ row }">
            <span @click="toSkip(row)" class="link">{{ row.app_name }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="today_new_count" label="今日新增用户">
          <template slot-scope="{ row }">
            <span>{{ row.today_new_count | toThousands }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="yesterday_new_count" label="昨日新增用户">
          <template slot-scope="{ row }">
            <span>{{ row.yesterday_new_count | toThousands }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="today_active_cnt" label="今日活跃用户">
          <template slot-scope="{ row }">
            <span>{{ row.today_active_cnt | toThousands }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="yesterday_active_cnt" label="昨日活跃用户">
          <template slot-scope="{ row }">
            <span>{{ row.yesterday_active_cnt | toThousands }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="today_launch_count" label="今日启动次数">
          <template slot-scope="{ row }">
            <span>{{ row.today_launch_count | toThousands }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="yesterday_launch_count" label="昨日启动次数">
          <template slot-scope="{ row }">
            <span>{{ row.yesterday_launch_count | toThousands }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="today_sum_user" label="今日累计用户">
          <template slot-scope="{ row }">
            <span>{{ row.today_sum_user | toThousands }}</span>
          </template>
        </el-table-column>
      </el-table>
      <el-row type="flex" justify="end" style="margin-top: 20px">
        <Pagination
          v-show="queryModel.total > 0"
          :total="queryModel.total"
          :page.sync="queryModel.page"
          :limit.sync="queryModel.size"
          @pagination="fetchList"
        />
      </el-row>
    </BlockContent>
  </div>
</template>

<script>
import {
  BlockContent,
  Header,
  Search,
  Tab,
} from "@/components/BlockContent/index.js";
import Pagination from "@/components/Pagination";
import { getAppList } from "@/api/common";
import { Base64 } from "js-base64";
import { allAppid } from "@/api/product";
export default {
  components: { BlockContent, Header, Tab, Pagination },
  data() {
    return {
      sumAppids: [],
      tabList: [
        {
          title: "新增用户",
          icon: "",
          today: 0,
          yesterday: 0,
          hint: "第一次启动应用的用户（App以设备为判断标准）。",
          backImgUrl:
            "https://img.alicdn.com/tfs/TB1z6Vhc8FR4u4jSZFPXXanzFXa-512-272.png",
        },
        {
          title: "活跃用户",
          icon: "",
          today: 0,
          yesterday: 0,
          hint: "启动过应用用户（去重），启动过一次的用户即视为活跃用户，包括新用户与老用户。",
          backImgUrl:
            "https://img.alicdn.com/tfs/TB1rA_Tek9l0K4jSZFKXXXFjpXa-512-272.png",
        },
        {
          title: "启动次数",
          icon: "",
          today: 0,
          yesterday: 0,
          hint: "截止至统计时间，应用的总启动次数。",
          backImgUrl:
            "https://img.alicdn.com/tfs/TB1iaAjbIVl614jSZKPXXaGjpXa-512-272.png",
        },
        {
          title: "累计用户",
          icon: "",
          today: 0,
          yesterday: 0,
          hint: "截止至统计时间，启动过应用的所有独立用户。",
          backImgUrl:
            "https://img.alicdn.com/tfs/TB198wmX5DsXe8jSZR0XXXK6FXa-512-272.png",
        },
      ],
      optionList: [
        {
          id: 1,
          title: "全部应用",
        },
        {
          id: 2,
          title: "应用分组",
          disabled: true,
        },
      ],
      queryModel: {
        total: 0,
        page: 1,
        size: 30,
      },
      tableData: [],
    };
  },
  created() {
    this.fetchList();
  },
  methods: {
    fetchList() {
      allAppid(this.queryModel).then((res) => {
        const { list, count, sumAppid } = res.data;
        this.queryModel.total = count;
        this.tableData = list;
        if (!this.sumAppids.length) {
          this.sumAppids = sumAppid;
          const object = sumAppid[0];
          for (const key in object) {
            switch (key) {
              case "today_new_count":
                this.tabList[0].today = object[key];
                break;
              case "yesterday_new_count":
                this.tabList[0].yesterday = object[key];
                break;
              case "today_active_cnt":
                this.tabList[1].today = object[key];
                break;
              case "yesterday_active_cnt":
                this.tabList[1].yesterday = object[key];
                break;
              case "today_launch_count":
                this.tabList[2].today = object[key];
                break;
              case "yesterday_launch_count":
                this.tabList[2].yesterday = object[key];
                break;
              case "today_sum_user":
                this.tabList[3].today = object[key];
                break;
              case "yesterday_sum_user":
                this.tabList[3].yesterday = object[key];
                break;
              default:
                break;
            }
          }
        }
      });
    },
    toSkip(row) {
      let params = Base64.encode(JSON.stringify(row));
      let url = window.location.origin;
      url = `${url}/#/business/general/overallTrend?app=${params}`;
      window.open(url, "_blank");
    },
  },
};
</script>

<style lang="scss" scoped>
.hint {
  font-size: 12px !important;
  color: #6b798e !important;
}
.link {
  color: #3b82fe;
  cursor: pointer;
}
.t-title {
  p {
    font-size: 13px;
    line-height: 20px;
    color: #252934;
  }
}
.tab-list {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
  .tab-item {
    width: calc(100% / 4 - 10px);
    height: 136px;
    padding: 20px;
    box-sizing: border-box;
    color: white;
    border-radius: 2px;
    position: relative;
    .item {
      position: relative;
      z-index: 5;
    }
    .title {
      font-size: 16px;
      line-height: 24px;
      margin-bottom: 10px;
    }
    p {
      font-size: 14px;
      margin-bottom: 10px;
    }
    .num {
      margin-left: 5px;
      font-size: 24px;
      font-weight: 500;
      font-family: AlibabaSans102-Bd, Tahoma, Arial, sans-serif !important;
    }
    .back-img {
      position: absolute;
      height: 100%;
      right: 0;
      top: 0;
      pointer-events: none;
    }
  }
  .tab-item:nth-child(1) {
    background-image: linear-gradient(-45deg, #4bb1ff 0%, #1d6eff 100%);
  }
  .tab-item:nth-child(2) {
    background-image: linear-gradient(134deg, #ff8814 0%, #ffaf38 100%);
  }
  .tab-item:nth-child(3) {
    background-image: linear-gradient(-45deg, #40cee1 0%, #17a0f5 100%);
  }
  .tab-item:nth-child(4) {
    background-image: linear-gradient(-45deg, #538efd 0%, #6d5afe 100%);
  }
}
</style>
