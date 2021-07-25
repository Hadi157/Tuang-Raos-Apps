"use strict";

/* eslint-disable global-require */

/* eslint-disable import/no-extraneous-dependencies */
var HtmlWebpackPlugin = require('html-webpack-plugin');

var CopyWebpackPlugin = require('copy-webpack-plugin');

var WebpackPwaManifest = require('webpack-pwa-manifest');

var ServiceWorkerWebpackPlugin = require('serviceworker-webpack-plugin');

var WorkboxPlugin = require('workbox-webpack-plugin');

var ImageminWebpackPlugin = require('imagemin-webpack-plugin')["default"];

var ImageminMozjpeg = require('imagemin-mozjpeg');

var ImageminWebpWebpackPlugin = require('imagemin-webp-webpack-plugin');

var BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

var MiniCssExtractPlugin = require('mini-css-extract-plugin');

var CssMinimizerPlugin = require('css-minimizer-webpack-plugin');

var UglifyJsPlugin = require('uglifyjs-webpack-plugin');

var path = require('path');

module.exports = {
  entry: path.resolve(__dirname, 'src/scripts/index.js'),
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js'
  },
  module: {
    rules: [{
      test: /\.css$/,
      use: [MiniCssExtractPlugin.loader, 'css-loader']
    }]
  },
  optimization: {
    minimizer: [new CssMinimizerPlugin(), new UglifyJsPlugin()],
    splitChunks: {
      chunks: 'all',
      minSize: 20000,
      maxSize: 70000,
      minChunks: 1,
      maxAsyncRequests: 30,
      maxInitialRequests: 30,
      automaticNameDelimiter: '~',
      enforceSizeThreshold: 50000,
      cacheGroups: {
        defaultVendors: {
          test: /[\\/]node_modules[\\/]/,
          priority: -10
        },
        "default": {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true
        }
      }
    }
  },
  plugins: [new HtmlWebpackPlugin({
    template: path.resolve(__dirname, 'src/templates/index.html'),
    filename: 'index.html'
  }), new CopyWebpackPlugin({
    patterns: [{
      from: path.resolve(__dirname, 'src/public/'),
      to: path.resolve(__dirname, 'dist/'),
      globOptions: {
        ignore: ['**/images**']
      }
    }]
  }), new WebpackPwaManifest({
    name: 'Tuang Raos Apps',
    short_name: 'Raos',
    description: 'My awesome Progressive Web App!',
    start_url: '/index.html',
    background_color: '#ffffff',
    crossorigin: 'use-credentials',
    theme_color: '#a52a2a',
    icons: [{
      src: path.resolve('src/public/icons/icon.png'),
      sizes: [96, 128, 192, 256, 384, 512]
    }, {
      src: path.resolve('src/public/icons/maskable_icon.png'),
      size: '1024x1024',
      purpose: 'maskable'
    }]
  }), new ServiceWorkerWebpackPlugin({
    entry: path.resolve(__dirname, 'src/scripts/sw.js')
  }), new WorkboxPlugin.GenerateSW({
    clientsClaim: true,
    skipWaiting: true
  }), new ImageminWebpackPlugin({
    plugins: [ImageminMozjpeg({
      quality: 50,
      progressive: true
    })]
  }), new ImageminWebpWebpackPlugin({
    config: [{
      test: /\.(jpe?g|png)/,
      options: {
        quality: 50
      }
    }],
    overrideExtension: true
  }), new BundleAnalyzerPlugin(), new MiniCssExtractPlugin()]
};