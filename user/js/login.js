var get_id;
window.onload = function() {

    var url = location.href;
    if(url.indexOf('?')!=-1)
    {
      var temp = url.split("?");
      var vars = temp[1].split("=");
      get_id = vars[1];
    }
    else{
      get_id = '';
    }
    
}

var token='';
function WebLogIn(){
    var account = document.getElementById("inputAccount").value;
    var password = document.getElementById("inputPassword").value;
    if(account ==''||password=='')
    {
      show_alert('請輸入完整登入資訊');
    }
    else{
      var data = {
        "account": account,
        "password": password
      };
      $.ajax({
        type : "POST",
        url: API_url + "/v1/api/auth",                                       
        async: false,    
        data:JSON.stringify(data),
        contentType: "application/json",                                          
        dataType:'json', 
        
        success: function(data, textStatus, request){
          token = data["x-eden-token"];
          localStorage.setItem('token',token)
          show_alert('網站已登入成功');
          if(get_id=="applyList"){
            window.location.href = 'applyList.html';
          }
          else{
            // console.log(localStorage.getItem('token'))
            window.location.href = 'check_in.html';
          }
        }
        ,
        error:function(xhr, thrownError){ 
          var where = 'login';
		      ajax_error(xhr, thrownError, where);
        }
      });
    }
}

function Enroll(){
    window.open('https://liff.line.me/1655081006-yjAYjdqv','_self')
}
    
