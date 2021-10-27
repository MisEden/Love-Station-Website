
function load_firm(){
    fetch( API_url + '/v1/api/admins/role/firms/search?keyword=' + keyword + '&currentPage=' + currentPage, {
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

        var table = document.getElementById("table_firm").getElementsByTagName('tbody')[0];
        table.innerHTML = "";
        firmId.length = 0;

        for(var i=jsonData.firms.length -1 ; i>=0; i--){
            firmId.push(jsonData.firms[i].id);

            var row = table.insertRow(0);
            var cell_firm_name = row.insertCell(0);
            var cell_firm_address = row.insertCell(1);
            var cell_firm_phone = row.insertCell(2);
            var cell_firm_contact_people = row.insertCell(3);
            var cell_firm_contact_title = row.insertCell(4);
            var cell_firm_contact_phone = row.insertCell(5);
            var cell_firm_contact_email = row.insertCell(6);
            var cell_edit = row.insertCell(7);

    
            // Cell for firm_name
            cell_firm_name.innerHTML = "<span id=\"tableText_firmName_" + jsonData.firms[i].id + "\">" + jsonData.firms[i].name + "</span>";
            cell_firm_name.innerHTML += "<input class=\"form-control\" type=\"text\" id=\"tableInput_firmName_" + jsonData.firms[i].id + "\" value=\"" + jsonData.firms[i].name + "\" style=\"display:none;\" placeholder=\"廠商名稱(必填)\">";

            // Cell for firm_address
            cell_firm_address.innerHTML = "<span id=\"tableText_firmAddress_" + jsonData.firms[i].id + "\">" + jsonData.firms[i].address + "</span>";
            cell_firm_address.innerHTML += "<input class=\"form-control\" type=\"text\" id=\"tableInput_firmAddress_" + jsonData.firms[i].id + "\" value=\"" + jsonData.firms[i].address + "\" style=\"display:none;\" placeholder=\"廠商地址(必填)\">";

            // Cell for firm_phone
            cell_firm_phone.innerHTML = "<span id=\"tableText_firmPhone_" + jsonData.firms[i].id + "\">" + jsonData.firms[i].phone + "</span>";
            cell_firm_phone.innerHTML += "<input class=\"form-control\" type=\"text\" id=\"tableInput_firmPhone_" + jsonData.firms[i].id + "\" value=\"" + jsonData.firms[i].phone.replaceAll("-","") + "\" style=\"display:none;\" placeholder=\"廠商電話(必填)\">";

            // Cell for firm_contact_people
            cell_firm_contact_people.innerHTML = "<span id=\"tableText_firmContactPeople_" + jsonData.firms[i].id + "\">" + jsonData.firms[i].contactPeople + "</span>";
            cell_firm_contact_people.innerHTML += "<input class=\"form-control\" type=\"text\" id=\"tableInput_firmContactPeople_" + jsonData.firms[i].id + "\" value=\"" + jsonData.firms[i].contactPeople + "\" style=\"display:none;\" placeholder=\"聯絡人姓名(必填)\">";

            // Cell for firm_contact_title
            cell_firm_contact_title.innerHTML = "<span id=\"tableText_firmContactTitle_" + jsonData.firms[i].id + "\">" + jsonData.firms[i].contactTitle + "</span>";
            cell_firm_contact_title.innerHTML += "<input class=\"form-control\" type=\"text\" id=\"tableInput_firmContactTitle_" + jsonData.firms[i].id + "\" value=\"" + jsonData.firms[i].contactTitle + "\" style=\"display:none;\" placeholder=\"聯絡人頭銜(必填)\">";

            // Cell for firm_contact_phone
            cell_firm_contact_phone.innerHTML = "<span id=\"tableText_firmContactPhone_" + jsonData.firms[i].id + "\">" + jsonData.firms[i].contactPhone + "</span>";
            cell_firm_contact_phone.innerHTML += "<input class=\"form-control\" type=\"text\" id=\"tableInput_firmContactPhone_" + jsonData.firms[i].id + "\" value=\"" + jsonData.firms[i].contactPhone.replaceAll("-","") + "\" style=\"display:none;\" placeholder=\"聯絡人電話(必填)\">";

            // Cell for firm_contact_email
            cell_firm_contact_email.innerHTML = "<span id=\"tableText_firmContactEmail_" + jsonData.firms[i].id + "\">" + jsonData.firms[i].contactEmail + "</span>";
            cell_firm_contact_email.innerHTML += "<input class=\"form-control\" type=\"text\" id=\"tableInput_firmContactEmail_" + jsonData.firms[i].id + "\" value=\"" + jsonData.firms[i].contactEmail + "\" style=\"display:none;\" placeholder=\"聯絡人信箱(必填)\">";

            // Cell for edit
            if(adminAuthority !== "admin_readonly"){
                cell_edit.innerHTML = "<input id=\"btn_edit_" + jsonData.firms[i].id + "\" class=\"btn btn-outline-info\" type=\"button\" onClick=\"edit_firm('" + jsonData.firms[i].id + "');\" value=\"編輯\">";
                cell_edit.innerHTML += "<input id=\"btn_save_" + jsonData.firms[i].id + "\" class=\"btn btn-outline-danger\" type=\"button\" onClick=\"save_firm('" + jsonData.firms[i].id + "');\" value=\"儲存\" style=\"display: none;\">";
            }else{
                cell_edit.innerHTML = "<input class=\"btn btn-outline-info\" type=\"button\" value=\"編輯\" disabled>";
            }
        }

            // build Pagination
            var totalPage = jsonData.totalPage;
            document.getElementById("pagination_firm").innerHTML = "";

            if(currentPage - 1 >= 0){
                var $li = $("<li class=\"page-item\"></li>");
                $("#pagination_firm").append($li.append("<a class=\"page-link\" href=\"partners.html?currentTab="+ currentTab + "&keyword="+ keyword + "&currentPage="+ (currentPage - 1) + "\">Previous</a>"));
            }else{
                var $li_disabled = $("<li class=\"page-item disabled\"></li>");
                $("#pagination_firm").append($li_disabled.append("<a class=\"page-link\" href=\"partners.html\">Previous</a>"));
            }

            for(var i=0; i< totalPage; i++){
                if(i == currentPage){
                    var $li_active = $("<li class=\"page-item active\"></li>");
                    $("#pagination_firm").append($li_active.append("<a class=\"page-link\" href=\"partners.html?currentTab="+ currentTab + "&keyword="+ keyword + "&currentPage="+ (i) + "\">"+ (i + 1) + "</a>"));
                }else{
                    var $li = $("<li class=\"page-item\"></li>");
                    $("#pagination_firm").append($li.append("<a class=\"page-link\" href=\"partners.html?currentTab="+ currentTab + "&keyword="+ keyword + "&currentPage="+ (i) + "\">"+ (i + 1) + "</a>"));
                }
            }

            if(currentPage + 1 < totalPage){
                var $li = $("<li class=\"page-item\"></li>");
                $("#pagination_firm").append($li.append("<a class=\"page-link\" href=\"partners.html?currentTab="+ currentTab + "&keyword="+ keyword + "&currentPage="+ (currentPage + 1) + "\">Next</a>"));
            }else{
                var $li_disabled = $("<li class=\"page-item disabled\"></li>");
                $("#pagination_firm").append($li_disabled.append("<a class=\"page-link\" href=\"partners.html\">Next</a>"));
            }

            // getAllId
            getAllFirmId();
    }).catch((err) => {
        console.log('錯誤:', err);
    })
}

