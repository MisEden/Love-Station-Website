function query(){
    var QueryId = document.getElementById("QueryId").value;
    if(QueryId =='')
    {
        show_alert('請輸入');
    }
    else if($(".help-block").find("ul").length!=0){
        show_alert('格式錯誤');
    }
    else{
        var Querydata = {
            "identityCard": QueryId
        }
        $.ajax({
            type : "POST",
            url: API_url + "/v1/api/referral-employees/me/referral-numbers",                                       
            async: false,    
            data:JSON.stringify(Querydata),
            headers:{
                'Content-Type': 'application/json',
                'x-eden-token': localStorage.getItem('token')
            },
            dataType:'json', 
            
            success:function(returnData){  
                show_alert('此民眾新產生之轉介編號為<br>' + returnData['id']);
            }
            ,
            error:function(xhr, thrownError){ 
                var where = 'query';
                ajax_error(xhr, thrownError, where);
            }
        });
    }
}