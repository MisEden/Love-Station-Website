
var path = window.location.pathname;
var where = path.split("/").pop().split(".")[0];

var userId = getParameterByName("id", "check_account.html");

window.onload = function () {
    var path = ["首頁", "帳號管理", "審查使用者帳號", "轉介單位帳號申請"];
    showBreadcrumb(path);

    if (!isError) { getReferral(); }

    var hideIdList = ["editDiv"];
    setReadOnly(hideIdList);
}

function getReferral() {
    // 取得轉介單位帳號申請單
    fetch(API_url + '/v1/api/admins/check-account/referral-employees?currentPage=0', {
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

            var totalPage = jsonData.totalPage;
            for (var i = 0; i < totalPage; i++) {

                fetch(API_url + '/v1/api/admins/check-account/referral-employees?currentPage=' + i, {
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
                        for (var i = 0; i <= jsonData.referralEmployees.length; i++) {
                            if (jsonData.referralEmployees[i].id == userId) {
                                document.getElementById("applyName").value = jsonData.referralEmployees[i].name;
                                document.getElementById("ReferralName").value = jsonData.referralEmployees[i].referral.hospitalChineseName;
                                document.getElementById("ReferralType").value = jsonData.referralEmployees[i].referralTitle.name;
                                document.getElementById("ReferralIdentity").value = jsonData.referralEmployees[i].workIdentity;
                                img.src = 'https://ehomeline.eden.org.tw' + jsonData.referralEmployees[i].image;
                                document.getElementById("inputEmail").value = jsonData.referralEmployees[i].email;
                                document.getElementById("inputAddress").value = jsonData.referralEmployees[i].address;
                                document.getElementById("inputTelephone").value = jsonData.referralEmployees[i].phone.toString().replaceAll("#", " 分機");
                                document.getElementById("inputPhone").value = jsonData.referralEmployees[i].cellphone;
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
        url: API_url + '/v1/api/admins/check-account/referral-employees/' + userId,
        async: false,
        data: JSON.stringify({
            "verified": true
        }),
        headers: {
            'Content-Type': 'application/json',
            'x-eden-token': localStorage.getItem('token')
        },

        success: function (data) {
            alert('審核通過');
            post();
        }
        ,
        error: function (xhr, thrownError) {
            ajax_error(xhr, thrownError, where);
        }
    })
}
function fail() {
    $.ajax({
        type: "PATCH",
        url: API_url + '/v1/api/admins/check-account/referral-employees/' + userId,
        async: false,
        data: JSON.stringify({
            "verified": false
        }),
        headers: {
            'Content-Type': 'application/json',
            'x-eden-token': localStorage.getItem('token')
        },

        success: function (data) {
            alert('審核未通過');
            post();
        }
        ,
        error: function (xhr, thrownError) {
            ajax_error(xhr, thrownError, where);
        }
    })
}

function post() {
    $.ajax({
        type: "POST",
        url: API_url + "/v1/api/notifications/referral-employees/register-verification",
        async: false,
        data: JSON.stringify({
            "id": userId
        }),
        headers: {
            'Content-Type': 'application/json',
            'x-eden-token': localStorage.getItem('token')
        },
        // dataType:'json', 

        success: function (data, textStatus, request) {
            alert('送通知成功');
            window.open('check_account.html', '_self');
        }
        ,
        error: function (xhr, thrownError) {
            ajax_error(xhr, thrownError, where);
            window.open('check_account.html', '_self');
        }
    });
}