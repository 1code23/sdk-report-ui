<template>
  <div>
    <div class="basicBoxHeader disfr jsb pad10 ac">
      <div class="basicHead_left">
        <span class="fwei cur basicHeadTitle" @click="goEvent"
          >自定义事件TOP 5</span
        ><span class="fwei"
          ><i class="el-icon-arrow-right" style="font-weight: 600"></i
        ></span>
      </div>
      <div class="basicHead_right disfr ac">
        <progressView style="margin-right: 8px"></progressView>
        <span>每五分钟更新</span>
      </div>
    </div>
    <div class="basicBoxMain">
      <div class="eventTitle disfr jsb ac">
        <span>事件名称</span>
        <span>触发次数</span>
      </div>
      <div
        class="eventList disfr jsb ac"
        v-for="(item, index) in eventArray"
        :key="index"
      >
        <div class="eventName">{{ item.event_name_cn }}</div>
        <div class="outBox">
          <div
            class="inBox"
            :style="{
              width: (item.trigger_cnt / eventArray[0].trigger_cnt) * 100 + '%',
            }"
          ></div>
        </div>
        <div class="eventNum" style="text-align: right">
          {{ item.trigger_cnt }}
        </div>
      </div>
    </div>
  </div>
</template>
<script>
// import { getBasicNorm } from "@/api/userEngagement";
import { mapGetters } from "vuex";
import progressView from "./components/progressView.vue";
import { getCustomEvent } from "@/api/real";
export default {
  components: { progressView },
  computed: {
    ...mapGetters(["appInfo"]),
  },
  data() {
    return {
      eventArray: [
        { event_name_cn: "xiaoh", data: "60", trigger_cnt: "20" },
        { event_name_cn: "xiaoh", data: "20", trigger_cnt: "20" },
      ],
    };
  },
  methods: {
    goEvent() {
      this.$router.push("/business/funct/CustomEvents");
    },
    getEventList() {
      getCustomEvent({ app_appid: this.appInfo.app_appid }).then((res) => {
        console.log(res);
        this.eventArray = res.data.list;
      });
    },
  },
  mounted() {
    this.getEventList();
  },
};
</script>
<style lang="scss" scoped>
.basicBoxHeader {
  background: rgb(247, 248, 250);
  .basicHeadTitle:hover {
    color: rgb(76, 141, 254);
  }
}
.basicHead_right {
  font-size: 12px;
  color: #6b798e;
}
.fwei {
  font-size: 16px;
  font-weight: 600;
}
.basicBoxMain {
  height: 383px;
  .eventTitle {
    padding: 15px 10px;
    font-size: 12px;
    color: #6b798e;
  }
  .eventList {
    height: 50px;
    .outBox {
      width: 74%;
      height: 8px;
      background: rgb(245, 245, 245);
    }
    .inBox {
      // width: 50%;
      height: 8px;
      background: rgb(65, 205, 153);
    }
    .eventName,
    .eventNum {
      width: 13%;
      font-size: 12px;
      color: #252934;
      padding: 15px 10px;
    }
  }
}
</style>
<style></style>
