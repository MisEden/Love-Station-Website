var get_id;
var get_status;
var fetch_url;

window.onload = function () {

    var url = location.href;

    if (url.indexOf('?') != -1) {
        var temp = url.split("?");
        var vars = temp[1].split("=");
        get_id = vars[1];
    }
    getPeople(get_id);

}

function getPeople(get_id) {

    fetch(API_url + '/v1/api/checkin-applications/' + get_id + '/detail', {
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
                var where = 'applyList';
                fetch_error(response, where);
            }
        }).then((jsonData) => {
            console.log(jsonData)
            document.getElementById("ReferralDate").value = jsonData.referralDate;
            document.getElementById("ReferralHospital").value = jsonData.referralHospitalChineseName;
            document.getElementById("ReferralName").value = jsonData.referralEmployeeName;
            document.getElementById("ReferralTitle").value = jsonData.referralTitleName;
            document.getElementById("ReferralPhone").value = jsonData.referralEmployeeCellphone;

            document.getElementById("applyID").value = jsonData.id;
            document.getElementById("inputID").value = jsonData.identityCard;
            document.getElementById("inputName").value = jsonData.userName;
            document.getElementById("inputBirth").value = jsonData.birthday;
            document.getElementById("inputSexual").value = jsonData.gender;
            document.getElementById("inputBlo").value = jsonData.bloodType;
            document.getElementById("inputAddress").value = jsonData.address;
            document.getElementById("inputPhone").value = jsonData.cellphone;
            if (jsonData.applicantIn == true) {
                document.getElementById("inputInOut").value = "是";
            }
            else {
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
            document.getElementById("inputReasonOt").value = jsonData.applicationReason;

            if (jsonData.firstVerified == null) {
                // document.getElementById("inputResult").value = '入住申請單待審核';

                document.getElementById("step_1_text_number").classList.add("stepStatus_doing");
                document.getElementById("step_1_text_number").innerHTML = "➜";
                document.getElementById("step_1_text_title").classList.add("stepStatus_normal_text");
                document.getElementById("step_1_text_title").innerHTML = "入住申請審核中...";

                document.getElementById("step_1_line").classList.add("stepStatus_wait");

                document.getElementById("step_2_text_number").classList.add("stepStatus_wait");
                document.getElementById("step_2_text_number").innerHTML = " ";
                document.getElementById("step_2_text_title").classList.add("stepStatus_wait_text");
                document.getElementById("step_2_text_title").innerHTML = "入住文件待審核";
            }
            else if (jsonData.firstVerified == false) {
                // document.getElementById("inputResult").value = '入住申請單審核未通過，原因: ' + jsonData.firstVerifiedReason;

                document.getElementById("step_1_text_number").classList.add("stepStatus_fail");
                document.getElementById("step_1_text_number").innerHTML = "✗";
                document.getElementById("step_1_text_title").classList.add("stepStatus_normal_text");
                document.getElementById("step_1_text_title").innerHTML = '入住申請審核「<strong>未通過</strong>」<br>原因: <u>' + jsonData.firstVerifiedReason + '</u>';

                document.getElementById("step_1_line").classList.add("stepStatus_wait");

                document.getElementById("step_2_text_number").classList.add("stepStatus_wait");
                document.getElementById("step_2_text_number").innerHTML = " ";
                document.getElementById("step_2_text_title").classList.add("stepStatus_normal_text");
                document.getElementById("step_2_text_title").innerHTML = "入住文件待審核";
            }
            else {
                if (jsonData.rentImage == null || jsonData.rentImage == "") {
                    // document.getElementById("inputResult").value = '入住申請單審核通過';

                    document.getElementById("step_1_text_number").classList.add("stepStatus_success");
                    document.getElementById("step_1_text_number").innerHTML = "✓";
                    document.getElementById("step_1_text_title").classList.add("stepStatus_normal_text");
                    document.getElementById("step_1_text_title").innerHTML = '入住申請審核「<strong>通過</strong>」';

                    document.getElementById("step_1_line").classList.add("stepStatus_success");

                    document.getElementById("step_2_text_number").classList.add("stepStatus_wait");
                    document.getElementById("step_2_text_number").innerHTML = " ";
                    document.getElementById("step_2_text_title").classList.add("stepStatus_normal_text");
                    document.getElementById("step_2_text_title").innerHTML = "入住文件待審核";
                }
                else if (jsonData.secondVerified == null) {
                    // document.getElementById("inputResult").value = '入住文件待審核';

                    document.getElementById("step_1_text_number").classList.add("stepStatus_success");
                    document.getElementById("step_1_text_number").innerHTML = "✓";
                    document.getElementById("step_1_text_title").classList.add("stepStatus_normal_text");
                    document.getElementById("step_1_text_title").innerHTML = '入住申請審核「<strong>通過</strong>」';

                    document.getElementById("step_1_line").classList.add("stepStatus_success");

                    document.getElementById("step_2_text_number").classList.add("stepStatus_doing");
                    document.getElementById("step_2_text_number").innerHTML = "➜";
                    document.getElementById("step_2_text_title").classList.add("stepStatus_normal_text");
                    document.getElementById("step_2_text_title").innerHTML = "入住文件審核中...";
                }
                else if (jsonData.secondVerified == false) {
                    // document.getElementById("inputResult").value = '入住文件審核未通過';

                    document.getElementById("step_1_text_number").classList.add("stepStatus_success");
                    document.getElementById("step_1_text_number").innerHTML = "✓";
                    document.getElementById("step_1_text_title").classList.add("stepStatus_normal_text");
                    document.getElementById("step_1_text_title").innerHTML = '入住申請審核「<strong>通過</strong>」';

                    document.getElementById("step_1_line").classList.add("stepStatus_success");

                    document.getElementById("step_2_text_number").classList.add("stepStatus_fail");
                    document.getElementById("step_2_text_number").innerHTML = "✗";
                    document.getElementById("step_2_text_title").classList.add("stepStatus_normal_text");
                    document.getElementById("step_2_text_title").innerHTML = "入住文件審核「<strong>未通過</strong>，請重新上傳檔案」";
                }
                else if (jsonData.secondVerified == true) {
                    // document.getElementById("inputResult").value = '入住文件審核通過';

                    document.getElementById("step_1_text_number").classList.add("stepStatus_success");
                    document.getElementById("step_1_text_number").innerHTML = "✓";
                    document.getElementById("step_1_text_title").classList.add("stepStatus_normal_text");
                    document.getElementById("step_1_text_title").innerHTML = '入住申請審核「<strong>通過</strong>」';

                    document.getElementById("step_1_line").classList.add("stepStatus_success");

                    document.getElementById("step_2_text_number").classList.add("stepStatus_success");
                    document.getElementById("step_2_text_number").innerHTML = "✓";
                    document.getElementById("step_2_text_title").classList.add("stepStatus_normal_text");
                    document.getElementById("step_2_text_title").innerHTML = "入住文件審核「<strong>通過</strong>」";
                }
            }

            if (jsonData.firstVerified == true && jsonData.secondVerified == null) {
                document.getElementById("btn_upload").disabled = false;
            }
            else if (jsonData.firstVerified == true && jsonData.secondVerified == false) {
                document.getElementById("btn_upload").disabled = false;
            }
            else if (jsonData.firstVerified == true && jsonData.secondVerified == true) {
                document.getElementById("btn_upload").disabled = true;
            }

        }).catch((err) => {
            console.log('錯誤:', err);
        })
}

function upload() {
    window.location.href = "upload.html?id=" + document.getElementById("applyID").value;
}

function checkin() {
    window.location.href = "check_in.html?id=" + document.getElementById("applyID").value;
}