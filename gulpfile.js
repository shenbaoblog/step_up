"use strict";
//gulpプラグインの読み込み
const gulp = require("gulp");
//条件分岐
const gulpIf = require("gulp-if");
//商用環境判定
const isProd = process.env.NODE_ENV === "production";

//-------------------------------------------------------------------
//sass
//-------------------------------------------------------------------
//sassをコンパイルするプラグインの読み込み
const sass = require("gulp-sass");
// var watch = require("gulp-watch");
//タスク終了時やタスクエラー発生時にデスクトップに通知を表示
const notify = require("gulp-notify");
//ビルドエラーが発生してもタスクを終了させない
const plumber = require("gulp-plumber");
//変更のあったファイルのみを処理する
const cached = require("gulp-cached");
//パーシャルファイルを保存（watch）したときに該当の親SCSSファイルをビルドする
const progeny = require("gulp-progeny");
//@importをフォルダ単位でまとめて読み込む
const sassGlob = require("gulp-sass-glob");
//予め決めていたコーディングルール通りにsassが書かれているかチェックする静的解析ツール
const sassLint = require("gulp-sass-lint");
//css加工用プラグインの読み込み
const postcss = require("gulp-postcss");
//ベンダープレフィックス自動取り付け
const autoprefixer = require("autoprefixer");
//gridのベンダープレフィックス取り付けをONにする（デフォルトはOFF）
const autoprefixerOption = {
  grid: true,
  grid: "autoplace",
};
//flexboxのブラウザ間の細かい挙動誤差修正（IE10/11対応）
const flexBugsFixes = require("postcss-flexbugs-fixes");
// font-familyにのobject-fitを自動追加
const objectFitImages = require("postcss-object-fit-images");
//postcss関数に渡される用（配列に変換している）
const postcssOption = [
  //flexboxのブラウザ間の細かい挙動誤差修正（IE10/11対応）をオブジェクトに渡している
  flexBugsFixes,
  //gridベンダープレフィックスON設定,fontfamilyにをオブジェクトに渡している
  autoprefixer(autoprefixerOption),
  objectFitImages,
];
//CSSのプロパティの並び順をソートして整理してくれる
const cssdeclsort = require("css-declaration-sorter");
//sassでメディアクエリをネストして書いても、CSSに出力する際にまとめてくれる
const mqpacker = require("css-mqpacker");
//ソースマップを出力
// const sourcemaps = require("gulp-sourcemaps"); // 記述しなくてOK
//const options = {
// コンパイル後のCSSを展開
//expanded(展開)
//nested（ネストがインデントされる）
//compact（規則集合毎が1行になる）
//compressed（全CSSコードが1行になる）
//  outputStyle: "expanded",
//};

//sass
gulp.task("sass", () => {
  return (
    gulp
      .src("./src/sass/**/*.scss", { sourcemaps: true })
      // .pipe(sourcemaps.init())
      .pipe(cached("sass")) //変更のあったファイルのみコンパイルする
      .pipe(progeny()) //パーシャルファイルを保存（watch）したときに該当の親SCSSファイルをビルドする
      .pipe(
        //エラーが発生してもタスクを完了させない
        plumber({
          //タスク終了時やタスクエラー発生時にデスクトップに通知を表示（うまくいかない）
          errorHandler: notify.onError({
            title: "エラー", // 任意のタイトルを表示させる
            message: "<%= error.message %>", // エラー内容を表示させる
          }),
        })
      )
      .pipe(sassGlob()) //@importをフォルダ単位でまとめて読み込む
      //ルール通りに記述されているかチェック
      // .pipe(
      //   sassLint({
      //     // airbnbのルール
      //     configFile: ".scss-lint.yml"
      //   })
      // )
      // .pipe(sassLint.format())
      // .pipe(sassLint.failOnError())
      .pipe(
        gulpIf(
          isProd,
          sass({
            // コンパイル後のCSSを展開
            //expanded(展開)
            //nested（ネストがインデントされる）
            //compact（規則集合毎が1行になる）
            //compressed（全CSSコードが1行になる）
            outputStyle: "compressed", //商用環境
          }),
          sass({
            outputStyle: "expanded", //開発環境
          })
        )
      )
      // Sassのコンパイルエラーを表示（うまくいなない）
      // (これがないと自動的に止まってしまう)
      //.on(
      //  "error",
      //  notify.onError(err => {
      //    return err.message;
      //  })
      //)
      .pipe(postcss(postcssOption)) //ベンダープレフィックス自動付与のpostcssOptionの設定を取り込む
      .pipe(postcss([cssdeclsort({ order: "smacss" })])) //CSSのプロパティの並び順をソートしてくれる（smacssが定義するレイアウトが最も重要な順）
      .pipe(postcss([mqpacker()])) //sassでメディアクエリをネストして書いても、CSSに出力する際にまとめてくれる
      .pipe(gulp.dest("./dist/css", { sourcemaps: "." })) //sourcemapの書き出し
      //コンパイル完了通知
      .pipe(
        notify({
          title: "Sass Build",
          message: "Sass build complete",
        })
      )
  );
});

