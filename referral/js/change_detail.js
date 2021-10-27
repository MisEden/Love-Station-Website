var get_id;
var appid;
var newStartDate;
var newEndDate;
var reason;
var changedItem;
var today = new Date();
var dd = String(today.getDate()).padStart(2, '0');
var mm = String(today.getMonth() + 1).padStart(2, '0');
var yyyy = today.getFullYear();
today = yyyy + '-' + mm + '-' + dd;

window.onload = function () {

    var url = location.href;

    if (url.indexOf('?') != -1) {
        var temp = url.split("?");
        var vars = temp[1].split("=");
        get_id = vars[1];
    }
    console.log(get_id)


    $("#changedItem").change(function () {
        var getreason = document.getElementById("changedItem").value;
        if (getreason == '取消入住') {
            document.getElementById("newStartDate").style.display = "none";
            document.getElementById("newEndDate").style.display = "none";
            document.getElementById("newStartDate_title").style.display = "none";
            document.getElementById("newEndDate_title").style.display = "none";
        }
        else {
            document.getElementById("newStartDate").style.display = "inline-block";
            document.getElementById("newEndDate").style.display = "inline-block";
            document.getElementById("newStartDate_title").style.display = "inline-block";
            document.getElementById("newEndDate_title").style.display = "inline-block";
        }
    });
    getPeople();

}

function getPeople() {

    fetch(API_url + '/v1/api/referral-employees/me/room-states/change', {
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
                var where = 'change_detail';
                fetch_error(response, where);
            }
        }).then((jsonData) => {
            for (var i = 0; i <= jsonData.checkinApplicationWithRoomStateChangeDetails.length; i++) {
                document.getElementById("inputNumber").value = jsonData.checkinApplicationWithRoomStateChangeDetails[[get_id]].checkinAppId;
                document.getElementById("roomStateChangeDate").value = jsonData.checkinApplicationWithRoomStateChangeDetails[[get_id]].roomStateChangeDate;
                document.getElementById("inputChName").value = jsonData.checkinApplicationWithRoomStateChangeDetails[[get_id]].userName;
                document.getElementById("inputBirth").value = jsonData.checkinApplicationWithRoomStateChangeDetails[[get_id]].userBirthday;
                document.getElementById("bloodType").value = jsonData.checkinApplicationWithRoomStateChangeDetails[[get_id]].bloodType;
                document.getElementById("inputId").value = jsonData.checkinApplicationWithRoomStateChangeDetails[[get_id]].userIdentityCard;
                document.getElementById("inputSexual").value = jsonData.checkinApplicationWithRoomStateChangeDetails[[get_id]].userGender;
                document.getElementById("userAddress").value = jsonData.checkinApplicationWithRoomStateChangeDetails[[get_id]].userAddress;
                document.getElementById("inputPhone").value = jsonData.checkinApplicationWithRoomStateChangeDetails[[get_id]].userCellphone;
                document.getElementById("specialMedicalHistory").value = jsonData.checkinApplicationWithRoomStateChangeDetails[[get_id]].specialMedicalHistory;
                document.getElementById("drugAllergy").value = jsonData.checkinApplicationWithRoomStateChangeDetails[[get_id]].drugAllergy;
                document.getElementById("language").value = jsonData.checkinApplicationWithRoomStateChangeDetails[[get_id]].language;
                document.getElementById("diagnosedWith").value = jsonData.checkinApplicationWithRoomStateChangeDetails[[get_id]].diagnosedWith;
                document.getElementById("overviewPatientCondition").value = jsonData.checkinApplicationWithRoomStateChangeDetails[[get_id]].overviewPatientCondition;
                document.getElementById("userIdentity").value = jsonData.checkinApplicationWithRoomStateChangeDetails[[get_id]].userIdentity;
                document.getElementById("selfCareAbility").value = jsonData.checkinApplicationWithRoomStateChangeDetails[[get_id]].selfCareAbility;
                document.getElementById("attachment").value = jsonData.checkinApplicationWithRoomStateChangeDetails[[get_id]].attachment;
                document.getElementById("referralDate").value = jsonData.checkinApplicationWithRoomStateChangeDetails[[get_id]].referralDate;
                document.getElementById("referralName").value = jsonData.checkinApplicationWithRoomStateChangeDetails[[get_id]].referralName;
                document.getElementById("referralEmployeeName").value = jsonData.checkinApplicationWithRoomStateChangeDetails[[get_id]].referralEmployeeName;
                document.getElementById("referralEmployeeTitle").value = jsonData.checkinApplicationWithRoomStateChangeDetails[[get_id]].referralEmployeeTitle;
                document.getElementById("referralEmployeeCellphone").value = jsonData.checkinApplicationWithRoomStateChangeDetails[[get_id]].referralEmployeeCellphone;
                document.getElementById("oneEmergencyContactName").value = jsonData.checkinApplicationWithRoomStateChangeDetails[[get_id]].oneEmergencyContactName;
                document.getElementById("oneEmergencyContactPhone").value = jsonData.checkinApplicationWithRoomStateChangeDetails[[get_id]].oneEmergencyContactPhone;
                document.getElementById("oneEmergencyContactRelationship").value = jsonData.checkinApplicationWithRoomStateChangeDetails[[get_id]].oneEmergencyContactRelationship;
                document.getElementById("twoEmergencyContactName").value = jsonData.checkinApplicationWithRoomStateChangeDetails[[get_id]].twoEmergencyContactName;
                document.getElementById("twoEmergencyContactPhone").value = jsonData.checkinApplicationWithRoomStateChangeDetails[[get_id]].twoEmergencyContactPhone;
                document.getElementById("twoEmergencyContactRelationship").value = jsonData.checkinApplicationWithRoomStateChangeDetails[[get_id]].twoEmergencyContactRelationship;
                document.getElementById("caregiverName").value = jsonData.checkinApplicationWithRoomStateChangeDetails[[get_id]].caregiverName;
                document.getElementById("applicantInfectiousDisease").value = jsonData.checkinApplicationWithRoomStateChangeDetails[[get_id]].applicantInfectiousDisease;
                document.getElementById("caregiverInfectiousDisease").value = jsonData.checkinApplicationWithRoomStateChangeDetails[get_id].caregiverInfectiousDisease
                document.getElementById("caregiverPhone").value = jsonData.checkinApplicationWithRoomStateChangeDetails[[get_id]].caregiverPhone;
                document.getElementById("caregiverRelationship").value = jsonData.checkinApplicationWithRoomStateChangeDetails[[get_id]].caregiverRelationship;
                document.getElementById("startDate").value = jsonData.checkinApplicationWithRoomStateChangeDetails[[get_id]].startDate;
                document.getElementById("endDate").value = jsonData.checkinApplicationWithRoomStateChangeDetails[[get_id]].endDate;
                document.getElementById("newStartDate").value = jsonData.checkinApplicationWithRoomStateChangeDetails[[get_id]].newStartDate;
                document.getElementById("newEndDate").value = jsonData.checkinApplicationWithRoomStateChangeDetails[[get_id]].newEndDate;
                document.getElementById("changedItem").value = jsonData.checkinApplicationWithRoomStateChangeDetails[[get_id]].changedItem;
                document.getElementById("reason").value = jsonData.checkinApplicationWithRoomStateChangeDetails[[get_id]].reason;
                document.getElementById("houseName").value = jsonData.checkinApplicationWithRoomStateChangeDetails[[get_id]].houseName;
            }
        }).catch((err) => {
            console.log('錯誤:', err);
        })

}

