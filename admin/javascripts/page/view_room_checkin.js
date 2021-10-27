
var path = window.location.pathname;
var where = path.split("/").pop().split(".")[0];

var id = getParameterByName("id");
var checkinResult;

window.onload = function() {
    var path = ["首頁", "入住管理", "檢視入住/退房紀錄", "入住回報"];
    showBreadcrumb(path);

    if(!isError){getRoomState();}
}

function getRoomState(){
     // 取得RoomState相關入住資訊
    fetch( API_url + '/v1/api/admins/feedback/checkin/' + id, {
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
            checkinResult=jsonData;

            //Load data
            loadCommon();
            

            //Load column of furniture
            loadFurniture();
        }
    }).catch((err) => {
        console.log('錯誤:', err);
    });
}

function loadCommon(){
    //lock
    if(checkinResult.lock == "已完成"){
        document.getElementById("lock_ok").checked = true;
    }else if(checkinResult.lock == "無設備"){
        document.getElementById("div_lock").style.display = "none";
    }else{
        document.getElementById("lock_no").checked = true;
        document.getElementById("lock_reason").value = checkinResult.lock;
    }

    //power
    if(checkinResult.power == "已完成"){
        document.getElementById("power_ok").checked = true;
    }else{
        document.getElementById("power_no").checked = true;
        document.getElementById("power_reason").value = checkinResult.power;
    }

    //convention
    var conventions = checkinResult.convention.split(",");
    if(conventions[0] == "已完成"){
        document.getElementById("convention_paper").checked = true;
    }

    if(conventions[1] == "已完成"){
        document.getElementById("convention_online").checked = true;
    }

    //contract
    if(checkinResult.contract == "已完成"){
        document.getElementById("contract").checked = true;
    }

    //security
    if(checkinResult.security == "已完成"){
        document.getElementById("security_ok").checked = true;
    }else{
        document.getElementById("security_no").checked = true;
        document.getElementById("security_reason").value = checkinResult.security;
    }

    //security
    if(checkinResult.heater == "已完成"){
        document.getElementById("heater_ok").checked = true;
    }else if(checkinResult.heater == "無設備"){
        document.getElementById("div_heater").style.display = "none";
    }
}

function loadFurniture(){  
    

    // 取得所有公共家具
    fetch( API_url + '/v1/api/checkin/room/'+checkinResult.roomId+'/furniture/public', {
       method: 'GET',
       headers: new Headers({
           'Content-Type': 'application/json'
       })
       
    }).then(function checkStatus(response) {

        if (response.status == 200) {
            return response.json();
        }else{
            fetch_error(response, where);
        }

    }).then((jsonData) => {

        publicFurnitureName = jsonData;
        publicFurniture = jsonData;

    
        var select = document.getElementById("public_furniture");
        for (var i = 0; i < publicFurniture.length; i++) {
            var checkedNormal = "";
            var checkedDisable = "";

            if(checkinResult.brokenPublicFurnitures.indexOf(publicFurnitureName[i].publicFurnitureName) == -1){
                checkedNormal = " checked";
            }else{
                checkedDisable = " checked";
            }


            var innerText = "<div ";
            if(i == publicFurniture.length -1){ innerText += "style=\"padding-top: 10px;\""; }else{ innerText += "class=\"div_item\""; }
            innerText += ">";
            innerText += "            <label class=\"col-form-label\">" + publicFurnitureName[i].publicFurnitureName + "</label><br/>";
            innerText += "            <div class=\"col-content\">";
            innerText += "              <input type =\"radio\" id=\"public_normal" + i + "\" name=\"public" + i + "\"" + checkedNormal + " disabled><label for=\"public_normal" + i + "\">正常</label>";
            innerText += "              <input type=\"radio\" id=\"public_disable" + i + "\" name=\"public" + i + "\"" + checkedDisable + " disabled><label for=\"public_disable" + i + "\">異常</label>";
            innerText += "            </div>";
            innerText += "        </div>";
            select.innerHTML += innerText;
        }
    }).catch((err) => {
        console.log('錯誤:', err);
    }); 
    
    // 取得所有私有家具
    fetch( API_url + '/v1/api/checkin/room/'+checkinResult.roomId+'/furniture/private', {
        method: 'GET',
        headers: new Headers({
            'Content-Type': 'application/json'
        })
        
    }).then(function checkStatus(response) {

        if (response.status == 200) {
            return response.json();
        }else{
            fetch_error(response, where);
        }

    }).then((jsonData) => {

        privateFurnitureName = jsonData;
        privateFurniture = privateFurnitureName;

        var select = document.getElementById("private_furniture");
        for (var i = 0; i < privateFurniture.length; i++) {
            var innerText = "<div ";
            var checkedNormal = "";
            var checkedDisable = "";

            if(checkinResult.brokenPrivateFurnitures.indexOf(privateFurnitureName[i].privateFurnitureName) == -1){
                checkedNormal = " checked";
            }else{
                checkedDisable = " checked";
            }

            if(i == privateFurniture.length -1){ innerText += "style=\"padding-top: 10px;\""; }else{ innerText += "class=\"div_item\""; }
            innerText += ">";
            innerText += "            <label class=\"col-form-label\">" + privateFurnitureName[i].privateFurnitureName + "</label><br/>";
            innerText += "            <div class=\"col-content\">";
            innerText += "              <input type =\"radio\" id=\"private_normal" + i + "\" name=\"private" + i + "\"" + checkedNormal + " disabled><label for=\"private_normal" + i + "\">正常</label>";
            innerText += "              <input type=\"radio\" id=\"private_disable" + i + "\" name=\"private" + i + "\"" + checkedDisable + " disabled><label for=\"private_disable" + i + "\">異常</label>";
            innerText += "            </div>";
            innerText += "        </div>";
            select.innerHTML += innerText;
        }
    }).catch((err) => {
        console.log('錯誤:', err);
    }); 
}