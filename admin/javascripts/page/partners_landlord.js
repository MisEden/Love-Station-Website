function load_landlord(){
    fetch( API_url + '/v1/api/admins/role/landlords/search/contact?keyword=' + keyword + '&currentPage=' + currentPage, {
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

        var table = document.getElementById("table_landlord").getElementsByTagName('tbody')[0];
        table.innerHTML = "";
        landlordId.length = 0;

        for(var i=jsonData.landlord.length -1 ; i>=0; i--){
            landlordId.push(jsonData.landlord[i].id);

            var row = table.insertRow(0);
            row.style.height = "90px";

            var cell_landlord_name = row.insertCell(0);
            var cell_landlord_gender = row.insertCell(1);
            var cell_landlord_house = row.insertCell(2);
            var cell_landlord_email = row.insertCell(3);
            var cell_landlord_address = row.insertCell(4);
            var cell_landlord_cellphone = row.insertCell(5);
            var cell_landlord_phone = row.insertCell(6);
            var cell_edit = row.insertCell(7);
            

            // Cell for landlord_name
            cell_landlord_name.innerHTML = jsonData.landlord[i].chineseName + "<br /><span style=\"font-size: 50%;\">(" + jsonData.landlord[i].englishName + ")</span>";
            
            // Cell for landlord_gender
            cell_landlord_gender.innerHTML = jsonData.landlord[i].gender;

            // Cell for landlord_house
            cell_landlord_house.innerHTML = "";

            try{
                var houseName_string = jsonData.landlord[i].housesName;
                var houseName_array = houseName_string.split(",");
                var houseId_string = jsonData.landlord[i].housesId;
                var houseId_array = houseId_string.split(",");

                for(var k = 0; k < houseName_array.length -1; k++){
                    cell_landlord_house.innerHTML += "<a href=\"house_info.html?house=" + houseId_array[k] + "\" target=\"_blank\">" + houseName_array[k] + "</a><br />";
                }
            }catch(e){

            }
            
            

            // Cell for landlord_email
            cell_landlord_email.innerHTML = "<span id=\"tableText_landlordEmail_" + jsonData.landlord[i].id + "\">" + jsonData.landlord[i].email + "</span>";
            cell_landlord_email.innerHTML += "<input class=\"form-control\" type=\"text\" id=\"tableInput_landlordEmail_" + jsonData.landlord[i].id + "\" value=\"" + jsonData.landlord[i].email + "\" placeholder=\"房東信箱(必填)\" style=\"display:none;\">";

           
            // Cell for landlord_address
            cell_landlord_address.innerHTML = "<span id=\"tableText_landlordAddress_" + jsonData.landlord[i].id + "\">" + jsonData.landlord[i].address + "</span>";
            cell_landlord_address.innerHTML += "<input class=\"form-control\" type=\"text\" id=\"tableInput_landlordAddress_" + jsonData.landlord[i].id + "\" value=\"" + jsonData.landlord[i].address + "\" placeholder=\"房東住址(必填)\" style=\"display:none;\">";

            // Cell for landlord_cellphone
            cell_landlord_cellphone.innerHTML = "<span id=\"tableText_landlordCellphone_" + jsonData.landlord[i].id + "\">" + jsonData.landlord[i].cellphone + "</span>";
            cell_landlord_cellphone.innerHTML += "<input class=\"form-control\" type=\"text\" id=\"tableInput_landlordCellphone_" + jsonData.landlord[i].id + "\" value=\"" + jsonData.landlord[i].cellphone.replaceAll("-", "") + "\" placeholder=\"房東手機\" style=\"display:none;\">";

            // Cell for landlord_phone
            cell_landlord_phone.innerHTML = "<span id=\"tableText_landlordPhone_" + jsonData.landlord[i].id + "\">" + jsonData.landlord[i].phone.toString().replaceAll("#", " 分機") + "</span>";
            cell_landlord_phone.innerHTML += "<input class=\"form-control\" type=\"text\" id=\"tableInput_landlordPhone_" + jsonData.landlord[i].id + "\" value=\"" + jsonData.landlord[i].phone.replaceAll("-", "") + "\" placeholder=\"房東電話(必填)\" style=\"display:none;\">";

            // Cell for edit
            if(adminAuthority !== "admin_readonly"){
                cell_edit.innerHTML = "<input id=\"btn_edit_" + jsonData.landlord[i].id + "\" class=\"btn btn-outline-info\" type=\"button\" onClick=\"edit_landlord('" + jsonData.landlord[i].id + "');\" value=\"編輯\">";
                cell_edit.innerHTML += "<input id=\"btn_save_" + jsonData.landlord[i].id + "\" class=\"btn btn-outline-danger\" type=\"button\" onClick=\"save_landlord('" + jsonData.landlord[i].id + "');\" value=\"儲存\" style=\"display: none;\">";
            }else{
                cell_edit.innerHTML = "<input class=\"btn btn-outline-info\" type=\"button\" value=\"編輯\" disabled>";
            }
        }



            // build Pagination
            var totalPage = jsonData.totalPage;
            document.getElementById("pagination_landlord").innerHTML = "";

            if(currentPage - 1 >= 0){
                var $li = $("<li class=\"page-item\"></li>");
                $("#pagination_landlord").append($li.append("<a class=\"page-link\" href=\"partners.html?currentTab="+ currentTab + "&keyword="+ keyword + "&currentPage="+ (currentPage - 1) + "\">Previous</a>"));
            }else{
                var $li_disabled = $("<li class=\"page-item disabled\"></li>");
                $("#pagination_landlord").append($li_disabled.append("<a class=\"page-link\" href=\"partners.html\">Previous</a>"));
            }

            for(var i=0; i< totalPage; i++){
                if(i == currentPage){
                    var $li_active = $("<li class=\"page-item active\"></li>");
                    $("#pagination_landlord").append($li_active.append("<a class=\"page-link\" href=\"partners.html?currentTab="+ currentTab + "&keyword="+ keyword + "&currentPage="+ (i) + "\">"+ (i + 1) + "</a>"));
                }else{
                    var $li = $("<li class=\"page-item\"></li>");
                    $("#pagination_landlord").append($li.append("<a class=\"page-link\" href=\"partners.html?currentTab="+ currentTab + "&keyword="+ keyword + "&currentPage="+ (i) + "\">"+ (i + 1) + "</a>"));
                }
            }

            if(currentPage + 1 < totalPage){
                var $li = $("<li class=\"page-item\"></li>");
                $("#pagination_landlord").append($li.append("<a class=\"page-link\" href=\"partners.html?currentTab="+ currentTab + "&keyword="+ keyword + "&currentPage="+ (currentPage + 1) + "\">Next</a>"));
            }else{
                var $li_disabled = $("<li class=\"page-item disabled\"></li>");
                $("#pagination_landlord").append($li_disabled.append("<a class=\"page-link\" href=\"partners.html\">Next</a>"));
            }

            // getAllId
            getAllLandlordId();
    }).catch((err) => {
        console.log('錯誤:', err);
    })
}

