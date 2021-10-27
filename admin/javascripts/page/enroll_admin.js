
var path = window.location.pathname;
var where = path.split("/").pop().split(".")[0];

window.onload = function() {
    
}


function back(){
    window.location = "login.html";
}

function insertAdmin(){
    var account = document.getElementById("insertAdmin_account").value;
    var password = document.getElementById("insertAdmin_password").value;
    var password_confirm = document.getElementById("insertAdmin_password_confirm").value;
    var name = document.getElementById("insertAdmin_name").value;
    var email = document.getElementById("insertAdmin_email").value;

    if(account.length == 0){
        alert("別忘記要填寫「帳號名稱」喔～");
        return;
    }else if(password.length == 0){
        alert("別忘記要填寫「帳戶密碼」喔～");
        return;
    }else if(password_confirm.length == 0){
        alert("別忘記要填寫「密碼確認」喔～");
        return;
    }else if(name.length == 0){
        alert("別忘記要填寫「管理員姓名」喔～");
        return;
    }else if(email.length == 0){
        alert("別忘記要填寫「管理員信箱」喔～");
        return;
    }

    if(password_confirm != password){
        alert("「帳戶密碼」與「密碼確認」好像不太一樣喔～在檢查看看吧！");
        return;
    }

    var emailPat=/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/;
    var matchArray=email.match(emailPat);
    if (matchArray==null){
        alert("「管理員信箱」的格式好像不太對喔～在檢查看看吧！");
        return;
    }

    //轉換為ＪＳＯＮ
    var Jsonarr={
        'account': account,
        'password': password,
        'name': name,
        'email': email
    }

    fetch(API_url + '/v1/api/admins',{
        method: 'POST', 
        body: JSON.stringify(Jsonarr), 
        headers: new Headers({
            'Content-Type': 'application/json'
        })
    })
    .then(res => res.json())
    .catch(error => console.error('Error:', error))
    .then((response) => {
        console.log('Success:', response);

        try {
            if("apiError" in response){
                if(response.apiError.status == "BAD_REQUEST"){
                    alert('新增失敗，因為：' + response.apiError.message);
                }
            }else{
                alert('已成功完成申請，請等待Email通知');
                setTimeout(function(){ 
                    window.location.href = "login.html";
                }, 3000);
            }
        } catch (error) {
            
        }
        
    });
}