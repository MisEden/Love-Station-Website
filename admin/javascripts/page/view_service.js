
var path = window.location.pathname;
var where = path.split("/").pop().split(".")[0];

var currentTab = getParameterByName('currentTab', 'view_service.html?currentTab=landlord');
var currentSearchCondition = [];
var exportExcelPath = "";

var housesList = [];

// landlord
var landlordId_all = [];

// volunteer
var volunteerId_all = [];

window.onload = function() {
    var path = ["首頁", "入住管理", "檢視服務回報紀錄"];
    showBreadcrumb(path);

    if(!isError){
        reloadTab();

        loadSearchDiv();
    }
}

function reloadTab(){
    var tabLandlord = document.getElementById("navTab_landlord");
    var tabVolunteer = document.getElementById("navTab_volunteer");

    if(currentTab == "landlord"){

        // change export url
        exportExcelPath = API_url + "/v1/api/admins/service/landlords/record/export";


        //Change Tab Status
        tabLandlord.classList.add("active");
        tabVolunteer.classList.remove("active");


        iniLoad_landlordService();
        // show result_div
        document.getElementById("resultDiv_landlordService").style.display = "";
    }else if(currentTab == "volunteer"){

        // change export url
        exportExcelPath = API_url + "/v1/api/admins/service/volunteers/record/export";

        
        //Change Tab Status
        tabLandlord.classList.remove("active");
        tabVolunteer.classList.add("active");

        iniLoad_volunteerService();
        // show result_div
        document.getElementById("resultDiv_volunteerService").style.display = "";
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
            var where = 'view_room_service';
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


    if(currentTab == "landlord"){
        document.getElementById("inputSearch_landlordOrVolunteer_title").innerHTML = "房東";

        // 取得所有房東的名稱
        fetch( API_url + '/v1/api/admins/role/landlords/names/all', {
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
            var select = document.getElementById("inputSearch_landlordOrVolunteer");

            for (var i = 0; i < jsonData.length; i++) {
                select.innerHTML += "<option value=\"" + jsonData[i].landlordId + "\">" + jsonData[i].landlordName + "</option>";
            }

            // Load Room Number
            changeHouseAndReloadRoom();
        }).catch((err) => {
            console.log('錯誤:', err);
        });
    }else if(currentTab == "volunteer"){
        document.getElementById("inputSearch_landlordOrVolunteer_title").innerHTML = "志工";

        // 取得所有房東的名稱
        fetch( API_url + '/v1/api/admins/role/volunteers/names/all', {
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
            var select = document.getElementById("inputSearch_landlordOrVolunteer");

            for (var i = 0; i < jsonData.length; i++) {
                select.innerHTML += "<option value=\"" + jsonData[i].id + "\">" + jsonData[i].name + "</option>";
            }

            // Load Room Number
            changeHouseAndReloadRoom();
        }).catch((err) => {
            console.log('錯誤:', err);
        });
    }
    


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

function changeTab(newTab){
    window.location.href = "view_service.html?currentTab=" + newTab ;
    // reloadTab();
}

function query(){
    var searchCondition_houseCity = document.getElementById("inputSearch_area").value;
    var searchCondition_house = document.getElementById("inputSearch_house").value;
    var searchCondition_room = document.getElementById("inputSearch_room").value;
    var searchCondition_landlordOrVolunteer = document.getElementById("inputSearch_landlordOrVolunteer").value;
    var searchCondition_date_start = document.getElementById("inputSearch_date_start").value;
    var searchCondition_date_end = document.getElementById("inputSearch_date_end").value;


    if(currentTab == "landlord"){
        load_landlordService(searchCondition_houseCity, searchCondition_house, searchCondition_room, searchCondition_landlordOrVolunteer, searchCondition_date_start, searchCondition_date_end);

        // show result_div
        document.getElementById("resultDiv_landlordService").style.display = "";
    }else if(currentTab == "volunteer"){
        load_volunteerService(searchCondition_houseCity, searchCondition_house, searchCondition_room, searchCondition_landlordOrVolunteer, searchCondition_date_start, searchCondition_date_end);

        // show result_div
        document.getElementById("resultDiv_volunteerService").style.display = "";
    }
    
}

function exportExcel(){


    //轉換為ＪＳＯＮ
    if(currentTab == "landlord"){
        var Jsonarr={ 'id': landlordId_all }
    }else if(currentTab == "volunteer"){
        var Jsonarr={ 'id': volunteerId_all }
    }  
    

    console.log("[Export ID] ->" + JSON.stringify(Jsonarr));

    fetch(exportExcelPath,{
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

Date.prototype.addDays = function(days) {
    this.setDate(this.getDate() + days);
    return this;
}
