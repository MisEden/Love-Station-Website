var dateToday = new Date();

var getHouseid = [];
var getHousename = [];
var getName;
var startDate = [];
var endDate = [];
var userName = []
var houseName = [];
var roomNumber = []
var appid = []
var selectHouse;
window.onload = function () {
    show_alert('請先查詢房客入住紀錄後，即可進行服務回報');
    //取得當月月份
    console.log(localStorage.getItem('token'))
    var mm = String(dateToday.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = dateToday.getFullYear();
    dateToday = yyyy + '-' + mm;
    document.getElementById('date_first').value = dateToday;



    // 取得房東愛心棧的名稱
    fetch(API_url + '/v1/api/landlords/house/names', {
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
        getName = jsonData;
        var select = document.getElementById("SelectHouse");
        for (var i = 0; i < getName.length; i++) {
            select.innerHTML += '<option>' + getName[i].name + '</option>';
            getHouseid[i] = getName[i].id
            getHousename[i] = getName[i].name
        }
    }).catch((err) => {
        console.log('錯誤:', err);
    });

}


function query() {
    var date_in = document.getElementById("date_first").value;

    if (date_in == 0) {
        show_alert('請選擇欲搜尋之時間');
    }
    else if (document.getElementById("SelectHouse").value == 0) {
        show_alert('請選擇棧點');
    }
    else {
        for (i = 0; i < getHouseid.length; i++) {
            if (document.getElementById("SelectHouse").value == getHousename[i]) {
                selectHouse = getHouseid[i]
            }
        }
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
        var date_in = document.getElementById("date_first").value;
        fetch(API_url + '/v1/api/landlords/house/checkin-applications?houseId=' + selectHouse + '&yearAndMonth=' + date_in, {
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
            console.log(jsonData)
            getUser = jsonData;
            for (i = 0; i < getUser.length; i++) {
                userName[i] = getUser[i].userName
                startDate[i] = getUser[i].startDate
                endDate[i] = getUser[i].endDate
                houseName[i] = getUser[i].houseName
                roomNumber[i] = getUser[i].roomNumber
                appid[i] = getUser[i].checkinAppId
            }
        }).catch(() => {
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
            show_alert('該時段或棧點沒有入住紀錄')
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
                cell1.innerHTML = houseName[i];
                cell2.innerHTML = roomNumber[i];
                cell3.innerHTML = startDate[i];
                cell4.innerHTML = endDate[i];
                cell5.innerHTML = userName[i];
                cell6.innerHTML = "<a href='report.html?splitid=" + houseName[i] + 'splitid=' + roomNumber[i] + 'splitid=' + selectHouse + 'splitid=' + appid[i] + "'>進行回報</a>";
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