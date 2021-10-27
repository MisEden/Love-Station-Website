
function load_referral(){
    fetch( API_url + '/v1/api/admins/role/referrals/search?keyword=' + keyword + '&currentPage=' + currentPage, {
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

        var table = document.getElementById("table_referral").getElementsByTagName('tbody')[0];
        table.innerHTML = "";
        referralId.length = 0;

        for(var i=jsonData.referrals.length -1 ; i>=0; i--){
            referralId.push(jsonData.referrals[i].id);

            var row = table.insertRow(0);
            var cell_referral_city = row.insertCell(0);
            var cell_referral_name_chinese = row.insertCell(1);
            var cell_referral_name_english = row.insertCell(2);
            var cell_referral_number = row.insertCell(3);
            var cell_edit = row.insertCell(4);

            // Cell for referral_city
            var citysString = "";
            citysString += "<select class=\"form-control\" id=\"tableInput_referralCity_" + jsonData.referrals[i].id + "\" style=\"display:none;\">";
            counties.forEach(function(county) {
                citysString += "    <option value=\"" + county + "\">" + county + "</option>";
            });
            citysString += "</select>";

            cell_referral_city.innerHTML = "<span id=\"tableText_referralCity_" + jsonData.referrals[i].id + "\">" + jsonData.referrals[i].city + "</span>";
            cell_referral_city.innerHTML += citysString;
            document.getElementById("tableInput_referralCity_" + jsonData.referrals[i].id).selectedIndex = counties.indexOf(jsonData.referrals[i].city);

            // Cell for referral_chineseName
            cell_referral_name_chinese.innerHTML = "<span id=\"tableText_referralChineseName_" + jsonData.referrals[i].id + "\">" + jsonData.referrals[i].chinese + "</span>";
            cell_referral_name_chinese.innerHTML += "<input class=\"form-control\" type=\"text\" id=\"tableInput_referralChineseName_" + jsonData.referrals[i].id + "\" value=\"" + jsonData.referrals[i].chinese + "\" style=\"display:none;\">";

            // Cell for referral_englishName
            cell_referral_name_english.innerHTML = "<span id=\"tableText_referralEnglishName_" + jsonData.referrals[i].id + "\">" + jsonData.referrals[i].english + "</span>";
            cell_referral_name_english.innerHTML += "<input class=\"form-control\" type=\"text\" id=\"tableInput_referralEnglishName_" + jsonData.referrals[i].id + "\" value=\"" + jsonData.referrals[i].english + "\" style=\"display:none;\">";


            // Cell for referral_number
            cell_referral_number.innerHTML = "<span id=\"tableText_referralNumber_" + jsonData.referrals[i].id + "\">" + jsonData.referrals[i].number + "</span>";
            cell_referral_number.innerHTML += "<input class=\"form-control\" type=\"text\" id=\"tableInput_referralNumber_" + jsonData.referrals[i].id + "\" value=\"" + jsonData.referrals[i].number + "\" style=\"display:none;\">";

            // Cell for edit
            if(adminAuthority !== "admin_readonly"){
                cell_edit.innerHTML = "<input id=\"btn_edit_" + jsonData.referrals[i].id + "\" class=\"btn btn-outline-info\" type=\"button\" onClick=\"edit_referral('" + jsonData.referrals[i].id + "');\" value=\"編輯\">";
                cell_edit.innerHTML += "<input id=\"btn_save_" + jsonData.referrals[i].id + "\" class=\"btn btn-outline-danger\" type=\"button\" onClick=\"save_referral('" + jsonData.referrals[i].id + "');\" value=\"儲存\" style=\"display: none;\">";
            }else{
                cell_edit.innerHTML = "<input class=\"btn btn-outline-info\" type=\"button\" value=\"編輯\" disabled>";
            }
           // cell_edit.innerHTML += "<input id=\"btn_delete_" + jsonData.referrals[i].id + "\" class=\"btn btn-outline-danger\" type=\"button\" onClick=\"confirmDelete('" + jsonData.referrals[i].id + "', '" + jsonData.referrals[i].chinese + "');\" value=\"刪除\">";
        }



            // build Pagination
            var totalPage = jsonData.totalPage;
            document.getElementById("pagination_referral").innerHTML = "";

            if(currentPage - 1 >= 0){
                var $li = $("<li class=\"page-item\"></li>");
                $("#pagination_referral").append($li.append("<a class=\"page-link\" href=\"partners.html?currentTab="+ currentTab + "&keyword="+ keyword + "&currentPage="+ (currentPage - 1) + "\">Previous</a>"));
            }else{
                var $li_disabled = $("<li class=\"page-item disabled\"></li>");
                $("#pagination_referral").append($li_disabled.append("<a class=\"page-link\" href=\"partners.html\">Previous</a>"));
            }

            for(var i=0; i< totalPage; i++){
                if(i == currentPage){
                    var $li_active = $("<li class=\"page-item active\"></li>");
                    $("#pagination_referral").append($li_active.append("<a class=\"page-link\" href=\"partners.html?currentTab="+ currentTab + "&keyword="+ keyword + "&currentPage="+ (i) + "\">"+ (i + 1) + "</a>"));
                }else{
                    var $li = $("<li class=\"page-item\"></li>");
                    $("#pagination_referral").append($li.append("<a class=\"page-link\" href=\"partners.html?currentTab="+ currentTab + "&keyword="+ keyword + "&currentPage="+ (i) + "\">"+ (i + 1) + "</a>"));
                }
            }

            if(currentPage + 1 < totalPage){
                var $li = $("<li class=\"page-item\"></li>");
                $("#pagination_referral").append($li.append("<a class=\"page-link\" href=\"partners.html?currentTab="+ currentTab + "&keyword="+ keyword + "&currentPage="+ (currentPage + 1) + "\">Next</a>"));
            }else{
                var $li_disabled = $("<li class=\"page-item disabled\"></li>");
                $("#pagination_referral").append($li_disabled.append("<a class=\"page-link\" href=\"partners.html\">Next</a>"));
            }

            // getAllId
            getAllReferralId();
    }).catch((err) => {
        console.log('錯誤:', err);
    })
}

