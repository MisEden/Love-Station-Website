
var path = window.location.pathname;
var where = path.split("/").pop().split(".")[0];

window.onload = function() {
    var path = ["首頁", "棧點管理", "現有棧點", "新增棧點"]; 
    showBreadcrumb(path);

    if(!isError){loadData();}
}

function loadData(){
    getLandlord();
}

function getLandlord(){
    fetch( API_url + '/v1/api/admins/role/landlords/names/all', {
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

        console.log(jsonData);
        document.getElementById("houseLandlord").innerHTML = "";
        for(var i = 0; i < jsonData.length; i++){
            $("#houseLandlord").append("<option value=\"" + jsonData[i].landlordId + "\">" + jsonData[i].landlordName + "</option>")
        }
        

    }).catch((err) => {
        console.log('錯誤:', err);
    })
}

function save(){
    var errorMessage = verifyRequestField();
    if(errorMessage.length > 0){
        alert("無法儲存\n" + errorMessage);
        return;
    }


    var houseCity = document.getElementById("houseCity").value;
    var houseNmae = document.getElementById("houseName").value;
    var houseIntroduction = document.getElementById("houseIntroduction").value.replace(/\r\n|\r|\n/g,"<br />");
    var houseSquareFootage = document.getElementById("houseSquareFootage").value;
    var houseRoomLayout = document.getElementById("houseRoomLayout").value;
    var houseTotalFloor = document.getElementById("houseTotalFloor").value;
    var houseStyle = document.getElementById("houseStyle").value;
    var houseRoomDescription = document.getElementById("houseRoomDescription").value;
    var houseFeature = document.getElementById("houseFeature").value;
    var houseLandlord = document.getElementById("houseLandlord").value;
    var houseAddress = document.getElementById("houseAddress").value;
    var houseNearHospital = document.getElementById("houseNearHospital").value.replace(/\r\n|\r|\n/g,"<br />");
    var houseLifeFunction = document.getElementById("houseLifeFunction").value.replace(/\r\n|\r|\n/g,"<br />");
    var houseTraffic = document.getElementById("houseTraffic").value.replace(/\r\n|\r|\n/g,"<br />");

    //轉換為ＪＳＯＮ
    var Jsonarr={
        'city': houseCity,
        'name': houseNmae,
        'introduction': houseIntroduction,
        'squareFootage': houseSquareFootage,
        'roomLayout': houseRoomLayout,
        'totalFloor': houseTotalFloor,
        'roomDescription': houseRoomDescription,
        'style': houseStyle,
        'feature': houseFeature,
        'landlordId': houseLandlord,
        'traffic': houseTraffic,
        'address': houseAddress,
        'nearHospital': houseNearHospital,
        'lifeFunction': houseLifeFunction
    }

    fetch(API_url + '/v1/api/admins/houses',{
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
                window.location = "house_info.html?house=" + response.id;
            }
        } catch (error) {
            
        }
        
    });
}

function discard(){
    window.location = "house.html";
}

function verifyRequestField(){
    var houseNmae = document.getElementById("houseName").value;
    var houseIntroduction = document.getElementById("houseIntroduction").value;
    var houseSquareFootage = parseInt(document.getElementById("houseSquareFootage").value);
    var houseRoomLayout = document.getElementById("houseRoomLayout").value;
    var houseTotalFloor = parseInt(document.getElementById("houseTotalFloor").value);
    var houseStyle = document.getElementById("houseStyle").value;
    var houseRoomDescription = document.getElementById("houseRoomDescription").value;
    var houseFeature = document.getElementById("houseFeature").value;
    var houseLandlord = document.getElementById("houseLandlord").value;
    var houseAddress = document.getElementById("houseAddress").value;
    var houseNearHospital = document.getElementById("houseNearHospital").value;
    var houseLifeFunction = document.getElementById("houseLifeFunction").value;
    var houseTraffic = document.getElementById("houseTraffic").value;

    if(houseNmae.length <= 0){
        return "「棧點名稱」為必填資料，請填寫後再按下儲存按鈕"
    }
    if(houseIntroduction.length <= 0){
        return "「棧點簡介」為必填資料，請填寫後再按下儲存按鈕"
    }
    if(houseSquareFootage <= 0 || isNaN(houseSquareFootage)){
        return "「坪數」需填寫大於0的數字，請填寫後再按下儲存按鈕"
    }
    if(houseRoomLayout.length <= 0){
        return "「格局」為必填資料，請填寫後再按下儲存按鈕"
    }
    if(houseTotalFloor + 1 == 1 || isNaN(houseTotalFloor)){
        return "「樓層」需填寫不為0的數字，請填寫後再按下儲存按鈕"
    }
    if(houseStyle.length <= 0){
        return "「型態」為必填資料，請填寫後再按下儲存按鈕"
    }
    if(houseRoomDescription.length <= 0){
        return "「房間數描述」為必填資料，請填寫後再按下儲存按鈕"
    }
    if(houseFeature.length <= 0){
        return "「特色說明」為必填資料，請填寫後再按下儲存按鈕"
    }
    if(houseLandlord.length <= 0){
        return "「房東」為必填資料，請填寫後再按下儲存按鈕"
    }
    if(houseAddress.length <= 0){
        return "「地址」為必填資料，請填寫後再按下儲存按鈕"
    }
    if(houseNearHospital.length <= 0){
        return "「鄰近醫院」為必填資料，請填寫後再按下儲存按鈕"
    }
    if(houseLifeFunction.length <= 0){
        return "「生活機能」為必填資料，請填寫後再按下儲存按鈕"
    }
    if(houseTraffic.length <= 0){
        return "「附近交通」為必填資料，請填寫後再按下儲存按鈕"
    }


    return "";
}