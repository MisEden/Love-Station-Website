
var path = window.location.pathname;
var where = path.split("/").pop().split(".")[0];

var currentPage = parseInt(getParameterByName('currentPage', where + ".html?currentPage=0"));


window.onload = function() {
    var path = ["首頁", "待辦審核", "待審核入住申請"]; 
    showBreadcrumb(path);

    if(!isError){
        loadData();
    }
}

function loadData(){
    var table = document.getElementById("table").getElementsByTagName('tbody')[0];

    // 取得所有負責的入住申請名單
    fetch(API_url + '/v1/api/admins/index/checkin-applications/detail?stage=first&currentPage=' + currentPage, {
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
                    
                for (var i = 0; i < jsonData.checkinApplications.length; i++) {
                    var row = table.insertRow(0);
                    var cell1 = row.insertCell(0);
                    var cell2 = row.insertCell(1);
                    var cell3 = row.insertCell(2);
                    var cell4 = row.insertCell(3);
                    var cell5 = row.insertCell(4);



                    cell1.innerHTML = "<a href='check_apply.html?id=" + jsonData.checkinApplications[i].id + "'>" + (jsonData.checkinApplications[i].id).substring(0, 16) + "...</a>";
                    cell2.innerHTML = '入住申請';
                    cell3.innerHTML = jsonData.checkinApplications[i].referralDate
                    cell4.innerHTML = jsonData.checkinApplications[i].referralHospitalChineseName;
                    cell5.innerHTML = jsonData.checkinApplications[i].referralEmployeeName + jsonData.checkinApplications[i].referralTitleName;

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
                cell1.innerHTML = "目前無新的待審核紀錄";
                cell1.colSpan = 5;
                cell1.classList.add("text-center");
            }

        }).catch((err) => {
            console.log('錯誤:', err);
        });
}