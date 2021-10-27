function setPassword(){
    var password = document.getElementById("inputPassword1").value;
    var confirmPassword = document.getElementById("inputPassword2").value;

    var token = document.getElementById("inputCode").value;

    if(password ==''||token =='')
    {
      show_alert('請輸入完整表單');
    }
    else{
      var data = {
        "password": password,
        "confirmPassword": confirmPassword
      };
    
      $.ajax({
        type : "PUT",
        url: API_url + "/v1/api/passwords/reset/" + token,                                       
        async: false,    
        data:JSON.stringify(data),
        contentType: "application/json;charset=utf-8",                                          
        
        success: function(data){
          show_alert('密碼已更換成功');

          var redirectionPath = "";
          if(data == "user"){
            redirectionPath = "https://liff.line.me/1655081006-n1VWY1d7";
          }else if(data == "referral_employee"){
            redirectionPath = "https://liff.line.me/1655081006-lZV9jvGP";
          }else if(data == "landlord"){

          }else if(data == "volunteer"){

          }else if(data == "firm"){

          }else if(data == "admin"){
            redirectionPath = "https://www.loveeden.tk/admin/login.html";
          }


          setTimeout(function(){ 
            window.location.href = redirectionPath;
          }, 3000);
        }
        ,
        error:function(xhr, thrownError){ 
          var where = 'rePassword';
		      ajax_error(xhr, thrownError, where);
        }
      });
    }
  }
  

  