function submit_report() {
    OriStartDate = document.getElementById("startDate").value;
    OriEndDate = document.getElementById("endDate").value;
    newStartDate = document.getElementById("newStartDate").value;
    newEndDate = document.getElementById("newEndDate").value;
    reason = document.getElementById("reason").value;
    changedItem = document.getElementById("changedItem").value;
    appid = document.getElementById("inputNumber").value;



    if (changedItem == '延後入住') {
        if (Date.parse(newStartDate) <= Date.parse(today)) {
            show_alert('不能選擇今天或今天之前的日期');
            return;
        }
        if (Date.parse(newStartDate) < Date.parse(OriStartDate)) {
            show_alert('(延後入住):新入住日期需在原入住日期之後');
            return;
        }
    }
    if (changedItem == '延後退房') {
        if (Date.parse(newEndDate) <= Date.parse(today)) {
            show_alert('不能選擇今天或今天之前的日期');
            return;
        }
        if (Date.parse(newEndDate) < Date.parse(OriEndDate)) {
            show_alert('(延後退房):新退房日期需在原退房日期之後')
            return;
        }
    }
    if (changedItem == '提前入住') {
        if (Date.parse(newStartDate) <= Date.parse(today)) {
            show_alert('不能選擇今天或今天之前的日期');
            return;
        }
        if (Date.parse(newStartDate) > Date.parse(OriStartDate)) {
            show_alert('(提前入住):新入住日期需在原入住日期之前')
            return;
        }
    }
    if (changedItem == '提前退房') {
        if (Date.parse(newEndDate) <= Date.parse(today)) {
            show_alert('不能選擇今天或今天之前的日期');
            return;
        }
        if (Date.parse(newEndDate) > Date.parse(OriEndDate)) {
            show_alert('(提前退房):新退房日期需在原退房日期之後')
            return;
        }
    }
    if (changedItem == '變更入住及退房時間') {
        if (Date.parse(newStartDate) <= Date.parse(today) || Date.parse(newEndDate) < Date.parse(today)) {
            show_alert('不能選擇今天或今天之前的日期');
            return;
        }
    }

    if (document.getElementById("reason").length == 0) {
        show_alert('請輸入變更原因')
        return;
    }
    else if (Date.parse(newStartDate) > Date.parse(newEndDate)) {
        show_alert('入住日期需在退房日期之前')
        return;
    }
    else if (Date.parse(newStartDate) == Date.parse(newEndDate)) {
        show_alert('入住日期不得等於退房日期')
        return;
    }
    else {
        // PATCH更改資訊
        fetch(API_url + '/v1/api/referral-employees/' + appid + '/update/room-state/change?' + 'newStartDate=' + newStartDate + '&newEndDate=' + newEndDate + '&changedItem=' + changedItem + '&reason=' + reason, {
            method: 'PATCH',
            headers: new Headers({
                'x-eden-token': localStorage.getItem('token')
            })
        }).then(function (response) {
            return response.text();
        }).then(function (text) {
            console.log(text);
            show_alert('成功送出(請等待業管單位審核)')
            setTimeout(function () {
                window.location.href = 'view_change.html';
            }, 3000);
        }).catch(function (error) {
            console.log(error);
        });
    }
}


