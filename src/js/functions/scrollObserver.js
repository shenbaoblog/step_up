// ポリフィル（IntersectionObserver）
import "intersection-observer";
export class ScrollObserver {
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
