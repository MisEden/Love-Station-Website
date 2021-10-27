
var path = window.location.pathname;
var where = path.split("/").pop().split(".")[0];

window.onload = function() {
    var path = ["首頁", "入住管理", "檢視服務指派紀錄"]; 
    showBreadcrumb(path);

    setDefaultDate();
    if (!isError) { getHouseName(); }
}


function setDefaultDate() {
    var today = new Date();
    var startDay = today.addDays(-7);
    var dd = startDay.getDate();
    var mm = startDay.getMonth() + 1;
    var yyyy = startDay.getFullYear();
    if (dd < 10) { dd = '0' + dd; }
    if (mm < 10) { mm = '0' + mm; }
    document.getElementById("data_first").value = yyyy + "-" + mm + "-" + dd;

    today = new Date();
    var endDay = today.addDays(7);
    var dd = endDay.getDate();
    var mm = endDay.getMonth() + 1;
    var yyyy = endDay.getFullYear();
    if (dd < 10) { dd = '0' + dd; }
    if (mm < 10) { mm = '0' + mm; }
    document.getElementById("data_end").value = yyyy + "-" + mm + "-" + dd;
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
            }
            else {
                fetch_error(response, where);
            }
        }).then((jsonData) => {

            var select = document.getElementById("SelectHouse");

            for (var i = 0; i < jsonData.length; i++) {
                select.innerHTML += "<option value=\"" + jsonData[i].id + "\">" + jsonData[i].name + "</option>";
            }

        }).catch((err) => {
            console.log('錯誤:', err);
        });
}

// 取得愛心棧的房號
$("#SelectHouse").change(function () {
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
                }
                else {
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
    }
    else {
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
                }
                else {
                    fetch_error(response, where);
                }

            }).then((jsonData) => {

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


    if (startDate == '') {
        alert('請先選擇開始日期');
    } else if (endDate == '') {
        alert('請先選擇結束日期');
    } else if (houseName == "請選擇") {
        alert('請先選擇棧點');
    } else {
        document.getElementById("show_table").style.display = "";

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
            userChineseName = selected_people = document.getElementById("SelectPeople").value;

        }

        // 取得該月所有入住申請名
        fetch(API_url + '/v1/api/admins/checkin-applications/?houseName=' + houseName + '&' + 'startDate=' + startDate + '&endDate=' + endDate + '&' + 'roomNumber=' + roomNumber + '&userChineseName=' + userChineseName + '&currentPage=0', {
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
                var totalPage = jsonData.totalPage;

                if (totalPage > 0) {

                    for (var i = 0; i < totalPage; i++) {
                        // 取得該月所有入住申請名單
                        fetch(API_url + '/v1/api/admins/checkin-applications/?houseName=' + houseName + '&' + 'startDate=' + startDate + '&endDate=' + endDate + '&' + 'roomNumber=' + roomNumber + '&userChineseName=' + userChineseName + '&currentPage=' + i, {
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
                                var table = document.getElementById("tableViewRoom").getElementsByTagName('tbody')[0];
                                table.innerHTML = "";
                                
                                for (var j = 0; j < jsonData.checkinApplications.length; j++) {
                                    
                                    var row = table.insertRow(0);
                                    var cell_id = row.insertCell(0);
                                    var cell_house = row.insertCell(1);
                                    var cell_room = row.insertCell(2);
                                    var cell_user = row.insertCell(3);
                                    var cell_edit = row.insertCell(4);

                                    cell_id.innerHTML = (jsonData.checkinApplications[j].id).substring(0, 16) + "...</a>";
                                    cell_house.innerHTML = jsonData.checkinApplications[j].houseName;
                                    cell_room.innerHTML = jsonData.checkinApplications[j].roomNumber;
                                    cell_user.innerHTML = jsonData.checkinApplications[j].userName;
                                    cell_edit.innerHTML = "<a href=\"assign_service.html?id=" + jsonData.checkinApplications[j].id + "&back="+where+"\">點我選擇</a>";

                                }

                            }).catch((err) => {
                                console.log('錯誤:', err);
                            });
                    }

                } else {
                    var table = document.getElementById("tableViewRoom").getElementsByTagName('tbody')[0];
                    table.innerHTML = "";
                    
                    var row = table.insertRow(0);
                    var cell1 = row.insertCell(0);
                    cell1.innerHTML = "目前無新的待審核紀錄";
                    cell1.colSpan = 5;
                    cell1.classList.add("text-center");
                }

            }).catch((err) => {
                console.log('錯誤:', err);
            });

    }

}

Date.prototype.addDays = function (days) {
    this.setDate(this.getDate() + days);
    return this;
}