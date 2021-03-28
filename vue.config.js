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
    ]
  },
  publicPath: '/',
  devServer: {
    proxy: {
      "/api": {
        target: 'http://47.119.115.208:15656',
        changeOrigin: true,
        ws: true,
        pathRewrite: {
          '^/api': '/', //重写请求路径
        },
      }
    }
  }
};