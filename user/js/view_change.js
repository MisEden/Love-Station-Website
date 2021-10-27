var getHouse;
var getName;
var startDate = [];
var endDate = [];
var appid = [];
window.onload = function () {
    var table = document.getElementById("table1").getElementsByTagName('tbody')[0];
    fetch(API_url + '/v1/api/checkin-applications/before-checkout/all', {
        method: 'GET',
        headers: new Headers({
            'Content-Type': 'application/json',
            'x-eden-token': localStorage.getItem('token')
        })
    })
        .then(function checkStatus(response) {
            if (response.status == 200) {
                return response.json();
            } else if (response.status == 404) {
                show_alert('你最近沒有通過審核的入住申請紀錄')
            }
        }).then((jsonData) => {

            table.innerHTML = "";

            for (i = 0; i < jsonData.length; i++) {
                var row = table.insertRow(0);
                var cell1 = row.insertCell(0);
                var cell2 = row.insertCell(1);
                var cell3 = row.insertCell(2);
                var cell4 = row.insertCell(3);
                var cell5 = row.insertCell(4);
                var cell6 = row.insertCell(5);
                cell1.innerHTML = "<a href='change_date.html?splitid=" + jsonData[i].startDate + 'splitid=' + jsonData[i].endDate + 'splitid=' + jsonData[i].checkinAppId + 'splitid=' + jsonData[i].house + 'splitid=' + jsonData[i].roomNumber + "'>點我變更</a>";
                cell2.innerHTML = "<a href='apply.html?id=" + jsonData[i].checkinAppId + "'>" + ("" + jsonData[i].checkinAppId).substring(0, 16) + "...</a>";
                cell3.innerHTML = jsonData[i].house;
                cell4.innerHTML = jsonData[i].roomNumber;
                cell5.innerHTML = jsonData[i].startDate;
                cell6.innerHTML = jsonData[i].endDate;

            }




        }).catch((err) => {
            console.log('錯誤:', err);
        });

    document.getElementById("show_apply").style.display = "inline-block";
}

function clearToken() {
    localStorage.clear();
    show_alert('清除完成');
}