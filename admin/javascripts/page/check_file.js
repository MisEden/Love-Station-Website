var path = window.location.pathname;
var where = path.split("/").pop().split(".")[0];

const checkinApplicationId = getParameterByName('id', "index.html");

var getUserID = "";

window.onload = function() {
    var path = ["首頁", "待審核入住契約文件", "審核入住契約文件"]
    showBreadcrumb(path);

    if (!isError) {
        loadData();
    }


    var hideIdList = ["editDiv"];
    setReadOnly(hideIdList);
}

function loadData() {
    fetch(API_url + '/v1/api/admins/index/checkin-applications/detail?stage=second&currentPage=0', {
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
                fetch_error(response, where);
            }

        }).then((jsonData) => {
            var totalPage = jsonData.totalPage;
            for (var i = 0; i < totalPage; i++) {
                fetch(API_url + '/v1/api/admins/index/checkin-applications/detail?stage=second&currentPage=' + i, {
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
                            fetch_error(response, where);
                        }

                    }).then((jsonData) => {
                        for (var i = 0; i <= jsonData.checkinApplications.length; i++) {

                            if (jsonData.checkinApplications[i] === undefined) { continue; }

                            if (jsonData.checkinApplications[i].id == checkinApplicationId) {

                                document.getElementById("ReferralDate").value = jsonData.checkinApplications[i].referralDate;
                                document.getElementById("ReferralHospital").value = jsonData.checkinApplications[i].referralHospitalChineseName;
                                document.getElementById("ReferralName").value = jsonData.checkinApplications[i].referralEmployeeName;
                                document.getElementById("ReferralTitle").value = jsonData.checkinApplications[i].referralTitleName;
                                document.getElementById("ReferralPhone").value = jsonData.checkinApplications[i].referralEmployeeCellphone;
                                document.getElementById("applyID").value = jsonData.checkinApplications[i].id;
                                getUserID = jsonData.checkinApplications[i].userId;
                                document.getElementById("inputID").value = jsonData.checkinApplications[i].identityCard;
                                document.getElementById("inputName").value = jsonData.checkinApplications[i].userName;

                                if (jsonData.checkinApplications[i].applicantIn == true) {
                                    document.getElementById("inputInOut").value = "是";
                                } else {
                                    document.getElementById("inputInOut").value = "否";
                                }

                                document.getElementById("inputStack1").value = jsonData.checkinApplications[i].houseName;
                                document.getElementById("inputStack2").value = jsonData.checkinApplications[i].roomNumber;
                                document.getElementById("inputDayIn").value = jsonData.checkinApplications[i].startDate;
                                document.getElementById("inputDayOut").value = jsonData.checkinApplications[i].endDate;
                                document.getElementById("inputReason").value = jsonData.checkinApplications[i].applicationReason;

                                $('#image').attr("src", API_url + jsonData.checkinApplications[i].rentImage);
                                $('#image2').attr("src", API_url + jsonData.checkinApplications[i].affidavitImage);
                                $('#link').attr("href", API_url + jsonData.checkinApplications[i].rentImage);
                                $('#link2').attr("href", API_url + jsonData.checkinApplications[i].affidavitImage);

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

function pass() {
    $.ajax({
        type: "PATCH",
        url: API_url + '/v1/api/admins/checkin-applications/' + checkinApplicationId + '/second-stage/verification',
        async: false,
        data: JSON.stringify({
            "secondVerified": true
        }),
        headers: {
            'Content-Type': 'application/json',
            'x-eden-token': localStorage.getItem('token')
        },

        success: function(data) {
            alert('審核完成');
            post();
        },

        error: function(xhr, thrownError) {
            ajax_error(xhr, thrownError, where);
        }
    })
}

function fail() {
    $.ajax({
        type: "PATCH",
        url: API_url + '/v1/api/admins/checkin-applications/' + checkinApplicationId + '/second-stage/verification',
        async: false,
        data: JSON.stringify({
            "secondVerified": false
        }),
        headers: {
            'Content-Type': 'application/json',
            'x-eden-token': localStorage.getItem('token')
        },

        success: function(data) {
            alert('審核未通過');
            post();
        },

        error: function(xhr, thrownError) {
            ajax_error(xhr, thrownError, where);

        }
    })
}

function post() {
    $.ajax({
        type: "POST",
        url: API_url + "/v1/api/notifications/users/checkin-applications/second-stage/verification",
        async: false,
        data: JSON.stringify({
            "id": checkinApplicationId
        }),
        headers: {
            'Content-Type': 'application/json',
            'x-eden-token': localStorage.getItem('token')
        },

        success: function(data, textStatus, request) {
            alert('通知就醫民眾成功');
        },
        error: function(xhr, thrownError) {
            ajax_error(xhr, thrownError, where);
        }
    });

    $.ajax({
        type: "POST",
        url: API_url + "/v1/api/notifications/referral-employees/checkin-applications/second-stage/verification",
        async: false,
        data: JSON.stringify({
            "id": checkinApplicationId
        }),
        headers: {
            'Content-Type': 'application/json',
            'x-eden-token': localStorage.getItem('token')
        },

        success: function(data, textStatus, request) {
            alert('通知轉介單位成功');
            window.location.href = 'index.html';
        },
        error: function(xhr, thrownError) {
            ajax_error(xhr, thrownError, where);
            window.location.href = 'index.html';
        }
    });
}