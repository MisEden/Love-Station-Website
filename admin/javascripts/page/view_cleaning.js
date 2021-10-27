
var path = window.location.pathname;
var where = path.split("/").pop().split(".")[0];

var housesList = [];

var firmId_all = [];

window.onload = function() {
    var path = ["首頁", "入住管理", "檢視廠商清潔紀錄"];; 
    showBreadcrumb(path);

    if(!isError){
        loadSearchDiv();

        iniLoad_firmService();
        // show result_div
        document.getElementById("resultDiv_firmService").style.display = "";
    }
}

function loadSearchDiv(){
    // 取得所有愛心棧的名稱
    fetch( API_url + '/v1/api/houses/names', {
        method: 'GET',
        headers: new Headers({
            'Content-Type': 'application/json',
            'x-eden-token': localStorage.getItem('token')
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
        var select = document.getElementById("inputSearch_house");

        for (var i = 0; i < jsonData.length; i++) {
            housesList.push(jsonData[i].id + "/" + jsonData[i].name);

            select.innerHTML += "<option value=\"" + jsonData[i].id + "\">" + jsonData[i].name + "</option>";
        }

        // Load Room Number
        changeHouseAndReloadRoom();
    }).catch((err) => {
        console.log('錯誤:', err);
    });


    // 取得所有廠商的名稱
    fetch( API_url + '/v1/api/admins/role/firms/names/all', {
        method: 'GET',
        headers: new Headers({
            'Content-Type': 'application/json',
            'x-eden-token': localStorage.getItem('token')
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
        var select = document.getElementById("inputSearch_firm");

        for (var i = 0; i < jsonData.length; i++) {
            select.innerHTML += "<option value=\"" + jsonData[i].firmId + "\">" + jsonData[i].firmName + "</option>";
        }

        // Load Room Number
        changeHouseAndReloadRoom();
    }).catch((err) => {
        console.log('錯誤:', err);
    });

        
    


    // 設定初始服務區間
    // var today = new Date();
    // var dd = today.getDate();
    // var mm = today.getMonth()+1; 
    // var yyyy = today.getFullYear();
    // if(dd<10){dd='0'+dd;} 
    // if(mm<10){mm='0'+mm;} 
    // document.getElementById("inputSearch_date_start").value = yyyy + "-" + mm + "-" + dd;

    // var endDay = today.addDays(7);
    // var dd = endDay.getDate();
    // var mm = endDay.getMonth()+1; 
    // var yyyy = endDay.getFullYear();
    // if(dd<10){dd='0'+dd;} 
    // if(mm<10){mm='0'+mm;}
    // document.getElementById("inputSearch_date_end").value = yyyy + "-" + mm + "-" + dd;
}

function changeHouseAndReloadRoom(){
    
    // 取得愛心棧的房號
    var index_inputSearch_house = document.getElementById("inputSearch_house").selectedIndex;

    if(index_inputSearch_house > 0){

        var houseId = document.getElementById("inputSearch_house").value;

        fetch( API_url + '/v1/api/houses/' + houseId + '/room-numbers' , {
            method: 'GET',
            headers: new Headers({
                'Content-Type': 'application/json',
                'x-eden-token': localStorage.getItem('token')
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
            
            var select = document.getElementById("inputSearch_room");
            $("#inputSearch_room ").empty();
            select.innerHTML += '<option value=\"\">檢視全部</option>';
            for (var i = 0; i < jsonData.length; i++) {
                select.innerHTML += '<option value=\"'+ jsonData[i].id + '\">'+ jsonData[i].number + '</option>';
            }
        }).catch((err) => {
            console.log('錯誤:', err);
        });
    }
    else{
        var select = document.getElementById("inputSearch_room");
        $("#inputSearch_room ").empty();
        select.innerHTML += '<option value=\"\">檢視全部</option>';
    }
    
}

function query(){
    var searchCondition_houseCity = document.getElementById("inputSearch_area").value;
    var searchCondition_house = document.getElementById("inputSearch_house").value;
    var searchCondition_room = document.getElementById("inputSearch_room").value;
    var searchCondition_firm = document.getElementById("inputSearch_firm").value;
    var searchCondition_date_start = document.getElementById("inputSearch_date_start").value;
    var searchCondition_date_end = document.getElementById("inputSearch_date_end").value;


    load_firmService(searchCondition_houseCity, searchCondition_house, searchCondition_room, searchCondition_firm, searchCondition_date_start, searchCondition_date_end);

    // show result_div
    document.getElementById("resultDiv_firmService").style.display = "";
    
}

function iniLoad_firmService(){

    // 根據條件取得廠商服務紀錄
    fetch( API_url + '/v1/api/admins/service/firms/record/non-view', {
        method: 'GET',
        headers: new Headers({
            'Content-Type': 'application/json',
            'x-eden-token': localStorage.getItem('token')
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
        
        var table = document.getElementById("table_firmService").getElementsByTagName('tbody')[0];
        table.innerHTML = "";
        firmId_all = [];

        for(var i = 0; i < jsonData.length; i++){
            firmId_all.push(jsonData[i].id)

            var row = table.insertRow();

            var cell_firmService_house = row.insertCell(0);
            var cell_firmService_room = row.insertCell(1);
            var cell_firmService_date = row.insertCell(2);
            var cell_firmService_firm = row.insertCell(3);
            var cell_firmService_firmName = row.insertCell(4);
            var cell_firmService_service = row.insertCell(5);
            var cell_firmService_remark = row.insertCell(6);
            var cell_firmService_check_string = row.insertCell(7);
            var cell_firmService_check_edit = row.insertCell(8);

            cell_firmService_house.innerHTML = jsonData[i].house;
            cell_firmService_room.innerHTML = jsonData[i].roomNumber;
            cell_firmService_date.innerHTML = jsonData[i].createdAt;
            cell_firmService_firm.innerHTML = jsonData[i].firmName;
            cell_firmService_firmName.innerHTML = jsonData[i].firmEmployeeName;
            cell_firmService_service.innerHTML = jsonData[i].service;

            if(jsonData[i].beforeImage.length > 0){
                cell_firmService_remark.innerHTML = "<a class=\"mx-2\" href=\"" + API_url + jsonData[i].beforeImage + "\" target=\"_blank\">清潔前</a>";
            }

            if(jsonData[i].afterImage.length > 0){
                cell_firmService_remark.innerHTML += "<a class=\"mx-2\" href=\"" + API_url + jsonData[i].afterImage + "\" target=\"_blank\">清潔後</a>";
            }

            if(adminAuthority !== "admin_readonly"){
                if(jsonData[i].viewed == "未檢視"){
                    cell_firmService_check_string.innerHTML = "<i class=\"fas fa-times-circle\"></i>未檢視";
                    cell_firmService_check_edit.innerHTML = "<input class=\"form-check-input\" type=\"checkbox\" " +
                    "id=\"checkViewed_" + jsonData[i].id + "\" name=\"checkViewed[]\" value=\"" + jsonData[i].id + "\">" +
                    "<label class=\"form-check-label\" for=\"checkViewed_" + jsonData[i].id + "\">已檢視</label></div>";
                }else{
                    cell_firmService_check_string.innerHTML = "<i class=\"fas fa-check-circle\"></i>" + jsonData[i].viewed.split("，")[0];
                }
            }else{
                if(jsonData[i].viewed == "未檢視"){
                    cell_firmService_check_string.innerHTML = "<i class=\"fas fa-times-circle\"></i>未檢視";
                    cell_firmService_check_edit.innerHTML = "<input class=\"form-check-input\" type=\"checkbox\" " +
                    "id=\"checkViewed_" + jsonData[i].id + "\" name=\"checkViewed[]\" value=\"" + jsonData[i].id + "\" disabled>" +
                    "<label class=\"form-check-label\" for=\"checkViewed_" + jsonData[i].id + "\">已檢視</label></div>";
                }else{
                    cell_firmService_check_string.innerHTML = "<i class=\"fas fa-check-circle\"></i>" + jsonData[i].viewed.split("，")[0];
                }
            }
        }

        if(jsonData.length > 0&& adminAuthority !== "admin_readonly"){
            var row = table.insertRow();

            var cell_firmService_house = row.insertCell(0);
            var cell_firmService_room = row.insertCell(1);
            var cell_firmService_date = row.insertCell(2);
            var cell_firmService_firm = row.insertCell(3);
            var cell_firmService_firmName = row.insertCell(4);
            var cell_firmService_service = row.insertCell(5);
            var cell_firmService_remark = row.insertCell(6);
            var cell_firmService_check_string = row.insertCell(7);
            var cell_firmService_check_edit = row.insertCell(8);

            cell_firmService_check_edit.innerHTML = "<input id=\"btn_save_firmService\" class=\"btn btn-outline-danger\" type=\"button\" onClick=\"save_firmService();\" value=\"儲存\">";
        }else if(jsonData.length == 0){
            var row = table.insertRow(0);
            var cell1 = row.insertCell(0);
            cell1.innerHTML = "目前無待檢視紀錄";
            cell1.colSpan = 9;
            cell1.classList.add("text-center");
                    
        }

    }).catch((err) => {
        console.log('錯誤:', err);
    });
}

function load_firmService(houseCity, houseId, roomId, firmId, startDate, endDate){

    // 根據條件取得廠商服務紀錄
    fetch( API_url + '/v1/api/admins/service/firms/record?houseCity='+houseCity+'&houseId='+houseId+'&roomId='+roomId+'&firmId='+firmId+'&startDate='+startDate+'&endDate='+endDate, {
        method: 'GET',
        headers: new Headers({
            'Content-Type': 'application/json',
            'x-eden-token': localStorage.getItem('token')
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
        
        var table = document.getElementById("table_firmService").getElementsByTagName('tbody')[0];
        table.innerHTML = "";
        firmId_all = [];

        for(var i = 0; i < jsonData.length; i++){
            firmId_all.push(jsonData[i].id)

            var row = table.insertRow();

            var cell_firmService_house = row.insertCell(0);
            var cell_firmService_room = row.insertCell(1);
            var cell_firmService_date = row.insertCell(2);
            var cell_firmService_firm = row.insertCell(3);
            var cell_firmService_firmName = row.insertCell(4);
            var cell_firmService_service = row.insertCell(5);
            var cell_firmService_remark = row.insertCell(6);
            var cell_firmService_check_string = row.insertCell(7);
            var cell_firmService_check_edit = row.insertCell(8);

            cell_firmService_house.innerHTML = jsonData[i].house;
            cell_firmService_room.innerHTML = jsonData[i].roomNumber;
            cell_firmService_date.innerHTML = jsonData[i].createdAt;
            cell_firmService_firm.innerHTML = jsonData[i].firmName;
            cell_firmService_firmName.innerHTML = jsonData[i].firmEmployeeName;
            cell_firmService_service.innerHTML = jsonData[i].service;

            if(jsonData[i].beforeImage.length > 0){
                cell_firmService_remark.innerHTML = "<a class=\"mx-2\" href=\"" + API_url + jsonData[i].beforeImage + "\" target=\"_blank\">清潔前</a>";
            }

            if(jsonData[i].afterImage.length > 0){
                cell_firmService_remark.innerHTML += "<a class=\"mx-2\" href=\"" + API_url + jsonData[i].afterImage + "\" target=\"_blank\">清潔後</a>";
            }

            if(adminAuthority !== "admin_readonly"){
                if(jsonData[i].viewed == "未檢視"){
                    cell_firmService_check_string.innerHTML = "<i class=\"fas fa-times-circle\"></i>未檢視";
                    cell_firmService_check_edit.innerHTML = "<input class=\"form-check-input\" type=\"checkbox\" " +
                    "id=\"checkViewed_" + jsonData[i].id + "\" name=\"checkViewed[]\" value=\"" + jsonData[i].id + "\">" +
                    "<label class=\"form-check-label\" for=\"checkViewed_" + jsonData[i].id + "\">已檢視</label></div>";
                }else{
                    cell_firmService_check_string.innerHTML = "<i class=\"fas fa-check-circle\"></i>" + jsonData[i].viewed.split("，")[0];
                }
            }else{
                if(jsonData[i].viewed == "未檢視"){
                    cell_firmService_check_string.innerHTML = "<i class=\"fas fa-times-circle\"></i>未檢視";
                    cell_firmService_check_edit.innerHTML = "<input class=\"form-check-input\" type=\"checkbox\" " +
                    "id=\"checkViewed_" + jsonData[i].id + "\" name=\"checkViewed[]\" value=\"" + jsonData[i].id + "\" disabled>" +
                    "<label class=\"form-check-label\" for=\"checkViewed_" + jsonData[i].id + "\">已檢視</label></div>";
                }else{
                    cell_firmService_check_string.innerHTML = "<i class=\"fas fa-check-circle\"></i>" + jsonData[i].viewed.split("，")[0];
                }
            }
        }

        if(jsonData.length > 0&& adminAuthority !== "admin_readonly"){
            var row = table.insertRow();

            var cell_firmService_house = row.insertCell(0);
            var cell_firmService_room = row.insertCell(1);
            var cell_firmService_date = row.insertCell(2);
            var cell_firmService_firm = row.insertCell(3);
            var cell_firmService_firmName = row.insertCell(4);
            var cell_firmService_service = row.insertCell(5);
            var cell_firmService_remark = row.insertCell(6);
            var cell_firmService_check_string = row.insertCell(7);
            var cell_firmService_check_edit = row.insertCell(8);

            cell_firmService_check_edit.innerHTML = "<input id=\"btn_save_firmService\" class=\"btn btn-outline-danger\" type=\"button\" onClick=\"save_firmService();\" value=\"儲存\">";
        }else if(jsonData.length == 0){
            var row = table.insertRow(0);
            var cell1 = row.insertCell(0);
            cell1.innerHTML = "並無符合該搜尋條件的服務紀錄";
            cell1.colSpan = 9;
            cell1.classList.add("text-center");
                    
        }

    }).catch((err) => {
        console.log('錯誤:', err);
    });
}

function save_firmService(){
    var inputCheck_viewed = document.getElementsByName("checkViewed[]");
    var checkViewed = [];
    
    for(var i = 0; i < inputCheck_viewed.length; i++){
        if(inputCheck_viewed[i].checked){
            checkViewed.push(inputCheck_viewed[i].value);
        }
    }
    
    
    if(checkViewed.length == 0){
        alert("請先勾選「已檢視」的項目");
        return;
    }


    //轉換為ＪＳＯＮ
    var Jsonarr={ 'id': checkViewed }

    fetch(API_url + '/v1/api/admins/service/firms/record/viewed',{
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
                    alert('變更失敗，因為：' + response.apiError.message);
                }
            }else{
                // alert('變更成功');
                
            }
        } catch (error) {
            
        }

        query();
    });
}

function exportExcel(){


    //轉換為ＪＳＯＮ
    var Jsonarr={ 
        'id': firmId_all 
    }  
    

    console.log("[Export ID] ->" + JSON.stringify(Jsonarr));

    fetch(API_url + '/v1/api/admins/service/firms/record/export',{
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
                    alert('下載失敗，因為：' + response.apiError.message);
                }
            }else{
                
                var filePaht = response.downloadUrl;
                var pathPart = filePaht.split("/");

                var a = document.createElement('a');
                var url = API_url + filePaht;
                var filename = pathPart[pathPart.length-1];

                console.log("URL = " + url);
                console.log("Download = " + filename);

                
                a.href = url;
                a.download = filename;
                a.click();
                window.URL.revokeObjectURL(url);

            }
        } catch (error) {
            console.log(error.message);
        }
        
    }); 

}