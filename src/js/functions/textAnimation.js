// ----------------------
// CSSを使用したテキストアニメーション（文字数制限あり）
export class textAnimation {
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
export class gsapTextAnimation extends textAnimation {
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
