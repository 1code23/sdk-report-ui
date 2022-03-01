<template>
  <div>
    <el-row :gutter="10" type="flex">
      <el-col :span="9"></el-col>
      <el-col :span="4" v-if="isShowFormType('channel')">
        <el-select
          style="width: 100%"
          @change="search($event, 'channel')"
          v-model="queryModel.app_channel"
          placeholder="请选择"
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
      <el-col :span="4" v-if="isShowFormType('versions')">
        <el-select
          style="width: 100%"
          @change="search"
          v-model="queryModel.app_vname"
          placeholder="请选择"
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
      <el-col :span="7" v-if="isShowFormType('date')">
        <el-date-picker
          style="width: 100%"
          v-model="queryModel.date"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          unlink-panels
          :picker-options="pickerOptions"
          @change="search"
          :clearable="false"
        >
        </el-date-picker>
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
        return ["event", "date", "channel", "versions"];
      },
    },
  },
  watch: {
    // 监听全局的appid改变时
    "appInfo.app_appid"(val) {
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
  },
  data() {
    return {
      routePath: "",
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
      },
      queryModel: {
        // date: ["2021-12-04T16:00:00.000Z", "2022-01-26T16:00:00.000Z"],
        date: [new Date().getTime() - 7 * 24 * 60 * 60 * 1000, new Date()],
        app_vname: "all",
        app_channel: "all",
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
    };
  },
  created() {
    this.init();
    this.routePath = this.$route.path;
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

<style></style>
