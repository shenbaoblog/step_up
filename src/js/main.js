// ----------------------
// jQuery読み込む
// import "./venders/jquery.min";

// ----------------------
// 画像遅延読み込み
// import "./venders/lazyload.min";
// $("img.js_lazyLoad").lazyload({});

// ----------------------
// ポリフィル（object-fit）
import objectFitImages from "object-fit-images"; // ポリフィル（object-fit）
objectFitImages();

// ----------------------
// ポリフィル（sticky)
// import Stickyfill from "stickyfilljs";
// // ナビ
// const ly_navigation_sticky = document.querySelectorAll(".ly_navigation");
// Stickyfill.add(ly_navigation_sticky);
// // ヘッダー
// const ly_header_sticky = document.querySelectorAll(".ly_header");
// Stickyfill.add(ly_header_sticky);

// ----------------------
// 横スクロール
// import ScrollHint from "scroll-hint"; // scroll-hint
// new ScrollHint(".js_sideScroll", {
//   suggestiveShadow: true,
//   i18n: {
//     scrollable: "横スクロール可能",
//   },
// });

// ----------------------
// スワイパー
import "./venders/swiper.min";
// import "./functions/swiper";
class HeroSlider {
  constructor(el) {
    this.el = el;
    this.swiper = this._initSwiper();
  }

  _initSwiper() {
    return new Swiper(this.el, {
      // Optional parameters
      // direction: "vertical",
      loop: true,
      grabCursor: true,
      effect: "coverflow",
      centeredSlides: true,
      slidesPerView: 1,
      speed: 1000,
      breakpoints: {
        1024: {
          slidesPerView: 2,
        },
      },
    });
  }

  start(options = {}) {
    options = Object.assign(
      {
        delay: 4000,
        disableOnInteraction: false,
      },
      options
    );
    this.swiper.params.autoplay = options;
    this.swiper.autoplay.start();
  }

  stop() {
    this.swiper.autoplay.stop();
  }
}

// const hero = new HeroSlider(".swiper-container");
// hero.start();
// ↓後でこっちに改善したい
// import swiper from "./functions/swiper_webpack";
// swiper();

