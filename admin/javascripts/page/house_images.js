
var path = window.location.pathname;
var where = path.split("/").pop().split(".")[0];

const houseId = getParameterByName('house', "house.html");

window.onload = function() {
    var path = ["首頁", "棧點管理", "現有棧點", "編輯棧點資訊", "棧點照片管理"]; 
    showBreadcrumb(path);

    if(!isError){
        setHouseName();
        loadData();
    }

    var hideIdList = ["editDiv"];
    setReadOnly(hideIdList);
}

function setHouseName(){
    
    fetch( API_url + '/v1/api/houses/' + houseId + '/name', {
        method: 'GET',
        headers: new Headers({
            'Content-Type': 'application/json'
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
        
        houseName = jsonData.name;

        document.getElementById("houseName").innerHTML = houseName;

    }).catch((err) => {
        console.log('錯誤:', err);
    })
}

function loadData(){
    fetch( API_url + '/v1/api/houses/' + houseId + '/detail', {
        method: 'GET',
        headers: new Headers({
            'Content-Type': 'application/json'
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
        
        document.getElementById("picShow").innerHTML = "";


        

        for(var i = 0; i < jsonData.images.length; i++){

            var $tr1 = $("<tr></tr>");
            var $tr2 = $("<tr></tr>");
            var $td1 = $("<td></td>");
            var $td2 = $("<td></td>");
            var $td3 = $("<td></td>");
            var $td4 = $("<td></td>");
            
            if((i+1) >= jsonData.images.length){
                var $a = $("<a href=\"" + API_url + jsonData.images[i] + "\" target=\"_blank\"></a>").append("<img class=\"w-50\" src=\"" + API_url + jsonData.images[i] + "\">");
                var $button = $("<input type=\"button\" class=\"btn btn-danger col-md-12\" value=\"刪除\" onClick=\"deleteHouseImage('" + jsonData.imagesId[i] + "')\">");
                
                $tr1.append($td1.append($a));
                $tr1.append($td2.append(""));
                $("#picShow").append($tr1);

                if(adminAuthority !== "admin_readonly"){
                    $tr2.append($td3.append($button));
                    $tr2.append($td4.append(""));
                    $("#picShow").append($tr2);
                }
                
            }else{
                var $a1 = $("<a href=\"" + API_url + jsonData.images[i] + "\" target=\"_blank\"></a>").append("<img class=\"w-50\" src=\"" + API_url + jsonData.images[i] + "\">");
                var $button1 = $("<input type=\"button\" class=\"btn btn-danger col-md-12\" value=\"刪除\" onClick=\"deleteHouseImage('" + jsonData.imagesId[i] + "')\">");

                var $a2 = $("<a href=\"" + API_url + jsonData.images[i+1] + "\" target=\"_blank\"></a>").append("<img class=\"w-50\" src=\"" + API_url + jsonData.images[i+1] + "\">");
                var $button2 = $("<input type=\"button\" class=\"btn btn-danger col-md-12\" value=\"刪除\" onClick=\"deleteHouseImage('" + jsonData.imagesId[i+1] + "')\">");
                
                $tr1.append($td1.append($a1));
                $tr1.append($td2.append($a2));
                $("#picShow").append($tr1);

                if(adminAuthority !== "admin_readonly"){
                    $tr2.append($td3.append($button1));
                    $tr2.append($td4.append($button2));
                    $("#picShow").append($tr2);
                }

                i++;
            }
        }


        if(jsonData.images.length > 0){
            document.getElementById("alert_image").style.display = "none";
        }else{
            document.getElementById("alert_image").style.display = "";
        }

    }).catch((err) => {
        console.log('錯誤:', err);
    })
}

function upload(){
    const myFile = document.querySelector('#file-uploader1');
    const upload = myFile.files[0];
    
    let formData = new FormData();
    
    formData.append('houseImage', upload);
  
    $.ajax({
      url: API_url + '/v1/api/admins/houses/' + houseId + '/images',
      type: 'POST',
      headers: {
        'x-eden-token': localStorage.getItem('token'),
      },
      contentType: false, //required
      processData: false, // required
      mimeType: 'multipart/form-data',
      data: formData,
      beforeSend: function () { // Before we send the request, remove the .hidden class from the spinner and default to inline-block.
        $('#loader').removeClass('hidden')
      },
      success: function(data, textStatus, request){
        $("#file-uploader1").val(null);
        // alert('送出成功');
        loadData();
      },
      complete: function () { // Set our complete callback, adding the .hidden class and hiding the spinner.
        $('#file-uploader1').addClass('hidden');
      },
      error:function(xhr, thrownError){
        ajax_error(xhr, thrownError, where);
      }
    })
}

function deleteHouseImage(id){
    var yes = confirm('刪除後將無法復原照片\n你確定要將此照片刪除嗎？');

    if (yes) {
        //轉換為ＪＳＯＮ
        var Jsonarr={
        }
        
        fetch(API_url + '/v1/api/admins/houses/images/' + id,{
            method: 'DELETE', 
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
            loadData();
        });
    }
}