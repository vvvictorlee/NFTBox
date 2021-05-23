/*
 * vue.config.js 配置
 * @Date: 2020-05-07 11:31:36 
 * @Last Modified time: 2020-05-07 16:56:42
 * 
*/

const IS_PROD = ['production', 'prod'].includes(process.env.NODE_ENV);

console.log("process.env.NODE_ENV:" + process.env.NODE_ENV);
console.log("process.env.VUE_APP_API:" + process.env.VUE_APP_API);
console.log("process.env.VUE_APP_SERVER_ID:" + process.env.VUE_APP_SERVER_ID);


const TerserPlugin = require('terser-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const path = require('path');
const CompressionWebpackPlugin = require('compression-webpack-plugin');
const productionGzipExtensions = /\.(js|css|html|ico|svg|png|jpeg|gif)$/;
const resolve = dir => path.resolve(__dirname, dir);

module.exports = {
    publicPath: IS_PROD ? '/nftbox/' : '/', // 默认'/'，部署应用包时的基本 URL
    outputDir: 'dist', // 'dist', 生产环境构建文件的目录
    assetsDir: '', // 相对于outputDir的静态资源(js、css、img、fonts)目录
    lintOnSave: false,
    runtimeCompiler: true, // 是否使用包含运行时编译器的 Vue 构建版本
    productionSourceMap: false, // 生产环境的 source map
    pluginOptions: {
        'style-resources-loader': {
            //自动引入 在当前每个页面中导入scss变量
            preProcessor: 'scss', 
            // patterns:[]
            patterns: [resolve('src/assets/scss/common.scss')]
        }
    },
    // CSS 相关选项
    css: {
        // 将组件内的 CSS 提取到一个单独的 CSS 文件 (只用在生产环境中)
        // 也可以是一个传递给 `extract-text-webpack-plugin` 的选项对象
        // extract: true, //注释掉，不然修改css的时候不会热更新

        // 是否开启 CSS source map？
        sourceMap: false,

        // 为预处理器的 loader 传递自定义选项。比如传递给
        // sass-loader 时，使用 `{ sass: { ... } }`。
        loaderOptions: {
            // postcss: {
            //     plugins: [ // vant-ui
            //         require("postcss-plugin-px2rem")({
            //             // 375 =>37.5rem  1 rem 20
            //             rootValue: 75, // 表示设计稿的大小  375 =>37.5rem   75  750 => 75rem
            //             exclude: "/node_modules/i",
            //         })
            //     ]
            // }
        },

        // 为所有的 CSS 及其预处理文件开启 CSS Modules。
        // 这个选项不会影响 `*.vue` 文件。
        // 启用 CSS modules for all css / pre-processor files.
        requireModuleExtension: true
    },

    // 在生产环境下为 Babel 和 TypeScript 使用 `thread-loader`
    // 在多核机器下会默认开启。
    parallel: require('os').cpus().length > 1,
    pwa: {},

    chainWebpack: config => {
        // 修复HMR
        config.resolve.symlinks(false);
        //修复 Lazy loading routes Error
        config.plugin('html').tap(args => {
            args[0].chunksSortMode = 'none';
            return args;
        });

        // 添加别名
        config.resolve.alias
            .set('@', resolve('src'))
            .set('assets', resolve('src/assets'))
            .set('components', resolve('src/components'));

        //压缩图片
        // config.module
        //     .rule("images")
        //     .use("image-webpack-loader")
        //     .loader("image-webpack-loader")
        //     .options({
        //         mozjpeg: {progressive: true, quality: 65},
        //         optipng: {enabled: false},
        //         pngquant: {quality: "65-90", speed: 4},
        //         gifsicle: {interlaced: false},
        //         webp: {quality: 75}
        //     });
    },
    configureWebpack: config => {
        //生产环境进行压缩
        if (IS_PROD) {
            const plugins = [];

            //去掉 console.log
            plugins.push(
                new TerserPlugin({
                    terserOptions: {
                        ecma: undefined,
                        warnings: false,
                        parse: {},
                        compress: {
                            drop_console: true,
                            drop_debugger: false,
                            pure_funcs: ['console.log'] // 移除console
                        }
                    },
                })
            );
            //开启gzip压缩
            plugins.push(
                new CompressionWebpackPlugin({
                    filename: '[path].gz[query]',
                    algorithm: 'gzip',
                    test: productionGzipExtensions,
                    threshold: 1024,
                    minRatio: 0.8
                })
            );
            config.plugins = [...config.plugins, ...plugins]
        }

        // 打包分析
        if (process.env.IS_ANALYZ) {
            config.plugin('webpack-report')
                .use(BundleAnalyzerPlugin, [{
                    analyzerMode: 'static',
                }]);
        }

        // //配置 externals
        // //防止将某些 import 的包(package)打包到 bundle 中，而是在运行时(runtime)再去从外部获取这些扩展依赖
        // config.externals = {
        //     'vue': 'Vue',
        //     'element-ui': 'ELEMENT',
        //     'vue-router': 'VueRouter',
        //     'vuex': 'Vuex',
        //     'axios': 'axios'
        // }
    },
    devServer: {
        // overlay: {
        //   warnings: true,
        //   errors: true
        // },
        open: IS_PROD,
        host: '0.0.0.0',
        port: 5721,
        https: false,
        hotOnly: false,
        proxy: {
            '/api': {
                target: process.env.VUE_APP_API || 'http://127.0.0.1:8080',
                // target: 'http://127.0.0.1:8080',
                changeOrigin: true,
                // secure: false,
            },
        },
    },
};