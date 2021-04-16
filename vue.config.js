const webpack = require("webpack");

module.exports = {
  configureWebpack: {
    plugins: [
      new webpack.ProvidePlugin({
        $: "jquery",
        jQuery: "jquery",
        "window.jQuery": "jquery",
        Popper: ["popper.js", "default"]
      })
    ],
    externals: { //取消对于node_module中的这些包不进行打包处理
      jquery: "jQuery",
      lodash: "_",
      animejs: "anime"
    },
  },
  publicPath: '/',
  devServer: {
    proxy: {
      "/api": {
        target: 'http://47.119.115.208:15656',
        // target: 'http://192.168.2.212:15656',
        changeOrigin: true,
        ws: true,
        pathRewrite: {
          '^/api': '/', //重写请求路径
        },
      }
    }
  },
  productionSourceMap: false,
};