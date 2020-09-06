// スワイパーベンダーの読み込み
import "../venders/swiper.min";

export class HeroSlider {
  constructor(el) {
    this.el = el;
    this.swiper = this._initSwiper();
  }
  // スワイパーの設定一覧を初期に実行
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
  // オートスライド開始メソッド
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
  // オートスライド停止メソッド
  stop() {
    this.swiper.autoplay.stop();
  }
}
