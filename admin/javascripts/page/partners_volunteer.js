function load_volunteer(){
    fetch( API_url + '/v1/api/admins/role/volunteers/search/contact?keyword=' + keyword + '&currentPage=' + currentPage, {
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

        var table = document.getElementById("table_volunteer").getElementsByTagName('tbody')[0];
        table.innerHTML = "";
        volunteerId.length = 0;

        for(var i=jsonData.volunteer.length -1 ; i>=0; i--){
            volunteerId.push(jsonData.volunteer[i].id);

            var row = table.insertRow(0);
            row.style.height = "90px";

            var cell_volunteer_name = row.insertCell(0);
            var cell_volunteer_gender = row.insertCell(1);
            var cell_volunteer_email = row.insertCell(2);
            var cell_volunteer_address = row.insertCell(3);
            var cell_volunteer_cellphone = row.insertCell(4);
            var cell_volunteer_phone = row.insertCell(5);
            var cell_edit = row.insertCell(6);
            

            // Cell for volunteer_name
            cell_volunteer_name.innerHTML = jsonData.volunteer[i].chineseName + "<br /><span style=\"font-size: 50%;\">(" + jsonData.volunteer[i].englishName + ")</span>";
            
            // Cell for volunteer_gender
            cell_volunteer_gender.innerHTML = jsonData.volunteer[i].gender;
            

            // Cell for volunteer_email
            cell_volunteer_email.innerHTML = "<span id=\"tableText_volunteerEmail_" + jsonData.volunteer[i].id + "\">" + jsonData.volunteer[i].email + "</span>";
            cell_volunteer_email.innerHTML += "<input class=\"form-control\" type=\"text\" id=\"tableInput_volunteerEmail_" + jsonData.volunteer[i].id + "\" value=\"" + jsonData.volunteer[i].email + "\" placeholder=\"房東信箱(必填)\" style=\"display:none;\">";

           
            // Cell for volunteer_address
            cell_volunteer_address.innerHTML = "<span id=\"tableText_volunteerAddress_" + jsonData.volunteer[i].id + "\">" + jsonData.volunteer[i].address + "</span>";
            cell_volunteer_address.innerHTML += "<input class=\"form-control\" type=\"text\" id=\"tableInput_volunteerAddress_" + jsonData.volunteer[i].id + "\" value=\"" + jsonData.volunteer[i].address + "\" placeholder=\"房東住址(必填)\" style=\"display:none;\">";

            // Cell for volunteer_cellphone
            cell_volunteer_cellphone.innerHTML = "<span id=\"tableText_volunteerCellphone_" + jsonData.volunteer[i].id + "\">" + jsonData.volunteer[i].cellphone + "</span>";
            cell_volunteer_cellphone.innerHTML += "<input class=\"form-control\" type=\"text\" id=\"tableInput_volunteerCellphone_" + jsonData.volunteer[i].id + "\" value=\"" + jsonData.volunteer[i].cellphone.replaceAll("-", "") + "\" placeholder=\"房東手機\" style=\"display:none;\">";

            // Cell for volunteer_phone
            cell_volunteer_phone.innerHTML = "<span id=\"tableText_volunteerPhone_" + jsonData.volunteer[i].id + "\">" + jsonData.volunteer[i].phone.toString().replaceAll("#", " 分機") + "</span>";
            cell_volunteer_phone.innerHTML += "<input class=\"form-control\" type=\"text\" id=\"tableInput_volunteerPhone_" + jsonData.volunteer[i].id + "\" value=\"" + jsonData.volunteer[i].phone.replaceAll("-", "") + "\" placeholder=\"房東電話(必填)\" style=\"display:none;\">";

            // Cell for edit
            if(adminAuthority !== "admin_readonly"){
                cell_edit.innerHTML = "<input id=\"btn_edit_" + jsonData.volunteer[i].id + "\" class=\"btn btn-outline-info\" type=\"button\" onClick=\"edit_volunteer('" + jsonData.volunteer[i].id + "');\" value=\"編輯\">";
                cell_edit.innerHTML += "<input id=\"btn_save_" + jsonData.volunteer[i].id + "\" class=\"btn btn-outline-danger\" type=\"button\" onClick=\"save_volunteer('" + jsonData.volunteer[i].id + "');\" value=\"儲存\" style=\"display: none;\">";
            }else{
                cell_edit.innerHTML = "<input class=\"btn btn-outline-info\" type=\"button\" value=\"編輯\" disabled>";
            }
        }



            // build Pagination
            var totalPage = jsonData.totalPage;
            document.getElementById("pagination_volunteer").innerHTML = "";

            if(currentPage - 1 >= 0){
                var $li = $("<li class=\"page-item\"></li>");
                $("#pagination_volunteer").append($li.append("<a class=\"page-link\" href=\"partners.html?currentTab="+ currentTab + "&keyword="+ keyword + "&currentPage="+ (currentPage - 1) + "\">Previous</a>"));
            }else{
                var $li_disabled = $("<li class=\"page-item disabled\"></li>");
                $("#pagination_volunteer").append($li_disabled.append("<a class=\"page-link\" href=\"partners.html\">Previous</a>"));
            }

            for(var i=0; i< totalPage; i++){
                if(i == currentPage){
                    var $li_active = $("<li class=\"page-item active\"></li>");
                    $("#pagination_volunteer").append($li_active.append("<a class=\"page-link\" href=\"partners.html?currentTab="+ currentTab + "&keyword="+ keyword + "&currentPage="+ (i) + "\">"+ (i + 1) + "</a>"));
                }else{
                    var $li = $("<li class=\"page-item\"></li>");
                    $("#pagination_volunteer").append($li.append("<a class=\"page-link\" href=\"partners.html?currentTab="+ currentTab + "&keyword="+ keyword + "&currentPage="+ (i) + "\">"+ (i + 1) + "</a>"));
                }
            }

            if(currentPage + 1 < totalPage){
                var $li = $("<li class=\"page-item\"></li>");
                $("#pagination_volunteer").append($li.append("<a class=\"page-link\" href=\"partners.html?currentTab="+ currentTab + "&keyword="+ keyword + "&currentPage="+ (currentPage + 1) + "\">Next</a>"));
            }else{
                var $li_disabled = $("<li class=\"page-item disabled\"></li>");
                $("#pagination_volunteer").append($li_disabled.append("<a class=\"page-link\" href=\"partners.html\">Next</a>"));
            }

            // getAllId
            getAllVolunteerId();
    }).catch((err) => {
        console.log('錯誤:', err);
    })
}

