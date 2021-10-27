
var path = window.location.pathname;
var where = path.split("/").pop().split(".")[0];

var currentTab = getParameterByName('currentTab',"partners.html?currentTab=referral&keyword=&currentPage=0");
var currentPage = parseInt(getParameterByName('currentPage',"partners.html?currentTab=referral&keyword=&currentPage=0"));
var keyword = getParameterByName('keyword');
var exportExcelPath = "";

// common
var counties = [
    '台北市', '基隆市', '新北市', '宜蘭縣', '桃園市', '新竹市', '新竹縣', '苗栗縣',
    '台中市', '彰化縣', '南投縣', '嘉義市', '嘉義縣', '雲林縣', '台南市', '高雄市',
    '澎湖縣', '金門縣', '屏東縣', '台東縣', '花蓮縣', '連江縣'
];

// referral
var referralId = [];
var referralId_all = [];
var referral_valueBeforeEdit = [];

// firm
var firmId = [];
var firmId_all = [];
var firm_valueBeforeEdit = [];

// landlord
var landlordId = [];
var landlordId_all = [];
var landlord_valueBeforeEdit = [];

// volunteer
var volunteerId = [];
var volunteerId_all = [];
var volunteer_valueBeforeEdit = [];

window.onload = function() {
    var path = ["首頁", "帳號管理", "合作單位帳號管理"];
    showBreadcrumb(path);


    if(!isError){
        document.getElementById("keyword").value = keyword;
        reloadTab();
    }

    var hideIdList = ["insertDiv"];
    setReadOnly(hideIdList);
}

function changeTab(newTab){
    window.location.href = "partners.html?currentTab=" + newTab + "&keyword=&currentPage=0";
    reloadTab();
}

function reloadTab(){
    var tabReferral = document.getElementById("navTab_referral");
    var tabLandlord = document.getElementById("navTab_landlord");
    var tabVolunteer = document.getElementById("navTab_volunteer");
    var tabFirm = document.getElementById("navTab_firm");

    if(currentTab == "referral"){
        load_referral();

        exportExcelPath = API_url + "/v1/api/admins/partners/referrals/export";


        //show insert div
        document.getElementById("insertDiv").style.display = "";

        //Change Tab Status
        tabReferral.classList.add("active");
        tabLandlord.classList.remove("active");
        tabVolunteer.classList.remove("active");
        tabFirm.classList.remove("active");

        //change keyword's placeholder
        $('#keyword').attr('placeholder','台北');

        //Show Insert & Table div
        document.getElementById("divInsert_referral").style.display = "";
        document.getElementById("divTable_referral").style.display = "";
    }else if(currentTab == "landlord"){
        load_landlord();


        exportExcelPath = API_url + "/v1/api/admins/partners/landlords/export";

        //hide insert div
        document.getElementById("insertDiv").style.display = "none";

        //Change Tab Status
        tabReferral.classList.remove("active");
        tabLandlord.classList.add("active");
        tabVolunteer.classList.remove("active");
        tabFirm.classList.remove("active");

        //change keyword's placeholder
        $('#keyword').attr('placeholder','秀英');

        //Show Insert & Table div
        // document.getElementById("divInsert_landlord").style.display = "";
        document.getElementById("divTable_landlord").style.display = "";
    }else if(currentTab == "volunteer"){
        load_volunteer();


        exportExcelPath = API_url + "/v1/api/admins/partners/volunteers/export";

        //show insert div
        document.getElementById("insertDiv").style.display = "none";

        //Change Tab Status
        tabReferral.classList.remove("active");
        tabLandlord.classList.remove("active");
        tabVolunteer.classList.add("active");
        tabFirm.classList.remove("active");

        //change keyword's placeholder
        $('#keyword').attr('placeholder','香妹');

        //Show Insert & Table div
        // document.getElementById("divInsert_landlord").style.display = "";
        document.getElementById("divTable_volunteer").style.display = "";
    }else if(currentTab == "firm"){
        load_firm();

        exportExcelPath = API_url + "/v1/api/admins/partners/firms/export";
        
        //show insert div
        document.getElementById("insertDiv").style.display = "";

        //Change Tab Status
        tabReferral.classList.remove("active");
        tabLandlord.classList.remove("active");
        tabVolunteer.classList.remove("active");
        tabFirm.classList.add("active");

        //change keyword's placeholder
        $('#keyword').attr('placeholder','統一');

        //Show Insert & Table div
        document.getElementById("divInsert_firm").style.display = "";
        document.getElementById("divTable_firm").style.display = "";
    }
}

function query(){
    var newKeyword = document.getElementById("keyword").value;
    window.location.href = "partners.html?currentTab=" + currentTab + "&keyword=" + newKeyword + "&currentPage=0";
}



function exportExcel(){


    //轉換為ＪＳＯＮ
    if(currentTab == "referral"){
        var Jsonarr={ 'id': referralId_all }
    }else if(currentTab == "landlord"){
        var Jsonarr={ 'id': landlordId_all }
    }else if(currentTab == "volunteer"){
        var Jsonarr={ 'id': volunteerId_all }
    }else if(currentTab == "firm"){
        var Jsonarr={ 'id': firmId_all }
    }
    

    console.log("[Export ID] ->" + JSON.stringify(Jsonarr));

    fetch(exportExcelPath,{
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
                    alert('下載失敗，因為：' + response.apiError.message);
                }
            }else{
                
                var filePaht = response.downloadUrl;
                var pathPart = filePaht.split("/");

                var a = document.createElement('a');
                var url = API_url + filePaht;
                var filename = pathPart[pathPart.length-1];

                console.log("URL = " + url);
                console.log("Download = " + filename);

                
                a.href = url;
                a.download = filename;
                a.click();
                window.URL.revokeObjectURL(url);

            }
        } catch (error) {
            console.log(error.message);
        }
        
    }); 


    

}