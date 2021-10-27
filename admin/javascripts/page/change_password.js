
var path = window.location.pathname;
var where = path.split("/").pop().split(".")[0];

window.onload = function() {
    var path = ["首頁", "變更密碼"]; 
    showBreadcrumb(path);
}

function changePassword(){
    var oldPassword = document.getElementById("oldPassword").value;
    var password = document.getElementById("password").value;
    var confirmPassword = document.getElementById("confirmPassword").value;

    if(oldPassword.length == 0){
        alert("別忘記要填寫「原密碼」喔～");
        return;
    }else if(password.length == 0){
        alert("別忘記要填寫「新密碼」喔～");
        return;
    }else if(confirmPassword.length == 0){
        alert("別忘記要填寫「確認新密碼」喔～");
        return;
    }else if(password !== confirmPassword){
        alert("兩次新密碼的輸入好像不一樣喔～再檢查看看吧！");
        return;
    }
    

    var passwordPat=/^([a-zA-Z]+\d+|\d+[a-zA-Z]+)[a-zA-Z0-9]*$/;
    var matchArray=password.match(passwordPat);
    if (matchArray==null){
        alert("「新密碼」的需要有6~15字、同時包含英文跟數字～再檢查看看吧！");
        return;
    }

    //轉換為ＪＳＯＮ
    var Jsonarr={
        'oldPassword': oldPassword,
        'password': password,
        'confirmPassword': confirmPassword
    }

    fetch(API_url + '/v1/api/admins/password',{
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

        if(response === undefined){
            alert('變更成功，請重新登入，系統將自動轉跳');
            setTimeout(function(){ 
                logout();
            }, 2000);
            return;
        }

        try {
            if("apiError" in response){
                if(response.apiError.status == "BAD_REQUEST"){
                    alert('新增失敗，因為：' + response.apiError.message);
                }
            }else{
                
            }
        } catch (error) {
            
        }
        
    });
}