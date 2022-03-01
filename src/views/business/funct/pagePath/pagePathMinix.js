export default {
  data() {
    return {
      // 桑基图数据--页码为1到2
      option: {
        tooltip: {
          trigger: "item",
          triggerOn: "mousemove",
          formatter: function (params) {
            // console.log(params);
            var str =
              "从" +
              params.data.source +
              "到" +
              params.data.target +
              "<br>" +
              params.data.sessions +
              ":" +
              params.data.sessionsData;
            return str;
          },
        },
        grid: {
          left: "0",
          right: "0",
          top: "0",
          bottom: "0",
          containLabel: true,
        },
        series: {
          type: "sankey",
          left: "0",
          right: "0",
          top: 20,
          bottom: "0",
          nodeGap: 30, //间隔
          nodeWidth: 130, //宽度
          // layout: "none",
          // focusNodeAdjacency: "allEdges",
          // focusNodeAdjacency: false, //全部高亮
          // layoutIterations: 0,//
          label: {
            position: [10, 10], //标签位置
            formatter: function (params) {
              // console.log(params);
              var str = params.data.name + "(" + params.data.sessionsData + ")";
              return str;
            },
          },
          data: [
            {
              name: "a",
              leave: "从该页面离开次数：",
              leaveNum: 5,
              sessions: "会话数：",
              sessionsData: 20,
              itemStyle: {
                // color: "#654321",
                color: "rgb(211,206,75)",
              },
              tooltip: {
                trigger: "item",
                triggerOn: "mousemove",
                formatter: function (params) {
                  // console.log(params);
                  var str =
                    params.data.name +
                    "<br>" +
                    params.data.leave +
                    params.data.leaveNum +
                    "<br>" +
                    params.data.sessions +
                    params.data.sessionsData;
                  return str;
                },
              },
            },
            {
              name: "b",
              leave: "从该页面离开次数：",
              leaveNum: 69,
              sessions: "会话数：",
              sessionsData: 20,
              itemStyle: {
                color: "rgb(221,203,80)",
              },
              tooltip: {
                trigger: "item",
                triggerOn: "mousemove",
                formatter: function (params) {
                  // console.log(params);
                  var str =
                    params.data.name +
                    "<br>" +
                    params.data.leave +
                    params.data.leaveNum +
                    "<br>" +
                    params.data.sessions +
                    params.data.sessionsData;
                  return str;
                },
              },
            },
            {
              name: "a1",
              leave: "从该页面离开次数：",
              leaveNum: 18,
              sessions: "会话数：",
              sessionsData: 10,
              itemStyle: {
                color: "rgb(86,191,140)",
              },
              tooltip: {
                trigger: "item",
                triggerOn: "mousemove",
                formatter: function (params) {
                  // console.log(params);
                  var str =
                    params.data.name +
                    "<br>" +
                    params.data.leave +
                    params.data.leaveNum +
                    "<br>" +
                    params.data.sessions +
                    params.data.sessionsData;
                  return str;
                },
              },
            },
            {
              name: "a2",
              leave: "从该页面离开次数：",
              leaveNum: 59,
              sessions: "会话数：",
              sessionsData: 10,
              itemStyle: {
                color: "rgb(66,177,166)",
              },
              tooltip: {
                trigger: "item",
                triggerOn: "mousemove",
                formatter: function (params) {
                  // console.log(params);
                  var str =
                    params.data.name +
                    "<br>" +
                    params.data.leave +
                    params.data.leaveNum +
                    "<br>" +
                    params.data.sessions +
                    params.data.sessionsData;
                  return str;
                },
              },
            },
          ],
          links: [
            {
              source: "a",
              target: "a1",
              value: 10,
              sessions: "会话数",
              sessionsData: 20,
            },
            {
              source: "a",
              target: "a2",
              value: 5,
              sessions: "会话数",
              sessionsData: 8,
            },
            {
              source: "b",
              target: "a2",
              value: 25,
              sessions: "会话数",
              sessionsData: 10,
            },
          ],
        },
      },
      // 桑基图上方的页码数据
      pageDta: [
        {
          page: "第1页",
          pageData: "335483",
          pageSymbol: ">",
          pageRate: "99.14%",
        },
        {
          page: "第2页",
          pageData: "335483",
          pageSymbol: ">",
          pageRate: "99.14%",
        },
        {
          page: "第3页",
          pageData: "335483",
          pageSymbol: ">",
          pageRate: "99.14%",
        },
        {
          page: "第4页",
          pageData: "335483",
          pageSymbol: ">",
          pageRate: "99.14%",
        },
      ],
      page: 1,
    };
  },
  mounted() {},
  methods: {},
};
