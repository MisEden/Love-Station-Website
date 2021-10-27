var dateToday = new Date();
var createdAt = [];
var house = [];
var roomNumber = []
var service = []
var beforeImage = []
var afterImage = []
window.onload = function () {
    //取得當月月份
    var mm = String(dateToday.getMonth() + 1).padStart(2, '0');
    var yyyy = dateToday.getFullYear();
    document.getElementById('date').value = dateToday = yyyy + '-' + mm;

    // 取得愛心棧的名稱
    fetch(API_url + '/v1/api/houses/names', {
        method: 'GET',
        headers: new Headers({
            'Content-Type': 'application/json',
        })
    }).then(function checkStatus(response) {
        if (response.status == 200) {
            return response.json();
        }
        else {
            var where = 'index';
            fetch_error(response, where);
        }
    }).then((jsonData) => {
        getName = jsonData;
        var select = document.getElementById("SelectHouse");
        for (var i = 0; i < getName.length; i++) {
            select.innerHTML += '<option>' + getName[i].name + '</option>';
        }
    }).catch((err) => {
        show_alert('發生錯誤 請重新登入')
    });
    var getNameId;
    // 取得愛心棧的房號
    $("#SelectHouse").change(function () {
        var getNameindex = document.getElementById("SelectHouse").selectedIndex - 1;
        if (getNameindex >= 0) {

            getNameId = getName[getNameindex].id;
            fetch(API_url + '/v1/api/houses/' + getNameId + '/room-numbers', {
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
                        var where = 'rent';
                        fetch_error(response, where);
                    }
                }).then((jsonData) => {
                    getRoom = jsonData;
                    var select = document.getElementById("SelectRoom");
                    // var option_row = $('#SelectRoom option').length;

                    // for(var i = 1; i < option_row; i++){
                    //     document.getElementById("SelectRoom").deleteRow(i);
                    // }

                    $("#SelectRoom").empty();
                    select.innerHTML = '<option value="">(全部)</option>';
                    for (var i = 0; i < getRoom.length; i++) {
                        select.innerHTML += '<option> ' + getRoom[i].number + '</option>';
                    }
                }).catch((err) => {
                    console.log('錯誤:', err);
                });
        }
        else {
            $("#SelectRoom ").empty();
        }

    });
}


function query() {

    var date = document.getElementById("date").value;
    if (date == 0) {
        show_alert('請選擇欲搜尋之時間');
    }

    else {
        show_table();
    }
}

function show_table() {
    const timeout = ms => new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve();
        }, ms);
    });
    const ajax1 = () => timeout(750).then(() => {
        var HousaName = document.getElementById("SelectHouse").value;
        var date = document.getElementById("date").value;
        if (document.getElementById('SelectRoom').value.length == 0) {
            room = ' '
        }
        else {
            room = document.getElementById('SelectRoom').value
        }
        fetch(API_url + '/v1/api/firm-employees/service/record/get?houseName=' + HousaName + '&yearAndMonth=' + date + '&roomNumber=' + room, {
            method: 'GET',
            headers: new Headers({
                'Content-Type': 'application/json',
                'x-eden-token': localStorage.getItem('token')
            })
        }).then(function checkStatus(response) {
            if (response.status == 200) {
                return response.json();
            }
            else {
                var where = 'index';
                fetch_error(response, where);
            }
        }).then((jsonData) => {
            console.log(jsonData)
            getUser = jsonData;
            for (i = 0; i < getUser.length; i++) {
                createdAt[i] = getUser[i].createdAt
                service[i] = getUser[i].service
                house[i] = getUser[i].house
                roomNumber[i] = getUser[i].roomNumber
                beforeImage[i] = API_url + getUser[i].beforeImage
                afterImage[i] = API_url + getUser[i].afterImage
            }
        }).catch((err) => {
            show_alert('該時間沒有入住紀錄')
        });
    });

    const ajax2 = () => timeout(500).then(() => {
        var table = document.getElementById("table1").getElementsByTagName('tbody')[0];
        var rowCount = table.rows.length;
        if (rowCount > 0) {
            for (var i = rowCount - 1; i >= 0; i--) {
                table.deleteRow(i);
            }
        }
        if (getUser.length == 0) {
            document.getElementById("show_apply").style.display = "none";
            show_alert('該時段沒有回報紀錄')
        }
        else {
            document.getElementById("show_apply").style.display = "inline-block";
            for (i = 0; i < getUser.length; i++) {
                var row = table.insertRow(0);
                var cell1 = row.insertCell(0);
                var cell2 = row.insertCell(1);
                var cell3 = row.insertCell(2);
                var cell4 = row.insertCell(3);
                var cell5 = row.insertCell(4);
                var cell6 = row.insertCell(5);
                cell1.innerHTML = house[i];
                cell2.innerHTML = roomNumber[i];
                cell3.innerHTML = createdAt[i];
                cell4.innerHTML = service[i];
                cell5.innerHTML = "<a href='" + beforeImage[i] + "'>檢視</a>";
                cell6.innerHTML = "<a href='" + afterImage[i] + "'>檢視</a>";
                var table = document.getElementById("table1").getElementsByTagName('tbody')[0];
            }
        }
    });

    const mergePromise = async ajaxArray => {
        let data = [];
        for (let aj of ajaxArray) {
            let res = await aj();
            data.push(res);
        }
        return data;
    };

    mergePromise([ajax1, ajax2]).then(data => {
        console.log('done');
    });



}
