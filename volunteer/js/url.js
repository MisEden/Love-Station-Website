//let API_url = 'https://private-anon-ed1fbefb73-edenapi.apiary-mock.com';

// let API_url = 'https://api.loveeden.tk';
// let API_url = 'http://140.118.109.21:8080'
let API_url = 'https://ehomeline.eden.org.tw';

// function clean() {
//     try {
//             localStorage.removeItem('token')
//             localStorage.removeItem('LIFF_STORE:1655081006-n1VWY1d7:context')
//             localStorage.removeItem('LIFF_STORE:1655081006-n1VWY1d7:accessToken')
//             window.location.href = 'login.html?id=login';

//     } catch (e) {
//         console.log(e);
//     }
// }

function show_alert(mes) {
    $('#mymodal-link').modal('toggle');
    document.getElementById("body").innerHTML = mes;
}

function ajax_error(xhr, thrownError, where) {
    var datastr = JSON.parse(xhr.responseText);
    if (xhr.status == 400) {
        if (datastr.hasOwnProperty("apiError")) {
            if (datastr.apiError.hasOwnProperty("subErrors")) {
                var field = datastr.apiError.subErrors[0].field;
                var message = datastr.apiError.subErrors[0].message;
                show_alert('格式錯誤<br>' + field + message);
            }
            else {
                show_alert('格式錯誤<br>' + datastr.apiError.message);
            }
        }
        else {
            show_alert('錯誤代碼<br>' + xhr.status + '<br>' + thrownError);
        }
        console.log(datastr);
    }
    else if (xhr.status == 401) {
        if (where == 'login') {
            show_alert('帳號或密碼錯誤，請重新輸入');
        }
        else {
            show_alert('登入逾時，請重新登入');
        }
        setTimeout(function () {
            window.location.href = 'login.html?id=' + where;
        }, 3000);
    }
    else if (xhr.status == 403) {
        show_alert('您沒有權限');
    }
    else if (xhr.status == 404) {

        if (where == '') {
            show_alert('查無此身分，請重新輸入身分證字號或與轉介單位聯繫');
        }
        else if (where == 'rePassword') {
            show_alert('更換失敗');
        }
        else {
            show_alert('表單送出失敗');
        }
        console.log(datastr);
    }
    else if (xhr.status == 500) {
        show_alert('系統有誤，請稍後再試');
        console.log(datastr);
    }
    else {
        show_alert('送出失敗<br>' + xhr.status + '<br>' + thrownError);
        console.log(datastr);
    }
}

function fetch_error(response, where) {
    if (response.status == 401) {
        var error = new Error(response.statusText);
        error.response = response;
        show_alert('請重新登入');
        setTimeout(function () {
            window.location.href = 'login.html?id=' + where;
        }, 3000);
        throw error;
    }
    else if (response.status == 403) {
        var error = new Error(response.statusText);
        error.response = response;
        show_alert('您沒有權限');
        setTimeout(function () {
            window.location.href = 'login.html';
        }, 3000);
        throw error;
    }
    else if (response.status == 404) {
        var error = new Error(response.statusText);
        error.response = response;
        show_alert('取得失敗');
    }
    else if (response.status == 500) {
        var error = new Error(response.statusText);
        error.response = response;
        show_alert('系統有誤，請稍後再試');
        throw error;
    }
    else {
        var error = new Error(response.statusText);
        error.response = response;
        show_alert('取得失敗<br>' + response.status + '<br>' + error.response);
        throw error;
    }
}
