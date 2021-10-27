// let API_url = 'https://api.loveeden.tk';
// let API_url = 'http://localhost:8080';
let API_url = 'https://ehomeline.eden.org.tw';

let navList = [{
        "title": "系統管理",
        "submenu": ["審查管理員帳號", "新增管理員帳號", "檢視管理員帳號"],
        "url": ["check_account_admin.html/check_admin.html", "admin_enroll_admin.html", "admin_account.html"]
    },
    {
        "title": "帳號管理",
        "submenu": ["審查使用者帳號", "合作單位帳號管理"],
        "url": ["check_account.html/check_people.html/check_referral.html/check_landlord.html/check_volunteer.html/check_firm.html", "partners.html"]
    },
    {
        "title": "待辦審核",
        "submenu": ["待審核入住申請", "待審核契約文件", "待審核需求變更", "待指派志工與廠商"],
        "url": ["review_checkin.html/check_apply.html", "review_file.html/check_file.html", "review_change.html/check_change.html", "review_unassigned.html/assign_service.html"]
    },
    {
        "title": "入住管理",
        "submenu": ["棧點使用狀態", "檢視入住申請單", "今日入住/退房紀錄", "檢視入住/退房回報紀錄", "檢視服務指派紀錄", "檢視服務回報紀錄", "檢視廠商清潔紀錄"],
        "url": ["rent.html", "review_application.html/review_application_detail.html", "review_today.html", "view_room.html/view_room_image.html/view_room_checkin.html/view_room_checkout.html/view_room_investigation.html", "view_assign.html", "view_service.html", "view_cleaning.html"]
    },
    {
        "title": "棧點管理",
        "submenu": ["現有棧點", "公共家具管理", "房間家具管理"],
        "url": ["house.html/house_info_insert.html/house_info.html/furniture_public.html/rooms.html/furniture_private.html", "furniture_public_manage.html", "furniture_private_manage.html"]
    },
];

let urlList = [
    { "title": "首頁", "url": "index.html" },
    { "title": "審查管理員帳號", "url": "check_account_admin.html" },
    { "title": "新增管理員帳號", "url": "admin_enroll_admin.html" },
    { "title": "管理員帳號申請", "url": "check_admin.html" },
    { "title": "檢視管理員帳號", "url": "admin_account.html" },
    { "title": "審查使用者帳號", "url": "check_account.html" },
    { "title": "審查入住申請單", "url": "check_apply.html" },
    { "title": "審核入住契約文件", "url": "check_file.html" },
    { "title": "審核變更需求單", "url": "check_change.html" },
    { "title": "愛心房東帳號申請", "url": "check_landlord.html" },
    { "title": "就醫民眾帳號申請", "url": "check_people.html" },
    { "title": "轉介單位帳號申請", "url": "check_referral.html" },
    { "title": "廠商員工帳號申請", "url": "check_firm.html" },
    { "title": "入住回報", "url": "view_room_checkin.html" },
    { "title": "退房回報", "url": "view_room_checkout.html" },
    { "title": "愛心棧問卷", "url": "view_room_investigation.html" },
    { "title": "棧點房間家具", "url": "furniture_private.html" },
    { "title": "棧點公共家具", "url": "furniture_public.html" },
    { "title": "房間家具管理", "url": "furniture_private_manage.html" },
    { "title": "公共家具管理", "url": "furniture_public_manage.html" },
    { "title": "現有棧點", "url": "house.html" },
    { "title": "編輯棧點資訊", "url": "house_info.html" },
    { "title": "棧點照片管理", "url": "house_images.html" },
    { "title": "棧點影圖管理", "url": "house_configuration.html" },
    { "title": "新增棧點", "url": "house_info_insert.html" },
    { "title": "棧點使用狀態", "url": "rent.html" },
    { "title": "今日入住/退房紀錄", "url": "review_today.html" },
    { "title": "棧點房間", "url": "rooms.html" },
    { "title": "契約文件", "url": "view_room_image.html" },
    { "title": "檢視入住/退房紀錄", "url": "view_room.html" },
    { "title": "合作單位帳號管理", "url": "partners.html" },
    { "title": "檢視服務回報紀錄", "url": "view_service.html" },
    { "title": "檢視廠商清潔紀錄", "url": "view_cleaning.html" },
    { "title": "待審核需求變更", "url": "view_change.html" },
    { "title": "待審核入住申請", "url": "review_checkin.html" },
    { "title": "待審核契約文件", "url": "review_file.html" },
    { "title": "待指派志工與廠商", "url": "review_unassigned.html" },
    { "title": "指派志工與廠商", "url": "assign_service.html" },
    { "title": "檢視服務指派紀錄", "url": "view_assign.html" },
    { "title": "變更密碼", "url": "change_password.html" },
    { "title": "檢視入住申請單", "url": "review_application.html" },
    { "title": "檢視入住申請單內容", "url": "review_application_detail.html" },
    { "title": "網站導覽說明", "url": "guide.html" }

];

