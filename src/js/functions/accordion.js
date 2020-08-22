// export default function accordion() {
// アコーディオン
$(function() {
  $(".js_accordion_title").on("click", function() {
    /*クリックでコンテンツを開閉*/
    $(this)
      .next()
      .slideToggle(200);
    /*矢印の向きを変更*/
    $(this).toggleClass("open", 200);
  });
});
// }