function getAllFirmId(){
    fetch( API_url + '/v1/api/admins/role/firms/search/all?keyword=' + keyword + '&currentPage=' + currentPage, {
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

        firmId_all.length = 0;

        for(var i=0; i<jsonData.length; i++){
            firmId_all.push(jsonData[i].id);
        }

    }).catch((err) => {
        console.log('錯誤:', err);
    })
}


function edit_firm(id){
    //hide tableText
    document.getElementById("tableText_firmName_" + id).style.display = "none";
    document.getElementById("tableText_firmAddress_" + id).style.display = "none";
    document.getElementById("tableText_firmPhone_" + id).style.display = "none";
    document.getElementById("tableText_firmContactPeople_" + id).style.display = "none";
    document.getElementById("tableText_firmContactTitle_" + id).style.display = "none";
    document.getElementById("tableText_firmContactPhone_" + id).style.display = "none";
    document.getElementById("tableText_firmContactEmail_" + id).style.display = "none";


    // show tableInput
    document.getElementById("tableInput_firmName_" + id).style.display = "";
    document.getElementById("tableInput_firmAddress_" + id).style.display = "";
    document.getElementById("tableInput_firmPhone_" + id).style.display = "";
    document.getElementById("tableInput_firmContactPeople_" + id).style.display = "";
    document.getElementById("tableInput_firmContactTitle_" + id).style.display = "";
    document.getElementById("tableInput_firmContactPhone_" + id).style.display = "";
    document.getElementById("tableInput_firmContactEmail_" + id).style.display = "";



    // record the value before edit
    firm_valueBeforeEdit.push(document.getElementById("tableInput_firmName_" + id).value);
    firm_valueBeforeEdit.push(document.getElementById("tableInput_firmAddress_" + id).value);
    firm_valueBeforeEdit.push(document.getElementById("tableInput_firmPhone_" + id).value);
    firm_valueBeforeEdit.push(document.getElementById("tableInput_firmContactPeople_" + id).value);
    firm_valueBeforeEdit.push(document.getElementById("tableInput_firmContactTitle_" + id).value);
    firm_valueBeforeEdit.push(document.getElementById("tableInput_firmContactPhone_" + id).value);
    firm_valueBeforeEdit.push(document.getElementById("tableInput_firmContactEmail_" + id).value);

    for(var i = 0; i < firmId.length; i++){
        var element_edit = document.getElementById("btn_edit_" + firmId[i]);
        var element_save = document.getElementById("btn_save_" + firmId[i]);
        
        if(element_edit !== null && element_save !== null){
            element_edit.style.display = "none";

            if(id == firmId[i]){
                element_save.style.display = "";
            }
        }
    }
}

