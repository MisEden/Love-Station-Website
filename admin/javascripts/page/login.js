var redirectPath;
window.onload = function() {

    //URL
    redirectPath = getParameterByName("id");


    // if (localStorage.getItem('token').length > 0 && localStorage.getItem('userRole') === "admin" && localStorage.getItem("userRoleDetail").length > 4) {
    //     if (redirectPath.length > 0) {
    //         window.location.href = redirectPath + '.html';
    //     } else {
    //         window.location.href = 'index.html';
    //     }
    // }
}


function runScript(e) {
    //See notes about 'which' and 'key'
    if (e.keyCode == 13) {
        WebLogIn()
    }
}

var token = '';

function WebLogIn() {
    var account = document.getElementById("inputAccount").value;
    var password = document.getElementById("inputPassword").value;

    if (account == '' || password == '') {
        alert('請輸入完整登入資訊');
    } else {
        var data = {
            "account": account,
            "password": password
        };

        console.log(JSON.stringify(data));

        $.ajax({
            type: "POST",
            url: API_url + "/v1/api/auth",
            async: false,
            data: JSON.stringify(data),
            contentType: "application/json",
            dataType: 'json',

            success: function(data, textStatus, request) {
                token = data["x-eden-token"];
                localStorage.setItem('token', token);
            },
            error: function(xhr, thrownError) {
                var path = window.location.pathname;
                var pageName = path.split("/").pop().split(".")[0];
                ajax_error(xhr, thrownError, pageName);
            }
        });

        $.ajax({
            type: "GET",
            url: API_url + "/v1/api/auth",
            async: false,
            headers: {
                'Content-Type': 'application/json',
                'x-eden-token': localStorage.getItem('token')
            },
            dataType: 'json',

            success: function(data, textStatus, request) {
                userName = data["userName"];
                userRole = data["userRole"];
                userRoleDetail = data["userRoleDetail"];
                localStorage.setItem('userName', userName);
                localStorage.setItem('userRole', userRole);
                localStorage.setItem('userRoleDetail', userRoleDetail);


                if (localStorage.getItem('token').length > 0 && localStorage.getItem('userRole') === "admin") {
                    if (redirectPath.length > 0) {
                        window.location.href = redirectPath + '.html';
                    } else {
                        window.location.href = 'index.html';
                    }
                } else {
                    localStorage.setItem("token", "");
                    localStorage.setItem("userName", "");
                    localStorage.setItem("userRold", "");
                    localStorage.setItem("userRoleDetail", "");
                    alert("請登入管理員帳號");
                }

            },
            error: function(xhr, thrownError) {
                var path = window.location.pathname;
                var pageName = path.split("/").pop().split(".")[0];
                ajax_error(xhr, thrownError, pageName);
            }
        });
    }
}