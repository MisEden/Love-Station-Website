var roomId;
window.onload = function() {

    //document.getElementById("disease").href = API_url + '/v1/api/storage/diseases-form';//原本的超連結對應可能是自己做的功能
    document.getElementById("disease").href = 'https://www.cdc.gov.tw/Disease/Index';//改成對應衛服部網頁連結
    document.getElementById("disease").target = '_blank';

    Date.prototype.format = function(fmt) {
        var o = {
            "M+": this.getMonth() + 1, //月份 
            "d+": this.getDate(), //日 
            "h+": this.getHours(), //小时 
            "m+": this.getMinutes(), //分 
            "s+": this.getSeconds(), //秒 
            "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
            "S": this.getMilliseconds() //毫秒 
        };
        if (/(y+)/.test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
        }
        for (var k in o) {
            if (new RegExp("(" + k + ")").test(fmt)) {
                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
            }
        }
        return fmt;
    }
    var today = new Date().format("yyyy-MM-dd hh:mm:ss");

    // 取得轉介人員資料
    fetch(API_url + '/v1/api/referral-employees/me', {
            method: 'GET',
            headers: new Headers({
                'Content-Type': 'application/json',
                'x-eden-token': localStorage.getItem('token')
            })
        })
        .then(function checkStatus(response) {

            if (response.status == 200) {
                return response.json();
            } else {
                var where = 'rent';
                fetch_error(response, where);
            }

        }).then((jsonData) => {
            document.getElementById("ReferralDate").value = today;
            document.getElementById("ReferralHospital").value = jsonData.referralHospitalName;
            document.getElementById("ReferralName").value = jsonData.referralEmployeeName;
            document.getElementById("ReferralTitle").value = jsonData.referralTitleName;
            document.getElementById("ReferralPhone").value = jsonData.referralEmployeeCellphone;
        }).catch((err) => {
            console.log('錯誤:', err);
        });

    var url = decodeURI(location.search);
    if (url.indexOf("?") != -1) {
        var str = url.substr(1);
        var strs = str.split("&");
        document.getElementById("inputStack1").value = strs[0].split("=")[1];
        document.getElementById("inputStack2").value = strs[1].split("=")[1];
        roomId = strs[2].split("=")[1];
        document.getElementById("inputDayIn").value = strs[3].split("=")[1];
        document.getElementById("inputDayOut").value = strs[4].split("=")[1];
    } else {
        show_alert('尚未選擇入住資訊');
        window.location.href = 'rent.html';
    }

}

function StringToArray(str) {
    var arr = str.split(',');
    return arr;
}


var getUserId;

