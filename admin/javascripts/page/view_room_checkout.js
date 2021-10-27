
var path = window.location.pathname;
var where = path.split("/").pop().split(".")[0];

var id = getParameterByName("id");
var checkoutResult;

window.onload = function() {
    var path = ["首頁", "入住管理", "檢視入住/退房紀錄", "退房回報"]; 
    showBreadcrumb(path);

    if(!isError){getRoomState();}
}

function getRoomState(){
    // 取得RoomState相關入住資訊
   fetch( API_url + '/v1/api/admins/feedback/checkout/' + id, {
       method: 'GET',
       headers: new Headers({
           'Content-Type': 'application/json',
           'x-eden-token': localStorage.getItem('token')
       })
   })
   .then(function checkStatus(response) {
       
       if (response.status == 200) {
           return response.json();
       }else if(response.status == 404){
           alert('尚未填寫，請重新查詢');
           window.close();
       }else{
           fetch_error(response, where);
       }

   }).then((jsonData) => {

       if(JSON.stringify(jsonData).length <= 2){
           alert('請確定Form的ID後再試一次');
       }else{
            checkoutResult=jsonData;

           //Load data
           loadfeedback();
       }
   }).catch((err) => {
       console.log('錯誤:', err);
   });
}

function loadfeedback(){

    // 床
    if (checkoutResult.checkoutFeedbackDetails[0].beddingFeedback!=''){
        document.getElementById("bedding_no").checked = true;
        document.getElementById("bedding_reason").value = checkoutResult.checkoutFeedbackDetails[0].beddingFeedback;
    }
    else{
        document.getElementById("bedding_ok").checked = true;
    }
    // 衛浴
    if (checkoutResult.checkoutFeedbackDetails[0].bathroomFeedback!=''){
        document.getElementById("shower_no").checked = true;
        document.getElementById("shower_reason").value = checkoutResult.checkoutFeedbackDetails[0].bathroomFeedback;
    }
    else{
        document.getElementById("shower_ok").checked = true;
    }
    // 冰箱
    if (checkoutResult.checkoutFeedbackDetails[0].refrigeratorFeedback!=''){
        document.getElementById("fri_no").checked = true;
        document.getElementById("fri_reason").value = checkoutResult.checkoutFeedbackDetails[0].refrigeratorFeedback;
    }
    else{
        document.getElementById("fri_ok").checked = true;
    }
    // 私人用品
    if (checkoutResult.checkoutFeedbackDetails[0].privateItemFeedback!=''){
        document.getElementById("personal_stuff_no").checked = true;
        document.getElementById("personal_stuff_reason").value = checkoutResult.checkoutFeedbackDetails[0].privateItemFeedback;
    }
    else{
        document.getElementById("personal_stuff_ok").checked = true;
    }
    // 垃圾
    if (checkoutResult.checkoutFeedbackDetails[0].garbageFeedback!=''){
        document.getElementById("garbage_no").checked = true;
        document.getElementById("garbage_reason").value = checkoutResult.checkoutFeedbackDetails[0].garbageFeedback;
    }
    else{
        document.getElementById("garbage_ok").checked = true;
    }
    // 門窗/電源
    if (checkoutResult.checkoutFeedbackDetails[0].doorsWindowsPowerFeedback!=''){
        document.getElementById("door_no").checked = true;
        document.getElementById("door_reason").value = checkoutResult.checkoutFeedbackDetails[0].doorsWindowsPowerFeedback;
    }
    else{
        document.getElementById("door_ok").checked = true;
    }
    // 保全
    if (checkoutResult.checkoutFeedbackDetails[0].securityNotificationFeedback!=''){
        document.getElementById("security_no").checked = true;
        document.getElementById("security_reason").value = checkoutResult.checkoutFeedbackDetails[0].securityNotificationFeedback;
    }
    else{
        document.getElementById("security_ok").checked = true;
    }
    // 文件
    if (checkoutResult.checkoutFeedbackDetails[0].returnCheckinFileFeedback!=''){
        document.getElementById("return_file_no").checked = true;
        document.getElementById("return_file_reason").value = checkoutResult.checkoutFeedbackDetails[0].returnCheckinFileFeedback;
    }
    else{
        document.getElementById("return_file_ok").checked = true;
    }
    // 鑰匙
    if (checkoutResult.checkoutFeedbackDetails[0].returnKeyFeedback!=''){
        document.getElementById("return_key_no").checked = true;
        document.getElementById("return_key_reason").value = checkoutResult.checkoutFeedbackDetails[0].returnKeyFeedback;
    }
    else{
        document.getElementById("return_key_ok").checked = true;
    }

}