var getHouse;
var getName;

window.onload = function() {

    // 取得所有愛心棧的名稱
    fetch( API_url + '/v1/api/houses/names', {
        method: 'GET',
        headers: new Headers({
            'Content-Type': 'application/json'
        })
    }).then(function checkStatus(response) {
        if (response.status == 200) {
            return response.json();
        }
        else{
            var where = 'index';
            fetch_error(response, where);
        }
    }).then((jsonData) => {
        getName = jsonData;
        var select = document.getElementById("SelectHouse");
        for (var i = 0; i < getName.length; i++) {
            select.innerHTML += '<option>' + getName[i].name + '</option>';
        }
    }).catch((err) => {
        console.log('錯誤:', err);
    });
}

function query_people(){
    
    if(document.getElementById("people").value==""){
        show_alert('請至少輸入一個字');
    }
    else{
        var people_name = document.getElementById("people").value;
        // 取得使用者資料
        fetch( API_url + '/v1/api/users/chinese-names?filter=' + people_name, {
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
                var where = 'applyList';
                fetch_error(response, where);
            }
        }).then((jsonData) => {
            var select_people = document.getElementById("SelectPeople");
            $("#SelectPeople").empty();
            for (var i = 0; i < jsonData.length; i++) {
                select_people.innerHTML += '<option>' + jsonData[i] + '</option>';
            }
        }).catch((err) => {
            console.log('錯誤:', err);
        });
    }    
}

function query(){
    var date_in = document.getElementById("date_first").value;
    var date_out = document.getElementById("date_end").value;

    

    if( date_in=="" || date_out==""){
        show_alert('請選擇欲搜尋之入住日期');
    }
    else if( date_in > date_out ){
        show_alert('搜尋終止日需在開始日期之後');
    }
    else if(document.getElementById("SelectHouse").value==0){
        show_alert('請選擇棧點');
    }
    else{
        var getHouse = document.getElementById("SelectHouse").value;
        var getPeople = document.getElementById("SelectPeople").value;

        if(document.getElementById("SelectPeople").value=="all"){
            show_table(date_in, date_out, getHouse, 'all');
        }
        else{
            show_table(date_in, date_out, getHouse, getPeople);
        }
    }
}

function show_table(date_in, date_out, getHouse, query){
    console.log(query);
    var table = document.getElementById("table1").getElementsByTagName('tbody')[0];
    
    if(query=="all"){
        var fetch_API = API_url + '/v1/api/checkin-applications/referral-employee/search?houseName=' + getHouse + '&startDate=' + date_in + '&endDate=' + date_out + '&currentPage=';
    }
    else{
        var fetch_API = API_url + '/v1/api/checkin-applications/referral-employee/search?houseName=' + getHouse + '&startDate=' + date_in + '&endDate=' + date_out + '&userChineseName=' + query + '&currentPage=';
    }
    // 取得所有負責的名單
    fetch( fetch_API + '0', {
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
            var where = 'applyList';
            fetch_error(response, where);
        }
    }).then((jsonData) => {

        var rowCount = table.rows.length;
        for (var i = 0; i < rowCount; i++) {
            table.deleteRow(0);
        }
        var totalPage = jsonData.totalPage;
        for(var i=0; i<totalPage ; i++){
            // 取得所有負責的名單
            fetch( fetch_API + i, {
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
                    var where = 'applyList';
                    fetch_error(response, where);
                }
            }).then((jsonData) => {
                for(var i=0; i<jsonData.checkinApplications.length; i++){
                    var row = table.insertRow(0);
                    var cell1 = row.insertCell(0);
                    var cell2 = row.insertCell(1);
                    var cell3 = row.insertCell(2);
                    var cell4 = row.insertCell(3);
                    var cell5 = row.insertCell(4);
                    var cell6 = row.insertCell(5);
                
                    cell1.innerHTML = "<a href='view_apply.html?id="+ jsonData.checkinApplications[i].id + "'>" + (jsonData.checkinApplications[i].id).substring(0,16) + "...</a>";
                    cell2.innerHTML = jsonData.checkinApplications[i].houseName;
                    cell3.innerHTML = jsonData.checkinApplications[i].startDate;
                    cell4.innerHTML = jsonData.checkinApplications[i].endDate;
                    cell5.innerHTML = jsonData.checkinApplications[i].userName;
                
                    if(jsonData.checkinApplications[i].firstVerified==null){
                        cell6.innerHTML = "入住申請單<br>待審核";
                    }
                    else if(jsonData.checkinApplications[i].firstVerified==false){
                        cell6.innerHTML = "入住申請單<br>審核未通過";
                    }
                    else {
                        
                        if(jsonData.checkinApplications[i].rentImage==null){
                            cell6.innerHTML = "入住申請單<br>審核通過";
                        }
                        else if(jsonData.checkinApplications[i].secondVerified==null){
                            cell6.innerHTML = "入住文件<br>待審核";
                        }
                        else if(jsonData.checkinApplications[i].secondVerified==false){
                            cell6.innerHTML = "入住文件<br>審核未通過";
                        }
                        else if(jsonData.checkinApplications[i].secondVerified==true){
                            cell6.innerHTML = "入住文件<br>審核通過";
                        }
                    }
                }
            }).catch((err) => {
                console.log('錯誤:', err);
            });
        }
        
    }).catch((err) => {
        console.log('錯誤:', err);
    });

    document.getElementById("show_apply").style.display = "inline-block";

}