function put() {

    var query_ID = document.getElementById("inputID").value;
    if (query_ID == '') {
        show_alert('請輸入申請者的身分證字號以供查詢');
    } else if ($(".has-error").length > 0) {
        show_alert('請輸入身分證正確格式');
    } else {
        fetch(API_url + '/v1/api/checkin-applications/identity-card/finished/latest', {
                method: 'GET',
                headers: new Headers({
                    'Content-Type': 'application/json',
                    'x-eden-token': localStorage.getItem('token'),
                    'x-eden-identity-card': query_ID
                })
            })
            .then(function checkStatus(response) {

                if (response.status == 200) {
                    return response.json();
                } else {
                    var where = 'rent';
                    fetch_error(response, where);
                }

            }).then((jsonData) => {

                getUserId = jsonData.userId;
                document.getElementById("inputName").value = jsonData.userName;
                document.getElementById("inputBirth").value = jsonData.birthday;
                document.getElementById("inputSexual").value = jsonData.gender;
                document.getElementById("inputPhone").value = jsonData.cellphone;
                document.getElementById("inputAddress").value = jsonData.address;
                document.getElementById("inputBlo").value = jsonData.bloodType;
                if (jsonData.diagnosedWith != undefined) {

                    document.getElementById("editLan").hidden = true;
                    document.getElementById("inputLan2").hidden = false;
                    document.getElementById("inputLan2").value = jsonData.language;
                    document.getElementById("inputLan2").disabled = true;

                    var existLangue = 0;
                    if (jsonData.language.indexOf("國語") > -1) {
                        document.getElementById("inputLan_chinese").checked = true;
                        existLangue += 2;
                    } else {
                        document.getElementById("inputLan_chinese").checked = false;
                    }

                    if (jsonData.language.indexOf("台語") > -1) {
                        document.getElementById("inputLan_taiwanese").checked = true;
                        existLangue += 2;
                    } else {
                        document.getElementById("inputLan_taiwanese").checked = false;
                    }

                    if (jsonData.language.indexOf("客語") > -1) {
                        document.getElementById("inputLan_hakka").checked = true;
                        existLangue += 2;
                    } else {
                        document.getElementById("inputLan_hakka").checked = false;
                    }

                    if (jsonData.language.length > existLangue) {
                        document.getElementById("inputLan_other").checked = false;
                        document.getElementById("inputLan_other_text").value = "";

                        document.getElementById("inputLan_other").checked = true;
                        var languages = jsonData.language.split(",");
                        for (var i = 0; i < languages.length; i++) {
                            if (languages[i] !== "國語" && languages[i] !== "台語" && languages[i] !== "客語") {
                                document.getElementById("inputLan_other_text").value += languages[i] + ",";
                            }
                        }
                        if (document.getElementById("inputLan_other_text").value.length > 0) {
                            document.getElementById("inputLan_other_text").value = document.getElementById("inputLan_other_text").value.substring(0, document.getElementById("inputLan_other_text").value.length - 1);
                        }

                    } else {
                        document.getElementById("inputLan_other").checked = false;
                        document.getElementById("inputLan_other_text").value = "";
                    }


                    document.getElementById("editType").hidden = true;


                    document.getElementById("inputType2").hidden = false;
                    document.getElementById("inputType2").value = jsonData.userIdentity;
                    document.getElementById("inputType2").disabled = true;
                    if (jsonData.userIdentity.indexOf("一般戶") > -1) {
                        document.getElementById("inputType_normal").checked = true;
                    } else {
                        document.getElementById("inputType_normal").checked = false;
                    }

                    if (jsonData.userIdentity.indexOf("身心障礙者(輕中重)") > -1) {
                        document.getElementById("inputType_disability").checked = true;
                    } else {
                        document.getElementById("inputType_disability").checked = false;
                    }

                    if (jsonData.userIdentity.indexOf("中低收入") > -1) {
                        document.getElementById("inputType_income_lower").checked = true;
                    } else {
                        document.getElementById("inputType_income_lower").checked = false;
                    }


                    if (jsonData.userIdentity.indexOf("低收入") > -1) {
                        document.getElementById("inputType_income_lowest").checked = true;
                    } else {
                        document.getElementById("inputType_income_lowest").checked = false;
                    }


                    document.getElementById("inputSick").value = jsonData.specialMedicalHistory;
                    document.getElementById("inputSick").disabled = true;
                    document.getElementById("inputSenDrug").value = jsonData.drugAllergy;
                    document.getElementById("inputSenDrug").disabled = true;
                    document.getElementById("inputAbility").value = jsonData.selfCareAbility;
                    document.getElementById("inputAbility").disabled = true;


                    document.getElementById("editTool").hidden = true;
                    document.getElementById("inputTool2").hidden = false;
                    document.getElementById("inputTool2").value = jsonData.attachment;
                    document.getElementById("inputTool2").disabled = true;

                    var existAttachment = 0;
                    if (jsonData.attachment.length >= 2) {
                        document.getElementById("inputTool_none").checked = false;
                    } else {
                        document.getElementById("inputTool_none").checked = true;
                    }

                    if (jsonData.attachment.indexOf("柺杖") > -1) {
                        document.getElementById("inputTool_crutch").checked = true;
                        existAttachment += 2;
                    } else {
                        document.getElementById("inputTool_crutch").checked = false;
                    }

                    if (jsonData.attachment.indexOf("輪椅") > -1) {
                        document.getElementById("inputTool_wheelchair").checked = true;
                        existAttachment += 2;
                    } else {
                        document.getElementById("inputTool_wheelchair").checked = false;
                    }

                    if (jsonData.attachment.indexOf("助行器") > -1) {
                        document.getElementById("inputTool_walker").checked = true;
                        existAttachment += 2;
                    } else {
                        document.getElementById("inputTool_walker").checked = false;
                    }

                    if (jsonData.attachment.indexOf("義肢") > -1) {
                        document.getElementById("inputTool_prosthetic").checked = true;
                        existAttachment += 2;
                    } else {
                        document.getElementById("inputTool_prosthetic").checked = false;
                    }

                    if (jsonData.attachment.indexOf("電動車") > -1) {
                        document.getElementById("inputTool_ecar").checked = true;
                        existAttachment += 2;
                    } else {
                        document.getElementById("inputTool_ecar").checked = false;
                    }

                    if (jsonData.attachment.length > existAttachment) {
                        document.getElementById("inputTool_other").checked = false;
                        document.getElementById("inputToolOt").value = "";

                        document.getElementById("inputTool_other").checked = true;
                        var attachments = jsonData.attachment.split(",");
                        for (var i = 0; i < attachments.length; i++) {
                            if (attachments[i] !== "柺杖" &&
                                attachments[i] !== "輪椅" &&
                                attachments[i] !== "助行器" &&
                                attachments[i] !== "義肢" &&
                                attachments[i] !== "電動車") {
                                document.getElementById("inputToolOt").value += attachments[i] + ",";
                            }
                        }
                        if (document.getElementById("inputToolOt").value.length > 0) {
                            document.getElementById("inputToolOt").value =
                                document.getElementById("inputToolOt").value.substring(0,
                                    document.getElementById("inputToolOt").value.length - 1);
                        }

                    } else {
                        document.getElementById("inputTool_other").checked = false;
                        document.getElementById("inputToolOt").value = "";
                    }



                    document.getElementById("inputDigName").value = jsonData.diagnosedWith;
                    document.getElementById("inputDigName").disabled = true;
                    document.getElementById("inputDigDet").value = jsonData.overviewPatientCondition;
                    document.getElementById("inputDigDet").disabled = true;
                    document.getElementById("inputDrug").value = jsonData.medicine;
                    document.getElementById("inputDrug").disabled = true;
                    document.getElementById("CareName").value = jsonData.caregiverName;
                    document.getElementById("CareName").disabled = true;
                    document.getElementById("CareRelate").value = jsonData.caregiverRelationship;
                    document.getElementById("CareRelate").disabled = true;
                    document.getElementById("CarePhone").value = jsonData.caregiverPhone;
                    document.getElementById("CarePhone").disabled = true;
                    document.getElementById("ContactName1").value = jsonData.oneEmergencyContactName;
                    document.getElementById("ContactName1").disabled = true;
                    document.getElementById("ContactRelate1").value = jsonData.oneEmergencyContactRelationship;
                    document.getElementById("ContactRelate1").disabled = true;
                    document.getElementById("ContactPhone1").value = jsonData.oneEmergencyContactPhone;
                    document.getElementById("ContactPhone1").disabled = true;
                    document.getElementById("ContactName2").value = jsonData.twoEmergencyContactName;
                    document.getElementById("ContactName2").disabled = true;
                    document.getElementById("ContactRelate2").value = jsonData.twoEmergencyContactRelationship;
                    document.getElementById("ContactRelate2").disabled = true;
                    document.getElementById("ContactPhone2").value = jsonData.twoEmergencyContactPhone;
                    document.getElementById("ContactPhone2").disabled = true;
                } else {
                    show_alert('此申請者為首次申請，請手動填入以下資訊');
                    document.getElementById("editLan").hidden = false;
                    document.getElementById("inputLan2").hidden = true;
                    document.getElementById("inputLan2").value = '';
                    document.getElementById("inputLan2").disabled = false;
                    document.getElementById("editType").hidden = false;
                    document.getElementById("inputType2").hidden = true;
                    document.getElementById("inputType2").value = '';
                    document.getElementById("inputType2").disabled = false;
                    document.getElementById("inputSick").value = '';
                    document.getElementById("inputSick").disabled = false;
                    document.getElementById("inputSenDrug").value = '';
                    document.getElementById("inputSenDrug").disabled = false;
                    document.getElementById("inputAbility").value = '';
                    document.getElementById("inputAbility").disabled = false;
                    document.getElementById("editTool").hidden = false;
                    document.getElementById("inputTool2").hidden = true;
                    document.getElementById("inputTool2").value = '';
                    document.getElementById("inputTool2").disabled = false;
                    document.getElementById("inputDigName").value = '';
                    document.getElementById("inputDigName").disabled = false;
                    document.getElementById("inputDigDet").value = '';
                    document.getElementById("inputDigDet").disabled = false;
                    document.getElementById("inputDrug").value = '';
                    document.getElementById("inputDrug").disabled = false;
                    document.getElementById("CareName").value = '';
                    document.getElementById("CareName").disabled = false;
                    document.getElementById("CareRelate").value = '';
                    document.getElementById("CareRelate").disabled = false;
                    document.getElementById("CarePhone").value = '';
                    document.getElementById("CarePhone").disabled = false;
                    document.getElementById("ContactName1").value = '';
                    document.getElementById("ContactName1").disabled = false;
                    document.getElementById("ContactRelate1").value = '';
                    document.getElementById("ContactRelate1").disabled = false;
                    document.getElementById("ContactPhone1").value = '';
                    document.getElementById("ContactPhone1").disabled = false;
                    document.getElementById("ContactName2").value = '';
                    document.getElementById("ContactName2").disabled = false;
                    document.getElementById("ContactRelate2").value = '';
                    document.getElementById("ContactRelate2").disabled = false;
                    document.getElementById("ContactPhone2").value = '';
                    document.getElementById("ContactPhone2").disabled = false;

                }
            }).catch((err) => {
                console.log('錯誤:', err);
            })
    }
}

