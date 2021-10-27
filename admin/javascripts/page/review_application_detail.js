
var path = window.location.pathname;
var where = path.split("/").pop().split(".")[0];

const checkinApplicationId = getParameterByName('id', "review_application.html");

window.onload = function() {
    var path = ["首頁", "入住管理", "檢視入住申請單", "檢視入住申請單內容"]; 
    showBreadcrumb(path);

    if(!isError){
        loadData();
    }
}

function loadData(){
    fetch( API_url + '/v1/api/admins/checkin-applications/' + checkinApplicationId, {
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
        else{
            fetch_error(response, where);
        }

    }).then((jsonData) => {

        console.log(jsonData);

        document.getElementById("ReferralDate").value = jsonData.referralDate.substring(0,10);;
        document.getElementById("ReferralHospital").value = jsonData.referralHospitalChineseName;
        document.getElementById("ReferralName").value = jsonData.referralEmployeeName;        
        document.getElementById("ReferralTitle").value = jsonData.referralTitleName;
        document.getElementById("ReferralPhone").value = jsonData.referralEmployeeCellphone;
        document.getElementById("applyID").value = jsonData.id;    
        getUserID = jsonData.userId;
        document.getElementById("inputID").value = jsonData.identityCard;
        document.getElementById("inputName").value = jsonData.userName;    
        document.getElementById("inputBirth").value = jsonData.birthday;
        document.getElementById("inputSexual").value = jsonData.gender;
        document.getElementById("inputBlo").value = jsonData.bloodType;
        document.getElementById("inputAddress").value = jsonData.address;    
        document.getElementById("inputPhone").value = jsonData.cellphone;
        if(jsonData.applicantIn==true){
            document.getElementById("inputInOut").value = "是";
        }
        else{
            document.getElementById("inputInOut").value = "否";
        }

        document.getElementById("inputLan").value = jsonData.language;
        document.getElementById("inputSick").value = jsonData.specialMedicalHistory;
        document.getElementById("inputSenDrug").value = jsonData.drugAllergy;
        document.getElementById("inputDigName").value = jsonData.diagnosedWith;
        document.getElementById("inputDigDet").value = jsonData.overviewPatientCondition;
        document.getElementById("inputDrug").value = jsonData.medicine;
        
        document.getElementById("inputType").value = jsonData.userIdentity;
        document.getElementById("inputAbility").value = jsonData.selfCareAbility;
        document.getElementById("inputTool").value = jsonData.attachment;
        
        document.getElementById("CareName").value = jsonData.caregiverName;
        document.getElementById("CareRelate").value = jsonData.caregiverRelationship;
        document.getElementById("CarePhone").value = jsonData.caregiverPhone;
        
        document.getElementById("inputConSick").value = jsonData.applicantInfectiousDisease;
        document.getElementById("CareConSick").value = jsonData.caregiverInfectiousDisease;

        document.getElementById("ContactName1").value = jsonData.oneEmergencyContactName;
        document.getElementById("ContactRelate1").value = jsonData.oneEmergencyContactRelationship;
        document.getElementById("ContactPhone1").value = jsonData.oneEmergencyContactPhone;
        document.getElementById("ContactName2").value = jsonData.twoEmergencyContactName;
        document.getElementById("ContactRelate2").value = jsonData.twoEmergencyContactRelationship;
        document.getElementById("ContactPhone2").value = jsonData.twoEmergencyContactPhone;

        document.getElementById("inputStack1").value = jsonData.houseName;
        document.getElementById("inputStack2").value = jsonData.roomNumber;
        document.getElementById("inputDayIn").value = jsonData.startDate;
        document.getElementById("inputDayOut").value = jsonData.endDate;
        document.getElementById("inputReason").value = jsonData.applicationReason;

        if(jsonData.firstVerified){
            document.getElementById("result_1st").value = "通過";
        }else if(jsonData.firstVerified == null){
            document.getElementById("result_1st").value = "";
        }else{
            document.getElementById("result_1st").value = "不通過";
        }

        document.getElementById("result_1st_reason").value = jsonData.firstVerifiedReason;

        if(jsonData.secondVerified){
            document.getElementById("result_2nd").value = "通過";
        }else if(jsonData.secondVerified == null){
            document.getElementById("result_2nd").value = "";
        }else{
            document.getElementById("result_2nd").value = "不通過";
        }

    }).catch((err) => {
        console.log('錯誤:', err);
    })
}