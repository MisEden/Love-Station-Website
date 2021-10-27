
var path = window.location.pathname;
var where = path.split("/").pop().split(".")[0];

var currentPage = parseInt(getParameterByName('currentPage', where + ".html?currentTab=checkin&currentPage=0"));
var currentTab = getParameterByName('currentTab', where + ".html?currentTab=checkin&currentPage=0");

var today = new Date();
var todayDate = today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate();

window.onload = function() {
    var path = ["首頁", "入住管理", "今日入住/退房紀錄"]; 
    showBreadcrumb(path);

    if(!isError){
        loadData();
    }
}

function loadData(){
    loadData_today();
    loadTabButton();
}

function loadTabButton(){
    
    if(currentTab == "checkin"){
        document.getElementById("navItem_checkin").classList.add("btn");
        document.getElementById("navItem_checkin").classList.add("btn-primary");
        document.getElementById("navItem_checkin").classList.add("text-white");
        document.getElementById("navItem_checkout").classList.remove("btn");
        document.getElementById("navItem_checkout").classList.remove("btn-primary");
        document.getElementById("navItem_checkout").classList.remove("text-white");
    }else if(currentTab == "checkout"){
        document.getElementById("navItem_checkin").classList.remove("btn");
        document.getElementById("navItem_checkin").classList.remove("btn-primary");
        document.getElementById("navItem_checkin").classList.remove("text-white");
        document.getElementById("navItem_checkout").classList.add("btn");
        document.getElementById("navItem_checkout").classList.add("btn-primary");
        document.getElementById("navItem_checkout").classList.add("text-white");
    }
}