function getAllReferralId(){
    fetch( API_url + '/v1/api/admins/role/referrals/search/all?keyword=' + keyword + '&currentPage=' + currentPage, {
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

        referralId_all.length = 0;

        for(var i=0; i<jsonData.length; i++){
            referralId_all.push(jsonData[i].id);
        }

    }).catch((err) => {
        console.log('錯誤:', err);
    })
}

function edit_referral(id){
    //hide tableText
    document.getElementById("tableText_referralCity_" + id).style.display = "none";
    document.getElementById("tableText_referralChineseName_" + id).style.display = "none";
    document.getElementById("tableText_referralEnglishName_" + id).style.display = "none";
    document.getElementById("tableText_referralNumber_" + id).style.display = "none";

    // show tableInput
    document.getElementById("tableInput_referralCity_" + id).style.display = "";
    document.getElementById("tableInput_referralChineseName_" + id).style.display = "";
    document.getElementById("tableInput_referralEnglishName_" + id).style.display = "";
    document.getElementById("tableInput_referralNumber_" + id).style.display = "";



    // record the value before edit
    referral_valueBeforeEdit.push(document.getElementById("tableInput_referralCity_" + id).value);
    referral_valueBeforeEdit.push(document.getElementById("tableInput_referralChineseName_" + id).value);
    referral_valueBeforeEdit.push(document.getElementById("tableInput_referralEnglishName_" + id).value);
    referral_valueBeforeEdit.push(document.getElementById("tableInput_referralNumber_" + id).value);

    for(var i = 0; i < referralId.length; i++){
        var element_edit = document.getElementById("btn_edit_" + referralId[i]);
        var element_save = document.getElementById("btn_save_" + referralId[i]);
        // var element_delete = document.getElementById("btn_delete_" + referralId[i]);
        
        if(element_edit !== null && element_save !== null){
            element_edit.style.display = "none";
            // element_delete.style.display = "none";

            if(id == referralId[i]){
                element_save.style.display = "";
            }
        }
    }
}

function save_referral(id){

    var newCity = document.getElementById("tableInput_referralCity_" + id).value;
    var newChinese = document.getElementById("tableInput_referralChineseName_" + id).value;
    var newEnglish = document.getElementById("tableInput_referralEnglishName_" + id).value;
    var newNumber = document.getElementById("tableInput_referralNumber_" + id).value;

    if(newCity.length == 0 || newChinese.length == 0 || newEnglish.length == 0 || newNumber.length == 0){
        alert("請填寫完所有欄位")
        return
    }

    //show tableText
    document.getElementById("tableText_referralCity_" + id).style.display = "";
    document.getElementById("tableText_referralChineseName_" + id).style.display = "";
    document.getElementById("tableText_referralEnglishName_" + id).style.display = "";
    document.getElementById("tableText_referralNumber_" + id).style.display = "";

    // hide tableInput
    document.getElementById("tableInput_referralCity_" + id).style.display = "none";
    document.getElementById("tableInput_referralChineseName_" + id).style.display = "none";
    document.getElementById("tableInput_referralEnglishName_" + id).style.display = "none";
    document.getElementById("tableInput_referralNumber_" + id).style.display = "none";

    // hide or show button
    for(var i = 0; i < referralId.length; i++){
        var element_edit = document.getElementById("btn_edit_" + referralId[i]);
        var element_save = document.getElementById("btn_save_" + referralId[i]);
        // var element_delete = document.getElementById("btn_delete_" + referralId[i]);
        
        if(element_edit !== null && element_save !== null){
            element_edit.style.display = "";
            element_save.style.display = "none";
            // element_delete.style.display = "";
        }
    }


    var changed_city = newCity != referral_valueBeforeEdit[0];
    var changed_chinese = newChinese != referral_valueBeforeEdit[1];
    var changed_english = newEnglish != referral_valueBeforeEdit[2];
    var changed_number = newNumber != referral_valueBeforeEdit[3];
    
    if(changed_city || changed_chinese || changed_english || changed_number){
        //轉換為ＪＳＯＮ
        var Jsonarr={
            'hospitalChineseName': newChinese,
            'hospitalEnglishName': newEnglish,
            'number': newNumber,
            'city': newCity
        }

        fetch(API_url + '/v1/api/admins/partners/referrals/' + id ,{
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

            load_referral();
        });
    }else{
        // 沒改變
        return;
    }

}

function insertReferral(){
    var newCity = document.getElementById("insertReferral_city");
    var newChinese = document.getElementById("insertReferral_chineseName");
    var newEnglish = document.getElementById("insertReferral_englishName");
    var newNumber = document.getElementById("insertReferral_number");

    if(newCity.value.length == 0 || newChinese.value.length == 0 || newEnglish.value.length == 0 || newNumber.value.length == 0){
        alert("請填寫完所有欄位")
        return
    }

    //轉換為ＪＳＯＮ
    var Jsonarr={
        'hospitalChineseName': newChinese.value,
        'hospitalEnglishName': newEnglish.value,
        'number': newNumber.value,
        'city': newCity.value
    }


    fetch(API_url + '/v1/api/admins/partners/referrals/',{
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
                
                newCity.value = "台北市";
                newChinese.value = "";
                newEnglish.value = "";
                newNumber.value = "";
                load_referral();
            }
        } catch (error) {
            
        }
        
    }); 


}
