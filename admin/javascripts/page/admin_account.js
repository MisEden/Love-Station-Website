
var path = window.location.pathname;
var where = path.split("/").pop().split(".")[0];

var currentPage = parseInt(getParameterByName('currentPage',"admin_account.html?role=&keyword=&currentPage=0"));
var role = getParameterByName('role');
var keyword = getParameterByName('keyword');

var admin_id = [];

window.onload = function() {
    var path = ["首頁", "系統管理", "檢視管理員帳號"]; 
    showBreadcrumb(path);

    if(!isError){
        document.getElementById("selectAuthority").value = role;
        document.getElementById("keyword").value = keyword;

        loadData();
    }
}

function loadData(){
    fetch( API_url + '/v1/api/admins/authority/account/search?role=' + role + '&keyword=' + keyword + '&currentPage=' + currentPage, {
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

        var table = document.getElementById("table_admin").getElementsByTagName('tbody')[0];
        table.innerHTML = "";
        admin_id = [];

        if(jsonData.admins.length > 0){
            for(var i=jsonData.admins.length -1 ; i>=0; i--){
            

                var row = table.insertRow(0);
    
                var cell_admin_authority = row.insertCell(0);
                var cell_admin_name = row.insertCell(1);
                var cell_admin_email = row.insertCell(2);
                var cell_admin_edit = row.insertCell(3);
                

                admin_id.push(jsonData.admins[i].id);
    
                // Cell for admin_authority
                var role_chinese = jsonData.admins[i].role;
                if(role_chinese === "admin"){
                    role_chinese = "系統管理員";
                }else if(role_chinese === "admin_writable"){
                    role_chinese = "可寫管理員";
                }else if(role_chinese === "admin_readonly"){
                    role_chinese = "唯讀管理員";
                }

                cell_admin_authority.innerHTML = "<span id=\"textAuthority_" + jsonData.admins[i].id + "\">" + role_chinese + "</span>";
                cell_admin_authority.innerHTML += "<select class=\"form-control\" id=\"selectAuthority_" + jsonData.admins[i].id + "\" style=\"display:none;\">"+ 
                        "<option value=\"admin\">系統管理員</option>" + 
                        "<option value=\"admin_writable\">可寫管理員</option>" + 
                        "<option value=\"admin_readonly\">唯讀管理員</option>" +
                        "</select>";

                document.getElementById("selectAuthority_" + jsonData.admins[i].id).value = jsonData.admins[i].role;
    
                // Cell for admin_name
                cell_admin_name.innerHTML = jsonData.admins[i].name;
                
    
                // Cell for admin_email
                cell_admin_email.innerHTML = jsonData.admins[i].email;;
                
                // Cell for edit
                cell_admin_edit.innerHTML = "<input id=\"btn_edit_" + jsonData.admins[i].id + "\" class=\"btn btn-outline-info\" type=\"button\" onClick=\"edit_admin('" + jsonData.admins[i].id + "');\" value=\"編輯\">";
                cell_admin_edit.innerHTML += "<input id=\"btn_save_" + jsonData.admins[i].id + "\" class=\"btn btn-outline-danger\" type=\"button\" onClick=\"save_admin('" + jsonData.admins[i].id + "');\" value=\"儲存\" style=\"display: none;\">";
            }
    
    
    
                // build Pagination
                var totalPage = jsonData.totalPage;
                document.getElementById("pagination_admin").innerHTML = "";
    
                if(currentPage - 1 >= 0){
                    var $li = $("<li class=\"page-item\"></li>");
                    $("#pagination_admin").append($li.append("<a class=\"page-link\" href=\"admin_account.html?role="+ role + "&keyword="+ keyword + "&currentPage="+ (currentPage - 1) + "\">Previous</a>"));
                }else{
                    var $li_disabled = $("<li class=\"page-item disabled\"></li>");
                    $("#pagination_admin").append($li_disabled.append("<a class=\"page-link\" href=\"admin_account.html\">Previous</a>"));
                }
    
                for(var i=0; i< totalPage; i++){
                    if(i == currentPage){
                        var $li_active = $("<li class=\"page-item active\"></li>");
                        $("#pagination_admin").append($li_active.append("<a class=\"page-link\" href=\"admin_account.html?role="+ role + "&keyword="+ keyword + "&currentPage="+ (i) + "\">"+ (i + 1) + "</a>"));
                    }else{
                        var $li = $("<li class=\"page-item\"></li>");
                        $("#pagination_admin").append($li.append("<a class=\"page-link\" href=\"admin_account.html?role="+ role + "&keyword="+ keyword + "&currentPage="+ (i) + "\">"+ (i + 1) + "</a>"));
                    }
                }
    
                if(currentPage + 1 < totalPage){
                    var $li = $("<li class=\"page-item\"></li>");
                    $("#pagination_admin").append($li.append("<a class=\"page-link\" href=\"admin_account.html?role="+ role + "&keyword="+ keyword + "&currentPage="+ (currentPage + 1) + "\">Next</a>"));
                }else{
                    var $li_disabled = $("<li class=\"page-item disabled\"></li>");
                    $("#pagination_admin").append($li_disabled.append("<a class=\"page-link\" href=\"admin_account.html\">Next</a>"));
                }
        }else{
            var row = table.insertRow(0);
            var cell1 = row.insertCell(0);
            cell1.innerHTML = "無符合條件的管理者名單";
            cell1.colSpan = 4;
            cell1.classList.add("text-center");
            
        }

        

    }).catch((err) => {
        console.log('錯誤:', err);
    })
}

