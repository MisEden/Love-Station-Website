function iniLoad_landlordService(){

    // 根據條件取得房東服務紀錄
    fetch( API_url + '/v1/api/admins/service/landlords/record/non-view', {
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
        
        var table = document.getElementById("table_landlordService").getElementsByTagName('tbody')[0];
        table.innerHTML = "";
        landlordId_all = [];

        for(var i = 0; i < jsonData.length; i++){
            landlordId_all.push(jsonData[i].id)

            var row = table.insertRow();

            var cell_landlordService_house = row.insertCell(0);
            var cell_landlordService_room = row.insertCell(1);
            var cell_landlordService_date = row.insertCell(2);
            var cell_landlordService_landlord = row.insertCell(3);
            var cell_landlordService_service = row.insertCell(4);
            var cell_landlordService_remark = row.insertCell(5);
            var cell_landlordService_check_string = row.insertCell(6);
            var cell_landlordService_check_edit = row.insertCell(7);

            cell_landlordService_house.innerHTML = jsonData[i].house;
            cell_landlordService_room.innerHTML = jsonData[i].roomNumber;
            cell_landlordService_date.innerHTML = jsonData[i].createdAt;
            cell_landlordService_landlord.innerHTML = jsonData[i].landlordName;
            cell_landlordService_service.innerHTML = jsonData[i].service;
            cell_landlordService_remark.innerHTML = jsonData[i].remark;

            if(adminAuthority !== "admin_readonly"){
                if(jsonData[i].viewed == "未檢視"){
                    cell_landlordService_check_string.innerHTML = "<i class=\"fas fa-times-circle\"></i>未檢視";
                    cell_landlordService_check_edit.innerHTML = "<input class=\"form-check-input\" type=\"checkbox\" " +
                    "id=\"checkViewed_" + jsonData[i].id + "\" name=\"checkViewed[]\" value=\"" + jsonData[i].id + "\">" +
                    "<label class=\"form-check-label\" for=\"checkViewed_" + jsonData[i].id + "\">已檢視</label></div>";
                }else{
                    cell_landlordService_check_string.innerHTML = "<i class=\"fas fa-check-circle\"></i>" + jsonData[i].viewed.split("，")[0];
                }
            }else{
                if(jsonData[i].viewed == "未檢視"){
                    cell_landlordService_check_string.innerHTML = "<i class=\"fas fa-times-circle\"></i>未檢視";
                    cell_landlordService_check_edit.innerHTML = "<input class=\"form-check-input\" type=\"checkbox\" " +
                    "id=\"checkViewed_" + jsonData[i].id + "\" name=\"checkViewed[]\" value=\"" + jsonData[i].id + "\" disabled>" +
                    "<label class=\"form-check-label\" for=\"checkViewed_" + jsonData[i].id + "\">已檢視</label></div>";
                }else{
                    cell_landlordService_check_string.innerHTML = "<i class=\"fas fa-check-circle\"></i>" + jsonData[i].viewed.split("，")[0];
                }
            }
        }

        if(jsonData.length > 0&& adminAuthority !== "admin_readonly"){
            var row = table.insertRow();

            var cell_landlordService_house = row.insertCell(0);
            var cell_landlordService_room = row.insertCell(1);
            var cell_landlordService_date = row.insertCell(2);
            var cell_landlordService_landlord = row.insertCell(3);
            var cell_landlordService_service = row.insertCell(4);
            var cell_landlordService_remark = row.insertCell(5);
            var cell_landlordService_check_string = row.insertCell(6);
            var cell_landlordService_check_edit = row.insertCell(7);

            cell_landlordService_check_edit.innerHTML = "<input id=\"btn_save_landlordService\" class=\"btn btn-outline-danger\" type=\"button\" onClick=\"save_landlordService();\" value=\"儲存\">";
        }else if(jsonData.length == 0){
            var row = table.insertRow(0);
            var cell1 = row.insertCell(0);
            cell1.innerHTML = "目前無待檢視紀錄";
            cell1.colSpan = 8;
            cell1.classList.add("text-center");
                    
        }

    }).catch((err) => {
        console.log('錯誤:', err);
    });
}


