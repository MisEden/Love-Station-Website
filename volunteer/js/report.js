var dateToday = new Date();
var merge_enddate = '';
var housename;
var roomnumber;
var startDate;
var endDate;
var serviceDate;
var selectHouse;
window.onload = function () {
    getquery()
    ServiceVerified()
}

function ServiceVerified() {
    $("#Service").change(function () {
        var ServiceContent = document.getElementById("Service").value
        if (ServiceContent.length == 0) {
            document.getElementById("Service").className = "form-control is-invalid";
        }
        else {
            document.getElementById("Service").className = "form-control is-valid";
        }
    });

}


function submit_volunteer() {

    service_content = document.getElementById("Service").value;
    remark = document.getElementById("Remark").value;

    if (service_content.length == 0) {
        show_alert('請輸入服務回報資訊')
        return;
    }
    else {
        var Jsonarr = {
            "checkinAppId": appid,
            "houseId": selectHouse,
            "roomNumber": roomnumber,
            "service": service_content,
            "remark": remark,
        }

        //儲存post結果
        fetch(API_url + '/v1/api/volunteers/service/record', {
            method: 'POST',
            body: JSON.stringify(Jsonarr),
            headers: new Headers({
                'Content-Type': 'application/json',
                'x-eden-token': localStorage.getItem('token')
            })
        }).then(function (response) {
            return response.text();
        }).then(function (text) {
            console.log(text);
            show_alert('已成功送出回報，將自動導回搜尋頁面')
            setTimeout(function () {
                window.location.href = 'view_applyList.html';
            }, 3000);
        }).catch(function (error) {
            console.log(error);
        });
    }
}

// 取得?後得值
function getquery() {
    let image_url = new URL(location.href);
    image_url = image_url.search
    arr = image_url.split("splitid=");

    housename = (decodeURIComponent(arr[1]))
    roomnumber = (decodeURIComponent(arr[2]))
    selectHouse = (decodeURIComponent(arr[3]))
    appid = (decodeURIComponent(arr[4]))
    document.getElementById("Place").value = housename;
    document.getElementById("RoomNumber").value = roomnumber;
}