function showBreadcrumb(path) {
    var $nav = $("<nav></nav>");
    var $ol = $("<ol class=\"breadcrumb\"></ol>");

    $.each(path, function(i, val) {
        var url = getUrlByPageName(val);

        if (url === undefined) {
            url = val;
        } else {
            if (i == path.length - 1) {
                url = "<a href=\"javascript:window.location.href=window.location.href\" style=\"font-size: 16px; color: #6c757d; font-weight: normal; text-decoration: underline; \">" + val + "</a>";
            } else {
                url = "<a href=\"" + getUrlByPageName(val) + "\" style=\"font-size: 16px; color: #212529; font-weight: normal;\">" + val + "</a>";
            }

        }

        if (i == path.length - 1) {
            $ol.append($("<li class=\"breadcrumb-item active\"></li>").html(url));
        } else {
            $ol.append($("<li class=\"breadcrumb-item\"></li>").html(url));
        }
    });

    $("#breadcrumbDiv").append($nav.append($ol));
}

function getUrlByPageName(pageName) {
    for (var i = 0; i < urlList.length; i++) {
        var val = urlList[i];
        if (val.title === pageName) {
            return val.url;
        }
    }
}


function getParameterByName(name, back = "", url = window.location.href) {
    name = name.replace(/[\[\]]/g, '\\$&');

    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) {
        if (back !== "") {
            window.location.href = back;
        }
        return '';
    };
    if (!results[2]) {
        if (back !== "") {
            window.location.href = back;
        }
        return '';
    }

    var value = decodeURIComponent(results[2].replace(/\+/g, ' '));
    return value;

}

function ajax_error(xhr, thrownError, where) {
    var datastr = JSON.parse(xhr.responseText);
    if (xhr.status == 400) {
        if (datastr.hasOwnProperty("apiError")) {
            if (datastr.apiError.hasOwnProperty("subErrors")) {
                var field = datastr.apiError.subErrors[0].field;
                var message = datastr.apiError.subErrors[0].message;
                alert('格式錯誤 ' + field + ':' + message);
            } else {
                alert('格式錯誤 ' + datastr.apiError.message);
            }
        } else {
            alert('錯誤代碼 ' + xhr.status + ' ' + thrownError);
        }
        console.log(datastr);
    }
    // 為取得授權
    else if (xhr.status == 401) {
        if (where == 'login') {
            alert('帳號或密碼錯誤');
            setTimeout(function() {
                window.location.href = where + ".html";
            }, 3000);
        } else {
            // alert('請重新登入');
            setTimeout(function() {
                window.location.href = 'login.html?id=' + where;
            }, 2000);
        }
        console.log(datastr);
    } else if (xhr.status == 403) {
        localStorage.setItem('userRole', "");
        alert('您沒有權限');
        window.location.href = 'login.html';
        console.log(datastr);
    } else if (xhr.status == 404) {
        if (datastr.hasOwnProperty("apiError")) {
            var message = datastr.apiError[0].message;
            if (where == 'check_account' || where == 'check_File' || where == 'check_people' || where == 'check_referral' || where == 'check_apply') {
                alert('審核失敗: ' + message);
            } else if (where == 'notice_File' || where == 'notice_people') {
                alert('通知就醫民眾失敗: ' + message);
            } else if (where == 'notice_referral') {
                alert('通知轉介單位失敗: ' + message);
            } else {
                alert('送出失敗: ' + message);
            }
        } else {
            alert('錯誤代碼 ' + xhr.status + ' ' + thrownError);
        }
        console.log(datastr);
    } else if (xhr.status == 500) {
        alert('系統有誤，請稍後再試');
        console.log(datastr);
    } else {
        if (where == 'check_account' || where == 'check_File' || where == 'check_people' || where == 'check_referral') {
            alert('審核失敗 ' + xhr.status + ' ' + thrownError);
        } else if (where == 'notice_File' || where == 'notice_people') {
            alert('通知就醫民眾失敗 ' + xhr.status + ' ' + thrownError);
        } else if (where == 'notice_referral') {
            alert('通知轉介單位失敗 ' + xhr.status + ' ' + thrownError);
        } else {
            alert('送出失敗 ' + xhr.status + ' ' + thrownError);
        }
        console.log(datastr);
    }
}

function fetch_error(response, where) {
    console.log(response)

    if (response.status == 401) {
        var error = new Error(response.statusText);
        error.response = response;
        // alert('請重新登入');
        setTimeout(function() {
            window.location.href = 'login.html?id=' + where;
        }, 3000);
        throw error;
    } else if (response.status == 403) {
        var error = new Error(response.statusText);
        error.response = response;
        localStorage.setItem('userRole', "");
        alert('您沒有權限');
        window.location.href = 'login.html';
        throw error;
    } else if (response.status == 404) {
        var error = new Error(response.statusText);
        error.response = response;
        if (where == 'checkin' || where == 'checkout' || where == 'invest') {
            alert('尚未填寫，請重新查詢');
            window.close();
        } else {
            alert('取得失敗');
        }

        throw error;
    } else if (response.status == 500) {
        var error = new Error(response.statusText);
        error.response = response;
        alert('系統有誤，請稍後再試');
        throw error;
    } else {
        var error = new Error(response.statusText);
        error.response = response;
        alert('取得失敗 ' + response.status + ' ' + error.response);
        throw error;
    }
}