function save_firm(id){

    var newName = document.getElementById("tableInput_firmName_" + id).value;
    var newAddress = document.getElementById("tableInput_firmAddress_" + id).value;
    var newPhone = document.getElementById("tableInput_firmPhone_" + id).value;
    var newContactPeople = document.getElementById("tableInput_firmContactPeople_" + id).value;
    var newContactTitle = document.getElementById("tableInput_firmContactTitle_" + id).value;
    var newContactPhone = document.getElementById("tableInput_firmContactPhone_" + id).value;
    var newContactEmail= document.getElementById("tableInput_firmContactEmail_" + id).value;

    if(newName.length == 0){
        alert("廠商名稱為必填欄位")
        return
    }

    if(newPhone.length == 10 && newPhone.substring(1, 2) == "9"){
        newPhone = newPhone.substring(0, 4) + "-" + newPhone.substring(4, 7) + "-" + newPhone.substring(7);
    }else if(newPhone.length > 8){
        newPhone = newPhone.substring(0, 2) + "-" + newPhone.substring(2);
    }

    if(newContactPhone.length == 10 && newContactPhone.substring(1, 2) == "9"){
        newContactPhone = newContactPhone.substring(0, 4) + "-" + newContactPhone.substring(4, 7) + "-" + newContactPhone.substring(7);
    }else if(newContactPhone.length > 8){
        newContactPhone = newContactPhone.substring(0, 2) + "-" + newContactPhone.substring(2);
    }

    //show tableText
    document.getElementById("tableText_firmName_" + id).style.display = "";
    document.getElementById("tableText_firmAddress_" + id).style.display = "";
    document.getElementById("tableText_firmPhone_" + id).style.display = "";
    document.getElementById("tableText_firmContactPeople_" + id).style.display = "";
    document.getElementById("tableText_firmContactTitle_" + id).style.display = "";
    document.getElementById("tableText_firmContactPhone_" + id).style.display = "";
    document.getElementById("tableText_firmContactEmail_" + id).style.display = "";


    //hide tableInput
    document.getElementById("tableInput_firmName_" + id).style.display = "none";
    document.getElementById("tableInput_firmAddress_" + id).style.display = "none";
    document.getElementById("tableInput_firmPhone_" + id).style.display = "none";
    document.getElementById("tableInput_firmContactPeople_" + id).style.display = "none";
    document.getElementById("tableInput_firmContactTitle_" + id).style.display = "none";
    document.getElementById("tableInput_firmContactPhone_" + id).style.display = "none";
    document.getElementById("tableInput_firmContactEmail_" + id).style.display = "none";

    // hide or show button
    for(var i = 0; i < firmId.length; i++){
        var element_edit = document.getElementById("btn_edit_" + firmId[i]);
        var element_save = document.getElementById("btn_save_" + firmId[i]);
        
        if(element_edit !== null && element_save !== null){
            element_edit.style.display = "";
            element_save.style.display = "none";
        }
    }


    var changed_name = newName != firm_valueBeforeEdit[0];
    var changed_address = newAddress != firm_valueBeforeEdit[1];
    var changed_phone = newPhone != firm_valueBeforeEdit[2];
    var changed_contactPeople = newContactPeople != firm_valueBeforeEdit[3];
    var changed_contactTitle = newContactTitle != firm_valueBeforeEdit[4];
    var changed_contactPhone = newContactPhone != firm_valueBeforeEdit[5];
    var changed_contactEmail = newContactEmail != firm_valueBeforeEdit[6];

    console.log(changed_name+"/"+changed_address+"/"+changed_phone+"/"+changed_contactPeople+"/"+
        changed_contactTitle+"/"+changed_contactPhone+"/"+changed_contactEmail)
    
    if(changed_name || changed_address || changed_phone || changed_contactPeople ||
        changed_contactTitle || changed_contactPhone || changed_contactEmail){
        //轉換為ＪＳＯＮ
        var Jsonarr={
            'name': newName,
            'address': newAddress,
            'phone': newPhone,
            'contactPeople': newContactPeople,
            'contactTitle': newContactTitle,
            'contactPhone': newContactPhone,
            'contactEmail': newContactEmail
        }

        fetch(API_url + '/v1/api/admins/partners/firms/' + id ,{
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
                    alert('變更失敗，因為：' + response.apiError.message);
                }
            }else{
                // alert('變更成功');
                
            }

            load_firm();
        });
    }else{
        // 沒改變
        return;
    }

}

