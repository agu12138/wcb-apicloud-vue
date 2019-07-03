// 引入依赖模块

var path = require('path');
var VueLoaderPlugin = require('vue-loader/lib/plugin');
var HtmlWebpackPlugin = require("html-webpack-plugin");
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var glob = require("glob");
var pages = glob.sync("./src/pages/*.js");
var entry = {};
pages.forEach(res => {
    entry[/.\/src\/pages\/(.*).js/.exec(res)[1]] = res;
})
module.exports = {
    mode: 'none',
    entry,
    output: {
        filename: './js/[name].js',
        path: path.join(__dirname, '../dist'),
        chunkFilename: "./js/[name].chunk.js"
    },
    module: {
        rules: [
         //  使用vue-loader 加载 .vue 结尾的文件
         {
             test: /\.vue$/,
             loader: 'vue-loader',
         },
         // 使用babel 加载 .js 结尾的文件
         {
             test: /\.js$/,
             use: [{
                 loader: "babel-loader",
                 options: {
                     presets: ['@babel/preset-env']
                 }
             }]
         },
         // 使用css-loader和style-loader 加载 .css 结尾的文件
         {
             test: /\.css$/,
             use: ExtractTextPlugin.extract({
                 fallback: "style-loader",
                 use: "css-loader"
             })
         },
         // 加载图片
         {
             test: /\.(png|jpg|gif)$/,
             use: [{
                 loader: "url-loader",
                 options: {
                     // 把较小的图片转换成base64的字符串内嵌在生成的js文件里
                     limit: 100,
                     // 路径要与当前配置文件下的publicPath相结合
                     name: './img/[name].[ext]?[hash:7]'
                 }
             }]
         },
         // 加载图标
         {
             test: /\.(eot|woff|woff2|svg|ttf)([\?]?.*)$/,
             use: [{
                 loader: "file-loader",
                 options: {
                     // 把较小的图标转换成base64的字符串内嵌在生成的js文件里    
                     limit: 100,
                     name: './fonts/[name].[ext]?[hash:7]',
                     prefix: 'font'
                 }
             }]
         }
        ]
    },
    resolve: {
        extensions: ['.js', '.vue', '.styl', 'css']
    },
    plugins: [
        new VueLoaderPlugin(),
         new ExtractTextPlugin({
             filename: './css/[name].[hash].css',
             allChunks: true
         }),
        // 自动生成html插件，如果创建多个HtmlWebpackPlugin的实例，就会生成多个页面
        new HtmlWebpackPlugin({
            // 生成html文件的名字，路径相对于输出文件所在的位置
            minify: {
                collapseWhitespace: true //折叠空白区域 也就是压缩代码
                , emoveComments: true
            },
            filename: 'index.html',
            // 源文件，路径相对于本文件所在的位置
            template: path.resolve(__dirname, '../public/index.html'),
            // 需要引入entry里面的哪几个入口，如果entry里有公共模块，记住一定要引入
            chunks: ['vendor', 'common'],
            // 要把<script>标签插入到页面哪个标签里(body|true|head|false)
            inject: 'body',
            // 生成html文件的标题
            title: '',
            // hash如果为true，将添加hash到所有包含的脚本和css文件，对于解除cache很有用
            // minify用于压缩html文件，其中的removeComments:true用于移除html中的注释，collapseWhitespace:true用于删除空白符与换行符
        })
       
    ],
    optimization: {
        splitChunks: {
            cacheGroups: {
                // 注意: priority属性
                // 其次: 打包业务中公共代码
                common: {
                    name: "common",
                    chunks: "all",
                    minSize: 1,
                    priority: 0
                },
                // 首先: 打包node_modules中的文件
                vendor: {
                    name: "vendor",
                    test: /[\\/]node_modules[\\/]/,
                    chunks: "all",
                    priority: 10
                }
            }
        }
    }
}