function edit() {

    document.getElementById("editLan").hidden = false;
    document.getElementById("inputLan2").hidden = true;
    document.getElementById("editType").hidden = false;
    document.getElementById("inputType2").hidden = true;
    document.getElementById("inputSick").disabled = false;
    document.getElementById("inputSenDrug").disabled = false;
    document.getElementById("inputAbility").disabled = false;
    document.getElementById("editTool").hidden = false;
    document.getElementById("inputTool2").hidden = true;
    document.getElementById("inputDigName").disabled = false;
    document.getElementById("inputDigDet").disabled = false;
    document.getElementById("inputDrug").disabled = false;
    document.getElementById("editTool").hidden = false;
    document.getElementById("inputTool2").hidden = true;
    document.getElementById("CareName").disabled = false;
    document.getElementById("CareRelate").disabled = false;
    document.getElementById("CarePhone").disabled = false;
    document.getElementById("ContactName1").disabled = false;
    document.getElementById("ContactRelate1").disabled = false;
    document.getElementById("ContactPhone1").disabled = false;
    document.getElementById("ContactName2").disabled = false;
    document.getElementById("ContactRelate2").disabled = false;
    document.getElementById("ContactPhone2").disabled = false;

}

function apply() {

    var referralDate = document.getElementById("ReferralDate").value
    var bloodType = document.getElementById("inputBlo").value;
    if (document.getElementById("inputInOut").value == "true") {
        var applicantIn = true;
    } else {
        var applicantIn = false;
    }
    if (document.getElementById("editLan").hidden == false) {
        var language = $("input[name='inputLan[]']:checked").map(function() { return $(this).val(); }).get();
        if (language.includes("ot") == true) {
            var index = language.indexOf("ot");
            language[index] = document.getElementById("inputLanOt").value;
        }
    } else {
        var language = StringToArray(document.getElementById("inputLan2").value);
    }
    if (document.getElementById("editType").hidden == false) {
        var userIdentity = $("input[name='inputType[]']:checked").map(function() { return $(this).val(); }).get();
    } else {
        var userIdentity = StringToArray(document.getElementById("inputType2").value);
    }
    var specialMedicalHistory = document.getElementById("inputSick").value;
    var drugAllergy = document.getElementById("inputSenDrug").value;
    var selfCareAbility = document.getElementById("inputAbility").value;
    if (document.getElementById("editTool").hidden == false) {
        var attachment = $("input[name='inputTool[]']:checked").map(function() { return $(this).val(); }).get();
        if (attachment.includes("ot") == true) {
            var index = attachment.indexOf("ot");
            attachment[index] = document.getElementById("inputToolOt").value;
        }
    } else {
        var attachment = StringToArray(document.getElementById("inputTool2").value);
    }
    var diagnosedWith = document.getElementById("inputDigName").value;
    var overviewPatientCondition = document.getElementById("inputDigDet").value;
    var medicine = document.getElementById("inputDrug").value;

    var caregiverName = document.getElementById("CareName").value;
    var caregiverRelationship = document.getElementById("CareRelate").value;
    var caregiverPhone = document.getElementById("CarePhone").value;

    var applicantInfectiousDisease = $('input[name=inputConSick]:checked').val();
    if (applicantInfectiousDisease == "Y") {
        applicantInfectiousDisease = document.getElementById("inputConSickName").value;
    }
    var caregiverInfectiousDisease = $('input[name=CareConSick]:checked').val();
    if (caregiverInfectiousDisease == "Y") {
        caregiverInfectiousDisease = document.getElementById("CareConSickName").value;
    }

    var oneEmergencyContactName = document.getElementById("ContactName1").value;
    var oneEmergencyContactRelationship = document.getElementById("ContactRelate1").value;
    var oneEmergencyContactPhone = document.getElementById("ContactPhone1").value;
    var twoEmergencyContactName = document.getElementById("ContactName2").value;
    var twoEmergencyContactRelationship = document.getElementById("ContactRelate2").value;
    var twoEmergencyContactPhone = document.getElementById("ContactPhone2").value;
    var startDate = document.getElementById("inputDayIn").value;
    var endDate = document.getElementById("inputDayOut").value;
    var applicationReason = $("input[name='inputReason[]']:checked").map(function() { return $(this).val(); }).get();
    if (applicationReason.includes("ot") == true) {
        var index = applicationReason.indexOf("ot");
        applicationReason[index] = document.getElementById("inputReasonOt").value;
    }


    if (language == '' || specialMedicalHistory == '' || drugAllergy == '' || diagnosedWith == '' ||
        overviewPatientCondition == '' || medicine == '' || userIdentity == '' || attachment == '' ||
        caregiverName == '' || caregiverRelationship == '' || caregiverPhone == '' || applicationReason == '' ||
        oneEmergencyContactName == '' || oneEmergencyContactRelationship == '' || oneEmergencyContactPhone == '') {
        show_alert('請填完表單');
        return false;
    } else {
        var apply_data = {
            "userId": getUserId,
            "referralDate": referralDate,
            "startDate": startDate,
            "endDate": endDate,
            "roomId": roomId,
            "applicantIn": applicantIn,
            "bloodType": bloodType,
            "language": language,
            "specialMedicalHistory": specialMedicalHistory,
            "drugAllergy": drugAllergy,
            "diagnosedWith": diagnosedWith,
            "overviewPatientCondition": overviewPatientCondition,
            "medicine": medicine,
            "userIdentity": userIdentity,
            "selfCareAbility": selfCareAbility,
            "attachment": attachment,
            "caregiverName": caregiverName,
            "caregiverRelationship": caregiverRelationship,
            "caregiverPhone": caregiverPhone,
            "applicantInfectiousDisease": applicantInfectiousDisease,
            "caregiverInfectiousDisease": caregiverInfectiousDisease,
            "oneEmergencyContactName": oneEmergencyContactName,
            "oneEmergencyContactRelationship": oneEmergencyContactRelationship,
            "oneEmergencyContactPhone": oneEmergencyContactPhone,
            "twoEmergencyContactName": twoEmergencyContactName,
            "twoEmergencyContactRelationship": twoEmergencyContactRelationship,
            "twoEmergencyContactPhone": twoEmergencyContactPhone,
            "applicationReason": applicationReason
        }

        $.ajax({
            type: "POST",
            url: API_url + "/v1/api/checkin-applications/first-stage",
            async: false,
            data: JSON.stringify(apply_data),
            headers: {
                'Content-Type': 'application/json',
                'x-eden-token': localStorage.getItem('token')
            },

            success: function(data, textStatus, request) {
                console.log(apply_data);
                show_alert('感謝申請，請等待審核結果');
                setTimeout(function() {
                    window.location.href = 'rent.html';
                }, 3000);
            },
            error: function(xhr, thrownError) {

                var where = 'rent';
                ajax_error(xhr, thrownError, where);

            }
        })
    }

}