function query(){
    var newRole = document.getElementById("selectAuthority").value;
    var newKeyword = document.getElementById("keyword").value;
    window.location.href = "admin_account.html?role=" + newRole + "&keyword=" + newKeyword + "&currentPage=0";
}

function edit_admin(id){
    //hide tableText
    document.getElementById("textAuthority_" + id).style.display = "none";

    // show tableInput
    document.getElementById("selectAuthority_" + id).style.display = "";

    for(var i = 0; i < admin_id.length; i++){
        var element_edit = document.getElementById("btn_edit_" + admin_id[i]);
        var element_save = document.getElementById("btn_save_" + admin_id[i]);
        // var element_delete = document.getElementById("btn_delete_" + referralId[i]);
        
        if(element_edit !== null && element_save !== null){
            element_edit.style.display = "none";
            // element_delete.style.display = "none";

            if(id == admin_id[i]){
                element_save.style.display = "";
            }
        }
    }
}

function save_admin(id){

    
    var textAuthority = document.getElementById("textAuthority_" + id);
    var selectAuthority = document.getElementById("selectAuthority_" + id);

    var newAuthority = selectAuthority.value;

    
    if(newAuthority === "admin"){
        if (!confirm('「系統管理員」將獲得變更管理員權限的能力\n你確定要這樣變更嗎？')) {
            return;
        }
    }

    
    //show tableText
    textAuthority.style.display = "";

    // hide tableInput
    selectAuthority.style.display = "none";

    // hide or show button
    for(var i = 0; i < admin_id.length; i++){
        var element_edit = document.getElementById("btn_edit_" + admin_id[i]);
        var element_save = document.getElementById("btn_save_" + admin_id[i]);
        
        if(element_edit !== null && element_save !== null){
            element_edit.style.display = "";
            element_save.style.display = "none";
        }
    }


    var change_authority = !(selectAuthority.options[selectAuthority.selectedIndex].text === textAuthority.innerHTML);
    

    
    if(change_authority){
        //轉換為ＪＳＯＮ
        var Jsonarr={
            'newRoleName': newAuthority
        }

        fetch(API_url + '/v1/api/admins/authority/account/' + id ,{
            method: 'PUT', 
            body: JSON.stringify(Jsonarr), 
            headers: new Headers({
                'Content-Type': 'application/json',
                'x-eden-token': localStorage.getItem('token')
            })
        })
        .then(res => res.json())
        .catch(error => console.error('Error:', error))
        .then((response) => {

            loadData();

            alert("變更後的權限將於該使用者重新登入後生效");
        });
    }else{
        // 沒改變
        return;
    }

}
