var path = window.location.pathname;
var where = path.split("/").pop().split(".")[0];

Date.prototype.addDays = function(days) {
    this.setDate(this.getDate() + days);
    return this;
}

var today = new Date();
var startDay = today.addDays(365);
var dd_end = startDay.getDate();
var mm_end = startDay.getMonth() + 1;
var yyyy_end = startDay.getFullYear();
if (dd_end < 10) { dd_end = '0' + dd_end; }
if (mm_end < 10) { mm_end = '0' + mm_end; }

var defaultURL = ".html?start=2020-01-01&end=" + yyyy_end + "-" + mm_end + "-" + dd_end + "&house=&room=&name=&first=&second=&currentPage=0";
var query_start = getParameterByName('start', where + defaultURL);
var query_end = getParameterByName('end', where + defaultURL);
var query_house = getParameterByName('house');
var query_room = getParameterByName('room');
var query_name = getParameterByName('name');
var query_first = getParameterByName('first');
var query_second = getParameterByName('second');
var query_currentPage = getParameterByName('currentPage', where + defaultURL);

try{
    query_currentPage = parseInt(query_currentPage);
}catch(error){

}

window.onload = function() {
    var path = ["首頁", "入住管理", "檢視入住申請單"];
    showBreadcrumb(path);

    if (!isError) {
        getHouseName();

        loadData();
    }
}

function defaultSet() {
    if (query_house.length <= 0) {
        query_house = "";
    }

    if (query_room.length <= 0) {
        query_room = "";
    }

    if (query_name.length <= 0) {
        query_name = "";
    }

    if (query_first.length <= 0) {
        query_first = "";
    }

    if (query_second.length <= 0) {
        query_second = "";
    }


    document.getElementById("data_first").value = query_start;
    document.getElementById("data_end").value = query_end;

    var selectHouse = document.getElementById("SelectHouse");
    for (var i = 0; i < selectHouse.options.length; i++) {
        if (selectHouse.options[i].text == query_house) {
            selectHouse.value = selectHouse.options[i].value;
            loadRoom();
            break;
        }
    }

    if (query_name.length > 0) {
        document.getElementById("SelectPeople").innerHTML = "<option value=''>顯示全部</option>";
        document.getElementById("SelectPeople").innerHTML += '<option value=' + query_name + '>' + query_name + '</option>';
        document.getElementById("SelectPeople").selectedIndex = 1;
    }


    if (query_first.length == 0) {
        document.getElementById('result_1st').selectedIndex = 0;
    } else if (query_first == "1") {
        document.getElementById('result_1st').selectedIndex = 1;
    } else if (query_first == "0") {
        document.getElementById('result_1st').selectedIndex = 2;
    }

    if (query_second.length == 0) {
        document.getElementById('result_2nd').selectedIndex = 0;
    }
    if (query_second == "1") {
        document.getElementById('result_2nd').selectedIndex = 1;
    } else if (query_second == "0") {
        document.getElementById('result_2nd').selectedIndex = 2;
    }
}

