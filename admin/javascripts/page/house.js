
var path = window.location.pathname;
var where = path.split("/").pop().split(".")[0];

const currentPage = parseInt(getParameterByName('page', "house.html?page=0"));
var changed = false;
var houseId = [];
var statusBeforeEdit = true;

window.onload = function() {
    var path = ["首頁", "棧點管理", "現有棧點"]; 
    showBreadcrumb(path);

    if(!isError){loadData();}

    var hideIdList = ["btn-insertHouse"];
    setReadOnly(hideIdList);
}

function loadData(){
    fetch( API_url + '/v1/api/houses?currentPage=' + currentPage, {
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
        // console.log(JSON.stringify(jsonData));
        
        var table = document.getElementById("table_houseList").getElementsByTagName('tbody')[0];
        table.innerHTML = "";

        for(var i=jsonData.houses.length-1; i >= 0; i--){
            var row = table.insertRow(0);
            var cell_serialNumber = row.insertCell(0);
            var cell_houseName = row.insertCell(1);
            var cell_houseAddress = row.insertCell(2);
            var cell_houseStatus = row.insertCell(3);
            var cell_houseStatus_edit = row.insertCell(4);
            var cell_edit_houseInfo = row.insertCell(5);
            var cell_edit_publicFurniture = row.insertCell(6);
            var cell_edit_rooms = row.insertCell(7);

            cell_serialNumber.innerHTML = jsonData.houses[i].serial;
            cell_houseName.innerHTML = jsonData.houses[i].name;
            cell_houseAddress.innerHTML = jsonData.houses[i].address;

            if(jsonData.houses[i].disable){
                cell_houseStatus.innerHTML = "<div id=\"status_show_" + jsonData.houses[i].id + "\"><i class=\"fas fa-times-circle\"></i>停用</div>";
            }else{
                cell_houseStatus.innerHTML = "<div id=\"status_show_" + jsonData.houses[i].id + "\"><i class=\"fas fa-check-circle\"></i>啟用</div>";
            }
            cell_houseStatus.innerHTML += "<div id=\"divEdit_" + jsonData.houses[i].id + "\" class=\"form-check\" style=\"display:none;\")><input class=\"form-check-input\" type=\"checkbox\" " +
            "id=\"checkDisable_" + jsonData.houses[i].id + "\" name=\"checkDisable[]\" value=\"" + jsonData.houses[i].id + "\"" + (!jsonData.houses[i].disable && ( "checked=\"checked\"" )) + ">" +
             "<label class=\"form-check-label\" for=\"checkDisable_" + jsonData.houses[i].id + "\">啟用</label></div>";
            
             houseId.push(jsonData.houses[i].id);

            if(adminAuthority !== "admin_readonly"){
                cell_houseStatus_edit.innerHTML = "<input id=\"btn_edit_" + jsonData.houses[i].id + "\" class=\"btn btn-outline-info\" type=\"button\" onClick=\"edit('" + jsonData.houses[i].id + "');\" value=\"狀態編輯\">";
                cell_houseStatus_edit.innerHTML += "<input id=\"btn_save_" + jsonData.houses[i].id + "\" class=\"btn btn-outline-danger\" type=\"button\" onClick=\"save('" + jsonData.houses[i].id + "');\" value=\"儲存\" style=\"display: none;\">";

                cell_edit_houseInfo.innerHTML = "<a href=\"house_info.html?house=" + jsonData.houses[i].id + "\">編輯</a>";
                cell_edit_publicFurniture.innerHTML = "<a href=\"furniture_public.html?house=" + jsonData.houses[i].id + "\">編輯</a>";
                cell_edit_rooms.innerHTML = "<a href=\"rooms.html?house=" + jsonData.houses[i].id + "\">編輯</a>";
            }else{
                cell_houseStatus_edit.innerHTML = "<input class=\"btn btn-outline-info\" type=\"button\" value=\"狀態編輯\" disabled>";

                cell_edit_houseInfo.innerHTML = "<a href=\"house_info.html?house=" + jsonData.houses[i].id + "\">檢視</a>";
                cell_edit_publicFurniture.innerHTML = "<a href=\"furniture_public.html?house=" + jsonData.houses[i].id + "\">檢視</a>";
                cell_edit_rooms.innerHTML = "<a href=\"rooms.html?house=" + jsonData.houses[i].id + "\">檢視</a>";
            }

            
            
        }


        if(!changed){
            // build Pagination
            var totalPage = jsonData.totalPage;

            if(currentPage - 1 >= 0){
                var $li = $("<li class=\"page-item\"></li>");
                $("#pagination").append($li.append("<a class=\"page-link\" href=\"house.html?page="+ (currentPage - 1) + "\">Previous</a>"));
            }else{
                var $li_disabled = $("<li class=\"page-item disabled\"></li>");
                $("#pagination").append($li_disabled.append("<a class=\"page-link\" href=\"house.html\">Previous</a>"));
            }

            for(var i=0; i< totalPage; i++){
                if(i == currentPage){
                    var $li_active = $("<li class=\"page-item active\"></li>");
                    $("#pagination").append($li_active.append("<a class=\"page-link\" href=\"house.html?page="+ (i) + "\">"+ (i + 1) + "</a>"));
                }else{
                    var $li = $("<li class=\"page-item\"></li>");
                    $("#pagination").append($li.append("<a class=\"page-link\" href=\"house.html?page="+ (i) + "\">"+ (i + 1) + "</a>"));
                }
            }

            if(currentPage + 1 < totalPage){
                var $li = $("<li class=\"page-item\"></li>");
                $("#pagination").append($li.append("<a class=\"page-link\" href=\"house.html?page="+ (currentPage + 1) + "\">Next</a>"));
            }else{
                var $li_disabled = $("<li class=\"page-item disabled\"></li>");
                $("#pagination").append($li_disabled.append("<a class=\"page-link\" href=\"house.html\">Next</a>"));
            }
        }
        
        
    }).catch((err) => {
        console.log('錯誤:', err);
    })
}

function edit(id){
    document.getElementById("status_show_" + id).style.display = "none";
    document.getElementById("divEdit_" + id).style.display = "";
    statusBeforeEdit = document.getElementById("checkDisable_" + id).checked;

    for(var i = 0; i < houseId.length; i++){
        var element_edit = document.getElementById("btn_edit_" + houseId[i]);
        var element_save = document.getElementById("btn_save_" + houseId[i]);
        
        if(element_edit !== null && element_save !== null){
            element_edit.style.display = "none";

            if(id == houseId[i]){
                element_save.style.display = "";
            }
        }
    }
}

function save(id){
    document.getElementById("status_show_" + id).style.display = "";
    document.getElementById("divEdit_" + id).style.display = "none";

    for(var i = 0; i < houseId.length; i++){
        var element_edit = document.getElementById("btn_edit_" + houseId[i]);
        var element_save = document.getElementById("btn_save_" + houseId[i]);
        
        if(element_edit !== null && element_save !== null){
            element_edit.style.display = "";
            element_save.style.display = "none";
        }
    }

    var changed_status = statusBeforeEdit != document.getElementById("checkDisable_" + id).checked;

    if(changed_status){
        //轉換為ＪＳＯＮ
        var Jsonarr={
        }

        fetch(API_url + '/v1/api/admins/houses/' + id + '/disable',{
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

            changed = true;
            loadData();
        });
    }else{
        // 沒改變
        return;
    }
}
