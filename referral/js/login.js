var get_id;
window.onload = function() {

    //URL
    var url = location.href;
    if (url.search("\\?") <= 0) {
        get_id = '';
    } else {
        //取得問號之後的值
        var temp = url.split("?");
        //將值再度分開
        var vars = temp[1].split("=");
        get_id = vars[1];
    }
}

var token = '';

function WebLogIn() {
    var account = document.getElementById("inputAccount").value;
    var password = document.getElementById("inputPassword").value;
    if (account == '' || password == '') {
        show_alert('請輸入完整登入資訊');
    } else {
        var data = {
            "account": account,
            "password": password
        };

        $.ajax({
            type: "POST",
            url: API_url + "/v1/api/auth",
            async: false,
            data: JSON.stringify(data),
            contentType: "application/json",
            dataType: 'json',

            success: function(data, textStatus, request) {
                token = data["x-eden-token"];
                localStorage.setItem('token', token)
                show_alert('網站已登入成功');
                if (get_id == "query") {
                    window.location.href = 'query_number.html';
                } else if (get_id == "rent") {
                    window.location.href = 'rent.html';
                } else {
                    window.location.href = 'view_applyList.html';
                }
            },
            error: function(xhr, thrownError) {
                var where = 'login';
                ajax_error(xhr, thrownError, where);
            }
        });
    }
}

function Enroll() {
    window.open('https://liff.line.me/1655081006-rRBXdEgA', '_self')
}