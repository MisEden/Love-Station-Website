
var path = window.location.pathname;
var where = path.split("/").pop().split(".")[0];

const houseId = getParameterByName('house', "house.html");

window.onload = function() {
    var path = ["首頁", "棧點管理", "現有棧點", "編輯棧點資訊", "棧點影圖管理"]; 
    showBreadcrumb(path);

    if(!isError){
        setHouseName();
        loadData();
    }
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
            var where = 'house';
            fetch_error(response, where);
        }

    }).then((jsonData) => {
        
        if(jsonData.planimetricMap == "系統建置中"){
            document.getElementById("link_planimetricMap").style.display = "none";
            document.getElementById("img_planimetricMap").style.display = "none";
            document.getElementById("img_planimetricMap").style.display = "none";


            document.getElementById("alert_planimetricMap").style.display = "";
            document.getElementById("planimetricMap_upload").style.display = "";
            document.getElementById("planimetricMap_delete").style.display = "none";

        }else{
            document.getElementById("link_planimetricMap").href =API_url + jsonData.planimetricMap;
            document.getElementById("img_planimetricMap").src =  API_url + jsonData.planimetricMap;
            document.getElementById("img_planimetricMap").alt =  API_url + jsonData.planimetricMap;
            document.getElementById("link_planimetricMap").style.display = "";
            document.getElementById("img_planimetricMap").style.display = "";
            document.getElementById("img_planimetricMap").style.display = "";

            document.getElementById("alert_planimetricMap").style.display = "none";
            document.getElementById("planimetricMap_upload").style.display = "none";
            document.getElementById("planimetricMap_delete").style.display = "";
        }
        
        if(jsonData.fullDegreePanorama == "系統建置中"){

            document.getElementById("iframe_fullDegreePanorama").style.display = "none";


            document.getElementById("alert_fullDegreePanorama").style.display = "";
            document.getElementById("fullDegreePanorama_upload").style.display = "";
            document.getElementById("fullDegreePanorama_delete").style.display = "none";
        }
        else{
            $('#iframe_fullDegreePanorama').attr("style", "width:100%; min-height:300px;")
            $('#iframe_fullDegreePanorama').attr("src", "https://cdn.pannellum.org/2.5/pannellum.htm#panorama=" + API_url + jsonData.fullDegreePanorama);
            document.getElementById("iframe_fullDegreePanorama").style.display = "";

            document.getElementById("alert_fullDegreePanorama").style.display = "none";
            document.getElementById("fullDegreePanorama_upload").style.display = "none";
            document.getElementById("fullDegreePanorama_delete").style.display = "";
        }

        // document.getElementById("btn_send_planimetricMap").onClick = "alert(\"OK\");";
        var hideIdList = ["planimetricMap_delete", "planimetricMap_upload", "fullDegreePanorama_delete", "fullDegreePanorama_upload"];
        setReadOnly(hideIdList);

    }).catch((err) => {
        console.log('錯誤:', err);
    })
}

function savePlanimetricMap(){
    const myFile = document.querySelector('#file-uploader1');
    const upload = myFile.files[0];
    
    let formData = new FormData();
    
    formData.append('housePlanimetricMap', upload);
  
    $.ajax({
      url: API_url + '/v1/api/admins/houses/' + houseId + '/planimetric-map',
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

function saveFullDegreePanorama(){
    const myFile = document.querySelector('#file-uploader2');
    const upload = myFile.files[0];
    
    let formData = new FormData();
    
    formData.append('houseFullDegreePanorama', upload);
  
    $.ajax({
      url: API_url + '/v1/api/admins/houses/' + houseId + '/full-degree-panorama',
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
        $("#file-uploader2").val(null);
        // alert('送出成功');
        loadData();
      },
      complete: function () { // Set our complete callback, adding the .hidden class and hiding the spinner.
        $('#file-uploader2').addClass('hidden');
      },
      error:function(xhr, thrownError){
        ajax_error(xhr, thrownError, where);
      }
    })
}

function deletePlanimetricMap(){
    var yes = confirm('刪除後將無法復原照片\n你確定要將此平面圖照片刪除嗎？');

    if (yes) {
        //轉換為ＪＳＯＮ
        var Jsonarr={
        }
        
        fetch(API_url + '/v1/api/admins/houses/' + houseId + '/planimetric-map',{
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

function deleteFullDegreePanorama(){
    var yes = confirm('刪除後將無法復原照片\n你確定要將此環視圖照片刪除嗎？');

    if (yes) {
        //轉換為ＪＳＯＮ
        var Jsonarr={
        }
        
        fetch(API_url + '/v1/api/admins/houses/' + houseId + '/full-degree-panorama',{
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