
var path = window.location.pathname;
var where = path.split("/").pop().split(".")[0];

furnitureNameBeforeEdit = "";

window.onload = function() {
    var path = ["首頁", "棧點管理", "房間家具管理"]; 
    showBreadcrumb(path);

    if(!isError){getFurnitureList();}

    var hideIdList = ["insertDiv", "editDiv"];
    setReadOnly(hideIdList);
}

function getFurnitureList(){
    var x = document.getElementById("select_changeA");
    var y = document.getElementById("select_changeB");
    x.innerHTML = "";
    y.innerHTML = "";

    fetch( API_url + '/v1/api/furniture/private/all', {
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
        var table = document.getElementById("table_privateFurniture").getElementsByTagName('tbody')[0];
        table.innerHTML = "";

        if(jsonData.length > 0){
            for(var i=jsonData.length -1 ; i>=0; i--){
                if(i == jsonData.length -1){
                    countAllFurniture = parseInt(jsonData[i].precedence);
                }
    
                var row = table.insertRow(0);
                var cell_serialNumber = row.insertCell(0);
                var cell_roomNumber = row.insertCell(1);
                var cell_edit_room = row.insertCell(2);
    
                cell_serialNumber.innerHTML = jsonData[i].precedence;
                cell_roomNumber.innerHTML = "<span id=\"text_furnitureName_" + jsonData[i].precedence + "\">" + jsonData[i].name + "</span>";
                cell_roomNumber.innerHTML += "<input id=\"input_furnitureName_" + jsonData[i].precedence + "\" class=\"form-control\" type=\"text\" value=\"" + jsonData[i].name + "\" style=\"display: none;\">";
                
                if(adminAuthority !== "admin_readonly"){
                    cell_edit_room.innerHTML = "<input id=\"btn_edit_" + jsonData[i].precedence + "\" class=\"btn btn-outline-info\" type=\"button\" onClick=\"edit(" + jsonData[i].precedence + ");\" value=\"編輯\">";
                    cell_edit_room.innerHTML += "<input id=\"btn_save_" + jsonData[i].precedence + "\" class=\"btn btn-outline-danger\" type=\"button\" onClick=\"save_edit(" + jsonData[i].precedence + ",'" + jsonData[i].id + "');\" value=\"儲存\" style=\"display: none;\">";
                    cell_edit_room.innerHTML += "<input id=\"btn_delete_" + jsonData[i].precedence + "\" class=\"btn btn-outline-danger\" type=\"button\" onClick=\"confirmDelete('" + jsonData[i].id + "', '" + jsonData[i].name + "');\" value=\"刪除\">";
                }else{
                    cell_edit_room.innerHTML = "<input class=\"btn btn-outline-info\" type=\"button\" value=\"編輯\" disabled>";
                    cell_edit_room.innerHTML += "<input class=\"btn btn-outline-danger\" type=\"button\" value=\"刪除\" disabled>";
                }
            
                //Load List in IndexChange
                var option = document.createElement("option");
                option.text = "(" + jsonData[i].precedence + ") " + jsonData[i].name;
                option.value = jsonData[i].id;
    
                var option_y = document.createElement("option");
                option_y.text = "(" + jsonData[i].precedence + ") " + jsonData[i].name;
                option_y.value = jsonData[i].id;
    
                x.add(option, x[0]);
                y.add(option_y, y[0]);
            }
    
            if(jsonData.length >= 2){
                x.options[0].selected = true;
                y.options[1].selected = true;
            }
        }else{
            var row = table.insertRow(0);
            var cell1 = row.insertCell(0);
            cell1.innerHTML = "目前無房間家具";
            cell1.colSpan = 3;
            cell1.classList.add("text-center");
        }

        changedSelect();
    }).catch((err) => {
        console.log('錯誤:', err);
    })
    
}

function changedSelect(){
    var x = document.getElementById("smallText_furnitureA");
    var y = document.getElementById("smallText_furnitureB");

    x.innerHTML = document.getElementById("select_changeA").options[document.getElementById("select_changeA").selectedIndex].text.split(" ")[1];
    y.innerHTML = document.getElementById("select_changeB").options[document.getElementById("select_changeB").selectedIndex].text.split(" ")[1];
}


function edit(precedence){
    document.getElementById("text_furnitureName_" + precedence).style.display = "none";
    document.getElementById("input_furnitureName_" + precedence).style.display = "";
    furnitureNameBeforeEdit = document.getElementById("input_furnitureName_" + precedence).value;

    for(var i = 1; i <= countAllFurniture; i++){
        var element_edit = document.getElementById("btn_edit_" + i);
        var element_save = document.getElementById("btn_save_" + i);
        var element_delete = document.getElementById("btn_delete_" + i);
        
        if(element_edit !== null && element_save !== null){
            element_edit.style.display = "none";
            element_delete.style.display = "none";

            if(precedence == i){
                element_save.style.display = "";
            }
        }
    }
}

function save_edit(precedence, id){
    document.getElementById("text_furnitureName_" + precedence).style.display = "";
    document.getElementById("input_furnitureName_" + precedence).style.display = "none";

    for(var i = 1; i <= countAllFurniture; i++){
        var element_edit = document.getElementById("btn_edit_" + i);
        var element_save = document.getElementById("btn_save_" + i);
        var element_delete = document.getElementById("btn_delete_" + i);
        
        if(element_edit !== null && element_save !== null){
            element_edit.style.display = "";
            element_save.style.display = "none";
            element_delete.style.display = "";
        }
    }

    if(furnitureNameBeforeEdit != document.getElementById("input_furnitureName_" + precedence).value){
        //轉換為ＪＳＯＮ
        var Jsonarr={
            'furnitureId': id,
            'furnitureName_new': document.getElementById("input_furnitureName_" + precedence).value
        }


        fetch(API_url + '/v1/api/admins/furniture/private/rename',{
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
            // alert('成功變更');
            getFurnitureList();
        });
    }else{
        // 沒改變
        return;
    }
}

function insert(){
    var input = document.getElementById("furnitureName");

    //轉換為ＪＳＯＮ
    var Jsonarr={
        'furnitureName': input.value
    }


    fetch(API_url + '/v1/api/admins/furniture/private',{
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
                getFurnitureList();
            }
        } catch (error) {
            
        }
        
    });   
}

function changeSerial(){
    var x = document.getElementById("select_changeA");
    var y = document.getElementById("select_changeB");

    if(x.value == y.value){
        alert("欲交換的「家具Ａ」與「家具Ｂ」不能相同，請再檢查一次");
        return;
    }

    //轉換為ＪＳＯＮ
    var Jsonarr={
        'furnitureId_A': x.value,
        'furnitureId_B': y.value
    }


    fetch(API_url + '/v1/api/admins/furniture/private/exchange',{
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
        getFurnitureList();
    });
}

function confirmDelete(id, name){
    var yes = confirm('刪除家具會連帶移除所有房間內「配置此家具的紀錄」&「針對此家具的入住確認」\n你確定要將「' + name + '」刪除嗎？');

    if (yes) {
        //轉換為ＪＳＯＮ
        var Jsonarr={
        }
        
        fetch(API_url + '/v1/api/admins/furniture/private/' + id,{
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
            getFurnitureList();
        });
    }
}