function loadData_today(){
    var table = document.getElementById("table").getElementsByTagName('tbody')[0];
    table.innerHTML = "";

    // 取得當天入住名單
    fetch(API_url + '/v1/api/admins/index/scheduled-' + currentTab + '/' + todayDate + "?currentPage=" + currentPage, {
        method: 'GET',
        headers: new Headers({
            'Content-Type': 'application/json',
            'x-eden-token': localStorage.getItem('token')
        })
    })
    .then(function checkStatus(response) {
        if (response.status == 200) {
            return response.json();
        } else {
            fetch_error(response, where);
            isError = true;
        }
    }).then((jsonData) => {

        var totalPage = jsonData.totalPage;

        if(totalPage > 0){
                
            for (var i = 0; i < jsonData.infoAdminNeeds.length; i++) {
                var row = table.insertRow(0);
                var cell_house = row.insertCell();
                var cell_checkinDate = row.insertCell();
                var cell_checkoutDate = row.insertCell();
                var cell_applyName = row.insertCell();
                var cell_applyPhone = row.insertCell();
                var cell_carer = row.insertCell();
                var cell_finishDate = row.insertCell();
                var cell_alert_message = row.insertCell();
                var cell_alert = row.insertCell();
                
                cell_house.innerHTML = jsonData.infoAdminNeeds[i].house;
                cell_checkinDate.innerHTML = jsonData.infoAdminNeeds[i].startDate;
                cell_checkoutDate.innerHTML = jsonData.infoAdminNeeds[i].endDate;
                cell_applyName.innerHTML = jsonData.infoAdminNeeds[i].chineseName;
                cell_applyPhone.innerHTML = jsonData.infoAdminNeeds[i].cellphone;
                cell_carer.innerHTML = jsonData.infoAdminNeeds[i].caregiverName;

                if(jsonData.infoAdminNeeds[i].notificationDate == null){
                    cell_alert_message.innerHTML = "尚未通知";
                }else{
                    cell_alert_message.innerHTML = jsonData.infoAdminNeeds[i].notificationDate;
                }

                // judgeTime
                var now_hour = new Date().getHours();
                var dataDate = new Date(jsonData.infoAdminNeeds[i].checkinActualTime);
                var data_hour = dataDate.getHours();
                var finishDateText = "";

                var isOvertime = !(now_hour < 15);
                var isNull = (jsonData.infoAdminNeeds[i].checkinActualTime == null);

                if(isNull){
                    if(isOvertime){
                        // 逾期、未填寫
                        cell_finishDate.classList.add("text-danger");
                        cell_finishDate.innerHTML = "逾期未填"; 
                    }else{
                        // 未逾期、未填寫
                        cell_finishDate.innerHTML = "尚未填寫"; 
                    }

                    // 未填寫 -> 不通知
                    if(adminAuthority === "admin_readonly"){
                        cell_alert.innerHTML = "<input type=\"button\" class=\"btn btn-info disabled\" value=\"權限不足\" id=\"notification-btn\" onclick=\"return false;\" disabled>";
                    }else{
                        cell_alert.innerHTML = "<input type=\"button\" class=\"btn btn-info disabled\" value=\"等待民眾回報\" id=\"notification-btn\" onclick=\"return false;\" disabled>";
                    }
                    
                }else{
                    if(data_hour >= 15){
                        // 逾期、有填寫
                        cell_finishDate.classList.add("text-danger");
                        cell_finishDate.innerHTML = jsonData.infoAdminNeeds[i].checkinActualTime; 
                    }else{
                        // 未逾期、有填寫
                        cell_finishDate.innerHTML = jsonData.infoAdminNeeds[i].checkinActualTime; 
                    }

                    // 有填寫 -> 正常通知
                    if(adminAuthority === "admin_readonly"){
                        cell_alert.innerHTML = "<input type=\"button\" class=\"btn btn-info disabled\" value=\"權限不足\" id=\"notification-btn\" onclick=\"return false;\" disabled>";
                    }else{
                        cell_alert.innerHTML = "<input type=\"button\" class=\"btn btn-info\" value=\"通知\" id=\"notification-btn\" onclick=\"sendNotification('finish-" + currentTab + "', '" + jsonData.infoAdminNeeds[i].checkinAppId + "')\">";
                    }
                    
                    
                }
            }

            // build Pagination
            var totalPage = jsonData.totalPage;
            document.getElementById("pagination").innerHTML = "";

            if(currentPage - 1 >= 0){
                var $li = $("<li class=\"page-item\"></li>");
                $("#pagination").append($li.append("<a class=\"page-link\" href=\"" + where + ".html?currentTab="+ currentTab + "&currentPage="+ (currentPage - 1) + "\">Previous</a>"));
            }else{
                var $li_disabled = $("<li class=\"page-item disabled\"></li>");
                $("#pagination").append($li_disabled.append("<a class=\"page-link\" href=\"" + where + ".html\">Previous</a>"));
            }

            for(var i=0; i< totalPage; i++){
                if(i == currentPage){
                    var $li_active = $("<li class=\"page-item active\"></li>");
                    $("#pagination").append($li_active.append("<a class=\"page-link\" href=\"" + where + ".html?currentTab="+ currentTab + "&currentPage="+ (i) + "\">"+ (i + 1) + "</a>"));
                }else{
                    var $li = $("<li class=\"page-item\"></li>");
                    $("#pagination").append($li.append("<a class=\"page-link\" href=\"" + where + ".html?currentTab="+ currentTab + "&currentPage="+ (i) + "\">"+ (i + 1) + "</a>"));
                }
            }

            if(currentPage + 1 < totalPage){
                var $li = $("<li class=\"page-item\"></li>");
                $("#pagination").append($li.append("<a class=\"page-link\" href=\"" + where + ".html?currentTab="+ currentTab + "&currentPage="+ (currentPage + 1) + "\">Next</a>"));
            }else{
                var $li_disabled = $("<li class=\"page-item disabled\"></li>");
                $("#pagination").append($li_disabled.append("<a class=\"page-link\" href=\"" + where + ".html\">Next</a>"));
            }

        }else{
            var row = table.insertRow(0);
            var cell1 = row.insertCell(0);
            cell1.innerHTML = "目前無新的待審核紀錄";
            cell1.colSpan = 9;
            cell1.classList.add("text-center");
        }

    }).catch((err) => {
        console.log('錯誤:', err);
    });
}

//finish-checkin / finish-checkout
function sendNotification(type, checkinApplicationId) {
    
    var jsonData = {
    };

    $.ajax({
        headers: {
            'Content-Type': 'application/json',
            'x-eden-token': localStorage.getItem('token')
        },
        url: API_url + '/v1/api/notifications/' + type + "?checkinAppId=" + checkinApplicationId,
        type: 'POST',
        data: JSON.stringify(jsonData),
        error: function (err) {
            alert(err);
            alert("通知失敗!");
        },
        success: function (data) {
            alert("通知成功!");
            loadData_today();
        }
    });
}



function changeTab(tabName){
    currentTab = tabName;
    
    loadData();
}
