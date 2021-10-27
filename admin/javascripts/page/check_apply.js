
var path = window.location.pathname;
var where = path.split("/").pop().split(".")[0];

const checkinApplicationId = getParameterByName('id', "index.html");

var dateToday = new Date(); 
var getUserID = "";
var cnt = false;
var check = 0;
var getOrderDate = [];
var getRoomId;

window.onload = function() {
    var path = ["首頁", "待辦審核", "入住申請", "審查入住申請單"]; 
    showBreadcrumb(path);

    if(!isError){
        getPeople();
        getHouse();
        setTime();

        $("#apply_in").change(function(){
            $("#apply_out").attr("min",document.getElementById("apply_in").value);
        })
        $("#apply_out").change(function(){
            if($("#apply_out").value!=''){
                $("#apply_in").attr("max",document.getElementById("apply_out").value);
            }
        })
    }


    var hideIdList = ["editDiv"];
    setReadOnly(hideIdList);
}

function getHouse(){
    // 取得所有愛心棧的名稱
    fetch( API_url + '/v1/api/houses/names', {
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

        var select = document.getElementById("SelectHouse");
        for (var i = 0; i < jsonData.length; i++) {
            select.innerHTML += "<option value=\"" + jsonData[i].id  + "\">" + jsonData[i].name + '</option>';
        }

    }).catch((err) => {
        console.log('錯誤:', err);
    });

}

// 取得愛心棧的房號
$("#SelectHouse").change(function(){
    
    if(document.getElementById("SelectHouse").selectedIndex > 0){

        fetch( API_url + '/v1/api/houses/' + document.getElementById("SelectHouse").value + '/room-numbers' , {
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

            var select = document.getElementById("SelectRoom");
            $("#SelectRoom ").empty();

            for (var i = 0; i < jsonData.length; i++) {
                select.innerHTML += "<option value=\"" + jsonData[i].id + "\">" + jsonData[i].number + '</option>';
            }

        }).catch((err) => {
            console.log('錯誤:', err);
        });
    }
    
});

function setTime(){
    var Today_year = dateToday.getFullYear();
    var Today_mon = dateToday.getMonth()+1 < 10 ? "0"+(dateToday.getMonth()+1) : (dateToday.getMonth()+1);//
    var Today_dat = dateToday.getDate() < 10 ? "0"+dateToday.getDate() : dateToday.getDate();
    $("#apply_in").val('');
    $("#apply_out").val('');

    $("#apply_in").attr("min",Today_year+"-"+Today_mon+"-"+Today_dat);
    $("#apply_in").attr("max",'');

    $("#apply_out").attr("min",Today_year+"-"+Today_mon+"-"+Today_dat);
}

function getPeople(){
    fetch( API_url + '/v1/api/admins/index/checkin-applications/detail?stage=first&currentPage=0', {
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
        var totalPage = jsonData.totalPage;

            for(var i=0; i<totalPage && !cnt ; i++){
                fetch( API_url + '/v1/api/admins/index/checkin-applications/detail?stage=first&currentPage=' + i, {
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
                    
                        for(var i=0; i<jsonData.checkinApplications.length && !cnt; i++){
                            if(jsonData.checkinApplications[i].id == checkinApplicationId){
                                document.getElementById("ReferralDate").value = jsonData.checkinApplications[i].referralDate.substring(0,10);;
                                document.getElementById("ReferralHospital").value = jsonData.checkinApplications[i].referralHospitalChineseName;
                                document.getElementById("ReferralName").value = jsonData.checkinApplications[i].referralEmployeeName;        
                                document.getElementById("ReferralTitle").value = jsonData.checkinApplications[i].referralTitleName;
                                document.getElementById("ReferralPhone").value = jsonData.checkinApplications[i].referralEmployeeCellphone;
                                document.getElementById("applyID").value = jsonData.checkinApplications[i].id;    
                                getUserID = jsonData.checkinApplications[i].userId;
                                document.getElementById("inputID").value = jsonData.checkinApplications[i].identityCard;
                                document.getElementById("inputName").value = jsonData.checkinApplications[i].userName;    
                                document.getElementById("inputBirth").value = jsonData.checkinApplications[i].birthday;
                                document.getElementById("inputSexual").value = jsonData.checkinApplications[i].gender;
                                document.getElementById("inputBlo").value = jsonData.checkinApplications[i].bloodType;
                                document.getElementById("inputAddress").value = jsonData.checkinApplications[i].address;    
                                document.getElementById("inputPhone").value = jsonData.checkinApplications[i].cellphone;
                                if(jsonData.checkinApplications[i].applicantIn==true){
                                    document.getElementById("inputInOut").value = "是";
                                }
                                else{
                                    document.getElementById("inputInOut").value = "否";
                                }
                        
                                document.getElementById("inputLan").value = jsonData.checkinApplications[i].language;
                                document.getElementById("inputSick").value = jsonData.checkinApplications[i].specialMedicalHistory;
                                document.getElementById("inputSenDrug").value = jsonData.checkinApplications[i].drugAllergy;
                                document.getElementById("inputDigName").value = jsonData.checkinApplications[i].diagnosedWith;
                                document.getElementById("inputDigDet").value = jsonData.checkinApplications[i].overviewPatientCondition;
                                document.getElementById("inputDrug").value = jsonData.checkinApplications[i].medicine;
                                
                                document.getElementById("inputType").value = jsonData.checkinApplications[i].userIdentity;
                                document.getElementById("inputAbility").value = jsonData.checkinApplications[i].selfCareAbility;
                                document.getElementById("inputTool").value = jsonData.checkinApplications[i].attachment;
                                
                                document.getElementById("CareName").value = jsonData.checkinApplications[i].caregiverName;
                                document.getElementById("CareRelate").value = jsonData.checkinApplications[i].caregiverRelationship;
                                document.getElementById("CarePhone").value = jsonData.checkinApplications[i].caregiverPhone;
                                
                                document.getElementById("inputConSick").value = jsonData.checkinApplications[i].applicantInfectiousDisease;
                                document.getElementById("CareConSick").value = jsonData.checkinApplications[i].caregiverInfectiousDisease;
                        
                                document.getElementById("ContactName1").value = jsonData.checkinApplications[i].oneEmergencyContactName;
                                document.getElementById("ContactRelate1").value = jsonData.checkinApplications[i].oneEmergencyContactRelationship;
                                document.getElementById("ContactPhone1").value = jsonData.checkinApplications[i].oneEmergencyContactPhone;
                                document.getElementById("ContactName2").value = jsonData.checkinApplications[i].twoEmergencyContactName;
                                document.getElementById("ContactRelate2").value = jsonData.checkinApplications[i].twoEmergencyContactRelationship;
                                document.getElementById("ContactPhone2").value = jsonData.checkinApplications[i].twoEmergencyContactPhone;
                            
                                document.getElementById("inputStack1").value = jsonData.checkinApplications[i].houseName;
                                document.getElementById("inputStack2").value = jsonData.checkinApplications[i].roomNumber;
                                document.getElementById("inputDayIn").value = jsonData.checkinApplications[i].startDate;
                                document.getElementById("inputDayOut").value = jsonData.checkinApplications[i].endDate;
                                document.getElementById("inputReason").value = jsonData.checkinApplications[i].applicationReason;

                                cnt = true;
                            }
                        }
                        
    
                        
                }).catch((err) => {
                    console.log('錯誤:', err);
                })
            }           
    }).catch((err) => {
        console.log('錯誤:', err);
    })
}

