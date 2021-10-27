
var path = window.location.pathname;
var where = path.split("/").pop().split(".")[0];

const houseId = getParameterByName('house', "house.html?page=0");
var houseName = "";
var roomNumber = [];
var statusBeforeEdit = true;
var numberBeforeEdit = 0;

window.onload = function() {
    var path = ["首頁", "棧點管理", "現有棧點", "棧點房間"]; 
    showBreadcrumb(path);

    if(!isError){
        getHouseName();
        loadData();
    }

    var hideIdList = ["editDiv"];
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

function loadData(){
    fetch( API_url + '/v1/api/houses/' + houseId + '/room-numbers/all', {
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
        document.getElementById("houseName_list").innerHTML = houseName;

        
        var table = document.getElementById("table_roomsList").getElementsByTagName('tbody')[0];
        table.innerHTML = "";

        if(jsonData.length > 0){
            for(var i=jsonData.length -1 ; i>=0; i--){
                var row = table.insertRow(0);
                var cell_serialNumber = row.insertCell(0);
                var cell_roomNumber = row.insertCell(1);
                var cell_roomStatus = row.insertCell(2);
                var cell_edit_room = row.insertCell(3);
                var cell_edit_furniture = row.insertCell(4);
    
                cell_serialNumber.innerHTML = (i+1);
    
    
                cell_roomNumber.innerHTML = "<span id=\"show_roomNumber_" + jsonData[i].number + "\">" + jsonData[i].number + "</span>";
                cell_roomNumber.innerHTML += "<input id=\"input_roomNumber_" + jsonData[i].number + "\" class=\"form-control\" type=\"number\" value=\"" + jsonData[i].number + "\" style=\"display: none;\">"
                roomNumber.push(jsonData[i].number);
    
                if(jsonData[i].disable){
                    cell_roomStatus.innerHTML = "<div id=\"status_show_" + jsonData[i].number + "\"><i class=\"fas fa-times-circle\"></i>停用</div>";
                }else{
                    cell_roomStatus.innerHTML = "<div id=\"status_show_" + jsonData[i].number + "\"><i class=\"fas fa-check-circle\"></i>啟用</div>";
                }
                cell_roomStatus.innerHTML += "<div id=\"divEdit_" + jsonData[i].number + "\" class=\"form-check\" style=\"display:none;\")><input class=\"form-check-input\" type=\"checkbox\" " +
                "id=\"checkDisable_" + jsonData[i].number + "\" name=\"checkDisable[]\" value=\"" + jsonData[i].number + "\"" + (!jsonData[i].disable && ( "checked=\"checked\"" )) + ">" +
                 "<label class=\"form-check-label\" for=\"checkDisable_" + jsonData[i].number + "\">啟用</label></div>"
    
                if(adminAuthority !== "admin_readonly"){
                    cell_edit_room.innerHTML = "<input id=\"btn_edit_" + jsonData[i].number + "\" class=\"btn btn-outline-info\" type=\"button\" onClick=\"edit(" + jsonData[i].number + ");\" value=\"編輯\">";
                    cell_edit_room.innerHTML += "<input id=\"btn_save_" + jsonData[i].number + "\" class=\"btn btn-outline-danger\" type=\"button\" onClick=\"save(" + jsonData[i].number + ", '" + jsonData[i].id + "');\" value=\"儲存\" style=\"display: none;\">";

                    cell_edit_furniture.innerHTML = "<a class=\"btn btn-outline-info\" href=\"furniture_private.html?room=" + jsonData[i].id + "\">管理</a>";
                }else{

                    cell_edit_room.innerHTML = "<input id=\"btn_edit_" + jsonData[i].number + "\" class=\"btn btn-outline-info\" type=\"button\" onClick=\"edit(" + jsonData[i].number + ");\" value=\"編輯\" disabled>";

                    cell_edit_furniture.innerHTML = "<a class=\"btn btn-outline-info\" href=\"furniture_private.html?room=" + jsonData[i].id + "\">檢視</a>";
                }
                
                
            }
        }else{
            var row = table.insertRow(0);
            var cell1 = row.insertCell(0);
            cell1.innerHTML = "目前無房間紀錄";
            cell1.colSpan = 5;
            cell1.classList.add("text-center");
        }
        

    }).catch((err) => {
        console.log('錯誤:', err);
    })
}

function edit(number){
    document.getElementById("status_show_" + number).style.display = "none";
    document.getElementById("divEdit_" + number).style.display = "";
    document.getElementById("show_roomNumber_" + number).style.display = "none";
    document.getElementById("input_roomNumber_" + number).style.display = "";
    statusBeforeEdit = document.getElementById("checkDisable_" + number).checked;
    numberBeforeEdit = document.getElementById("input_roomNumber_" + number).value;

    for(var i = 0; i < roomNumber.length; i++){
        var element_edit = document.getElementById("btn_edit_" + roomNumber[i]);
        var element_save = document.getElementById("btn_save_" + roomNumber[i]);
        
        if(element_edit !== null && element_save !== null){
            element_edit.style.display = "none";

            if(number == roomNumber[i]){
                element_save.style.display = "";
            }
        }
    }
}

function save(number, roomId){
    document.getElementById("status_show_" + number).style.display = "";
    document.getElementById("divEdit_" + number).style.display = "none";
    document.getElementById("show_roomNumber_" + number).style.display = "";
    document.getElementById("input_roomNumber_" + number).style.display = "none";

    for(var i = 0; i < roomNumber.length; i++){
        var element_edit = document.getElementById("btn_edit_" + roomNumber[i]);
        var element_save = document.getElementById("btn_save_" + roomNumber[i]);
        
        if(element_edit !== null && element_save !== null){
            element_edit.style.display = "";
            element_save.style.display = "none";
        }
    }

    var changed_number = numberBeforeEdit != document.getElementById("input_roomNumber_" + number).value
    var changed_status = statusBeforeEdit != document.getElementById("checkDisable_" + number).checked;

    if(changed_number || changed_status){
        //轉換為ＪＳＯＮ
        var Jsonarr={
            'roomNumber': document.getElementById("input_roomNumber_" + number).value,
            'roomDisable': !document.getElementById("checkDisable_" + number).checked
        }

        fetch(API_url + '/v1/api/admins/rooms/' + roomId ,{
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

            loadData();
        });
    }else{
        // 沒改變
        return;
    }
}

function insert(){
    var input = document.getElementById("roomNumber");

    //轉換為ＪＳＯＮ
    var Jsonarr={
        'roomNumber': input.value
    }


    fetch(API_url + '/v1/api/admins/houses/' + houseId + '/rooms',{
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
                input.value = "";
                loadData();
            }
        } catch (error) {
            
        }
        
    });  
}