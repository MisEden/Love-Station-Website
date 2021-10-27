var dateToday = new Date();
var createdAt = [];
var volunteerName = []
var house = [];
var roomNumber = []
var service = []
var remark = []
window.onload = function () {
    //取得當月月份
    var mm = String(dateToday.getMonth() + 1).padStart(2, '0');
    var yyyy = dateToday.getFullYear();
    document.getElementById('date').value = dateToday = yyyy + '-' + mm;

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
        var date = document.getElementById("date").value;
        fetch(API_url + '/v1/api/volunteers/service/record/get?&yearAndMonth=' + date, {
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
                var where = 'view_report';
                fetch_error(response, where);
            }
        }).then((jsonData) => {
            getUser = jsonData;
            for (i = 0; i < getUser.length; i++) {
                volunteerName[i] = getUser[i].volunteerName
                createdAt[i] = getUser[i].createdAt
                service[i] = getUser[i].service
                house[i] = getUser[i].house
                roomNumber[i] = getUser[i].roomNumber
                remark[i] = getUser[i].remark
            }
        }).catch((err) => {
            show_alert('該時間沒人入住')
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
            show_alert('該月沒有回報紀錄')
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
                cell5.innerHTML = volunteerName[i];
                cell6.innerHTML = remark[i];
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