
var path = window.location.pathname;
var where = path.split("/").pop().split(".")[0];

var userId = getParameterByName("id", "check_account.html");

window.onload = function() {
    var path = ["首頁", "帳號管理", "審查使用者帳號", "就醫民眾帳號申請"]; 
    showBreadcrumb(path);

    if(!isError){getPeople();}

    var hideIdList = ["editDiv"];
    setReadOnly(hideIdList);
}

function getPeople(){
    fetch( API_url + '/v1/api/admins/check-account/users?currentPage=0', {
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

        for(var i=0; i<totalPage ; i++){
            fetch( API_url + '/v1/api/admins/check-account/users?currentPage=' + i, {
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
                for(var i=0; i<=jsonData.users.length; i++){
                    if(jsonData.users[i].id==userId){
                        document.getElementById("inputChName").value = jsonData.users[i].chineseName;
                        document.getElementById("inputEngName").value = jsonData.users[i].englishName;        
                        document.getElementById("inputEmail").value = jsonData.users[i].email;
                        document.getElementById("inputBirth").value = jsonData.users[i].birthday;
                        document.getElementById("inputId").value = jsonData.users[i].identityCard;    
                        document.getElementById("inputSexual").value = jsonData.users[i].gender;
                        document.getElementById("inputAddress").value = jsonData.users[i].address;    
                        document.getElementById("inputTelephone").value = jsonData.users[i].phone.toString().replaceAll("#", " 分機");
                        document.getElementById("inputPhone").value = jsonData.users[i].cellphone;            
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

function pass(){
    $.ajax({
        type : "PATCH",
        url: API_url + '/v1/api/admins/check-account/users/' + userId,
        async: false,    
        data: JSON.stringify({
            "verified": true
        }),
        headers:{
            'Content-Type': 'application/json',
            'x-eden-token': localStorage.getItem('token')
        },
        
        success:function(data){                                    
            alert('審核通過');
            post();
        }
        ,
        error:function(xhr, thrownError){ 
            ajax_error(xhr, thrownError, where);
        }
    })
}

function fail(){
    $.ajax({
        type : "PATCH",
        url: API_url + '/v1/api/admins/check-account/users/' + userId,
        async: false,    
        data: JSON.stringify({
            "verified": false
        }),
        headers:{
            'Content-Type': 'application/json',
            'x-eden-token': localStorage.getItem('token')
        },
        
        success:function(data){                                    
            alert('審核未通過');
            post();
        }
        ,
        error:function(xhr, thrownError){
            ajax_error(xhr, thrownError, where);
        }
    })
}

function post(){
    $.ajax({
        type : "POST",
        url: API_url + "/v1/api/notifications/users/register-verification",                                       
        async: false,    
        data:JSON.stringify({
            "id" : userId
        }),
        headers : {
            'Content-Type': 'application/json',
            'x-eden-token': localStorage.getItem('token')
        },                        
        
        success: function(data, textStatus, request){
            console.log(data);
            alert('送通知成功');
            window.open('check_account.html','_self');
        }
        ,
        error:function(xhr, thrownError){
            ajax_error(xhr, thrownError, where);
            window.open('check_account.html','_self');
        }
      });
}