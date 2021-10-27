var getHouse;
var getName;

window.onload = function () {
    var table = document.getElementById("table1").getElementsByTagName('tbody')[0];
    fetch(API_url + '/v1/api/referral-employees/me/room-states/change?currentPage=0', {
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
        console.log(jsonData.checkinApplicationWithRoomStateChangeDetails[0])
        console.log(jsonData.checkinApplicationWithRoomStateChangeDetails[1])
        console.log(jsonData.checkinApplicationWithRoomStateChangeDetails[2])
        console.log(jsonData.checkinApplicationWithRoomStateChangeDetails[3])
        for (var i = 0; i < jsonData.checkinApplicationWithRoomStateChangeDetails.length; i++) {
            var row = table.insertRow(0);
            var cell1 = row.insertCell(0);
            var cell2 = row.insertCell(1);
            var cell3 = row.insertCell(2);
            var cell4 = row.insertCell(3);

            cell1.innerHTML = jsonData.checkinApplicationWithRoomStateChangeDetails[i].userName;
            cell2.innerHTML = jsonData.checkinApplicationWithRoomStateChangeDetails[i].userCellphone;
            cell3.innerHTML = jsonData.checkinApplicationWithRoomStateChangeDetails[i].caregiverPhone;
            cell4.innerHTML = "<a href= change_detail.html?id=" + i + " >檢視</a>";
        }
    }).catch((err) => {
        show_alert('發生錯誤 請重新登入')
    });

}