//sassが更新されたか監視
gulp.task("sass-watch", () => {
  return gulp.watch("./src/sass/**/*.scss", gulp.series("sass"));
});

//-------------------------------------------------------------------
//ejs
//-------------------------------------------------------------------
const ejs = require("gulp-ejs");
const rename = require("gulp-rename"); //.ejsの拡張子を変更
const replace = require("gulp-replace");
const prettierPlugin = require("gulp-prettier-plugin");
const htmlmin = require("gulp-htmlmin");

const fs = require("fs");
const config = JSON.parse(fs.readFileSync("./src/ejsConfig.json"));

// htmlminの設定
const htmlminOption = {
  collapseWhitespace: true, // 余白を除去する
  removeComments: true, // HTMLコメントを除去する
};

gulp.task("ejs", (done) => {
  gulp
    .src(["./src/**/*.ejs", "!" + "./src/**/_*.ejs"])
    // .pipe(cached("ejs")) //変更のあったファイルのみコンパイルする
    .pipe(
      //エラーが発生してもタスクを完了させない
      plumber({
        //タスク終了時やタスクエラー発生時にデスクトップに通知を表示（うまくいかない）
        errorHandler: notify.onError({
          title: "エラー", // 任意のタイトルを表示させる
          message: "<%= error.message %>", // エラー内容を表示させる
        }),
      })
    )
    .pipe(ejs({ config: config }, {}, { ext: ".html" })) //ejsを纏める
    .pipe(
      rename({
        prefix: "", //ファイル名の先頭に文字列追加
        extname: ".html", //拡張子をhtmlに
      })
    )
    // .pipe(replace(/[\s\S]*?(<!DOCTYPE)/, "$1")) //冒頭の空白削除
    //htmlを整形
    .pipe(
      prettierPlugin(
        {
          //①Prettierのオプションを指定する
          prettier: {
            singleQuote: true,
          },
        },
        { filter: true }
      )
    )
    .pipe(gulpIf(isProd, htmlmin(htmlminOption))) //htmlの圧縮（商用環境のみ）
    .pipe(gulp.dest("./dist")); //出力先
  done();
});

//ejsが更新されたか監視
gulp.task("ejs-watch", () => {
  return gulp.watch("./src/**/*.ejs", gulp.task("ejs"));
});

//-------------------------------------------------------------------
//xmlサイトマップ生成
//-------------------------------------------------------------------
const sitemap = require("gulp-sitemap");
const save = require("gulp-save");

gulp.task("sitemap", () => {
  return gulp
    .src("dist/**/*.html", {
      read: false,
    })
    .pipe(
      sitemap({
        siteUrl: "http://www.amazon.com",
      })
    )
    .pipe(gulp.dest("./dist"));
});

//xmlサイトマップ生成2
gulp.task("xml", () => {
  return gulp
    .src("dist/**/*.html", {
      read: false,
    })
    .pipe(save("before-sitemap"))
    .pipe(
      sitemap({
        siteUrl: "http://www.amazon.com",
      })
    ) // Returns sitemap.xml
    .pipe(gulp.dest("./dist"))
    .pipe(
      save.restore("before-sitemap") //restore all files to the state when we cached them
      // -> continue stream with original html files
    );
});

//-------------------------------------------------------------------
//webpack
//-------------------------------------------------------------------
const webpackStream = require("webpack-stream");
const webpack = require("webpack");
const webpackProdConfig = require("./webpack.gprod.config"); // webpackの商用設定ファイル
const webpackDevConfig = require("./webpack.gdev.config"); // webpackの開発用設定ファイル

// タスクの定義。
gulp.task("webpack", () => {
  return webpackStream(
    gulpIf(isProd, webpackProdConfig, webpackDevConfig),
    webpack
  ) // webpackStreamの第2引数にwebpackを渡す
    .pipe(gulp.dest("./dist/js"));
});

//JSが更新されたか監視
gulp.task("webpack-watch", () => {
  return gulp.watch("./src/js/**/*.js", gulp.task("webpack"));
});

//-------------------------------------------------------------------
//Babel(webpackでバンドル時は不使用)
//-------------------------------------------------------------------
const babel = require("gulp-babel"); // gulpでBabelを操作
const uglify = require("gulp-uglify"); // JSを圧縮

