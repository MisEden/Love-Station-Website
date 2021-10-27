
var path = window.location.pathname;
var where = path.split("/").pop().split(".")[0];

var userId = getParameterByName("id", "check_account_admin.html");

window.onload = function() {
    var path = ["首頁", "系統管理", "管理員帳號申請"]; 
    showBreadcrumb(path);

    if(!isError){loadAdminData();}
}

function loadAdminData(){
    fetch( API_url + '/v1/api/admins/authority/register/'+ userId, {
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
            isError = true;
            fetch_error(response, where);
        }
        
    }).then((jsonData) => {
        
        document.getElementById("admin_account").value = jsonData.account;
        document.getElementById("admin_name").value = jsonData.name;
        document.getElementById("admin_email").value = jsonData.email;
        
        
    }).catch((err) => {
        console.log('錯誤:', err);
    })
}

function finish(){
    var option_pass = document.getElementById("customRadio").checked;
    var option_passAndPromotion = document.getElementById("customRadio1").checked;
    var option_fail = document.getElementById("customRadio2").checked;
    var changeTo = document.getElementById("selectAuthority").value;
    var reason = document.getElementById("reason").value;
    

    if(option_pass){
        var Jsonarr={
            "verified" : true,
            "changeTo" : "",
            "reason" : ""
        }
    }else if(option_passAndPromotion){
        var Jsonarr={
            "verified" : true,
            "changeTo" : changeTo,
            "reason" : ""
        }
    }else if(option_fail){
        var Jsonarr={
            "verified" : false,
            "changeTo" : "",
            "reason" : reason
        }
    }else{
        return;
    }


    fetch(API_url + '/v1/api/admins/authority/register/'+ userId,{
        method: 'PUT', 
        body: JSON.stringify(Jsonarr), 
        headers: new Headers({
            'Content-Type': 'application/json',
            'x-eden-token': localStorage.getItem('token')
        })
    })
    .then(res => res.json())
    .catch(error => console.error('Error:', error))
    .then((response) => {

        alert("已送出結果，系統轉跳中");
        window.location = "check_account_admin.html";
        
    });
}