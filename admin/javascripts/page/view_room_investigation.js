
var path = window.location.pathname;
var where = path.split("/").pop().split(".")[0];

var id = getParameterByName("id");


window.onload = function() {
    var path = ["首頁", "入住管理", "檢視入住/退房紀錄", "愛心棧問卷"]; 
    showBreadcrumb(path);

    if(!isError){loadData();}
}

function loadData() {
    fetch(API_url + '/v1/api/admins/feedback/investigation/' + id, {
        method: 'GET',
        headers: new Headers({
            'Content-Type': 'application/json',
            'x-eden-token': localStorage.getItem('token')
        })
    }).then(function checkStatus(response) {
       
        if (response.status == 200) {
            return response.json();
        }
        else if(response.status == 404){
           alert('尚未填寫，請重新查詢');
           window.close();
        }
        else{
            fetch_error(response, where);
        }
 
    }).then((jsonData) => {

        

        rate = jsonData

        serviceEfficiency = rate.serviceEfficiency
        serviceAttitude = rate.serviceAttitude
        serviceQuality = rate.serviceQuality

        equipmentFurniture = rate.equipmentFurniture

        equipmentElectricDevice = rate.equipmentElectricDevice

        equipmentAssistive = rate.equipmentAssistive

        equipmentBedding = rate.equipmentBedding

        equipmentBarrierFreeEnvironment = rate.equipmentBarrierFreeEnvironment

        environmentClean = rate.environmentClean
        environmentComfort = rate.environmentComfort
        safetyFirefighting = rate.safetyFirefighting
        safetySecomEmergencySystem = rate.safetySecomEmergencySystem

        switch (serviceEfficiency) {
            case 1:
                document.getElementById('a1').setAttribute('class', 'fa fa-star checked');
                break;
            case 2:
                document.getElementById('a1').setAttribute('class', 'fa fa-star checked');
                document.getElementById('a2').setAttribute('class', 'fa fa-star checked');
                break;
            case 3:
                document.getElementById('a1').setAttribute('class', 'fa fa-star checked');
                document.getElementById('a2').setAttribute('class', 'fa fa-star checked');
                document.getElementById('a3').setAttribute('class', 'fa fa-star checked');
                break;
            case 4:
                document.getElementById('a1').setAttribute('class', 'fa fa-star checked');
                document.getElementById('a2').setAttribute('class', 'fa fa-star checked');
                document.getElementById('a3').setAttribute('class', 'fa fa-star checked');
                document.getElementById('a4').setAttribute('class', 'fa fa-star checked');
                break;
            case 5:
                document.getElementById('a1').setAttribute('class', 'fa fa-star checked');
                document.getElementById('a2').setAttribute('class', 'fa fa-star checked');
                document.getElementById('a3').setAttribute('class', 'fa fa-star checked');
                document.getElementById('a4').setAttribute('class', 'fa fa-star checked');
                document.getElementById('a5').setAttribute('class', 'fa fa-star checked');
                break;
        }
        switch (serviceAttitude) {
            case 1:
                document.getElementById('b1').setAttribute('class', 'fa fa-star checked');
                break;
            case 2:
                document.getElementById('b1').setAttribute('class', 'fa fa-star checked');
                document.getElementById('b2').setAttribute('class', 'fa fa-star checked');
                break;
            case 3:
                document.getElementById('b1').setAttribute('class', 'fa fa-star checked');
                document.getElementById('b2').setAttribute('class', 'fa fa-star checked');
                document.getElementById('b3').setAttribute('class', 'fa fa-star checked');
                break;
            case 4:
                document.getElementById('b1').setAttribute('class', 'fa fa-star checked');
                document.getElementById('b2').setAttribute('class', 'fa fa-star checked');
                document.getElementById('b3').setAttribute('class', 'fa fa-star checked');
                document.getElementById('b4').setAttribute('class', 'fa fa-star checked');
                break;
            case 5:
                document.getElementById('b1').setAttribute('class', 'fa fa-star checked');
                document.getElementById('b2').setAttribute('class', 'fa fa-star checked');
                document.getElementById('b3').setAttribute('class', 'fa fa-star checked');
                document.getElementById('b4').setAttribute('class', 'fa fa-star checked');
                document.getElementById('b5').setAttribute('class', 'fa fa-star checked');
                break;
        }
        switch (serviceQuality) {
            case 1:
                document.getElementById('c1').setAttribute('class', 'fa fa-star checked');
                break;
            case 2:
                document.getElementById('c1').setAttribute('class', 'fa fa-star checked');
                document.getElementById('c2').setAttribute('class', 'fa fa-star checked');
                break;
            case 3:
                document.getElementById('c1').setAttribute('class', 'fa fa-star checked');
                document.getElementById('c2').setAttribute('class', 'fa fa-star checked');
                document.getElementById('c3').setAttribute('class', 'fa fa-star checked');
                break;
            case 4:
                document.getElementById('c1').setAttribute('class', 'fa fa-star checked');
                document.getElementById('c2').setAttribute('class', 'fa fa-star checked');
                document.getElementById('c3').setAttribute('class', 'fa fa-star checked');
                document.getElementById('c4').setAttribute('class', 'fa fa-star checked');
                break;
            case 5:
                document.getElementById('c1').setAttribute('class', 'fa fa-star checked');
                document.getElementById('c2').setAttribute('class', 'fa fa-star checked');
                document.getElementById('c3').setAttribute('class', 'fa fa-star checked');
                document.getElementById('c4').setAttribute('class', 'fa fa-star checked');
                document.getElementById('c5').setAttribute('class', 'fa fa-star checked');
                break;
        }
        switch (equipmentFurniture) {
            case 1:
                document.getElementById('d1').setAttribute('class', 'fa fa-star checked');
                break;
            case 2:
                document.getElementById('d1').setAttribute('class', 'fa fa-star checked');
                document.getElementById('d2').setAttribute('class', 'fa fa-star checked');
                break;
            case 3:
                document.getElementById('d1').setAttribute('class', 'fa fa-star checked');
                document.getElementById('d2').setAttribute('class', 'fa fa-star checked');
                document.getElementById('d3').setAttribute('class', 'fa fa-star checked');
                break;
            case 4:
                document.getElementById('d1').setAttribute('class', 'fa fa-star checked');
                document.getElementById('d2').setAttribute('class', 'fa fa-star checked');
                document.getElementById('d3').setAttribute('class', 'fa fa-star checked');
                document.getElementById('d4').setAttribute('class', 'fa fa-star checked');
                break;
            case 5:
                document.getElementById('d1').setAttribute('class', 'fa fa-star checked');
                document.getElementById('d2').setAttribute('class', 'fa fa-star checked');
                document.getElementById('d3').setAttribute('class', 'fa fa-star checked');
                document.getElementById('d4').setAttribute('class', 'fa fa-star checked');
                document.getElementById('d5').setAttribute('class', 'fa fa-star checked');
                break;
        }
        switch (equipmentElectricDevice) {
            case 1:
                document.getElementById('e1').setAttribute('class', 'fa fa-star checked');
                break;
            case 2:
                document.getElementById('e1').setAttribute('class', 'fa fa-star checked');
                document.getElementById('e2').setAttribute('class', 'fa fa-star checked');
                break;
            case 3:
                document.getElementById('e1').setAttribute('class', 'fa fa-star checked');
                document.getElementById('e2').setAttribute('class', 'fa fa-star checked');
                document.getElementById('e3').setAttribute('class', 'fa fa-star checked');
                break;
            case 4:
                document.getElementById('e1').setAttribute('class', 'fa fa-star checked');
                document.getElementById('e2').setAttribute('class', 'fa fa-star checked');
                document.getElementById('e3').setAttribute('class', 'fa fa-star checked');
                document.getElementById('e4').setAttribute('class', 'fa fa-star checked');
                break;
            case 5:
                document.getElementById('e1').setAttribute('class', 'fa fa-star checked');
                document.getElementById('e2').setAttribute('class', 'fa fa-star checked');
                document.getElementById('e3').setAttribute('class', 'fa fa-star checked');
                document.getElementById('e4').setAttribute('class', 'fa fa-star checked');
                document.getElementById('e5').setAttribute('class', 'fa fa-star checked');
                break;
        }
        switch (equipmentAssistive) {
            case 1:
                document.getElementById('f1').setAttribute('class', 'fa fa-star checked');
                break;
            case 2:
                document.getElementById('f1').setAttribute('class', 'fa fa-star checked');
                document.getElementById('f2').setAttribute('class', 'fa fa-star checked');
                break;
            case 3:
                document.getElementById('f1').setAttribute('class', 'fa fa-star checked');
                document.getElementById('f2').setAttribute('class', 'fa fa-star checked');
                document.getElementById('f3').setAttribute('class', 'fa fa-star checked');
                break;
            case 4:
                document.getElementById('f1').setAttribute('class', 'fa fa-star checked');
                document.getElementById('f2').setAttribute('class', 'fa fa-star checked');
                document.getElementById('f3').setAttribute('class', 'fa fa-star checked');
                document.getElementById('f4').setAttribute('class', 'fa fa-star checked');
                break;
            case 5:
                document.getElementById('f1').setAttribute('class', 'fa fa-star checked');
                document.getElementById('f2').setAttribute('class', 'fa fa-star checked');
                document.getElementById('f3').setAttribute('class', 'fa fa-star checked');
                document.getElementById('f4').setAttribute('class', 'fa fa-star checked');
                document.getElementById('f5').setAttribute('class', 'fa fa-star checked');
                break;
        }
        switch (equipmentBedding) {
            case 1:
                document.getElementById('g1').setAttribute('class', 'fa fa-star checked');
                break;
            case 2:
                document.getElementById('g1').setAttribute('class', 'fa fa-star checked');
                document.getElementById('g2').setAttribute('class', 'fa fa-star checked');
                break;
            case 3:
                document.getElementById('g1').setAttribute('class', 'fa fa-star checked');
                document.getElementById('g2').setAttribute('class', 'fa fa-star checked');
                document.getElementById('g3').setAttribute('class', 'fa fa-star checked');
                break;
            case 4:
                document.getElementById('g1').setAttribute('class', 'fa fa-star checked');
                document.getElementById('g2').setAttribute('class', 'fa fa-star checked');
                document.getElementById('g3').setAttribute('class', 'fa fa-star checked');
                document.getElementById('g4').setAttribute('class', 'fa fa-star checked');
                break;
            case 5:
                document.getElementById('g1').setAttribute('class', 'fa fa-star checked');
                document.getElementById('g2').setAttribute('class', 'fa fa-star checked');
                document.getElementById('g3').setAttribute('class', 'fa fa-star checked');
                document.getElementById('g4').setAttribute('class', 'fa fa-star checked');
                document.getElementById('g5').setAttribute('class', 'fa fa-star checked');
                break;
        }
        switch (equipmentBarrierFreeEnvironment) {
            case 1:
                document.getElementById('h1').setAttribute('class', 'fa fa-star checked');
                break;
            case 2:
                document.getElementById('h1').setAttribute('class', 'fa fa-star checked');
                document.getElementById('h2').setAttribute('class', 'fa fa-star checked');
                break;
            case 3:
                document.getElementById('h1').setAttribute('class', 'fa fa-star checked');
                document.getElementById('h2').setAttribute('class', 'fa fa-star checked');
                document.getElementById('h3').setAttribute('class', 'fa fa-star checked');
                break;
            case 4:
                document.getElementById('h1').setAttribute('class', 'fa fa-star checked');
                document.getElementById('h2').setAttribute('class', 'fa fa-star checked');
                document.getElementById('h3').setAttribute('class', 'fa fa-star checked');
                document.getElementById('h4').setAttribute('class', 'fa fa-star checked');
                break;
            case 5:
                document.getElementById('h1').setAttribute('class', 'fa fa-star checked');
                document.getElementById('h2').setAttribute('class', 'fa fa-star checked');
                document.getElementById('h3').setAttribute('class', 'fa fa-star checked');
                document.getElementById('h4').setAttribute('class', 'fa fa-star checked');
                document.getElementById('h5').setAttribute('class', 'fa fa-star checked');
                break;
        }
        switch (environmentClean) {
            case 1:
                document.getElementById('i1').setAttribute('class', 'fa fa-star checked');
                break;
            case 2:
                document.getElementById('i1').setAttribute('class', 'fa fa-star checked');
                document.getElementById('i2').setAttribute('class', 'fa fa-star checked');
                break;
            case 3:
                document.getElementById('i1').setAttribute('class', 'fa fa-star checked');
                document.getElementById('i2').setAttribute('class', 'fa fa-star checked');
                document.getElementById('i3').setAttribute('class', 'fa fa-star checked');
                break;
            case 4:
                document.getElementById('i1').setAttribute('class', 'fa fa-star checked');
                document.getElementById('i2').setAttribute('class', 'fa fa-star checked');
                document.getElementById('i3').setAttribute('class', 'fa fa-star checked');
                document.getElementById('i4').setAttribute('class', 'fa fa-star checked');
                break;
            case 5:
                document.getElementById('i1').setAttribute('class', 'fa fa-star checked');
                document.getElementById('i2').setAttribute('class', 'fa fa-star checked');
                document.getElementById('i3').setAttribute('class', 'fa fa-star checked');
                document.getElementById('i4').setAttribute('class', 'fa fa-star checked');
                document.getElementById('i5').setAttribute('class', 'fa fa-star checked');
                break;
        }
        switch (environmentComfort) {
            case 1:
                document.getElementById('j1').setAttribute('class', 'fa fa-star checked');
                break;
            case 2:
                document.getElementById('j1').setAttribute('class', 'fa fa-star checked');
                document.getElementById('j2').setAttribute('class', 'fa fa-star checked');
                break;
            case 3:
                document.getElementById('j1').setAttribute('class', 'fa fa-star checked');
                document.getElementById('j2').setAttribute('class', 'fa fa-star checked');
                document.getElementById('j3').setAttribute('class', 'fa fa-star checked');
                break;
            case 4:
                document.getElementById('j1').setAttribute('class', 'fa fa-star checked');
                document.getElementById('j2').setAttribute('class', 'fa fa-star checked');
                document.getElementById('j3').setAttribute('class', 'fa fa-star checked');
                document.getElementById('j4').setAttribute('class', 'fa fa-star checked');
                break;
            case 5:
                document.getElementById('j1').setAttribute('class', 'fa fa-star checked');
                document.getElementById('j2').setAttribute('class', 'fa fa-star checked');
                document.getElementById('j3').setAttribute('class', 'fa fa-star checked');
                document.getElementById('j4').setAttribute('class', 'fa fa-star checked');
                document.getElementById('j5').setAttribute('class', 'fa fa-star checked');
                break;
        }
        switch (safetyFirefighting) {
            case 1:
                document.getElementById('k1').setAttribute('class', 'fa fa-star checked');
                break;
            case 2:
                document.getElementById('k1').setAttribute('class', 'fa fa-star checked');
                document.getElementById('k2').setAttribute('class', 'fa fa-star checked');
                break;
            case 3:
                document.getElementById('k1').setAttribute('class', 'fa fa-star checked');
                document.getElementById('k2').setAttribute('class', 'fa fa-star checked');
                document.getElementById('k3').setAttribute('class', 'fa fa-star checked');
                break;
            case 4:
                document.getElementById('k1').setAttribute('class', 'fa fa-star checked');
                document.getElementById('k2').setAttribute('class', 'fa fa-star checked');
                document.getElementById('k3').setAttribute('class', 'fa fa-star checked');
                document.getElementById('k4').setAttribute('class', 'fa fa-star checked');
                break;
            case 5:
                document.getElementById('k1').setAttribute('class', 'fa fa-star checked');
                document.getElementById('k2').setAttribute('class', 'fa fa-star checked');
                document.getElementById('k3').setAttribute('class', 'fa fa-star checked');
                document.getElementById('k4').setAttribute('class', 'fa fa-star checked');
                document.getElementById('k5').setAttribute('class', 'fa fa-star checked');
                break;
        }
        switch (safetySecomEmergencySystem) {
            case 1:
                document.getElementById('l1').setAttribute('class', 'fa fa-star checked');
                break;
            case 2:
                document.getElementById('l1').setAttribute('class', 'fa fa-star checked');
                document.getElementById('l2').setAttribute('class', 'fa fa-star checked');
                break;
            case 3:
                document.getElementById('l1').setAttribute('class', 'fa fa-star checked');
                document.getElementById('l2').setAttribute('class', 'fa fa-star checked');
                document.getElementById('l3').setAttribute('class', 'fa fa-star checked');
                break;
            case 4:
                document.getElementById('l1').setAttribute('class', 'fa fa-star checked');
                document.getElementById('l2').setAttribute('class', 'fa fa-star checked');
                document.getElementById('l3').setAttribute('class', 'fa fa-star checked');
                document.getElementById('l4').setAttribute('class', 'fa fa-star checked');
                break;
            case 5:
                document.getElementById('l1').setAttribute('class', 'fa fa-star checked');
                document.getElementById('l2').setAttribute('class', 'fa fa-star checked');
                document.getElementById('l3').setAttribute('class', 'fa fa-star checked');
                document.getElementById('l4').setAttribute('class', 'fa fa-star checked');
                document.getElementById('l5').setAttribute('class', 'fa fa-star checked');
                break;
        }


        document.getElementById('a1').setAttribute('class', 'fa fa-star checked');





    });








}