function loadData() {

    fetch(API_url + '/v1/api/admins/checkin-applications/search?houseName=' + query_house + '&' + 'startDate=' + query_start + '&endDate=' + query_end + '&' + 'roomNumber=' + query_room + '&userChineseName=' + query_name + '&first=' + query_first + '&second=' + query_second + '&currentPage=' + query_currentPage, {
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
            }

        }).then((user_detail) => {
            console.log(user_detail);

            var table = document.getElementById("tableViewRoom").getElementsByTagName('tbody')[0];
            table.innerHTML = "";

            if (user_detail.checkinApplications.length > 0) {

                for (i = user_detail.checkinApplications.length - 1; i >= 0; i--) {
                    var row = table.insertRow(0);
                    var cell1_house = row.insertCell(0);
                    var cell2_room = row.insertCell(1);
                    var cell3_start = row.insertCell(2);
                    var cell4_end = row.insertCell(3);
                    var cell5_people = row.insertCell(4);
                    var cell6_carer = row.insertCell(5);
                    var cell7_referral = row.insertCell(6);
                    var cell8_referralEmployee = row.insertCell(7);
                    var cell9_1st = row.insertCell();
                    var cell10_1stReason = row.insertCell();
                    var cell11_2nd = row.insertCell();
                    var cell12_deleted = row.insertCell();
                    var cell13_document = row.insertCell();
                    var cell14_remind = row.insertCell();

                    // 棧點名稱
                    cell1_house.innerHTML = user_detail.checkinApplications[i].houseName;

                    // 房號
                    cell2_room.innerHTML = user_detail.checkinApplications[i].roomNumber;

                    // 入住日期
                    cell3_start.innerHTML = user_detail.checkinApplications[i].startDate;

                    // 退房日期
                    cell4_end.innerHTML = user_detail.checkinApplications[i].endDate;

                    // 申請人
                    cell5_people.innerHTML = user_detail.checkinApplications[i].userName;

                    // 照顧人
                    cell6_carer.innerHTML = user_detail.checkinApplications[i].careGiverName;

                    // 轉介醫院
                    cell7_referral.innerHTML = user_detail.checkinApplications[i].referralHospitalName;

                    // 轉介員工
                    cell8_referralEmployee.innerHTML = user_detail.checkinApplications[i].referralEmployeeName;

                    // 一階結果
                    if (user_detail.checkinApplications[i].firstVerified) {
                        cell9_1st.innerHTML = "通過";
                    } else if (user_detail.checkinApplications[i].firstVerified == null) {
                        cell9_1st.innerHTML = "";
                    } else {
                        cell9_1st.innerHTML = "不通過";
                    }

                    // 一階理由
                    if (user_detail.checkinApplications[i].firstVerifiedReason != null) {
                        if (user_detail.checkinApplications[i].firstVerifiedReason.length <= 5) {
                            cell10_1stReason.innerHTML = user_detail.checkinApplications[i].firstVerifiedReason;
                        } else {
                            cell10_1stReason.innerHTML = user_detail.checkinApplications[i].firstVerifiedReason.substring(0, 5) + "...";
                        }
                    }

                    // 二階結果
                    if (user_detail.checkinApplications[i].secondVerified) {
                        cell11_2nd.innerHTML = "通過";
                    } else if (user_detail.checkinApplications[i].secondVerified == null) {
                        cell11_2nd.innerHTML = "";
                    } else {
                        cell11_2nd.innerHTML = "不通過";
                    }

                    // 是否取消
                    if (user_detail.checkinApplications[i].deleted) {
                        cell12_deleted.innerHTML = "<span style='color: red;'>取消</span>";
                    } else if (user_detail.checkinApplications[i].deleted == null) {
                        cell12_deleted.innerHTML = "";    
                    } else {
                        cell12_deleted.innerHTML = "<span style='color: blue;'>否</span>";
                    }

                    // 契約文件
                    cell13_document.innerHTML = "<a id='in' target='_blank' href='review_application_detail.html?id=" + user_detail.checkinApplications[i].id + "'>檢視</a>";

                
                    // 提醒退房   
                    if (today.getDate() == (new Date(user_detail.checkinApplications[i].endDate).getDate() - 3)) {
                        cell14_remind.innerHTML = "<input type=\"button\" class=\"btn btn-info\" value=\"通知\" id=\"notification-btn\" onclick=\"sendNotification('" + user_detail.checkinApplications[i].id + "')\">";
                    }    

                }

                // build Pagination
                var totalPage = user_detail.totalPage;
                document.getElementById("pagination").innerHTML = "";

                var formatURL = where + ".html?start=" + query_start + "&end=" + query_end + "&house=" + query_house + "&room=" + query_room + "&name=" + query_name + "&first=" + query_first + "&second=" + query_second + "&currentPage=";

                if (query_currentPage - 1 >= 0) {
                    var $li = $("<li class=\"page-item\"></li>");
                    $("#pagination").append($li.append("<a class=\"page-link\" href=\"" + formatURL + (query_currentPage - 1) + "\">Previous</a>"));
                } else {
                    var $li_disabled = $("<li class=\"page-item disabled\"></li>");
                    $("#pagination").append($li_disabled.append("<a class=\"page-link\" href=\"" + where + ".html\">Previous</a>"));
                }

                for (var i = 0; i < totalPage; i++) {
                    if (i == query_currentPage) {
                        var $li_active = $("<li class=\"page-item active\"></li>");
                        $("#pagination").append($li_active.append("<a class=\"page-link\" href=\"" + formatURL + (i) + "\">" + (i + 1) + "</a>"));
                    } else {
                        var $li = $("<li class=\"page-item\"></li>");
                        $("#pagination").append($li.append("<a class=\"page-link\" href=\"" + formatURL + (i) + "\">" + (i + 1) + "</a>"));
                    }
                }

                if (query_currentPage + 1 < totalPage) {
                    var $li = $("<li class=\"page-item\"></li>");
                    $("#pagination").append($li.append("<a class=\"page-link\" href=\"" + formatURL + (query_currentPage + 1) + "\">Next</a>"));
                } else {
                    var $li_disabled = $("<li class=\"page-item disabled\"></li>");
                    $("#pagination").append($li_disabled.append("<a class=\"page-link\" href=\"" + where + ".html\">Next</a>"));
                }

            } else {
                var row = table.insertRow(0);
                var cell1 = row.insertCell(0);
                cell1.innerHTML = "並無符合該搜尋條件的申請紀錄";
                cell1.colSpan = 14;
                cell1.classList.add("text-center");
            }

        }).catch((err) => {
            console.log('錯誤:', err);
        })

}

