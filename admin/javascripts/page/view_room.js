
var path = window.location.pathname;
var where = path.split("/").pop().split(".")[0];

window.onload = function() {
    var path = ["首頁", "入住管理", "檢視入住/退房紀錄"]; 
    showBreadcrumb(path);

    setDefaultDate();
    if(!isError){getHouseName();}
}

function setDefaultDate(){
    var today = new Date();
    var startDay = today.addDays(-7);
    var dd = startDay.getDate();
    var mm = startDay.getMonth()+1; 
    var yyyy = startDay.getFullYear();
    if(dd<10){dd='0'+dd;} 
    if(mm<10){mm='0'+mm;} 
    document.getElementById("data_first").value = yyyy + "-" + mm + "-" + dd;

    today = new Date();
    var endDay = today.addDays(7);
    var dd = endDay.getDate();
    var mm = endDay.getMonth()+1; 
    var yyyy = endDay.getFullYear();
    if(dd<10){dd='0'+dd;} 
    if(mm<10){mm='0'+mm;}
    document.getElementById("data_end").value = yyyy + "-" + mm + "-" + dd;
}

// 取得所有愛心棧的名稱
function getHouseName(){
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
    }else{
        
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

// 取得入住/退房回報
function query() {
    var startDate = document.getElementById('data_first').value;
    var endDate = document.getElementById('data_end').value;

    var selectHouse = document.getElementById("SelectHouse");
    var houseName = selectHouse.options[selectHouse.selectedIndex].text;

    
    if (startDate == '') {
        alert('請先選擇開始日期');
    }else if (endDate == '') {
        alert('請先選擇結束日期');
    }else if (houseName == "請選擇") {
        alert('請先選擇棧點');
    }else {
        const timeout = ms => new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve();
            }, ms);
        });

        const ajax1 = () => timeout(750).then(() => {

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

            fetch(API_url + '/v1/api/admins/feedback/checkin-applications/search?houseName=' + houseName + '&' + 'startDate=' + startDate + '&endDate=' + endDate + '&' + 'roomNumber=' + roomNumber + '&userChineseName=' + userChineseName + '&currentPage=0', {
                method: 'GET',
                headers: new Headers({
                    'Content-Type': 'application/json',
                    'x-eden-token': localStorage.getItem('token')
                })
            }).then(response => {
                return response.json();

            }).then(user_detail => {

                var table = document.getElementById("tableViewRoom").getElementsByTagName('tbody')[0];
                table.innerHTML = "";

                if(user_detail.checkinApplications.length > 0){
                    
                    for (i = 0; i < user_detail.checkinApplications.length; i++) {
                        var row = table.insertRow(0);
                        var cell1_house = row.insertCell(0);
                        var cell2_room = row.insertCell(1);
                        var cell3_start = row.insertCell(2);
                        var cell4_end = row.insertCell(3);
                        var cell5_people = row.insertCell(4);
                        var cell6_carer = row.insertCell(5);
                        var cell7_referral = row.insertCell(6);
                        var cell8_referralEmployee = row.insertCell(7);
                        var cell9_document = row.insertCell(8);
                        var cell10_checkin = row.insertCell(9);
                        var cell11_checkout = row.insertCell(10);
                        var cell12_investigation = row.insertCell(11);
    
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
    
                        // 契約文件
                        var rentImagePath = user_detail.checkinApplications[i].rentImage;
                        var affidavitImagePath = user_detail.checkinApplications[i].affidavitImage;
                        cell9_document.innerHTML = "<a id='in' target='_blank' href='view_room_image.html?rent=" + rentImagePath + "&affidavit=" + affidavitImagePath + "'>檢視</a>";
    
                        // 入住回報
                        cell10_checkin.innerHTML = "<a id='in' target='_blank' href='view_room_checkin.html?id=" + user_detail.checkinApplications[i].id + "'>檢視</a>";
    
                        // 退房回報
                        cell11_checkout.innerHTML = "<a id='in' target='_blank' href='view_room_checkout.html?id=" + user_detail.checkinApplications[i].id + "'>檢視</a>";
                        
                        // 
                        cell12_investigation.innerHTML = "<a id='in' target='_blank' href='view_room_investigation.html?id=" + user_detail.checkinApplications[i].id + "'>檢視</a>";
                    }
    
                }else{
                    var row = table.insertRow(0);
                    var cell1 = row.insertCell(0);
                    cell1.innerHTML = "並無符合該搜尋條件的申請紀錄";
                    cell1.colSpan = 12;
                    cell1.classList.add("text-center");
                }
    
            });
        });

        const mergePromise = async ajaxArray => {
            let data = [];
            for (let aj of ajaxArray) {
                let res = await aj();
                data.push(res);
            }
            return data;
        };

        mergePromise([ajax1]).then(data => {
            console.log('done');
        });
    }

    //can not reclick in 2 second
    setTimeout(function () {
        queryIsClicked = true;
    }, 2000);
}   

Date.prototype.addDays = function(days) {
    this.setDate(this.getDate() + days);
    return this;
  }