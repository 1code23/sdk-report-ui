module.exports = {
  publicPath: "/",
  lintOnSave: false,
  devServer: {
    // host: "127.0.0.1",
    hot: true,
    // open: true,
    port: 8080,
    proxy: {
      // "/api": {
      //   target: "http://10.20.40.183:8088", //开发环境
      //   changeOrigin: true,
      //   pathRewrite: {
      //     "^/api": "",
      //   },
      // },
      "/statisApi": {
        target: "http://10.20.40.183:8088/",
        changeOrigin: true,
        pathRewrite: {
          "^/statisApi": "",
        },
      },
    },
  },
  configureWebpack: {
    resolve: {
      // 别名
      alias: {
        assets: "@/assets",
        components: "@/components",
      },
    },
  },
};
