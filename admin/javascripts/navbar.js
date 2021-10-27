
var navUserName = "";
const adminAuthority = localStorage.getItem("userRoleDetail");
var isError = false;

// get UserName
function getNavUserName(){
    console.log("[Admin's Token]：" + localStorage.getItem("token"));

    var path = window.location.pathname;
    var pageName = path.split("/").pop().split(".")[0];

    if (localStorage.getItem("token") === null) {
        fetch_error(response, pageName);
    }

    fetch( API_url + '/v1/api/auth/', {
        method: 'GET',
        headers: new Headers({
            'Content-Type': 'application/json',
            'x-eden-token': localStorage.getItem('token')
        })
    })
    .then(function checkStatus(response) {

        if (response.status == 200 || response.status == 201) {
            return response.json();
        }else if(response.status == 401){
            alert("請重新登入(系統將自動轉跳)");
            setTimeout(function(){ 
                window.location.href = 'login.html';
            }, 2000);
        }else{
            isError = true
            fetch_error(response, pageName);
        }

    }).then((jsonData) => {

        localStorage.setItem('userName',jsonData.userName);
        localStorage.setItem('userRole',jsonData.userRole);
        localStorage.setItem('userRoleDetail',jsonData.userRoleDetail);
          

        navUserName = jsonData.userName;
        document.getElementById("navUserName").innerHTML = jsonData.userName + "，您好";

    }).catch((err) => {
        console.log('錯誤:', err);
    })
}


// something need to do when load this js file
iniLoad_navbar();
iniLoad_footer();
if(localStorage.getItem("userName") === null){
    getNavUserName();
}else{
    if(localStorage.getItem("userName").length > 0){
        navUserName = localStorage.getItem("userName");
        document.getElementById("navUserName").innerHTML = navUserName + "，您好";

        if(localStorage.getItem("userRoleDetail") === "admin"){
            document.getElementById("navUserType").innerHTML = "系統管理員 <small>Admin</small>";
        }else if(localStorage.getItem("userRoleDetail") === "admin_writable"){
            document.getElementById("navUserType").innerHTML = "可寫管理員 <small>Writable</small>";
        }else{
            document.getElementById("navUserType").innerHTML = "唯讀管理員 <small>ReadOnly</small>";
        }
        
    }else{
        getNavUserName();
    }
}


