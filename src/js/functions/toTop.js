// トップへ戻るボタンを途中表示
jQuery(function() {
  $(window).scroll(function() {
    let now = $(window).scrollTop();
    if (now > 100) {
      // $(".bl_toTop").fadeIn("200");
      $(".bl_toTop").addClass("js_visible");
    } else {
      // $(".bl_toTop").fadeOut("200");
      $(".bl_toTop").removeClass("js_visible");
    }
  });
});