function getAllVolunteerId(){
    fetch( API_url + '/v1/api/admins/role/volunteers/search/contact/all?keyword=' + keyword + '&currentPage=' + currentPage, {
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

        volunteerId_all.length = 0;

        for(var i=0; i<jsonData.length; i++){
            volunteerId_all.push(jsonData[i].id);
        }

    }).catch((err) => {
        console.log('錯誤:', err);
    })
}

function edit_volunteer(id){
    //hide tableText
    document.getElementById("tableText_volunteerEmail_" + id).style.display = "none";
    document.getElementById("tableText_volunteerAddress_" + id).style.display = "none";
    document.getElementById("tableText_volunteerCellphone_" + id).style.display = "none";
    document.getElementById("tableText_volunteerPhone_" + id).style.display = "none";

    // show tableInput
    document.getElementById("tableInput_volunteerEmail_" + id).style.display = "";
    document.getElementById("tableInput_volunteerAddress_" + id).style.display = "";
    document.getElementById("tableInput_volunteerCellphone_" + id).style.display = "";
    document.getElementById("tableInput_volunteerPhone_" + id).style.display = "";



    // record the value before edit
    volunteer_valueBeforeEdit.push(document.getElementById("tableInput_volunteerEmail_" + id).value);
    volunteer_valueBeforeEdit.push(document.getElementById("tableInput_volunteerAddress_" + id).value);
    volunteer_valueBeforeEdit.push(document.getElementById("tableInput_volunteerCellphone_" + id).value);
    volunteer_valueBeforeEdit.push(document.getElementById("tableInput_volunteerPhone_" + id).value);

    for(var i = 0; i < volunteerId.length; i++){
        var element_edit = document.getElementById("btn_edit_" + volunteerId[i]);
        var element_save = document.getElementById("btn_save_" + volunteerId[i]);
        
        if(element_edit !== null && element_save !== null){
            element_edit.style.display = "none";

            if(id == volunteerId[i]){
                element_save.style.display = "";
            }
        }
    }
}

