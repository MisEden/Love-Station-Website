
var path = window.location.pathname;
var where = path.split("/").pop().split(".")[0];

var id = getParameterByName("id", "review_change.html");

var newStartDate;
var newEndDate;

window.onload = function() {
    var path = ["首頁", "待辦審核", "待審核需求變更", "審核變更需求單"]; 
    showBreadcrumb(path);

    if(!isError){
        loadData();
    }else{
        return;
    }


    var hideIdList = ["editDiv"];
    setReadOnly(hideIdList);
}

function loadData() {
    fetch(API_url + '/v1/api/admins/checkin-applications/' + id + '/room-states/change', {
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

            document.getElementById("applyID").value = jsonData.checkinAppId;
            document.getElementById("roomStateChangeDate").value = jsonData.roomStateChangeDate;
            document.getElementById("inputName").value = jsonData.userName;
            document.getElementById("inputBirth").value = jsonData.userBirthday;
            document.getElementById("inputBlo").value = jsonData.bloodType;
            document.getElementById("inputID").value = jsonData.userIdentityCard;
            document.getElementById("inputSexual").value = jsonData.userGender;
            document.getElementById("inputAddress").value = jsonData.userAddress;
            document.getElementById("inputPhone").value = jsonData.userCellphone;
            document.getElementById("inputSick").value = jsonData.specialMedicalHistory;
            document.getElementById("inputSenDrug").value = jsonData.drugAllergy;
            document.getElementById("inputLan").value = jsonData.language;
            document.getElementById("inputDigName").value = jsonData.diagnosedWith;
            document.getElementById("inputDigDet").value = jsonData.overviewPatientCondition;
            document.getElementById("inputDrug").value = jsonData.medicine;
            document.getElementById("inputType").value = jsonData.userIdentity;
            document.getElementById("inputAbility").value = jsonData.selfCareAbility;
            document.getElementById("inputTool").value = jsonData.attachment;
            document.getElementById("ReferralDate").value = jsonData.referralDate;
            document.getElementById("ReferralHospital").value = jsonData.referralName;
            document.getElementById("ReferralName").value = jsonData.referralEmployeeName;
            document.getElementById("ReferralTitle").value = jsonData.referralEmployeeTitle;
            document.getElementById("ReferralPhone").value = jsonData.referralEmployeeCellphone;
            document.getElementById("ContactName1").value = jsonData.oneEmergencyContactName;
            document.getElementById("ContactPhone1").value = jsonData.oneEmergencyContactPhone;
            document.getElementById("ContactRelate1").value = jsonData.oneEmergencyContactRelationship;
            document.getElementById("ContactName2").value = jsonData.twoEmergencyContactName;
            document.getElementById("ContactPhone2").value = jsonData.twoEmergencyContactPhone;
            document.getElementById("ContactRelate2").value = jsonData.twoEmergencyContactRelationship;
            document.getElementById("CareName").value = jsonData.caregiverName;
            document.getElementById("inputConSick").value = jsonData.applicantInfectiousDisease;
            document.getElementById("CareConSick").value = jsonData.caregiverInfectiousDisease
            document.getElementById("CarePhone").value = jsonData.caregiverPhone;
            document.getElementById("CareRelate").value = jsonData.caregiverRelationship;
            document.getElementById("startDate").value = jsonData.startDate;
            document.getElementById("endDate").value = jsonData.endDate;
            document.getElementById("newStartDate").value = jsonData.newStartDate;
            newStartDate = jsonData.newStartDate;
            document.getElementById("newEndDate").value = jsonData.newEndDate;
            newEndDate = jsonData.newEndDate;
            document.getElementById("reason").value = jsonData.reason;
            document.getElementById("houseName").value = jsonData.houseName;
            document.getElementById("changedItem").value = jsonData.changedItem;

        }).catch((err) => {
            console.log('錯誤:', err);
        })
}

function finish(){

    var checkResault = $('input[name=customRadio]:checked').val();
    if(checkResault=="pass"){
        var verified = true;
        var deniedReason = '';
    } else if(checkResault=="fail"){
        var verified = false;
        var deniedReason = document.getElementById('deniedReason').value;
    }else{
        return;
    }

    
    // PATCH更改資訊
    fetch(API_url + '/v1/api/admins/' + id + '/update/room-states/change?' + 'newStartDate=' + newStartDate + '&newEndDate=' + newEndDate + '&verified=' + verified + '&deniedReason=' + deniedReason, {
        method: 'PATCH',
        headers: new Headers({
            'x-eden-token': localStorage.getItem('token')
        })
    }).then(function (response) {
        return response.text();
    }).then(function (text) {
        console.log(text);
        alert('成功送出，系統將自動轉跳')
        setTimeout(function () {
            window.location.href = 'review_change.html';
        }, 1500);
    }).catch(function (error) {
        console.log(error);
    });
}