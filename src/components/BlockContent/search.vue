<template>
  <div class="block-search">
    <el-row :gutter="10" type="flex" :justify="justify">
      <el-col :span="3" v-if="isShowFormType('date_radio')">
        <el-date-picker
          style="width: 100%; height: 90%"
          v-model="queryModel.any_date"
          type="date"
          @change="search"
          placeholder="选择日期"
          :clearable="false"
        >
        </el-date-picker>
      </el-col>
      <el-col :span="5" v-if="isShowFormType('custom_date')">
        <el-date-picker
          style="width: 100%; height: 90%"
          v-model="queryModel.custom_date"
          :format="showTxtCustom"
          type="date"
          @change="search"
          placeholder="选择日期"
          :clearable="false"
          :picker-options="{
            disabledDate: (time) => {
              var startDate = new Date();
              var year = startDate.getFullYear();
              startDate = startDate.setFullYear(year - 2);
              return startDate > time.getTime() || time.getTime() > new Date();
            },
          }"
        >
          <!-- 限制之前两年 -->
          <!-- return time.getTime() > Date.now() - 8.64e7; -->
        </el-date-picker>
      </el-col>
      <el-col :span="3" v-if="isShowFormType('date')" style="min-width: 250px">
        <el-date-picker
          style="width: 100%; height: 90%"
          v-model="queryModel.date"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          @change="search"
          :clearable="false"
          unlink-panels
          :picker-options="pickerOptions"
        >
          <!-- :picker-options="{
            disabledDate: (time) => {
              return time.getTime() > Date.now() - 8.64e6;
            },
          }" -->
          <!-- return time.getTime() > Date.now() - 3600 * 1000 * 24; -->
          <!-- selectableRange: selectTimeRange, -->
        </el-date-picker>
      </el-col>
      <el-col :span="3" v-if="isShowFormType('channel')">
        <el-select
          style="width: 100%"
          @change="search($event, 'channel')"
          v-model="queryModel.app_channel"
          placeholder="请选择"
          :disabled="!showChVe"
          filterable
        >
          <el-option
            v-for="(item, index) in options_channel"
            :key="index"
            :label="item.label"
            :value="item.app_channel"
          >
          </el-option>
        </el-select>
      </el-col>
      <el-col :span="3" v-if="isShowFormType('versions')">
        <el-select
          style="width: 93%; height: 90%"
          @change="search"
          v-model="queryModel.app_vname"
          placeholder="请选择"
          :disabled="!showChVe"
          filterable
        >
          <el-option
            v-for="(item, index) in options_vname"
            :key="index"
            :label="item.label"
            :value="item.app_vname"
          >
          </el-option>
        </el-select>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import moment from "moment";
