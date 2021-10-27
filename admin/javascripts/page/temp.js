
var path = window.location.pathname;
var where = path.split("/").pop().split(".")[0];

window.onload = function() {
    var path = ["首頁", "棧點管理", "現有棧點"]; 
    showBreadcrumb(path);
}