function getAllLandlordId(){
    fetch( API_url + '/v1/api/admins/role/landlords/search/contact/all?keyword=' + keyword + '&currentPage=' + currentPage, {
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

        landlordId_all.length = 0;

        for(var i=0; i<jsonData.length; i++){
            landlordId_all.push(jsonData[i].id);
        }

    }).catch((err) => {
        console.log('錯誤:', err);
    })
}

function edit_landlord(id){
    //hide tableText
    document.getElementById("tableText_landlordEmail_" + id).style.display = "none";
    document.getElementById("tableText_landlordAddress_" + id).style.display = "none";
    document.getElementById("tableText_landlordCellphone_" + id).style.display = "none";
    document.getElementById("tableText_landlordPhone_" + id).style.display = "none";

    // show tableInput
    document.getElementById("tableInput_landlordEmail_" + id).style.display = "";
    document.getElementById("tableInput_landlordAddress_" + id).style.display = "";
    document.getElementById("tableInput_landlordCellphone_" + id).style.display = "";
    document.getElementById("tableInput_landlordPhone_" + id).style.display = "";



    // record the value before edit
    landlord_valueBeforeEdit.push(document.getElementById("tableInput_landlordEmail_" + id).value);
    landlord_valueBeforeEdit.push(document.getElementById("tableInput_landlordAddress_" + id).value);
    landlord_valueBeforeEdit.push(document.getElementById("tableInput_landlordCellphone_" + id).value);
    landlord_valueBeforeEdit.push(document.getElementById("tableInput_landlordPhone_" + id).value);

    for(var i = 0; i < landlordId.length; i++){
        var element_edit = document.getElementById("btn_edit_" + landlordId[i]);
        var element_save = document.getElementById("btn_save_" + landlordId[i]);
        
        if(element_edit !== null && element_save !== null){
            element_edit.style.display = "none";

            if(id == landlordId[i]){
                element_save.style.display = "";
            }
        }
    }
}