import { mapGetters } from "vuex";
import { getAppVname } from "@/api/common.js";
export default {
  name: "blockSearch",
  computed: {
    ...mapGetters(["appInfo"]),
  },
  props: {
    type: {
      type: Array,
      default: () => {
        return ["date", "channel", "versions"];
      },
    },
    justify: {
      type: String,
      default: "start",
    },
    showChVe: {
      type: Boolean,
      default() {
        return true;
      },
    },
    customDayNum: {
      type: Number,
      default: 0,
    },
  },
  computed: {
    showTxtCustom() {
      let date = this.queryModel.custom_date;
      return (
        adr.mom(date).add(this.customDayNum, "days").format("YYYY-MM-DD") +
        "~" +
        adr.mom(date).format("YYYY-MM-DD")
      );
    },
  },
  watch: {
    // 监听全局的appid改变时
    "appInfo.app_appid"(val) {
      console.log(val);
      if (val && this.routePath === this.$route.path) {
        this.options_channel = this.$options.data().options_channel;
        this.options_vname = this.$options.data().options_vname;
        this.init();
      }
    },
    // 监听全局的appid改变时
    async "queryModel.app_channel"(val) {
      if (val) {
        this.options_vname = this.$options.data().options_vname;
        this.queryModel.app_vname = "all";
        const app_vname = await this.getAppVname();
        this.options_vname = this.options_vname.concat(app_vname);
      }
    },
    "queryModel.app_vname"(val) {
      console.log(val);
    },
  },
  data() {
    return {
      routePath: "",
      queryModel: {
        // date: ["2021-12-04T16:00:00.000Z", "2022-01-26T16:00:00.000Z"],
        date: [new Date().getTime() - 7 * 24 * 60 * 60 * 1000, new Date()],
        app_vname: "all",
        app_channel: "all",
        any_date: new Date() - 24 * 60 * 60 * 1000, //单选日期
        custom_date: new Date() - 24 * 60 * 60 * 1000,
      },
      options_vname: [
        {
          app_vname: "all",
          label: "全部版本",
        },
      ],
      options_channel: [
        {
          app_channel: "all",
          label: "全部渠道",
        },
      ],
      pickerOptions: {
        shortcuts: [
          {
            text: "今天",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 0);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "昨天",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 1);
              end.setTime(end.getTime() - 3600 * 1000 * 24 * 1);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "过去7天",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              end.setTime(end.getTime() - 3600 * 1000 * 24 * 1);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "过去30天",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              end.setTime(end.getTime() - 3600 * 1000 * 24 * 1);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "过去60天",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              end.setTime(end.getTime() - 3600 * 1000 * 24 * 1);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "过去90天",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              end.setTime(end.getTime() - 3600 * 1000 * 24 * 1);
              picker.$emit("pick", [start, end]);
            },
          },
        ],
        disabledDate: (time) => {
          // return time.getTime() > Date.now() - 8.64e6;
          // 限制之前两年
          var startDate = new Date();
          var year = startDate.getFullYear();
          startDate = startDate.setFullYear(year - 2);
          return startDate > time.getTime() || time.getTime() > new Date();
          // 限制之前两年
        },
      },
    };
  },
  created() {
    this.init();
    this.routePath = this.$route.path;
    // console.log(this.routePath);
  },
  methods: {
    async init() {
      const appChannelList = await this.$store.dispatch("app/getAppChannel");
      const appVnameList = await this.$store.dispatch("app/getAppVname");
      this.options_channel = [...this.options_channel, ...appChannelList];
      this.options_vname = [...this.options_vname, ...appVnameList];
      this.search();
    },
    getAppVname() {
      return new Promise((resolve, reject) => {
        return getAppVname({
          app_channel: this.queryModel.app_channel,
        })
          .then((res) => {
            let list = [];
            if (res.data.list) {
              list = res.data.list.map((item) => {
                item.label = item.app_vname;
                return item;
              });
            }
            resolve(list);
          })
          .catch((err) => {
            reject([]);
          });
      });
    },
    search(val, type) {
      let params = { ...this.queryModel };
      if (params.date.length) {
        params.start_date = moment(params.date[0]).format("YYYY-MM-DD");
        params.end_date = moment(params.date[1]).format("YYYY-MM-DD");
      }
      params.any_date = moment(params.any_date).format("YYYY-MM-DD");
      params.custom_date = moment(params.custom_date).format("YYYY-MM-DD");
      //切换渠道时，版本号需要重置
      if (type === "channel") {
        params.app_vname = "all";
      }
      this.$emit("search", params);
    },
    isShowFormType(type) {
      return this.type.findIndex((t) => t === type) >= 0;
    },
  },
};
</script>

<style lang="scss" scoped>
/deep/.el-input {
  height: 30px;
}
/deep/.el-input--small .el-input__inner {
  height: 30px;
  line-height: 30px;
}
/deep/ .el-input--small {
  font-size: 12px;
}
/deep/ .el-range-editor--small .el-range-input {
  cursor: pointer !important;
}
/deep/.el-input--small .el-input__inner {
  cursor: pointer !important;
}
</style>
<style>
.el-picker-panel__shortcut {
  background: #e6f7ff;
  color: #1890ff;
  display: flex;
  justify-content: center;
  width: 72%;
  margin: 5px auto;
  border: 1px solid #91d5ff;
  padding: 0 5px;
  font-size: 12px;
}
.el-picker-panel__sidebar {
  width: 97px;
}
.el-picker-panel__sidebar {
  padding-top: 0;
}
</style>