function load_landlordService(houseCity, houseId, roomId, landlordId, startDate, endDate){

    // 根據條件取得房東服務紀錄
    fetch( API_url + '/v1/api/admins/service/landlords/record?houseCity='+houseCity+'&houseId='+houseId+'&roomId='+roomId+'&landlordId='+landlordId+'&startDate='+startDate+'&endDate='+endDate, {
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
        
        var table = document.getElementById("table_landlordService").getElementsByTagName('tbody')[0];
        table.innerHTML = "";
        landlordId_all = [];

        for(var i = 0; i < jsonData.length; i++){
            landlordId_all.push(jsonData[i].id)

            var row = table.insertRow();

            var cell_landlordService_house = row.insertCell(0);
            var cell_landlordService_room = row.insertCell(1);
            var cell_landlordService_date = row.insertCell(2);
            var cell_landlordService_landlord = row.insertCell(3);
            var cell_landlordService_service = row.insertCell(4);
            var cell_landlordService_remark = row.insertCell(5);
            var cell_landlordService_check_string = row.insertCell(6);
            var cell_landlordService_check_edit = row.insertCell(7);

            cell_landlordService_house.innerHTML = jsonData[i].house;
            cell_landlordService_room.innerHTML = jsonData[i].roomNumber;
            cell_landlordService_date.innerHTML = jsonData[i].createdAt;
            cell_landlordService_landlord.innerHTML = jsonData[i].landlordName;
            cell_landlordService_service.innerHTML = jsonData[i].service;
            cell_landlordService_remark.innerHTML = jsonData[i].remark;

            if(adminAuthority !== "admin_readonly"){
                if(jsonData[i].viewed == "未檢視"){
                    cell_landlordService_check_string.innerHTML = "<i class=\"fas fa-times-circle\"></i>未檢視";
                    cell_landlordService_check_edit.innerHTML = "<input class=\"form-check-input\" type=\"checkbox\" " +
                    "id=\"checkViewed_" + jsonData[i].id + "\" name=\"checkViewed[]\" value=\"" + jsonData[i].id + "\">" +
                    "<label class=\"form-check-label\" for=\"checkViewed_" + jsonData[i].id + "\">已檢視</label></div>";
                }else{
                    cell_landlordService_check_string.innerHTML = "<i class=\"fas fa-check-circle\"></i>" + jsonData[i].viewed.split("，")[0];
                }
            }else{
                if(jsonData[i].viewed == "未檢視"){
                    cell_landlordService_check_string.innerHTML = "<i class=\"fas fa-times-circle\"></i>未檢視";
                    cell_landlordService_check_edit.innerHTML = "<input class=\"form-check-input\" type=\"checkbox\" " +
                    "id=\"checkViewed_" + jsonData[i].id + "\" name=\"checkViewed[]\" value=\"" + jsonData[i].id + "\" disabled>" +
                    "<label class=\"form-check-label\" for=\"checkViewed_" + jsonData[i].id + "\">已檢視</label></div>";
                }else{
                    cell_landlordService_check_string.innerHTML = "<i class=\"fas fa-check-circle\"></i>" + jsonData[i].viewed.split("，")[0];
                }
            }
        }

        if(jsonData.length > 0&& adminAuthority !== "admin_readonly"){
            var row = table.insertRow();

            var cell_landlordService_house = row.insertCell(0);
            var cell_landlordService_room = row.insertCell(1);
            var cell_landlordService_date = row.insertCell(2);
            var cell_landlordService_landlord = row.insertCell(3);
            var cell_landlordService_service = row.insertCell(4);
            var cell_landlordService_remark = row.insertCell(5);
            var cell_landlordService_check_string = row.insertCell(6);
            var cell_landlordService_check_edit = row.insertCell(7);

            cell_landlordService_check_edit.innerHTML = "<input id=\"btn_save_landlordService\" class=\"btn btn-outline-danger\" type=\"button\" onClick=\"save_landlordService();\" value=\"儲存\">";
        }else if(jsonData.length == 0){
            var row = table.insertRow(0);
            var cell1 = row.insertCell(0);
            cell1.innerHTML = "並無符合該搜尋條件的服務紀錄";
            cell1.colSpan = 8;
            cell1.classList.add("text-center");
                    
        }

    }).catch((err) => {
        console.log('錯誤:', err);
    });
}


function save_landlordService(){
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

    fetch(API_url + '/v1/api/admins/service/landlords/record/viewed',{
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