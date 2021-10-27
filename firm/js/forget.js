function forget(){
  var email = document.getElementById("inputEmail").value;
  if(email =='')
  {
    show_alert('請輸入電子信箱');
  }
  else{
    var data = {
      "email": email
    };
  
    $.ajax({
      type : "POST",
      url: API_url + "/v1/api/passwords/reset",                                       
      async: false,    
      data:JSON.stringify(data),
      contentType: "application/json;charset=utf-8",                                          
      
      success:function(){ 
        show_alert('已寄出驗證碼，請於信箱內查詢');
      }
      ,
      error:function(xhr, thrownError){ 
        var where = 'forget';
        ajax_error(xhr, thrownError, where);
      }
    });
  }
}
  
  // var form_listen = document.getElementById("form1");
  // form_listen.addEventListener("submit",(e)=>{
  //   e.preventDefault;
  //   forget();
  // });
  