gulp.task("babel", () => {
  return (
    gulp
      .src(["./src/js/**/*.js", "!" + "./src/js/**/_*.js"], {
        sourcemaps: true,
      })
      .pipe(
        babel({
          presets: ["@babel/preset-env"],
        })
      )
      .pipe(gulpIf(isProd, uglify())) // 商用環境なら圧縮
      //.pipe(gulpIf(isProd, // 商用環境なら
      //  rename({extname: '.min.js'}) //名前変更
      //))
      .pipe(gulp.dest("./dist/js", { sourcemaps: "." }))
  );
});
//JSが更新されたか監視
gulp.task("babel-watch", () => {
  return gulp.watch("./src/js/**/*.js", gulp.task("babel"));
});

//-------------------------------------------------------------------
//ESlint
//-------------------------------------------------------------------
const eslint = require("gulp-eslint");

gulp.task("eslint", () => {
  return gulp
    .src("./src/js/**/*.js")
    .pipe(eslint({ fix: true })) //gulp-eslintを実行して、構文のチェック※fix: trueで自動修正
    .pipe(eslint.format()) //ターミナル内に結果の出力をおこなう
    .pipe(eslint.failAfterError()) //ルールに引っかかった際にはエラーを出力
    .pipe(gulp.dest("./src/js"));
});
//JSが更新されたか監視
gulp.task("eslint-watch", () => {
  return gulp.watch("./src/js/**/*.js", gulp.task("eslint"));
});

//-------------------------------------------------------------------
//画像圧縮（png,jpg,gif,svg）
//-------------------------------------------------------------------
const imageResize = require("gulp-image-resize"); //画像リサイズ
const imagemin = require("gulp-imagemin"); //画像圧縮
const imageminPngquant = require("imagemin-pngquant"); //png不可逆圧縮
const imageminMozjpeg = require("imagemin-mozjpeg"); //jpeg不可逆圧縮
const changed = require("gulp-changed"); //差分をとって変わった部分を変更する
const filelog = require("gulp-filelog"); //処理されたファイル名をログに流す

// 画像圧縮オプション
const imageminOption = [
  imageminPngquant({
    quality: [0.7, 0.85],
    speed: 1,
  }),
  imageminMozjpeg({
    quality: 80, // 画質 こちらも0から100まで指定できるが、pngquantと違って65-80のように幅を持って指定はできない。1つの数字のみ。
    progressive: true, // baselineとprogressiveがある。baselineよりprogressiveのほうがエンコードは遅いが圧縮率は高い。
  }),
  imagemin.gifsicle({
    interlaced: false,
    optimizationLevel: 1,
    colors: 256,
  }),
  //imagemin.jpegtran(),
  imagemin.optipng(),
  imagemin.svgo({
    plugins: [
      // viewBox属性を削除する（widthとheight属性がある場合）。
      // 表示が崩れる原因になるので削除しない。
      { removeViewBox: false },
      // <metadata>を削除する。
      // 追加したmetadataを削除する必要はない。
      { removeMetadata: false },
      // SVGの仕様に含まれていないタグや属性、id属性やvertion属性を削除する。
      // 追加した要素を削除する必要はない。
      { removeUnknownsAndDefaults: false },
      // コードが短くなる場合だけ<path>に変換する。
      // アニメーションが動作しない可能性があるので変換しない。
      { convertShapeToPath: false },
      // 重複や不要な`<g>`タグを削除する。
      // アニメーションが動作しない可能性があるので変換しない。
      { collapseGroups: false },
      // SVG内に<style>や<script>がなければidを削除する。
      // idにアンカーが貼られていたら削除せずにid名を縮小する。
      // id属性は動作の起点となることがあるため削除しない。
      { cleanupIDs: false },
    ],
  }),
];

// リサイズオプション
const resizeOptions = {
  width: 200,
  height: 200,
  gravity: "Center",
  crop: true, // 切り取り
  upscale: false, // 拡大表示
  imageMagick: true,
};

gulp.task("img-min", () => {
  return (
    gulp
      .src("./src/img/**/*.{jpg,JPG,jpeg,JPEG,png,PNG,gif,GIF,svg,SVG}") // jpg、jpeg、png、gif、svg拡張子に一致するすべてのファイル
      .pipe(changed("./dist/img")) // ./src/imgフォルダの中身と、出力先の./dist/imgフォルダの中身を比較して異なるものだけ処理(新しく追加されたファイル等)
      //.pipe(imageResize(resizeOptions)) // リサイズ
      .pipe(imagemin(imageminOption)) // 画像圧縮
      .pipe(gulp.dest("./dist/img")) // imgファイルに保存(出力)
      .pipe(filelog()) //処理されたファイル名をログに流す
      //画像圧縮完了通知
      .pipe(
        notify({
          title: "Img Compression",
          message: "Images Compression finished",
        })
      )
  );
});

