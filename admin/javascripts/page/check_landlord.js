
var path = window.location.pathname;
var where = path.split("/").pop().split(".")[0];

var userId = getParameterByName("id", "check_account.html");

window.onload = function() {
    var path = ["首頁", "帳號管理", "審查使用者帳號", "愛心房東帳號申請"]; 
    showBreadcrumb(path);

    if(!isError){getLandlord();}

    var hideIdList = ["editDiv"];
    setReadOnly(hideIdList);
}

function getLandlord(){
    fetch( API_url + '/v1/api/admins/check-account/landlords?currentPage=0', {
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
            fetch( API_url + '/v1/api/admins/check-account/landlords?currentPage=' + i, {
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
                for(var i=0; i<=jsonData.landlords.length; i++){
                    if(jsonData.landlords[i].id==userId){
                        document.getElementById("inputChName").value = jsonData.landlords[i].chineseName;
                        document.getElementById("inputEngName").value = jsonData.landlords[i].englishName;        
                        document.getElementById("inputEmail").value = jsonData.landlords[i].email;
                        document.getElementById("inputBirth").value = jsonData.landlords[i].birthday;
                        document.getElementById("inputId").value = jsonData.landlords[i].identityCard;    
                        document.getElementById("inputSexual").value = jsonData.landlords[i].gender;
                        document.getElementById("inputAddress").value = jsonData.landlords[i].address;    
                        document.getElementById("inputTelephone").value = jsonData.landlords[i].phone.toString().replaceAll("#", " 分機");
                        document.getElementById("inputPhone").value = jsonData.landlords[i].cellphone;            
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
        url: API_url + '/v1/api/admins/check-account/landlords/' + userId,
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
        url: API_url + '/v1/api/admins/check-account/landlords/' + userId,
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
        url: API_url + "/v1/api/notifications/landlords/register-verification",                                       
        async: false,    
        data:JSON.stringify({
            "id":userId
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