function save_landlord(id){

    var newEmail = document.getElementById("tableInput_landlordEmail_" + id);
    var newAddress = document.getElementById("tableInput_landlordAddress_" + id);
    var newCellphone = document.getElementById("tableInput_landlordCellphone_" + id);
    var newPhone = document.getElementById("tableInput_landlordPhone_" + id);

    var newEmailValue = document.getElementById("tableInput_landlordEmail_" + id).value;
    var newAddressValue = document.getElementById("tableInput_landlordAddress_" + id).value;
    var newCellphoneValue = document.getElementById("tableInput_landlordCellphone_" + id).value;
    var newPhoneValue = document.getElementById("tableInput_landlordPhone_" + id).value;

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
    document.getElementById("tableText_landlordEmail_" + id).style.display = "";
    document.getElementById("tableText_landlordAddress_" + id).style.display = "";
    document.getElementById("tableText_landlordCellphone_" + id).style.display = "";
    document.getElementById("tableText_landlordPhone_" + id).style.display = "";

    // hide tableInput
    document.getElementById("tableInput_landlordEmail_" + id).style.display = "none";
    document.getElementById("tableInput_landlordAddress_" + id).style.display = "none";
    document.getElementById("tableInput_landlordCellphone_" + id).style.display = "none";
    document.getElementById("tableInput_landlordPhone_" + id).style.display = "none";

    // hide or show button
    for(var i = 0; i < landlordId.length; i++){
        var element_edit = document.getElementById("btn_edit_" + landlordId[i]);
        var element_save = document.getElementById("btn_save_" + landlordId[i]);
        
        if(element_edit !== null && element_save !== null){
            element_edit.style.display = "";
            element_save.style.display = "none";
        }
    }


    var changed_email = newEmail.value !== landlord_valueBeforeEdit[3];
    var changed_address = newAddress.value !== landlord_valueBeforeEdit[7];
    var changed_cellphone = newCellphone.value !== landlord_valueBeforeEdit[8];
    var changed_phone = newPhone.value !== landlord_valueBeforeEdit[9];

    
    if(changed_email || changed_address || changed_cellphone || changed_phone){
        //轉換為ＪＳＯＮ
        var Jsonarr={
            'email': newEmailValue,
            'address': newAddressValue,
            'phone': newPhoneValue,
            'cellphone': newCellphoneValue
        }

        console.log(JSON.stringify(Jsonarr));

        fetch(API_url + '/v1/api/admins/partners/landlords/' + id +'/contact',{
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

            load_landlord();
        });
    }else{
        // 沒改變
        return;
    }

}