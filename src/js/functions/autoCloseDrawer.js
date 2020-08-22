// ドロワーをクリックで閉じる
$(function() {
  $(".ly_navigation .bl_headerNav_link").on("click", function(event) {
    $(".bl_drawer_checkbox").prop("checked", false);
  });
});
