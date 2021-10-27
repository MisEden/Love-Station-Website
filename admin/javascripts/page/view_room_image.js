
var path = window.location.pathname;
var where = path.split("/").pop().split(".")[0];

var rent = getParameterByName("rent");
var affidavit = getParameterByName("affidavit");

window.onload = function() {
    var path = ["首頁", "入住管理", "檢視入住/退房紀錄", "契約文件"]; 
    showBreadcrumb(path);

    if(!isError){
        if(rent.length == 0){
            document.getElementById("alert_rent").style.display = "";
            document.getElementById("image_rent").style.display = "none";
        }else{
            document.getElementById("image_rent").src = API_url + rent;
            document.getElementById("a_rent").href = API_url + rent;
        }

        if(affidavit.length == 0){
            document.getElementById("alert_affidavit").style.display = "";
            document.getElementById("image_affidavit").style.display = "none";
        }else{
            document.getElementById("image_affidavit").src = API_url + affidavit;
            document.getElementById("a_affidavit").href = API_url + affidavit;
        }
    }
}