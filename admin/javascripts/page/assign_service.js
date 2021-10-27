
var path = window.location.pathname;
var where = path.split("/").pop().split(".")[0];

var id;
var back = getParameterByName('back');

window.onload = function() {
    var path = ["首頁", "入住管理", "待指派志工與廠商", "指派志工與廠商"]; 
    showBreadcrumb(path);

    if(back.length == 0){
        back = "review_unassigned";
    }
    id = getParameterByName('id', back + ".html");
    

    if(!isError){
        loadData_Volunteer();
        loadData_FirmEmployee();
    }

    if(!isError){
        loadData_CheckinApplication();
    }

    var hideIdList = ["editDiv"];
    setReadOnly(hideIdList);
}

function loadData_CheckinApplication(){
    // 載入申請單
    fetch(API_url + '/v1/api/admins/checkin-applications/' + id, {
        method: 'GET',
        headers: new Headers({
            'Content-Type': 'application/json',
            'x-eden-token': localStorage.getItem('token')
        })
    })
        .then(function checkStatus(response) {
            if (response.status == 200) {
                return response.json();
            } else {
                fetch_error(response, where);
                isError = true;
            }
        }).then((jsonData) => {
            document.getElementById("inputHouseName").value = jsonData.houseName;
            document.getElementById("inputRoomNumber").value = jsonData.roomNumber;
            document.getElementById("inputStartDate").value = jsonData.startDate;
            document.getElementById("inputEndDate").value = jsonData.endDate;


            document.getElementById("inputChName").value = jsonData.userName;
            document.getElementById("inputCellphone").value = jsonData.cellphone;
            document.getElementById("inputReferralName").value = jsonData.referralEmployeeName;

            if(jsonData.volunteerId != null){
                document.getElementById('SelectVolunteers').value = jsonData.volunteerId;
            }


            if(jsonData.firmEmployeeId != null){
                document.getElementById('SelectFirms').value = jsonData.firmEmployeeId;
            }

        }).catch((err) => {
            console.log('錯誤:', err);
        });
}

function loadData_Volunteer(){
    // 載入申請單
    fetch(API_url + '/v1/api/admins/role/volunteers/names/all', {
        method: 'GET',
        headers: new Headers({
            'Content-Type': 'application/json',
            'x-eden-token': localStorage.getItem('token')
        })
    })
        .then(function checkStatus(response) {
            if (response.status == 200) {
                return response.json();
            } else {
                fetch_error(response, where);
                isError = true;
            }
        }).then((jsonData) => {
            
            for (var i = 0; i < jsonData.length; i++) {
                document.getElementById('SelectVolunteers').innerHTML += '<option value = ' + jsonData[i].id + '>' + jsonData[i].name + '</option>';
            }

        }).catch((err) => {
            console.log('錯誤:', err);
        });
}

function loadData_FirmEmployee(){
    // 載入申請單
    fetch(API_url + '/v1/api/admins/role/firm-employees/names/all', {
        method: 'GET',
        headers: new Headers({
            'Content-Type': 'application/json',
            'x-eden-token': localStorage.getItem('token')
        })
    })
        .then(function checkStatus(response) {
            if (response.status == 200) {
                return response.json();
            } else {
                fetch_error(response, where);
                isError = true;
            }
        }).then((jsonData) => {
            for (var i = 0; i < jsonData.length; i++) {
                document.getElementById('SelectFirms').innerHTML += '<option value = ' + jsonData[i].firmEmployeeId + '>' + jsonData[i].firmName + " - " + jsonData[i].firmEmployeeName + '</option>';
            }

        }).catch((err) => {
            console.log('錯誤:', err);
        });
}

function assign() {
    var volunteer = document.getElementById('SelectVolunteers').value;
    var firmsEmployee = document.getElementById('SelectFirms').value;
    
    //PATCH指派資訊
    var assign_people = {
        'checkinAppId': id,
        'volunteerId': volunteer,
        'firmEmployeeId': firmsEmployee
    };


    fetch(API_url + '/v1/api/admins/checkin-applications/assign/volunteer/firm-employee', {
        method: 'PATCH',
        body: JSON.stringify(assign_people),
        headers: new Headers({
            'Content-Type': 'application/json',
            'x-eden-token': localStorage.getItem('token')
        })
    }).then(function (response) {
        return response.text();
    }).then(function (text) {
        
        alert('成功送出指派');

        setTimeout(function () {
            window.location.href = back + '.html';
        }, 1500);

    }).catch(function (error) {
        console.log(error);
    });
}