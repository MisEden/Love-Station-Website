
var path = window.location.pathname;
var where = path.split("/").pop().split(".")[0];
var today = new Date();

var currentPage = parseInt(getParameterByName('currentPage', where + ".html?currentPage=0"));

window.onload = function() {
    var path = ["首頁", "入住管理", "待指派志工與廠商"]; 
    showBreadcrumb(path);

    if(!isError){
        loadData();
    }
}

function loadData(){
    // 取得變更需求
    var table = document.getElementById("table").getElementsByTagName('tbody')[0];

    // 取得變更申請
    fetch(API_url + '/v1/api/admins/checkin-applications/volunteer-date/firm-employee-date?yearAndMonth=' + today.getFullYear() + "-" + (today.getMonth() + 1) + '&currentPage=' + currentPage, {
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

            var totalPage = jsonData.totalPage;

            if(totalPage > 0){
                
                for (var i = 0; i < jsonData.checkinApplicationBriefs.length; i++) {
                    
                    var row = table.insertRow(0);
                    var cell_id = row.insertCell(0);
                    var cell_house = row.insertCell(1);
                    var cell_room = row.insertCell(2);
                    var cell_date = row.insertCell(3);
                    var cell_user = row.insertCell(4);
                    var cell_edit = row.insertCell(5);

                    cell_id.innerHTML = (jsonData.checkinApplicationBriefs[i].checkinAppId).substring(0, 16) + "...</a>";
                    cell_house.innerHTML = jsonData.checkinApplicationBriefs[i].house;
                    cell_room.innerHTML = jsonData.checkinApplicationBriefs[i].roomNumber;
                    cell_date.innerHTML = jsonData.checkinApplicationBriefs[i].createdAt
                    cell_user.innerHTML = jsonData.checkinApplicationBriefs[i].chineseName;
                    cell_edit.innerHTML = "<a href=\"assign_service.html?id=" + jsonData.checkinApplicationBriefs[i].checkinAppId + "&back="+where+"\">點我選擇</a>";

                }

                // build Pagination
                var totalPage = jsonData.totalPage;
                document.getElementById("pagination").innerHTML = "";

                if(currentPage - 1 >= 0){
                    var $li = $("<li class=\"page-item\"></li>");
                    $("#pagination").append($li.append("<a class=\"page-link\" href=\"" + where + ".html?currentPage="+ (currentPage - 1) + "\">Previous</a>"));
                }else{
                    var $li_disabled = $("<li class=\"page-item disabled\"></li>");
                    $("#pagination").append($li_disabled.append("<a class=\"page-link\" href=\"" + where + ".html\">Previous</a>"));
                }

                for(var i=0; i< totalPage; i++){
                    if(i == currentPage){
                        var $li_active = $("<li class=\"page-item active\"></li>");
                        $("#pagination").append($li_active.append("<a class=\"page-link\" href=\"" + where + ".html?currentPage="+ (i) + "\">"+ (i + 1) + "</a>"));
                    }else{
                        var $li = $("<li class=\"page-item\"></li>");
                        $("#pagination").append($li.append("<a class=\"page-link\" href=\"" + where + ".html?currentPage="+ (i) + "\">"+ (i + 1) + "</a>"));
                    }
                }

                if(currentPage + 1 < totalPage){
                    var $li = $("<li class=\"page-item\"></li>");
                    $("#pagination").append($li.append("<a class=\"page-link\" href=\"" + where + ".html?currentPage="+ (currentPage + 1) + "\">Next</a>"));
                }else{
                    var $li_disabled = $("<li class=\"page-item disabled\"></li>");
                    $("#pagination").append($li_disabled.append("<a class=\"page-link\" href=\"" + where + ".html\">Next</a>"));
                }

            }else{
                var row = table.insertRow(0);
                    var cell1 = row.insertCell(0);
                    cell1.innerHTML = "並無符合該搜尋條件的申請紀錄";
                    cell1.colSpan = 6;
                    cell1.classList.add("text-center");
            }

            

        }).catch((err) => {
            console.log('錯誤:', err);
        });
}