// 取得所有愛心棧的名稱
function getHouseName() {
    fetch(API_url + '/v1/api/houses/names', {
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
            }
        }).then((jsonData) => {

            var select = document.getElementById("SelectHouse");

            for (var i = 0; i < jsonData.length; i++) {
                select.innerHTML += "<option value=\"" + jsonData[i].id + "\">" + jsonData[i].name + "</option>";
            }

            defaultSet();

        }).catch((err) => {
            console.log('錯誤:', err);
        });
}

// 取得愛心棧的房號
function loadRoom() {
    var houseId = document.getElementById("SelectHouse").value;

    if (houseId.indexOf("-") != -1) {

        fetch(API_url + '/v1/api/houses/' + houseId + '/room-numbers', {
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
                }
            }).then((jsonData) => {

                var select = document.getElementById("SelectRoom");
                $("#SelectRoom").empty();

                select.innerHTML = '<option value="">(全部)</option>';
                for (var i = 0; i < jsonData.length; i++) {
                    if (query_room == jsonData[i].number) {
                        select.innerHTML += "<option value=\"" + jsonData[i].id + "\" selected=\"selected\">" + jsonData[i].number + "</option>";
                    } else {
                        select.innerHTML += "<option value=\"" + jsonData[i].id + "\">" + jsonData[i].number + "</option>";
                    }

                }
            }).catch((err) => {
                console.log('錯誤:', err);
            });
    } else {
        $("#SelectRoom ").empty();
    }
}
$("#SelectHouse").change(function() {
    var houseId = document.getElementById("SelectHouse").value;

    if (houseId.indexOf("-") != -1) {

        fetch(API_url + '/v1/api/houses/' + houseId + '/room-numbers', {
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
                }
            }).then((jsonData) => {

                var select = document.getElementById("SelectRoom");
                $("#SelectRoom").empty();

                select.innerHTML = '<option value="">(全部)</option>';
                for (var i = 0; i < jsonData.length; i++) {
                    select.innerHTML += "<option value=\"" + jsonData[i].id + "\">" + jsonData[i].number + "</option>";
                }
            }).catch((err) => {
                console.log('錯誤:', err);
            });
    } else {
        $("#SelectRoom ").empty();
    }
});

function query_people() {
    var peopleKeyword = document.getElementById("people").value;

    if (peopleKeyword.length == 0) {
        alert('請至少輸入一個字');
    } else {

        // 取得使用者資料
        fetch(API_url + '/v1/api/users/chinese-names?filter=' + peopleKeyword, {
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
                }

            }).then((jsonData) => {
                console.log(JSON.stringify(jsonData));

                var select_people = document.getElementById("SelectPeople");
                $("#SelectPeople").empty();

                for (var i = 0; i < jsonData.length; i++) {
                    select_people.innerHTML += '<option value=' + jsonData[i] + '>' + jsonData[i] + '</option>';
                }

            }).catch((err) => {
                console.log('錯誤:', err);
            });
    }
}

