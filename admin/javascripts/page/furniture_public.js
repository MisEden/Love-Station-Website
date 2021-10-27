
var path = window.location.pathname;
var where = path.split("/").pop().split(".")[0];

const houseId = getParameterByName('house');
var houseName = "";
var existFurniture;
var countAllFurniture = 0;
var beforeSave = true;

window.onload = function() {
    var path = ["首頁", "棧點管理", "現有棧點", "棧點公共家具"]; 
    showBreadcrumb(path);

    if(!isError){
        getHouseName();
        getExistFurnitrue();
    }

    var hideIdList = ["btn_insertFurniture"];
    setReadOnly(hideIdList);
}

function getHouseName(){
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

    }).catch((err) => {
        console.log('錯誤:', err);
    })
}

function getExistFurnitrue(){
    fetch( API_url + '/v1/api/houses/' + houseId + '/public-furniture', {
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
        
        existFurniture = jsonData;
        loadData();

    }).catch((err) => {
        console.log('錯誤:', err);
    })
}

function loadData(){
    fetch( API_url + '/v1/api/furniture/public/all', {
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

        document.getElementById("housePublicFurniture_list").innerHTML = houseName;

        
        var table = document.getElementById("table_publicFurniture").getElementsByTagName('tbody')[0];
        

        if(jsonData.length > 0){
            for(var i=jsonData.length -1 ; i>=0; i--){
                if(i == jsonData.length -1){
                    countAllFurniture = parseInt(jsonData[i].precedence);
                }
    
                var row = table.insertRow(0);
                var cell_serialNumber = row.insertCell(0);
                var cell_existFurniture = row.insertCell(1);
                var cell_roomNumber = row.insertCell(2);
                var cell_edit_room = row.insertCell(3);
    
                var isExist = isExistFurniture(jsonData[i].name);
    
                cell_serialNumber.innerHTML = jsonData[i].precedence;
                cell_existFurniture.innerHTML = "<div id=\"divEdit_" + jsonData[i].precedence + "\" class=\"form-check\"" + (!isExist && ( "style=\"display:none;\"" )) + "><input class=\"form-check-input\" type=\"checkbox\" " +
                    "id=\"checkExist_" + jsonData[i].precedence + "\" name=\"checkExist[]\" value=\"" + jsonData[i].name + "\" disabled " + (isExist && ( "checked=\"checked\"" )) + ">" +
                     "<label class=\"form-check-label\" for=\"checkExist_" + jsonData[i].precedence + "\">有配置</label></div>";
                cell_roomNumber.innerHTML = jsonData[i].name;

                if(adminAuthority !== "admin_readonly"){
                    cell_edit_room.innerHTML = "<input id=\"btn_edit_" + jsonData[i].precedence + "\" class=\"btn btn-outline-info\" type=\"button\" onClick=\"edit(" + jsonData[i].precedence + ");\" value=\"編輯\">";
                    cell_edit_room.innerHTML += "<input id=\"btn_save_" + jsonData[i].precedence + "\" class=\"btn btn-outline-danger\" type=\"button\" onClick=\"save(" + jsonData[i].precedence + ");\" value=\"儲存\" style=\"display: none;\">";
                }else{

                    cell_edit_room.innerHTML = "<input class=\"btn btn-outline-info\" type=\"button\" value=\"編輯\" disabled>";
                }
            }
        }else{
            var row = table.insertRow(0);
            var cell1 = row.insertCell(0);
            cell1.innerHTML = "目前無公共家具";
            cell1.colSpan = 4;
            cell1.classList.add("text-center");
        }
        

    }).catch((err) => {
        console.log('錯誤:', err);
    })
}

function isExistFurniture(furnitureName){
    for(var i = 0; i < existFurniture.length; i++){
        if(existFurniture[i].publicFurnitureName === furnitureName){
            return true
        }
    }

    return false;
}

function edit(precedence){
    document.getElementById("checkExist_" + precedence).disabled = false;
    document.getElementById("divEdit_" + precedence).style.display = "";
    beforeSave = document.getElementById("checkExist_" + precedence).checked;

    for(var i = 1; i <= countAllFurniture; i++){
        var element_edit = document.getElementById("btn_edit_" + i);
        var element_save = document.getElementById("btn_save_" + i);
        
        if(element_edit !== null && element_save !== null){
            element_edit.style.display = "none";

            if(precedence == i){
                element_save.style.display = "";
            }
        }
    }
}

function save(precedence){
    document.getElementById("checkExist_" + precedence).disabled = true;
    if(!document.getElementById("checkExist_" + precedence).checked){
        document.getElementById("divEdit_" + precedence).style.display = "none";
    }

    for(var i = 1; i <= countAllFurniture; i++){
        var element_edit = document.getElementById("btn_edit_" + i);
        var element_save = document.getElementById("btn_save_" + i);
        
        if(element_edit !== null && element_save !== null){
            element_edit.style.display = "";
            element_save.style.display = "none";
        }
    }

    if(beforeSave != document.getElementById("checkExist_" + precedence).checked){
        //轉換為ＪＳＯＮ
        var Jsonarr={
            'houseId': houseId,
            'furnitureName': document.getElementById("checkExist_" + precedence).value
        }

        fetch(API_url + '/v1/api/admins/furniture/public/status',{
            method: 'PUT', 
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

            if("apiError" in response){
                if(response.apiError.status == "BAD_REQUEST"){
                    alert('變更失敗，因為：' + response.apiError.message);
                }
            }else{
                // alert('變更成功');
            }
        });
    }else{
        // 沒改變
        return;
    }
}