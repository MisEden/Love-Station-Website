var dateToday = new Date();
var getUser;
var startDate = [];
var endDate = [];
var userName = [];
var houseName = [];
var roomNumber = [];
var room;
var appid = [];
window.onload = function () {
    //取得當月月份
    var mm = String(dateToday.getMonth() + 1).padStart(2, '0');
    var yyyy = dateToday.getFullYear();
    document.getElementById('date').value = dateToday = yyyy + '-' + mm;

    worker_inf()
}

function worker_inf() {
    // 取得廠商資訊
    fetch(API_url + '/v1/api/firm-employees/firm/name', {
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
            var where = 'report';
            fetch_error(response, where);
        }
    }).then((FirmEmployee) => {

        FirmId = FirmEmployee.firmId
        FirmEmployeeName = FirmEmployee.firmEmployeeName
        FirmEmployeeId = FirmEmployee.firmEmployeeId
        FirmName = FirmEmployee.firmName
        localStorage.setItem('FirmId', FirmId)
        localStorage.setItem('FirmEmployeeName', FirmEmployeeName)
        localStorage.setItem('FirmEmployeeId', FirmEmployeeId)
        localStorage.setItem('FirmName', FirmName)

    }).catch((err) => {
        show_alert('發生錯誤 請重新登入')
    });
}

function query() {

    var date_in = document.getElementById("date").value;

    if (date_in == 0) {
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
        var date_in = document.getElementById("date").value;
        fetch(API_url + '/v1/api/firm-employees/checkin-applications/assigned?yearAndMonth=' + date_in, {
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
                var where = 'view_applyList';
                fetch_error(response, where);
            }
        }).then((jsonData) => {
            getUser = jsonData;
            for (i = 0; i < getUser.length; i++) {
                userName[i] = getUser[i].userName
                startDate[i] = getUser[i].startDate
                endDate[i] = getUser[i].endDate
                houseName[i] = getUser[i].house
                roomNumber[i] = getUser[i].roomNumber
                appid[i] = getUser[i].checkinAppId
            }
        }).catch((err) => {
            show_alert('請重新登入')
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
            show_alert('該時段沒有已指派的入住紀錄')
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
                cell1.innerHTML = houseName[i];
                cell2.innerHTML = roomNumber[i];
                cell3.innerHTML = startDate[i];
                cell4.innerHTML = endDate[i];
                cell5.innerHTML = "<a href='report.html?splitid=" + houseName[i] + 'splitid=' + roomNumber[i] + 'splitid=' + appid[i] + "'>進行回報</a>";
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

    document.getElementById("show_apply").style.display = "inline-block";


}
