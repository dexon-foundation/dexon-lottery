const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const CleanTerminalPlugin = require('clean-terminal-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const DuplicatePackageCheckerPlugin = require("duplicate-package-checker-webpack-plugin");
const WebpackPwaManifest = require('webpack-pwa-manifest');
const FaviconsWebpackPlugin = require('favicons-webpack-plugin')
const MANIFEST = require('./app/manifest.json');

const OUTPUT_FOLDER = './build';
const APP_ICON = './app/favicon.png';

module.exports = (env, options) => {

    const isProduction = options.mode === 'production';

    let _basePath = '/';
    const { BASE_URL } = process.env;
    if (isProduction && BASE_URL && (typeof BASE_URL === 'string')) {
        _basePath = BASE_URL;
        if (_basePath.substr(-1) != '/') _basePath += '/';
        console.log(`Base url of this build is: ${_basePath}`);
    }

    const plugins = [
        new CleanWebpackPlugin([OUTPUT_FOLDER], {  watch: false }),
        // hope that we can get rid of this once WebpackPwaManifest supports favicon
        new FaviconsWebpackPlugin({
            logo: APP_ICON,
            persistentCache: true,
            icons: {
                android: false,
                appleIcon: false,
                appleStartup: false,
                coast: false,
                favicons: true,
                firefox: false,
                opengraph: false,
                twitter: false,
                yandex: false,
                windows: false
            }
        }),
        new HtmlWebpackPlugin({
            template: './app/index.html',
            title: MANIFEST.name,
            description: MANIFEST.description,
        }),
        new webpack.DefinePlugin({
            'MODE': JSON.stringify(options.mode)
        }),
        new ForkTsCheckerWebpackPlugin({
            checkSyntacticErrors: true,
            tslint: true
        }),
        (isProduction ?
            new BundleAnalyzerPlugin({
                analyzerMode: 'static',
                reportFilename: 'bundle_analyze.html',
                openAnalyzer: false
            })
            :
            new CleanTerminalPlugin()
        ),
        new DuplicatePackageCheckerPlugin(),
        new WebpackPwaManifest({
            name: MANIFEST.name,
            short_name: MANIFEST.short_name,
            description: MANIFEST.description,
            background_color: MANIFEST.background_color,
            crossorigin: MANIFEST.crossorigin,
            ios: MANIFEST.ios,
            icons: [
              {
                src: path.resolve(APP_ICON),
                sizes: [96, 128, 192, 256, 512] // multiple sizes
              }
            ]
          })
    ];

    return {
        devtool: isProduction? '' : 'inline-source-map',
        entry: {
            vendor: ['react', 'react-dom', 'react-loadable'],
            client: './app/index.ts',
        },
        output: {
            filename: '[name].[chunkhash].js',
            path: path.join(__dirname, OUTPUT_FOLDER),
            chunkFilename: '[name].[chunkhash].js',
            publicPath: _basePath,
        },
        optimization: {
            splitChunks: {
                cacheGroups: {
                   vendor: {
                       chunks: 'initial',
                       name: 'vendor',
                       test: 'vendor',
                       enforce: true,
                   }
                }
            },
            runtimeChunk: true,
        },
        plugins,
        module: {
            rules: [
                {
                    test: /\.tsx?$/,
                    exclude: /node_modules/,
                    use: [
                        { loader: 'cache-loader' },
                        {
                            loader: 'thread-loader',
                            options: {
                                // there should be 1 cpu for the fork-ts-checker-webpack-plugin
                                workers: require('os').cpus().length - 1,
                            },
                        },
                        {
                            loader: 'ts-loader',
                            options: {
                                happyPackMode: true, // IMPORTANT! use happyPackMode mode to speed-up compilation and reduce errors reported to webpack,
                                logLevel: 'warn'
                            }
                        }
                    ]
                },
                {
                    test: /.*\.(gif|png|jpe?g|svg)$/i,
                    loader: 'file-loader',
                    exclude: /node_modules/,
                    options: {
                      name: '/[name]_[hash:7].[ext]',
                      outputPath: 'assets/'
                    }
                }
            ]
        },
        resolve: {
            extensions: [".tsx", ".ts", ".js"],
            alias: {
                '@': path.resolve(__dirname, 'app/'),
                'bn.js': path.resolve(__dirname, 'node_modules/bn.js'),
                'eth-lib': path.resolve(__dirname, 'node_modules/eth-lib'),
            }
        },
        devServer: {
            stats: {
                all: false,
                // chunks: true,
                assets: true,
                errors: true,
                // timings: true,
                performance: true,
                warnings: true,
            },
            /*
            proxy: {
                "/api": {
                    target: "http://localhost:1234/",
                    secure: false,
                    pathRewrite: {"^/api" : ""}
                }
            }
            */
        }
    }
};