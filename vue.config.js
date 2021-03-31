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
        // target: 'http://47.119.115.208:15656',
        target: 'http://192.168.2.212:15656',
        changeOrigin: true,
        ws: true,
        pathRewrite: {
          '^/api': '/', //重写请求路径
        },
        // cookieDomainRewrite: {
        //   'http://192.168.2.212:15656': '192.168.2.141'
        // }
        // onProxyReq(proxyReq, req, res) {
        //   originHost = req.headers['x-forwarded-for']
        //   const cookie = req.headers['cookie']
        //   if (cookie) {
        //     proxyReq.setHeader('cookie', cookie)
        //     console.log("req" + cookie);
        //   }
        // },
        // onProxyRes(proxyRes, req, res) {
        //   if (proxyRes.headers['set-cookie']) {
        //     console.log("res", proxyRes.headers['set-cookie']);
        //     // 域名信息与实际业务相关
        //     // proxyRes.headers['set-cookie'] = proxyRes.headers['set-cookie'].map(v => {
        //     //   return v.replace('domain=.mufeng.me', 'domain=' + originHost.split(':')[0])
        //     // })
        //     // res.headers['cookie'] = proxyRes.headers['set-cookie'];
        //     console.log(res);
        //   }
        // }
      }
    }
  }
};