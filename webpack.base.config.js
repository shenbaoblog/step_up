// output.pathに指定するパスがOSによって異なることを
// 防ぐためにpathモジュールを読み込んでおく
const path = require("path");

module.exports = {
  // エントリーポイントの設定
  entry: "./src/js/main.js",
  // 出力の設定
  output: {
    // 出力するファイル名
    filename: "bundle.js",
    // 出力先のパス（絶対パスを指定しないとエラーが出るので注意）←エラーでない？？？
    path: path.resolve(__dirname, "./dist/js")
  }
};
