// スムーススクロール
$(function() {
  // #で始まるリンクをクリックしたら実行
  $('a[href^="#"]').click(function() {
    let adjust = 0; // スクロール位置の微調整
    let speed = 500; // スクロール速度（ミリ秒で記述）
    let href = $(this).attr("href");
    let target = $(href == "#" || href == "" ? "html" : href);
    let position = target.offset().top + adjust;
    $("body,html").animate({ scrollTop: position }, speed, "swing");
    return false;
  });
});
