// import { upperCase } from 'lodash-es';
// output.pathに指定するパスがOSによって異なることを
// 防ぐためにpathモジュールを読み込んでおく
const path = require("path");
// clean-webpack-plugin を読み込んでおく
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
//const MiniCssExtractPlugin = require('mini-css-extract-plugin'); // CSSを分離
//const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin'); // CSSをminify
const TerserPlugin = require("terser-webpack-plugin"); // JSをminify
const webpack = require("webpack"); // プラグインを利用するため

module.exports = {
  // モードの設定（モードを指定しないとwebpack実行時に警告が出る）
  mode: "development", //development, production, none

  entry: "./src/js/main.js", // エントリーポイント（変換したいファイルが有るフォルダ）
  // 出力の設定
  output: {
    path: path.resolve(__dirname, "./dist/js"),
    filename: "bundle.js", // 出力するファイル名
  },
  module: {
    rules: [
      // babelでトランスパイル
      {
        test: /\.js$/, // ローダー処理の対象ファイル
        exclude: /node_modules/,
        loader: "babel-loader",
        // options: {
        //   presets: [
        //     // プリセットを指定することで、ES2020 を ES5 に変換
        //     "@babel/preset-env",
        //   ],
        // },
        //include: path.resolve(__dirname, "./src/js"), // ローダー処理の対象ディレクトリ
      },
      // sassをバンドル
      // {
      //   test: /\.(sass|scss)$/, // 対象ファイル
      //   use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"], // 後ろから実行される
      // },
      // {
      //   test: /\.gif|png|jpg|eot|woff|ttf|svg$/,
      //   use: ["url-loader"],
      // },
    ],
  },
  // プラグインの設定
  plugins: [
    // CSSを分離
    // new MiniCssExtractPlugin({
    //   filename: "../css/style.css", // ファイル名の設定
    // }),
    // jQuery読み込み
    // new webpack.ProvidePlugin({
    //   jQuery: "jquery",
    //   $: "jquery",
    // }),
    // autoprefixer,
    // objectFitImages,
    // clean-webpack-plugin を利用する
    // 今回、output.path に public/js を指定しているため,
    // public/js ディレクトリ内のファイルが削除されてからビルドが実行される
    new CleanWebpackPlugin(),
  ],
  optimization: {
    minimizer: [
      new TerserPlugin({
        extractComments: "all",
        sourceMap: true,
        terserOptions: {
          compress: { drop_console: true },
        },
      }), // JSをminify（production時のみ）
      //new OptimizeCssAssetsPlugin({}), // CSSをminify（production時のみ）
    ],
  },
  // ソースマップの設定
  // devtool: "cheap-module-eval-source-map",
};
