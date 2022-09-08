const { defineConfig } = require('@vue/cli-service')
const path = require('path')
module.exports = defineConfig({
  transpileDependencies: true,
  lintOnSave: false,
  // 这个是给webpack-dev-server开启可IP和域名访问权限。
  devServer: {
    host:'www.corho.com'
  },
  configureWebpack:{
    externals: {
      qc: 'QC'
    }
  },
  // configureWebpack:{
  //   devServer:{
  //   historyApiFallback:true,
  //   allowedHosts:['www.corho.com']
  //   }
  // },
  // configureWebpack: config => {
  //   config.devServer.allowedHosts()
  //   config.devServer.historyApiFallback(true)
  //   config.devServer.allowedHosts('all')
  // },
  pluginOptions: {
    'style-resources-loader': {
      preProcessor: 'less',
      //那些文件需要自动引入，使用绝对路径
      //需要时path.join来拼接完整路径
      patterns: [
        path.join(__dirname, './src/assets/styles/variables.less'),
        path.join(__dirname, './src/assets/styles/mixins.less')
      ]
    }
  },
  

  //将图片打包成base64的格式 
  // chainWebpack: config => {
  //   config.module
  //     .rule('images')
  //     .use('url-loader')
  //     .loader('url-loader')
  //     .tap(options => Object.assign(options, { limit: 10000 }))
  // }
})