// ----------------------
// テキストアニメーション
// import "./functions/textAnimation";
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
    this.DOM.el.classList.add("js_inView");
  }
}
// ----------------------
// gsapを使用したテキストアニメーション（文字数制限なし）：継承
import gsap, { Back } from "gsap";
class gsapTextAnimation extends textAnimation {
  constructor(el) {
    super(el);
    this.DOM.chars = this.DOM.el.querySelectorAll(".bl_animationTxt_char");
  }
  animate() {
    this.DOM.el.classList.add("js_inView");
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
// スクロールオブザーバー
// import "./functions/scrollObserver";

// ポリフィル（IntersectionObserver）
import "intersection-observer";
class ScrollObserver {
  constructor(els, cb, options) {
    this.els = document.querySelectorAll(els);
    const defaultOptions = {
      root: null,
      rootMargin: "0px",
      threshold: 0,
      once: true,
    };
    this.cb = cb;
    this.options = Object.assign(defaultOptions, options);
    this.once = this.options.once;
    this._init();
  }
  _init() {
    // IntersectionObserverのコールバック関数（entries：すべての監視対象）
    const callback = function(entries, observer) {
      // 各監視対象ごとにループ（entry：各監視対象）
      entries.forEach((entry) => {
        //監視対象がビューポートの内側に入ってきた場合
        if (entry.isIntersecting) {
          // クラスの外部で宣言したコールバック関数実行
          this.cb(entry.target, true);
          // 一度発火したら、監視対象から除外
          // console.log(this.once);
          if (this.once) {
            // 監視対象から除外
            observer.unobserve(entry.target);
          }
        } else {
          // クラスの外部で宣言したコールバック関数実行
          this.cb(entry.target, false);
        }
      });
      // alert("IntersectionObserver");
    };
    // IntersectionObserverをインスタンス化
    this.io = new IntersectionObserver(callback.bind(this), this.options);
    // 100msごとにスクロールの値を監視（ポリフィルによるIE対策）
    this.io.POLL_INTERVAL = 100;
    // elsに格納されいてるすべての要素を監視
    this.els.forEach(
      (el) => this.io.observe(el) // ループごとに各要素の監視スタート
    );
  }
  // 監視している対象の開放
  destroy() {
    this.io.disconnect();
  }
}

// -------------------------------
// ドロワー
class drawerMenu {
  constructor() {
    this.DOM = {};
    this.DOM.btn = document.querySelector(".bl_drawer_btn");
    this.DOM.container = document.querySelector(".ly_container");
    this.DOM.cover = document.querySelector(".bl_drawerMenuCover");
    this.eventType = this._getEventType();
    this._addEvent();
  }

  _getEventType() {
    return window.ontouchstart ? "touchstart" : "click";
  }
  _toggle() {
    this.DOM.container.classList.toggle("js_drawerOpen__container");
  }
  _addEvent() {
    this.DOM.btn.addEventListener(this.eventType, this._toggle.bind(this));
    this.DOM.cover.addEventListener(this.eventType, this._toggle.bind(this));
  }
}
// new drawerMenu();

// -------------------------------
// ページローダー
import "./venders/pace.min";

// ----------------------
// import "./functions/toTop"; // トップへ戻るボタンを途中表示
// import "./functions/autoCloseDrawer"; // ドロワーをクリックで自動クローズ
// import "./functions/currentScroll"; // カレントスクロール
// import "./functions/smoothScroll"; // スムーススクロール
// import "./functions/accordion"; // アコーディオンimport { reduce } from "core-js/fn/array";

class Main {
  constructor() {
    this.header = document.querySelector(".bl_header");
    this.sides = document.querySelectorAll(".bl_side");
    this._observers = [];
    this._init();
  }

  set observers(val) {
    this._observers.push(val);
  }

  get observers() {
    return this._observers;
  }

  _init() {
    new drawerMenu();
    this.hero = new HeroSlider(".swiper-container");
    Pace.on("done", this._paceDone.bind(this));
    // this._scrollInit();
  }

  _paceDone() {
    this._scrollInit();
  }

  _destroyObservers() {
    this.observers.forEach((ob) => {
      console.log(ob);
      ob.destroy();
    });
  }

  destroy() {
    this._destroyObservers();
  }

  _scrollInit() {
    this.observers = new ScrollObserver(
      ".js_navTrigger",
      this._navAnimation.bind(this),
      {
        once: false,
      }
    );
    this.observers = new ScrollObserver(
      ".bl_coverSlide",
      this._inViewAnimation,
      {}
    );
    this.observers = new ScrollObserver(
      ".bl_appear",
      this._inViewAnimation,
      {}
    );
    this.observers = new ScrollObserver(
      ".bl_gsapAnimationTxt",
      this._textAnimation.bind(this),
      {}
    );
    this.observers = new ScrollObserver(
      ".bl_mainContent",
      this._sideTextAnimation.bind(this),
      { once: false, rootMargin: "-300px 0px" }
    );
    this.observers = new ScrollObserver(
      ".swiper-container",
      this._toggleSlideAnimation.bind(this),
      {
        once: false,
      }
    );
  }

  // ヒーロースライダー
  _toggleSlideAnimation(el, isIntersecting) {
    if (isIntersecting) {
      this.hero.start();
    } else {
      this.hero.stop();
    }
  }

  // ヘッダートリガー検知
  _navAnimation(el, isIntersecting) {
    if (isIntersecting) {
      this.header.classList.remove("js_triggered");
    } else {
      this.header.classList.add("js_triggered");
    }
  }

  // カバースライドのスクロール検知
  _inViewAnimation(el, isIntersecting) {
    if (isIntersecting) {
      el.classList.add("js_inView");
    } else {
      el.classList.remove("js_inView");
    }
  }

  // アニメーションテキストのスクロール検知
  _textAnimation(el, isIntersecting) {
    if (isIntersecting) {
      const ta = new gsapTextAnimation(el);
      ta.animate();
    }
  }

  // サイドテキストアニメーションのスクロール検知
  _sideTextAnimation(el, isIntersecting) {
    if (isIntersecting) {
      this.sides.forEach((side) => side.classList.add("js_inView"));
    } else {
      this.sides.forEach((side) => side.classList.remove("js_inView"));
    }
  }
}

document.addEventListener("DOMContentLoaded", function() {
  const main = new Main();
  // main.destroy();
});
