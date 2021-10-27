
var path = window.location.pathname;
var where = path.split("/").pop().split(".")[0];

window.onload = function() {
    var path = ["首頁", "網站導覽說明"]; 
    showBreadcrumb(path);
}