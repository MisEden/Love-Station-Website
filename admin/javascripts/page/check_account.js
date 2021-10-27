
var path = window.location.pathname;
var where = path.split("/").pop().split(".")[0];

window.onload = function() {
    var path = ["首頁", "帳號管理", "審查使用者帳號"];  
    showBreadcrumb(path);

    // load data
    if(!isError){getPeople();}else{ return;}
    if(!isError){getReferral();}else{ return;}
    if(!isError){getLandlord();}else{ return;}
    if(!isError){getVolunteer();}else{ return;}
    if(!isError){getFirmEmployee();}else{ return;}
    
}

// 取得就醫民眾帳號申請單
function getPeople(){
    var table = document.getElementById("tableApply_user").getElementsByTagName('tbody')[0];

    fetch( API_url + '/v1/api/admins/check-account/users?currentPage=0', {
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
            isError = true;
            fetch_error(response, where);
        }

    }).then((jsonData) => {
        var totalPage = jsonData.totalPage;

        if(totalPage > 0){
            for(var i=0; i<totalPage ; i++){
                fetch( API_url + '/v1/api/admins/check-account/users?currentPage=' + i, {
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
                    for(var i=0; i<jsonData.users.length; i++){
                        var row = table.insertRow(0);
                        var cell1 = row.insertCell(0);
                        var cell2 = row.insertCell(1);
                        var cell3 = row.insertCell(2);
                        var cell4 = row.insertCell(3);
                        var cell5 = row.insertCell(4);
            
                        cell1.innerHTML = "就醫民眾";
                        cell2.innerHTML = jsonData.users[i].referralNumber.id;
                        cell3.innerHTML = jsonData.users[i].chineseName;
                        cell4.innerHTML = jsonData.users[i].cellphone;
                        cell5.innerHTML = "<input type='button' value='詳細資訊' class='btn btn-primary' onclick='location.href=\"check_people.html?id=" + jsonData.users[i].id + "\"'>";
                    }
                }).catch((err) => {
                    console.log('錯誤:', err);
                })
            }
        }else{
            var row = table.insertRow(0);
            var cell1 = row.insertCell(0);
            cell1.innerHTML = "目前無新的待審核紀錄";
            cell1.colSpan = 8;
            cell1.classList.add("text-center");
        }

    }).catch((err) => {
        console.log('錯誤:', err);
    })
}

// 取得轉介單位帳號申請單
function getReferral(){
    var table = document.getElementById("tableApply_referralEmployee").getElementsByTagName('tbody')[0];

    // 取得轉介單位帳號申請單
    fetch( API_url + '/v1/api/admins/check-account/referral-employees?currentPage=0', {
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
            isError = true;
            fetch_error(response, where);
        }
        
    }).then((jsonData) => {

        var totalPage = jsonData.totalPage;

        if(totalPage > 0){
            for(var i=0; i<totalPage ; i++){
                fetch( API_url + '/v1/api/admins/check-account/referral-employees?currentPage=' + i, {
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
                    for(var i=0; i<jsonData.referralEmployees.length; i++){
                        var row = table.insertRow(0);
                        var cell1 = row.insertCell(0);
                        var cell2 = row.insertCell(1);
                        var cell3 = row.insertCell(2);
                        var cell4 = row.insertCell(3);
                        var cell5 = row.insertCell(4);
            
                        cell1.innerHTML = "轉介單位";
                        cell2.innerHTML = jsonData.referralEmployees[i].referral.hospitalChineseName;
                        cell3.innerHTML = jsonData.referralEmployees[i].name;
                        cell4.innerHTML = jsonData.referralEmployees[i].referralTitle.name;
                        cell5.innerHTML = "<input type='button' value='詳細資訊' class='btn btn-primary' onclick='location.href=\"check_referral.html?id=" + jsonData.referralEmployees[i].id + "\"'>";
            
                    }
                }).catch((err) => {
                    console.log('錯誤:', err);
                })
            }
        }else{
            var row = table.insertRow(0);
            var cell1 = row.insertCell(0);
            cell1.innerHTML = "目前無新的待審核紀錄";
            cell1.colSpan = 8;
            cell1.classList.add("text-center");
        }

    }).catch((err) => {
        console.log('錯誤:', err);
    })
}