function getTheDate(datestr){
    var temp = datestr.split("-");
    var date = new Date(temp[0],temp[1],temp[2]);
    return date;
}

function finish(){
    var apply_data;

    applyID = document.getElementById("applyID").value;
    var checkResault = $('input[name=customRadio]:checked').val();
    if(checkResault=="change"){

        if(document.getElementById("SelectRoom").selectedIndex<0){
            alert('請先選擇棧點並選擇房號');
        }
        else{
            var getRoomindex = document.getElementById("SelectRoom").selectedIndex;
            getRoomId = document.getElementById("SelectRoom").value;

                var par = 0;
                var date_in = document.getElementById("apply_in").value;
                var date_out = document.getElementById("apply_out").value;
    
                if( date_in=="" || date_out==""){
                    alert('請選擇入住日期及退房日期');
                }
                else{
                    var startTime = getTheDate(date_in);
                    var endTime = getTheDate(date_out);

                    if( startTime <= dateToday || endTime <= dateToday){
                        alert('日期需在今天之後');
                        par = 1;
                    }
                    else{
                        
                        if(par!=1){
                            apply_data = {
                                "firstVerified": true,
                                "startDate":  document.getElementById("apply_in").value,
                                "endDate":  document.getElementById("apply_out").value,
                                "roomId": getRoomId
                            }
                            console.log(apply_data);
                            send_result(apply_data);
                        }
                    }
                }

        }
    }
    else if(checkResault=="pass"){
        apply_data = {
            "firstVerified": true
        }
        send_result(apply_data);
    }
    else{
        apply_data = {
            "firstVerified": false,
            "firstVerifiedReason": document.getElementById("reason").value
        }
        send_result(apply_data);
    }
}

function send_result(apply_data){
    $.ajax({
        type : "PATCH",
        url: API_url + "/v1/api/admins/checkin-applications/" + checkinApplicationId +"/first-stage/verification",                                       
        async: false,    
        data:JSON.stringify(apply_data),
        headers:{
            'Content-Type': 'application/json',
            'x-eden-token': localStorage.getItem('token')
        },
        
        success:function(data){                                    
            alert('審核完成');
            send_people();
        }
        ,
        error:function(xhr, thrownError){ 
            
            ajax_error(xhr, thrownError, where);

        }
    })
}

async function send_people(){
    $.ajax({
        type : "POST",
        url: API_url + "/v1/api/notifications/users/checkin-applications/first-stage/verification",                                       
        async: false,    
        data:JSON.stringify({
            "id": checkinApplicationId
        }),
        headers : {
            'Content-Type': 'application/json',
            'x-eden-token': localStorage.getItem('token')
        },                        
        
        success: function(data, textStatus, request){
          alert('已送通知給申請民眾');
          window.open('index.html','_self');
        }
        ,
        error:function(xhr, thrownError){     

            ajax_error(xhr, thrownError, where);
            window.open('index.html','_self');

        }
    });
}