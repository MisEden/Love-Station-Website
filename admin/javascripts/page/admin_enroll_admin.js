
var path = window.location.pathname;
var where = path.split("/").pop().split(".")[0];

window.onload = function() {
    var path = ["首頁", "帳號管理", "新增管理員帳號"];  
    showBreadcrumb(path);
}

function insertAdmin(){
    var account = document.getElementById("insertAdmin_account").value;
    var name = document.getElementById("insertAdmin_name").value;
    var email = document.getElementById("insertAdmin_email").value;
    var authority = document.getElementById("selectAuthority").value;

    if(account.length == 0){
        alert("別忘記要填寫「帳號名稱」喔～");
        return;
    }else if(name.length == 0){
        alert("別忘記要填寫「管理員姓名」喔～");
        return;
    }else if(email.length == 0){
        alert("別忘記要填寫「管理員信箱」喔～");
        return;
    }

    if(authority === "admin"){
        if (!confirm('「系統管理員」將獲得變更管理員權限的能力\n你確定要指派最高權限嗎？')) {
            return;
        }
    }

    var emailPat=/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/;
    var matchArray=email.match(emailPat);
    if (matchArray==null){
        alert("「管理員信箱」的格式好像不太對喔～再檢查看看吧！");
        return;
    }

    //轉換為ＪＳＯＮ
    var Jsonarr={
        'account': account,
        'name': name,
        'email': email,
        'roleName': authority
    }

    fetch(API_url + '/v1/api/admins/authority/register',{
        method: 'POST', 
        body: JSON.stringify(Jsonarr), 
        headers: new Headers({
            'Content-Type': 'application/json',
            'x-eden-token': localStorage.getItem('token')
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
                alert('已建立帳號，並寄出通知信');
            }
        } catch (error) {
            
        }
        
    });
}