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
// import "./functions/toTop"; // トップへ戻るボタンを途中表示
// import "./functions/autoCloseDrawer"; // ドロワーをクリックで自動クローズ
// import "./functions/currentScroll"; // カレントスクロール
// import "./functions/smoothScroll"; // スムーススクロール
// import "./functions/accordion"; // アコーディオンimport { reduce } from "core-js/fn/array";

// スワイパー
import { HeroSlider } from "./functions/swiper";
// テキストアニメーション
import { textAnimation, gsapTextAnimation } from "./functions/textAnimation";
// スクロールオブザーバー
import { ScrollObserver } from "./functions/scrollObserver";
// ドロワー
import { drawerMenu } from "./functions/drawerMenu";
// ページローダー
import "./venders/pace.min";

// 実行用クラス
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
