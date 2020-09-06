export class drawerMenu {
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
