<template>
  <div ref="rect" class="container"></div>
</template>

<script>
export default {
  data() {
    return {
      option: {
        grid: {
          left: 10,
          right: 10,
          containLabel: true,
        },
        tooltip: {
          borderWidth: 0,
          trigger: "axis",
        },
        xAxis: {
          type: "category",
          boundaryGap: false, //是否线条靠近边缘
          axisTick: {
						show:true,
            alignWithLabel: false,
          },
          axisLine: {
						show:true,
            lineStyle: {
              color: "#cecece",
            },
          },
          axisLabel: {
            color: "#696969",
          },
					data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
        },
        yAxis: {
          type: "value",
          data: [],
					axisLine: {
						show:true,
            lineStyle: {
              color: "#cecece",
            },
          },
					axisTick: {
						show:true,
            alignWithLabel: true,
          },
          splitLine: {
            show: true,
            lineStyle: {
              type: "dashed",
            },
          },
        },
        legend: {
          show: true,
          itemWidth: 8,
          itemHeight: 2,
          bottom: 30,
					icon:"rect"
        },
        series: [
          {
            name: "Email",
            type: "line",
            stack: "Total",
            data: [120, 132, 101, 134, 90, 230, 210],
          },
          {
            name: "Union Ads",
            type: "line",
            stack: "Total",
            data: [220, 182, 191, 234, 290, 330, 310],
          },
          {
            name: "Video Ads",
            type: "line",
            stack: "Total",
            data: [150, 232, 201, 154, 190, 330, 410],
          },
          {
            name: "Direct",
            type: "line",
            stack: "Total",
            data: [320, 332, 301, 334, 390, 330, 320],
          },
          {
            name: "Search Engine",
            type: "line",
            stack: "Total",
            data: [820, 932, 901, 934, 1290, 1330, 1320],
          },
        ],
      },
      myChart: null,
    };
  },
  mounted() {
    var myChart = window.echarts.init(this.$refs.rect);
    myChart.setOption(this.option);
  },
};
</script>

<style lang="scss" scoped>
.container{
	width:100%;
	height:400px;
}
</style>