function insertFirm(){
    var newName = document.getElementById("insertFirm_name");
    var newAddress = document.getElementById("insertFirm_address");
    var newPhone = document.getElementById("insertFirm_phone");
    var newContactName = document.getElementById("insertFirm_contactName");
    var newContactTitle = document.getElementById("insertFirm_contactTitle");
    var newContactPhone = document.getElementById("insertFirm_contactPhone");
    var newContactEmail = document.getElementById("insertFirm_contactEmail");

    if(newName.value.length == 0){
        alert("廠商名稱為必填欄位")
        return
    }

    //轉換為ＪＳＯＮ
    var Jsonarr={
        'name': newName.value,
        'address': newAddress.value,
        'phone': newPhone.value,
        'contactPeople': newContactName.value,
        'contactTitle': newContactTitle.value,
        'contactPhone': newContactPhone.value,
        'contactEmail': newContactEmail.value
    }


    fetch(API_url + '/v1/api/admins/partners/firms/',{
        method: 'POST', 
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

        try {
            if("apiError" in response){
                if(response.apiError.status == "BAD_REQUEST"){
                    alert('新增失敗，因為：' + response.apiError.message);
                }
            }else{
                
                newName.value = "";
                newAddress.value = "";
                newPhone.value = "";
                newContactName.value = "";
                newContactTitle.value = "";
                newContactPhone.value = "";
                newContactEmail.value = "";
                alert("新增完成");
                load_firm();
            }
        } catch (error) {
            
        }
        
    }); 
}