// 取得愛心房東帳號申請單
function getLandlord(){
    var table = document.getElementById("tableApply_landlord").getElementsByTagName('tbody')[0];
    
    fetch( API_url + '/v1/api/admins/check-account/landlords?currentPage=0', {
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
            isError = true;
            fetch_error(response, where);
        }
        
    }).then((jsonData) => {
        var totalPage = jsonData.totalPage;

        if(totalPage > 0){
            for(var i=0; i<totalPage ; i++){
                fetch( API_url + '/v1/api/admins/check-account/landlords?currentPage=' + i, {
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
                    for(var i=0; i<jsonData.landlords.length; i++){
                        var row = table.insertRow(0);
                        var cell1 = row.insertCell(0);
                        var cell2 = row.insertCell(1);
                        var cell3 = row.insertCell(2);
                        var cell4 = row.insertCell(3);
                        cell1.innerHTML = "愛心房東";
                        cell2.innerHTML = jsonData.landlords[i].chineseName;
                        cell3.innerHTML = jsonData.landlords[i].cellphone;
                        cell4.innerHTML = "<input type='button' value='詳細資訊' class='btn btn-primary' onclick='location.href=\"check_landlord.html?id=" + jsonData.landlords[i].id + "\"'>";
            
                    }
                }).catch((err) => {
                    console.log('錯誤:', err);
                })
            }
        }else{
            var row = table.insertRow(0);
            var cell1 = row.insertCell(0);
            cell1.innerHTML = "目前無新的待審核紀錄";
            cell1.colSpan = 8;
            cell1.classList.add("text-center");
        }
        
    }).catch((err) => {
        console.log('錯誤:', err);
    })
}

// 取得愛心志工帳號申請單
function getVolunteer(){
    var table = document.getElementById("tableApply_volunteer").getElementsByTagName('tbody')[0];
    
    fetch( API_url + '/v1/api/admins/check-account/volunteers?currentPage=0', {
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
            isError = true;
            fetch_error(response, where);
        }
        
    }).then((jsonData) => {
        var totalPage = jsonData.totalPage;

        if(totalPage > 0){
            for(var i=0; i<totalPage ; i++){
                fetch( API_url + '/v1/api/admins/check-account/volunteers?currentPage=' + i, {
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
                    console.log(jsonData)
                    for(var i=0; i<jsonData.volunteers.length; i++){
                        var row = table.insertRow(0);
                        var cell1 = row.insertCell(0);
                        var cell2 = row.insertCell(1);
                        var cell3 = row.insertCell(2);
                        var cell4 = row.insertCell(3);
                        cell1.innerHTML = "愛心志工";
                        cell2.innerHTML = jsonData.volunteers[i].chineseName;
                        cell3.innerHTML = jsonData.volunteers[i].cellphone;
                        cell4.innerHTML = "<input type='button' value='詳細資訊' class='btn btn-primary' onclick='location.href=\"check_volunteer.html?id=" + jsonData.volunteers[i].id + "\"'>";
            
                    }
                }).catch((err) => {
                    console.log('錯誤:', err);
                })
            }
        }else{
            var row = table.insertRow(0);
            var cell1 = row.insertCell(0);
            cell1.innerHTML = "目前無新的待審核紀錄";
            cell1.colSpan = 8;
            cell1.classList.add("text-center");
        }
        
    }).catch((err) => {
        console.log('錯誤:', err);
    })
}

// 取得廠商員工帳號申請單
function getFirmEmployee(){
    var table = document.getElementById("tableApply_firmEmployee").getElementsByTagName('tbody')[0];
    
    fetch( API_url + '/v1/api/admins/check-account/firm-employees?currentPage=0', {
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
            isError = true;
            fetch_error(response, where);
        }
        
    }).then((jsonData) => {
        var totalPage = jsonData.totalPage;

        if(totalPage > 0){
            for(var i=0; i<totalPage ; i++){
                fetch( API_url + '/v1/api/admins/check-account/firm-employees?currentPage=' + i, {
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
                    for(var j=0; j<jsonData.firmEmployees.length; j++){
                        var row = table.insertRow(0);
                        var cell1 = row.insertCell(0);
                        var cell2 = row.insertCell(1);
                        var cell3 = row.insertCell(2);
                        var cell4 = row.insertCell(3);
                        var cell5 = row.insertCell(4);
                        
                        cell1.innerHTML = "廠商員工";
                        cell2.innerHTML = jsonData.firmEmployees[j].firmName;
                        cell3.innerHTML = jsonData.firmEmployees[j].chineseName;
                        cell4.innerHTML = jsonData.firmEmployees[j].cellphone;
                        cell5.innerHTML = "<input type='button' value='詳細資訊' class='btn btn-primary' onclick='location.href=\"check_firm.html?id=" + jsonData.firmEmployees[j].id + "\"'>";
            
                    }
                }).catch((err) => {
                    console.log('錯誤:', err);
                })
            }
        }else{
            var row = table.insertRow(0);
            var cell1 = row.insertCell(0);
            cell1.innerHTML = "目前無新的待審核紀錄";
            cell1.colSpan = 8;
            cell1.classList.add("text-center");
        }
        
    }).catch((err) => {
        console.log('錯誤:', err);
    })
}

// if(totalPage > 0){
    
// }else{
//     var row = table.insertRow(0);
//     var cell1 = row.insertCell(0);
//     cell1.innerHTML = "目前無新的待審核紀錄";
//     cell1.colSpan = 8;
//     cell1.classList.add("text-center");
// }