点击：[我的博客地址](https://segmentfault.com/a/1190000013413360)

> ###新建项目

1、新建一个文件夹

```
npm init
```
一直回车，最后yes，生成package.json

2、文件夹中新建以下文件

```
src                            --源码
index.html                     --入口首页
webpack.config.js              --webpack开发环境配置
webpack.production.config.js   --webpack生产环境配置
```

> ###下载依赖包

先下载几个基本的包，后续还会用到其他包。

打包工具
**webpack**  

辅助开发的服务器(该服务器能热加载代码，自动刷新页面，代理服务器解决前端开发时跨域问题)                
**webpack-dev-server**

react用到es6语法，所以要安装es6转码器babel相关的包
**babel-core**
**babel-loader**
**babel-preset-es2015**
**babel-preset-react**
**babelify**

webpack需要处理样式文件打包的处理器
**css-loader**
**style-loader**
**less-loader**

webpack需要处理图片文件打包的处理器
**file-loader**
**url-loader**

以上包的下载使用 `npm i XXX --save-dev`
--save-dev 是写入开发环境的依赖


----------


react项目的两个基础包
**react**
**react-dom**

这两个包下载使用 `npm i XXX --save`
--save 是写入生产环境的依赖


> ###package.json中的scripts

在package.json中的scripts加上两个key
```
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "start": "cross-env NODE_ENV=dev webpack-dev-server --inline --progress --colors",
    "build": "cross-env NODE_ENV=production webpack --config ./webpack.production.config.js --progress --colors"
  },
```
这里需要安装的一个包 `npm i cross-env --save-dev`
**有何用？**
windows不支持 `NODE_ENV=development` 的设置方式，这个包能够提供一个设置环境变量的scripts，让你能够以unix方式设置环境变量，然后在windows上也能兼容运行。`cross-env` 让这一切变得简单，不同平台使用唯一指令，无需担心跨平台问题。

`--progress` 显示打包过程中的进度
`--colors` 打包信息带有颜色显示
`--inline` 自动刷新的配置

`webpack --config ./webpack.production.config.js`
这个命令是制定webpack的配置文件，因为默认的是`webpack.config.js`，而这里是打包命令，应该使用`webpack.production.config.js`。

> ###开发环境配置 --webpack.config.js

先上完整代码

```
const path=require('path');
const webpack = require('webpack')
var HtmlWebpackPlugin = require('html-webpack-plugin');
var OpenBrowserPlugin = require('open-browser-webpack-plugin');

// 配置文件的内容需要通过module.exports暴露
module.exports = {
  // 配置需要打包的入口文件，值可以是字符串、数组、对象。
  // 1. 字符串： entry： './entry'
  // 2. 字符串： entry：[ './entry1','entry2'] (多入口)
  // 3. 对象：   entry： {alert/index': path.resolve(pagesDir, `./alert/index/page`)}
  // 多入口书写的形式应为object，因为object,的key在webpack里相当于此入口的name,
  entry : './src/js/index.js',
  output : {
    // 输出文件配置，output 输出有自己的一套规则，常用的参数基本就是这三个
    // path: 表示生成文件的根目录 需要一个**绝对路径** path仅仅告诉Webpack结果存储在哪里
    path : path.resolve(__dirname,'dist'),
    // filename 属性表示的是如何命名出来的入口文件
    filename : './js/bundle.js'
  },
  resolve: {
    //自动扩展文件后缀名，意味着我们require模块可以省略不写后缀名
    extensions: ['*', '.js', '.json', '.less','.jsx'],
    //模块别名定义，方便后续直接引用别名，无须多写长长的地址
    alias: {
      '@components': path.resolve(__dirname,'src/js/components')
    }
  },
  module : {
    // 这里就是Loader，通过Loader，webpack能够针对每一种特定的资源做出相应的处理
    // 1.test参数用来指示当前配置项针对哪些资源，该值应是一个条件值(condition)。
    // 2.exclude参数用来剔除掉需要忽略的资源，该值应是一个条件值(condition)。
    // 3.include参数用来表示本loader配置仅针对哪些目录/文件，该值应是一个条件值(condition)。
    // 而include参数则用来指示目录；注意同时使用这两者的时候，实际上是and的关系。
    // 4.use参数，用来指示用哪个或哪些loader来处理目标资源。
    rules : [
      {
        test: /\.(js|jsx)$/,
        use : {
          loader : "babel-loader",
          options : {
            presets : ['es2015','react']
          }
        },
        exclude : /node_modules/
      },
      {
        test: /\.less$/,
        exclude: /node_modules/,
        use : [{loader : "style-loader"},{loader : "css-loader"},{loader : "less-loader"}]
      },
      {
        test : /\.css$/,
        use : [{loader : "style-loader"},{loader : "css-loader"}]
      },
      {
        test: /\.(png|gif|jpg|jpeg|bmp)$/i,
        use : {
          loader : 'url-loader',
          options : {
            limit : '8192'
          }
        }
      },
      {
        test: /\.(woff|woff2|svg|ttf|eot)($|\?)/i,
        use: {
          loader: 'url-loader',
          options: {
            limit: '8192'
          }
        }
      }
    ]
  },
  plugins: [
    // html 模板插件
    new HtmlWebpackPlugin({
        template: __dirname + '/index.html'
    }),

    // 热加载插件
    new webpack.HotModuleReplacementPlugin(),

    // 打开浏览器
    new OpenBrowserPlugin({
      url: 'http://localhost:8080'
    }),

    // 可在业务 js 代码中使用 __DEV__ 判断是否是dev模式（dev模式下可以提示错误、测试报告等, production模式不提示）
    new webpack.DefinePlugin({
      __DEV__: JSON.stringify(JSON.parse((process.env.NODE_ENV == 'dev') || 'false'))
    }),

  ],
  //我们在这里对webpack-dev-server进行配置
  devServer: {
    contentBase:"./",// 本地服务器在哪个目录搭建页面，一般我们在当前目录即可；
    historyApiFallback:true,//当我们搭建spa应用时非常有用，它使用的是HTML5 History Api，任意的跳转或404响应可以指向 index.html 页面；
    inline:true,//用来支持dev-server自动刷新的配置，webpack有两种模式支持自动刷新，一种是iframe模式，一种是inline模式；使用iframe模式是不需要在devServer进行配置的，只需使用特定的URL格式访问即可；不过我们一般还是常用inline模式，在devServer中对inline设置为true后，当我们启动webpack-dev-server时仍要需要配置inline才能生效
    hot:true,// 启动webpack热模块替换特性,这里是个坑
    port:8080,//配置服务端口号
    host:'localhost',//服务器的IP地址，可以使用IP也可以使用localhost
    compress:true,//服务端压缩是否开启
  }
}

```

相关参数配置的说明已经写在代码的注释里。

这里对于上面使用的插件我在做一下说明：

`html-webpack-plugin` ：html-webpack-plugin可以根据你设置的模板，在每次运行后生成对应的模板文件，同时所依赖的CSS/JS也都会被引入，如果CSS/JS中含有hash值，则html-webpack-plugin生成的模板文件也会引入正确版本的CSS/JS文件。详细介绍https://www.npmjs.com/package/html-webpack-plugin

`webpack.HotModuleReplacementPlugin`：模块热替换(HMR - Hot Module Replacement)功能会在应用程序运行过程中替换、添加或删除模块，而无需重新加载整个页面。主要是通过以下几种方式，来显著加快开发速度：
保留在完全重新加载页面时丢失的应用程序状态。
只更新变更内容，以节省宝贵的开发时间。
调整样式更加快速 ，几乎相当于在浏览器调试器中更改样式。
详细介绍https://doc.webpack-china.org/plugins/hot-module-replacement-plugin/

`open-browser-webpack-plugin` ： 则在webpack 启动成功后会打开浏览器。详细介绍https://www.npmjs.com/package/open-browser-webpack-plugin

`webpack.DefinePlugin` ： 可在业务 js 代码中使用 __DEV__ 判断是否是dev模式。详细介绍https://doc.webpack-china.org/plugins/define-plugin/

比如

```
if(__DEV__) {
	console.log("现在是开发环境");
}
else {
	console.log("现在是生产环境");
}
```

这里需要额外安装的包：
**html-webpack-plugin**
**open-browser-webpack-plugin**


> ###生产环境配置 --webpack.production.config.js

同样的，先上完整代码：

```
var path = require('path')
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var autoprefixer = require('autoprefixer');
var OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');

module.exports = {
  entry: {
    app: path.resolve(__dirname, './src/js/index.js'),
    // 将 第三方依赖 单独打包
    vendor: ['react', 'react-dom']
  },
  output: {
    path: __dirname + "/dist",
    // filename 属性表示的是如何命名出来的入口文件，规则是一下三种：
    // [name] 指代入口文件的name，也就是上面提到的entry参数的key，因此，我们可以在name里利用/，即可达到控制文件目录结构的效果。
    // [hash]，指代本次编译的一个hash版本，值得注意的是，只要是在同一次编译过程中生成的文件，这个[hash].js
    //的值就是一样的；在缓存的层面来说，相当于一次全量的替换。
    filename: "js/[name].[chunkhash:8].js",
    // publicPath 参数表示的是一个URL 路径（指向生成文件的跟目录），用于生成css/js/图片/字体文件
    // 等资源的路径以确保网页能正确地加载到这些资源.
    // “publicPath”项则被许多Webpack的插件用于在生产模式下更新内嵌到css、html文件里的url值.
    // 例如，在localhost（即本地开发模式）里的css文件中边你可能用“./test.png”这样的url来加载图片，
    // 但是在生产模式下“test.png”文件可能会定位到CDN上并且你的Node.js服务器可能是运行在HeroKu上边的。
    // 这就意味着在生产环境你必须手动更新所有文件里的url为CDN的路径。
    //开发环境：Server和图片都是在localhost（域名）下
    //.image {
    // background-image: url('./test.png');
    //}
    // 生产环境：Server部署下HeroKu但是图片在CDN上
    //.image {
    //  background-image: url('https://someCDN/test.png');
    //}
    publicPath: './'
  },

  resolve: {
    //自动扩展文件后缀名，意味着我们require模块可以省略不写后缀名
    extensions: ['*', '.js', '.json', '.less','.jsx'],
    //模块别名定义，方便后续直接引用别名，无须多写长长的地址
    alias: {
      '@components': path.resolve(__dirname,'src/js/components')
    }
  },

  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ['es2015', 'react']
          }
        }
      }, {
        test: /\.less$/,
        exclude: /node_modules/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: ['css-loader', 'postcss-loader', 'less-loader']
        })
      }, {
        test: /\.css$/,
        // exclude: /node_modules/, 删掉次行  不然打包会报错  因为antd.css 在node_modules中
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: ['css-loader', 'postcss-loader']
        })
      }, {
        test: /\.(png|gif|jpg|jpeg|bmp)$/i,
        use: {
          loader: 'url-loader',
          options: {
            limit: '8192',
            outputPath: 'images/',
            publicPath : '/images'
          }
        }
      }, {
        test: /\.(woff|woff2|svg|ttf|eot)($|\?)/i,
        use: {
          loader: 'url-loader',
          options: {
            limit: '8192',
            outputPath: 'font/'
          }
        }
      }
    ]
  },
  plugins: [
    // webpack 内置的 banner-plugin
    new webpack.BannerPlugin("Copyright by 765745342@qq.com"),

    // html 模板插件
    new HtmlWebpackPlugin({
      template: __dirname + '/index.html'
    }),

    // 定义为生产环境，编译 React 时压缩到最小
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify(process.env.NODE_ENV)
      }
    }),

    // 为组件分配ID，通过这个插件webpack可以分析和优先考虑使用最多的模块，并为它们分配最小的ID
    new webpack.optimize.OccurrenceOrderPlugin(),

    new webpack.optimize.UglifyJsPlugin({
      compress: {
        //supresses warnings, usually from module minification
        warnings: false
      }
    }),

    // 分离CSS和JS文件
    new ExtractTextPlugin('css/[name].[chunkhash:8].css'),

    // 提供公共代码
    new webpack.optimize.CommonsChunkPlugin({name: 'vendor', filename: 'js/[name].[chunkhash:8].js'}),

    // 可在业务 js 代码中使用 __DEV__ 判断是否是dev模式（dev模式下可以提示错误、测试报告等, production模式不提示）
    new webpack.DefinePlugin({
      __DEV__: JSON.stringify(JSON.parse((process.env.NODE_ENV == 'dev') || 'false'))
    }),
    new OptimizeCssAssetsPlugin({
      assetNameRegExp: /\.css$/g,
      cssProcessor: require('cssnano'),
      cssProcessorOptions: { discardComments: {removeAll: true } },
      canPrint: true
    })
  ]
}


```

有些地方和 `webpack.config.js` 的配置是一样的我就不做说明了。

`extract-text-webpack-plugin` ： 开发环境下，css 代码是放在整个打包出来的那个 bundle.js 文件中的，发布环境下当然不能混淆在一起。该插件的主要是为了抽离css样式,防止将样式打包在js中引起页面样式加载错乱的现象。详细介绍https://www.npmjs.com/package/extract-text-webpack-plugin

`webpack.optimize.CommonsChunkPlugin` ： 将第三方依赖单独打包。即将 node_modules 文件夹中的代码打包为 vendor.js 将我们自己写的业务代码打包为 app.js。这样有助于缓存，因为在项目维护过程中，第三方依赖不经常变化，而业务代码会经常变化。详细介绍https://doc.webpack-china.org/plugins/commons-chunk-plugin

`webpack.optimize.UglifyJsPlugin` ： 压缩你的JS代码。详细介绍https://doc.webpack-china.org/plugins/uglifyjs-webpack-plugin

`optimize-css-assets-webpack-plugin` ： CSS代码压缩。详细介绍https://www.npmjs.com/package/optimize-css-assets-webpack-plugin

`autoprefixer` ： Autoprefixer是一个后处理程序，你可以同Sass，Stylus或LESS等预处理器共通使用。它适用于普通的CSS，而你无需关心要为哪些浏览器加前缀，只需全新关注于实现，并使用W3C最新的规范。详细介绍https://www.npmjs.com/package/autoprefixer
这是一个自动给你加上css浏览器前缀，比如
你只需写：

```
a {
    display: flex;
}
```
这个插件自动给你添加厂商前缀：

```
a {
    display: -webkit-box;
    display: -webkit-flex;
    display: -ms-flexbox;
    display: flex;
}
```
这个插件请注意，你需要下载 `postcss-loader`
并且新建文件`postcss.config.js`
文件内容：
```
module.exports = {
  plugins: {
    'autoprefixer': {browsers: 'last 5 version'}
  }
}

```


这里需要额外安装的包：
**postcss-loader**
**extract-text-webpack-plugin**
**optimize-css-assets-webpack-plugin**

> ###启动项目

`npm start`

> ###打包项目

`npm run build`
