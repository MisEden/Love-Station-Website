
var path = window.location.pathname;
var where = path.split("/").pop().split(".")[0];

var currentPage = parseInt(getParameterByName('currentPage', where + ".html?currentPage=0"));


window.onload = function() {
    var path = ["首頁", "待辦審核", "待審核需求變更"]; 
    showBreadcrumb(path);

    if(!isError){
        loadData();
    }
}

function loadData(){
    // 取得變更需求
    var table = document.getElementById("table").getElementsByTagName('tbody')[0];

    // 取得變更申請
    fetch(API_url + '/v1/api/admins/checkin-applications/room-states/change?currentPage=' + currentPage, {
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
            }
        }).then((jsonData) => {
            console.log(jsonData);

            var totalPage = jsonData.totalPage;

            if(totalPage > 0){

                for(var i = 0; i < jsonData.checkinApplicationWithRoomStateChangeDetails.length; i++){
                    var row = table.insertRow(0);

                    var cell_id = row.insertCell(0);
                    var cell_date = row.insertCell(1);
                    var cell_referral = row.insertCell(2);
                    var cell_referralEmployee = row.insertCell(3);
                    
                    cell_id.innerHTML = "<a id='in' target='_blank' href='check_change.html?id=" + jsonData.checkinApplicationWithRoomStateChangeDetails[i].checkinAppId + "'>" + jsonData.checkinApplicationWithRoomStateChangeDetails[i].checkinAppId + "</a>";
                    cell_date.innerHTML = jsonData.checkinApplicationWithRoomStateChangeDetails[i].roomStateChangeDate;
                    cell_referral.innerHTML = jsonData.checkinApplicationWithRoomStateChangeDetails[i].referralName;
                    cell_referralEmployee.innerHTML = jsonData.checkinApplicationWithRoomStateChangeDetails[i].referralEmployeeName;
    
                }
                
                

                // build Pagination
                var totalPage = jsonData.totalPage;
                document.getElementById("pagination").innerHTML = "";

                if(currentPage - 1 >= 0){
                    var $li = $("<li class=\"page-item\"></li>");
                    $("#pagination").append($li.append("<a class=\"page-link\" href=\"review_change.html?currentPage="+ (currentPage - 1) + "\">Previous</a>"));
                }else{
                    var $li_disabled = $("<li class=\"page-item disabled\"></li>");
                    $("#pagination").append($li_disabled.append("<a class=\"page-link\" href=\"review_change.html\">Previous</a>"));
                }

                for(var i=0; i< totalPage; i++){
                    if(i == currentPage){
                        var $li_active = $("<li class=\"page-item active\"></li>");
                        $("#pagination").append($li_active.append("<a class=\"page-link\" href=\"review_change.html?currentPage="+ (i) + "\">"+ (i + 1) + "</a>"));
                    }else{
                        var $li = $("<li class=\"page-item\"></li>");
                        $("#pagination").append($li.append("<a class=\"page-link\" href=\"review_change.html?currentPage="+ (i) + "\">"+ (i + 1) + "</a>"));
                    }
                }

                if(currentPage + 1 < totalPage){
                    var $li = $("<li class=\"page-item\"></li>");
                    $("#pagination").append($li.append("<a class=\"page-link\" href=\"review_change.html?currentPage="+ (currentPage + 1) + "\">Next</a>"));
                }else{
                    var $li_disabled = $("<li class=\"page-item disabled\"></li>");
                    $("#pagination").append($li_disabled.append("<a class=\"page-link\" href=\"review_change.html\">Next</a>"));
                }

            }else{
                var row = table.insertRow(0);
                    var cell1 = row.insertCell(0);
                    cell1.innerHTML = "並無符合該搜尋條件的申請紀錄";
                    cell1.colSpan = 5;
                    cell1.classList.add("text-center");
            }

            

        }).catch((err) => {
            console.log('錯誤:', err);
        });
}