function query() {
    var startDate = document.getElementById('data_first').value;
    var endDate = document.getElementById('data_end').value;

    var selectHouse = document.getElementById("SelectHouse");
    var houseName = selectHouse.options[selectHouse.selectedIndex].text;
    if (houseName == "搜尋全部") {
        houseName = "";
    }

    var result_1st = document.getElementById('result_1st').value;
    var result_2nd = document.getElementById('result_2nd').value;


    if (startDate == '') {
        alert('請先選擇開始日期');
    } else if (endDate == '') {
        alert('請先選擇結束日期');
    } else if (houseName == "請選擇") {
        alert('請先選擇棧點');
    } else {

        var roomNumber = "";
        var userChineseName = "";

        // 判斷有無選取房號
        if (document.getElementById('SelectRoom').value.length == 0) {
            roomNumber = ' '
        } else {
            roomNumber = document.getElementById('SelectRoom').options[document.getElementById('SelectRoom').selectedIndex].text;
        }

        // 判斷有無特定使用者
        if (document.getElementById("SelectPeople").value.length == 0) {
            userChineseName = ' ';
        } else {
            userChineseName = document.getElementById("SelectPeople").value;
        }

        var url = where + ".html?start=" + startDate + "&end=" + endDate + "&house=" + houseName + "&room=" + roomNumber + "&name=" + userChineseName + "&first=" + result_1st + "&second=" + result_2nd + "&currentPage=0";
        window.location = url;
    }
}

function clean() {
    window.location = where + defaultURL;
}


// All of Work to Export Excel


function exportExcel() {
    alert("請稍候，系統產生檔案中...\n\n輸出時間視資料數量而定");
    getAllId();
}

function getAllId() {
    fetch(API_url + '/v1/api/admins/checkin-applications/id/search?houseName=' + query_house + '&' + 'startDate=' + query_start + '&endDate=' + query_end + '&' + 'roomNumber=' + query_room + '&userChineseName=' + query_name + '&first=' + query_first + '&second=' + query_second, {
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
            }

        }).then((jsonData) => {
            var exportId = [];

            for (var i = 0; i < jsonData.length; i++) {
                exportId.push(jsonData[i].id);

            }


            getExcel(exportId);

        }).catch((err) => {
            console.log('錯誤:', err);
        })
}

function getExcel(exportId) {


    //轉換為ＪＳＯＮ
    var Jsonarr = { 'id': exportId }


    console.log("[Export ID] ->" + JSON.stringify(Jsonarr));

    fetch(API_url + "/v1/api/admins/checkin-applications/export", {
            method: 'POST',
            body: JSON.stringify(Jsonarr),
            headers: new Headers({
                'Content-Type': 'application/json',
                'x-eden-token': localStorage.getItem('token')
            })
        })
        .then(res => res.json())
        .catch(error => console.error('Error:', error))
        .then((response) => {
            // console.log('Success:', response);

            try {
                if ("apiError" in response) {
                    if (response.apiError.status == "BAD_REQUEST") {
                        alert('下載失敗，因為：' + response.apiError.message);
                    }
                } else {

                    var filePaht = response.downloadUrl;
                    var pathPart = filePaht.split("/");

                    var a = document.createElement('a');
                    var url = API_url + filePaht;
                    var filename = pathPart[pathPart.length - 1];

                    // console.log("URL = " + url);
                    // console.log("Download = " + filename);


                    a.href = url;
                    a.download = filename;
                    a.click();
                    window.URL.revokeObjectURL(url);

                }
            } catch (error) {
                console.log(error.message);
            }

        });

}

function sendNotification(checkinApplicationId) {

    var jsonData = {}

    $.ajax({
        headers: {
            'Content-Type': 'application/json',
            'x-eden-token': localStorage.getItem('token')
        },
        url: API_url + '/v1/api/notifications/' + checkinApplicationId + '/checkout/remind',
        type: 'POST',
        data: JSON.stringify(jsonData),
        error: function(err) {
            alert(err);
            alert("通知失敗!");
        },
        success: function(data) {
            alert("通知成功!");
        }
    });
}