//imgが更新されたか監視
gulp.task("img-watch", () => {
  return gulp.watch("./src/img/**/*", gulp.series("img-min"));
});

//-------------------------------------------------------------------
//distとsrcで連携削除&追加
//-------------------------------------------------------------------
const del = require("del");

const path = require("path");

const wait = require("gulp-wait");
const vinylPaths = require("vinyl-paths");

//-------------------------------------------------------------------
//distとsrcで連携削除&追加（ダミー動作はする）→画像を一旦全削除して、再圧縮
//-------------------------------------------------------------------
gulp.task("clean", () => {
  return del(["./dist/img/**/*"]);
});

gulp.task("sync-img-watch", () => {
  gulp.watch("./src/img/**/*", gulp.series("clean", "img-min"));
});

//-------------------------------------------------------------------
//ブラウザ更新チェック
//-------------------------------------------------------------------
//ローカルサーバーを立ち上げて自動でブラウザをリロード
const browserSync = require("browser-sync").create();
const browserSyncOption = {
  port: 3000,
  server: {
    baseDir: "./dist/",
    index: "index.html",
  },
  reloadOnRestart: true,
};

//ローカルサーバーを立ち上げ、ブラウザで初期読み込み
gulp.task("local-server", (done) => {
  browserSync.init(browserSyncOption);
  done();
});

//ブラウザ自動更新
gulp.task("bs-reload", (done) => {
  const browserReload = (done) => {
    browserSync.reload();
    done();
  };
  gulp.watch("./dist/**/*", browserReload);
});

//ブラウザ初期読み込み&自動更新
gulp.task("bs-watch", gulp.series("local-server", "bs-reload"));
// gulp.task("bs-reload", () => {
//   browserSync.reload();
// });

//-------------------------------------------------------------------
//ftpアップロードを自動化
//-------------------------------------------------------------------
const ftp = require("vinyl-ftp");
const fancyLog = require("fancy-log");

gulp.task("ftp", () => {
  const ftpConfig = {
    host: "enterinfo.xsrv.jp", //FTPSサーバー
    user: "enterinfo", //FTP・WebDAVアカウント
    password: "cbxxlqiy", //FTP・WebDAVパスワード
    log: fancyLog,
  };

  const connect = ftp.create(ftpConfig);
  const ftpUploadFiles = "./dist/**/*";

  //バッファ機能をオフにする設定
  const ftpUploadConfig = {
    buffer: false,
  };

  const remoteDistDir = "/enterinfo.xsrv.jp/public_html/bbb";

  return (
    gulp
      .src(ftpUploadFiles, ftpUploadConfig)
      // .pipe(connect.newer(remoteDistDir)) // リモートサーバーとファイルを比較し、更新日時よりファイルが新しいファイルのみを残したふとリームに変換
      .pipe(connect.dest(remoteDistDir))
  );
});

//-------------------------------------------------------------------
//ftpアップロードを自動化2
//-------------------------------------------------------------------
const FtpDeploy = require("ftp-deploy");
const ftpDeploy = new FtpDeploy();

//　接続情報を設定
const ftpOptions = {
  host: "enterinfo.xsrv.jp", //FTPSサーバー
  user: "enterinfo", //FTP・WebDAVアカウント
  password: "cbxxlqiy", //FTP・WebDAVパスワード
  localRoot: "./dist/", //アップロードするファイルがあるフォルダを指定
  // remoteRoot: "/home/test/www/ftp_deploy_test/", //サーバーのアップロード先を指定
  remoteRoot: "/enterinfo.xsrv.jp/public_html/bbb", //サーバーのアップロード先を指定
  include: ["*"], //アップロードするファイルを指定できます。
  exclude: [], //アップロードしないファイルを指定できます。
  deleteRemote: false,
  log: fancyLog,
};

//タスクを登録
gulp.task("ftp2", (done) => {
  ftpDeploy.deploy(ftpOptions, (error) => {
    if (error) {
      console.log("Error", error);
    }
  });
  done();
});

//-------------------------------------------------------------------
//watchをデフォルトに設定&sassコンパイル、ブラウザ自動更新を行う
//-------------------------------------------------------------------
gulp.task(
  "default",
  gulp.series(
    "ejs",
    "sass",
    // "babel",
    "webpack",
    "img-min",
    gulp.parallel(
      "sass-watch",
      "ejs-watch",
      // "babel-watch",
      "webpack-watch",
      "img-watch",
      "bs-watch"
    )
  )
);