function save_volunteer(id){

    var newEmail = document.getElementById("tableInput_volunteerEmail_" + id);
    var newAddress = document.getElementById("tableInput_volunteerAddress_" + id);
    var newCellphone = document.getElementById("tableInput_volunteerCellphone_" + id);
    var newPhone = document.getElementById("tableInput_volunteerPhone_" + id);

    var newEmailValue = document.getElementById("tableInput_volunteerEmail_" + id).value;
    var newAddressValue = document.getElementById("tableInput_volunteerAddress_" + id).value;
    var newCellphoneValue = document.getElementById("tableInput_volunteerCellphone_" + id).value;
    var newPhoneValue = document.getElementById("tableInput_volunteerPhone_" + id).value;

    if(newEmail.value.length == 0 || newAddress.value.length == 0 || newPhone.value.length == 0){
        alert("請填寫完所有必填欄位");
        return;
    }

    if(newCellphoneValue.length > 9){
        newCellphoneValue = newCellphoneValue.substring(0, 4) + "-" + newCellphoneValue.substring(4, 7) + "-" + newCellphoneValue.substring(7);
    }

    if(newPhoneValue.length > 8){
        newPhoneValue = newPhoneValue.substring(0, 2) + "-" + newPhoneValue.substring(2);
    }

    //show tableText
    document.getElementById("tableText_volunteerEmail_" + id).style.display = "";
    document.getElementById("tableText_volunteerAddress_" + id).style.display = "";
    document.getElementById("tableText_volunteerCellphone_" + id).style.display = "";
    document.getElementById("tableText_volunteerPhone_" + id).style.display = "";

    // hide tableInput
    document.getElementById("tableInput_volunteerEmail_" + id).style.display = "none";
    document.getElementById("tableInput_volunteerAddress_" + id).style.display = "none";
    document.getElementById("tableInput_volunteerCellphone_" + id).style.display = "none";
    document.getElementById("tableInput_volunteerPhone_" + id).style.display = "none";

    // hide or show button
    for(var i = 0; i < volunteerId.length; i++){
        var element_edit = document.getElementById("btn_edit_" + volunteerId[i]);
        var element_save = document.getElementById("btn_save_" + volunteerId[i]);
        
        if(element_edit !== null && element_save !== null){
            element_edit.style.display = "";
            element_save.style.display = "none";
        }
    }


    var changed_email = newEmail.value !== volunteer_valueBeforeEdit[3];
    var changed_address = newAddress.value !== volunteer_valueBeforeEdit[7];
    var changed_cellphone = newCellphone.value !== volunteer_valueBeforeEdit[8];
    var changed_phone = newPhone.value !== volunteer_valueBeforeEdit[9];

    
    if(changed_email || changed_address || changed_cellphone || changed_phone){
        //轉換為ＪＳＯＮ
        var Jsonarr={
            'email': newEmailValue,
            'address': newAddressValue,
            'phone': newPhoneValue,
            'cellphone': newCellphoneValue
        }

        console.log(JSON.stringify(Jsonarr));

        fetch(API_url + '/v1/api/admins/partners/volunteers/' + id +'/contact',{
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
            console.log('Success:', response); 

            if("apiError" in response){
                if(response.apiError.status == "BAD_REQUEST"){
                    if("subErrors" in response.apiError){
                        alert('變更失敗，因為：「' + response.apiError.subErrors[0].field + '」->' + response.apiError.subErrors[0].message);
                    }else{
                        alert('變更失敗，因為：' + response.apiError.message);
                    }
                }else{
                    alert("變更失敗，請再次檢查格式是否符合要求");
                }
            }else{
                // alert('變更成功');
                
            }

            load_volunteer();
        });
    }else{
        // 沒改變
        return;
    }

}