function iniLoad_navbar(){
    var path = window.location.pathname;
    var currentPage_fileName = path.split("/").pop();


    // show nav image
    var $webImage_title = $("<a class=\"navbar-brand\" href=\"index.html\"><img src=\"images/logo_white_nav.png\" width=\"30\" height=\"30\" class=\"d-inline-block align-top\" alt=\"\">愛心棧管理後台</a>");
    
    var $navButton = $("<button class=\"navbar-toggler\" type=\"button\" data-toggle=\"collapse\" data-target=\"#navbarSupportedContent\" aria-controls=\"navbarSupportedContent\" aria-expanded=\"false\" aria-label=\"Toggle navigation\"><span class=\"navbar-toggler-icon\"></span></button>");

    var $navContent = $("<div class=\"collapse navbar-collapse\" id=\"navbarSupportedContent\">");



    // show main nav menu
    var $menu = $("<ul class=\"navbar-nav mr-auto\"></ul>");

    $.each(navList, function(i, val) {
        if(adminAuthority !== "admin" && val.title === "系統管理"){
            return;
        }

        var $item = $("<li class=\"nav-item dropdown\"></li>");
        var $title = $("<a class=\"nav-link dropdown-toggle\" href=\"#\" id=\"navbarDropdown\" role=\"button\" data-toggle=\"dropdown\"  aria-haspopup=\"true\" aria-expanded=\"false\"></a>").html(val.title);
        var $title_active = $("<a class=\"nav-link dropdown-toggle active\" href=\"#\" id=\"navbarDropdown\" role=\"button\" data-toggle=\"dropdown\"  aria-haspopup=\"true\" aria-expanded=\"false\"></a>").html(val.title);


        // check Main active
        var isActive_main = false;
        $.each(val.submenu, function(j, sub) {
            var urlList = val.url[j];
            var urlArray = urlList.split("/");

            for(var j = 0; j < urlArray.length; j ++){
                if(urlArray[j] == currentPage_fileName){
                    isActive_main = true;
                    break;
                }
            }
        });

        if(isActive_main){
            $item.append($title_active);
        }else{
            $item.append($title);
        }
        

        var $submenu = $("<div class=\"dropdown-menu\" aria-labelledby=\"navbarDropdown\"></div>");
        $.each(val.submenu, function(j, sub) {
            var isActive_sub = false;
            var urlList = val.url[j];
            var urlArray = urlList.split("/");

            for(var j = 0; j < urlArray.length; j ++){
                if(urlArray[j] == currentPage_fileName){
                    isActive_sub = true;
                    break;
                }
            }

            if(isActive_sub){
                $submenu.append($("<a class=\"dropdown-item active\" href=\"" + urlArray[0] + "\"></a>").html(sub));
            }else{
                $submenu.append($("<a class=\"dropdown-item\" href=\"" + urlArray[0] + "\"></a>").html(sub));
            }
        });

        $menu.append($item.append($submenu));    
    });

    $navContent.append($menu);


    // show user nav menu
    var $userDiv = $("<div class=\"nav-item dropdown ml-md-auto\"></div>");
    var $userMenu = $("<ul class=\"navbar-nav mr-auto\"></ul>");
    var $userMenu_item = $("<li class=\"nav-item dropdown\"></li>");

    if(currentPage_fileName == "change_password.html"){
        var $userMenu_title = $("<a class=\"nav-link dropdown-toggle active\" href=\"#\" id=\"navbarDropdown\" role=\"button\" data-toggle=\"dropdown\"" +
    " aria-haspopup=\"true\" aria-expanded=\"false\"></a>").html( "<span id=\"navUserName\"></span>");
    }else{
        var $userMenu_title = $("<a class=\"nav-link dropdown-toggle\" href=\"#\" id=\"navbarDropdown\" role=\"button\" data-toggle=\"dropdown\"" +
    " aria-haspopup=\"true\" aria-expanded=\"false\"></a>").html( "<span id=\"navUserName\"></span>");
    }
    
    $userMenu_item.append($userMenu_title);

    var $userMenu_submenu = $("<div class=\"dropdown-menu\" aria-labelledby=\"navbarDropdown\"></div>");
    $userMenu_submenu.append($("<a id=\"menu_user_type\" class=\"dropdown-item\" href=\"" + "javascript: void(0)" + "\" onClick=\"return false;\"></a>").html("<span id=\"navUserType\" style=\"color:#999; font-size:80%;\"></span>"));
    $userMenu_submenu.append($("<a  class=\"dropdown-item pt-0 py-0\" href=\"" + "javascript: void(0)" + "\"></a>").html("<div class=\"dropdown-divider\"></div>"));

    if(currentPage_fileName == "change_password.html"){
        $userMenu_submenu.append($("<a class=\"dropdown-item active\" href=\"" + "change_password.html" + "\"></a>").html("變更密碼"));
    }else{
        $userMenu_submenu.append($("<a class=\"dropdown-item\" href=\"" + "change_password.html" + "\"></a>").html("變更密碼"));
    }

    
    $userMenu_submenu.append($("<a class=\"dropdown-item\" href=\"javascript: void(0)\" onclick=\"logout();\"></a>").html("登出"));



    $userMenu_submenu.append($("<a  class=\"dropdown-item pt-0 py-0\" href=\"" + "javascript: void(0)" + "\"></a>").html("<div class=\"dropdown-divider\"></div>"));

    if(currentPage_fileName == "guide.html"){
        $userMenu_submenu.append($("<a class=\"dropdown-item active\" href=\"guide.html\"></a>").html("網站導覽"));
    }else{
        $userMenu_submenu.append($("<a class=\"dropdown-item\" href=\"guide.html\"></a>").html("網站導覽"));
    }
    

    $userDiv.append($userMenu.append($userMenu_item.append($userMenu_submenu)));

    $navContent.append($userDiv);




    $("#websiteNav").append($webImage_title);
    $("#websiteNav").append($navButton);
    $("#websiteNav").append($navContent);
}

function iniLoad_footer(){
    var $foot_div = $("<div class=\"text-center p-3\" style=\"background-color: rgba(0, 0, 0, 0.2); font-size: 10pt;\"></div>");
    var $a = $("<a class=\"text-dark\" href=\"https://donations.eden.org.tw/\"> 財團法人伊甸社會福利基金會</a>");

    $foot_div.append("© 2020 Copyright:&nbsp;");
    $foot_div.append($a);
    $("#websiteFooter").append($foot_div);
}

function logout(){
    localStorage.setItem("token", "");
    localStorage.setItem("userName", "");
    localStorage.setItem("userRold", "");
    localStorage.setItem("userRoleDetail", "");
    window.location.href = 'login.html';
}


function setReadOnly(hideIdList, readonlyIdList = [], changeTextIdList = []){

    if(adminAuthority === "admin_readonly"){
        for(var i = 0; i < hideIdList.length; i++){
            var item = document.getElementById(hideIdList[i]);
    
            item.style.display = "none";
        }

        for(var i = 0; i < readonlyIdList.length; i++){
            var item = document.getElementById(readonlyIdList[i]);
            try{
                item.readOnly = true;
                item.disabled = true
            }catch($e){

            }
        }

        for(var i = 0; i < changeTextIdList.length; i++){
            var item = document.getElementById(changeTextIdList[i]);
            try{
                item.innerHTML = "檢視"
            }catch($e){

            }
        }
    }
}

var menu_user_type_click_number = 0;
$("#menu_user_type").click(renew_menu_user_type);