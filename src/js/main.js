// ----------------------
// jQuery読み込む
import "./venders/jquery.min";

// ----------------------
// 画像遅延読み込み
import "./venders/lazyload.min";
$("img.js_lazyLoad").lazyload({});

// ----------------------
// ポリフィル（object-fit）
import objectFitImages from "object-fit-images"; // ポリフィル（object-fit）
objectFitImages();

// ----------------------
// ポリフィル（sticky)
import Stickyfill from "stickyfilljs";
// ナビ
const ly_navigation_sticky = document.querySelectorAll(".ly_navigation");
Stickyfill.add(ly_navigation_sticky);
// ヘッダー
const ly_header_sticky = document.querySelectorAll(".ly_header");
Stickyfill.add(ly_header_sticky);

// ----------------------
// 横スクロール
import ScrollHint from "scroll-hint"; // scroll-hint
new ScrollHint(".js_sideScroll", {
  suggestiveShadow: true,
  i18n: {
    scrollable: "横スクロール可能",
  },
});

// ----------------------
// スワイパー
import "./venders/swiper.min";
import "./functions/swiper";
// ↓後でこっちに改善
// import swiper from "./functions/swiper_webpack";
// swiper();

// ----------------------
// テキストアニメーション
import "./functions/textAnimation";
// ----------------------
// CSSを使用したテキストアニメーション（文字数制限あり）
class textAnimation {
  constructor(el) {
    this.DOM = {};
    // 三項演算子
    // elがDOMだった場合：インターセクションオブザーバー用
    // elがセレクターの文字列あればDOMを取得
    this.DOM.el = el instanceof HTMLElement ? el : document.querySelector(el);
    // テキストを配列に分解してcharsに代入
    this.chars = this.DOM.el.innerHTML.trim().split("");
    // 加工したテキストを元の要素に代入
    this.DOM.el.innerHTML = this._splitText();
  }
  // 分割した配列をspan要素（bl_animationTxt_charクラス付き）で囲んで、結合するメソッド
  _splitText() {
    return this.chars.reduce((acc, curr) => {
      // 空白を&nbsp;に書き換え
      curr = curr.replace(/\s+/, "&nbsp;");
      // 分割した配列をspan要素（bl_animationTxt_charクラス付き）で囲んで、結合
      return `${acc}<span class="bl_animationTxt_char">${curr}</span>`;
    }, "");
  }
  animate() {
    this.DOM.el.classList.add("bl_animationTxt_view");
  }
}

// ----------------------
// gsapを使用したテキストアニメーション（文字数制限なし）：継承
import gsap, { Back } from "gsap";
class tweenTextAnimation extends textAnimation {
  constructor(el) {
    super(el);
    this.DOM.chars = this.DOM.el.querySelectorAll(".bl_animationTxt_char");
  }
  animate() {
    this.DOM.el.classList.add("bl_animationTxt_view");
    this.DOM.chars.forEach((c, i) => {
      gsap.to(c, 0.6, {
        ease: Back.easeOut,
        delay: i * 0.05,
        startAt: { y: "-50%", opacity: 0 },
        y: "0%",
        opacity: 1,
      });
    });
  }
}

// ----------------------
// 文字列をspanに分割し、各spanにbl_animationTxt_charを付与
document.addEventListener("DOMContentLoaded", function() {
  // const btnAnimation = document.querySelector("#id_btnAnimation");
  // const ta = new textAnimation(".js_animationTxt");
  // ta.animate();
  // btnAnimation.addEventListener("click", ta.animate.bind(ta));

  // // ----------------------
  // // IntersectionObserver（インターセクションオブザーバー）

  // // IntersectionObserverで監視する要素をすべて抽出
  // const els = document.querySelectorAll(".js_intersectionObserver");
  // // IntersectionObserverのコールバック関数（entries：すべての監視対象）
  // const cb = function(entries, observer) {
  //   // 各監視対象ごとにループ（entry：各監視対象）
  //   entries.forEach((entry) => {
  //     //監視対象がビューポートの内側に入ってきた場合
  //     if (entry.isIntersecting) {
  //       console.log("in view");
  //       // 監視対象要素をspanで分割し、classを付与
  //       const tweenTA = new tweenTextAnimation(entry.target);
  //       // 監視対象要素をアニメーションさせる
  //       tweenTA.animate();
  //       // entry.target.classList.add("js_intersectionObserver_inView");
  //       // 監視対象から除外
  //       observer.unobserve(entry.target);
  //       // observer.unobserve(entry.target);
  //     } else {
  //       console.log("out view");
  //       // entry.target.classList.remove("js_intersectionObserver_inView");
  //     }
  //   });
  //   // alert("IntersectionObserver");
  // };
  // const options = {
  //   root: null,
  //   rootMargin: "0px",
  //   threshold: 0,
  // };
  // // IntersectionObserverをインスタンス化
  // const io = new IntersectionObserver(cb, options);
  // // elsに格納されいてるすべての要素を監視
  // els.forEach(
  //   (el) => io.observe(el) // ループごとに各要素の監視スタート
  // );
  // // ----------------------

  const cb = function(el, isIntersecting) {
    if (isIntersecting) {
      const ta = new tweenTextAnimation(el);
      ta.animate();
    }
  };
  const so = new ScrollObserver(".bl_tweenAnimationTxt", cb);
});

class ScrollObserver {
  constructor(els, cb, options) {
    this.els = document.querySelectorAll(els);
    const defaultOptions = {
      root: null,
      rootMargin: "0px",
      threshold: 0,
    };
    this.cb = cb;
    this.options = Object.assign(defaultOptions, options);
    this._init();
  }
  _init() {
    // IntersectionObserverのコールバック関数（entries：すべての監視対象）
    const callback = function(entries, observer) {
      // 各監視対象ごとにループ（entry：各監視対象）
      entries.forEach((entry) => {
        //監視対象がビューポートの内側に入ってきた場合
        if (entry.isIntersecting) {
          // 監視対象要素をspanで分割し、classを付与
          // const tweenTA = new tweenTextAnimation(entry.target);
          // 監視対象要素をアニメーションさせる
          // tweenTA.animate();
          // entry.target.classList.add("js_intersectionObserver_inView");
          // 監視対象から除外
          this.cb(entry.target, true);
          observer.unobserve(entry.target);
        } else {
          this.cb(entry.target, false);
          // entry.target.classList.remove("js_intersectionObserver_inView");
        }
      });
      // alert("IntersectionObserver");
    };
    // IntersectionObserverをインスタンス化
    const io = new IntersectionObserver(callback.bind(this), this.options);
    // elsに格納されいてるすべての要素を監視
    this.els.forEach(
      (el) => io.observe(el) // ループごとに各要素の監視スタート
    );
  }
}

// ----------------------
import "./functions/toTop"; // トップへ戻るボタンを途中表示
import "./functions/autoCloseDrawer"; // ドロワーをクリックで自動クローズ
import "./functions/currentScroll"; // カレントスクロール
import "./functions/smoothScroll"; // スムーススクロール
import "./functions/accordion"; // アコーディオンimport { reduce } from "core-js/fn/array";
