
var path = window.location.pathname;
var where = path.split("/").pop().split(".")[0];

window.onload = function() {
    var path = ["首頁", "帳號管理", "審查管理員帳號"];  
    showBreadcrumb(path);

    // load data
    if(!isError){getAdminApplication();}
    
}

function getAdminApplication(){
    var table = document.getElementById("tableApply_admin").getElementsByTagName('tbody')[0];
    
    fetch( API_url + '/v1/api/admins/authority/register', {
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

        if(jsonData.length > 0){
            for(var i=0; i<jsonData.length; i++){
                var row = table.insertRow(0);
                var cell1 = row.insertCell(0);
                var cell2 = row.insertCell(1);
                var cell3 = row.insertCell(2);
                
                cell1.innerHTML = jsonData[i].name;
                cell2.innerHTML = jsonData[i].email;
                cell3.innerHTML = "<input type='button' value='詳細資訊' class='btn btn-primary' onclick='location.href=\"check_admin.html?id=" + jsonData[i].id + "\"'>";
    
            }
        }else{
            var row = table.insertRow(0);
            var cell1 = row.insertCell(0);
            cell1.innerHTML = "目前無新的待審核紀錄";
            cell1.colSpan = 3;
            cell1.classList.add("text-center");
        }
        
    }).catch((err) => {
        console.log('錯誤:', err);
    })
}
