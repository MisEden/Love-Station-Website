var getName;
var getRoom;

window.onload = function() {
    showMenu("stack.html");

    // 取得所有愛心棧的名稱
    fetch(API_url + '/v1/api/houses/names', {
        method: 'GET',
        headers: new Headers({
            'Content-Type': 'application/json'
        })
    }).then(function checkStatus(response) {
        if (response.status == 200) {
            return response.json();
        } else {
            var where = 'index';
            fetch_error(response, where);
        }
    }).then((jsonData) => {
        getName = jsonData;
        var select = document.getElementById("SelectHouse");
        for (var i = 0; i < getName.length; i++) {
            if (i == 0) {
                select.innerHTML += '<option value=\"' + getName[i].id + '\" selected="selected">' + getName[i].name + '</option>';
            } else {
                select.innerHTML += '<option value=\"' + getName[i].id + '\">' + getName[i].name + '</option>';
            }
        }

        getInfo();

    }).catch((err) => {
        console.log('錯誤:', err);
    });

    $("#SelectHouse").change(function() {
        getInfo();
    });

};

function getInfo() {

    houseId = document.getElementById("SelectHouse").value;


    // 取得愛心棧資訊
    fetch(API_url + '/v1/api/houses/' + houseId + '/detail', {
        method: 'GET',
        headers: new Headers({
            'Content-Type': 'application/json'
        })
    }).then(function checkStatus(response) {
        if (response.status == 200) {
            return response.json();
        } else {
            var where = 'stack';
            fetch_error(response, where);
        }
    }).then((jsonData) => {

        var img = document.getElementById("images");
        document.getElementById("images").innerHTML = "";


        for (var i = 0; i < jsonData.images.length; i++) {
            if (i == 0) {
                img.innerHTML = '<div class="carousel-item active"><img class="d-block w-100" src="' + API_url + jsonData.images[i] + '"></div>';
            } else {
                img.innerHTML += '<div class="carousel-item"><img class="d-block w-100" src="' + API_url + jsonData.images[i] + '"></div>';
            }
        }
        document.getElementById("introduction").innerHTML = '<p>' + jsonData.introduction + '<p>';
        document.getElementById("map").innerHTML = '<iframe width="100%" height="250" frameborder="0" style="border:0" src="https://www.google.com/maps/embed/v1/place?key=AIzaSyArPKC5KbAvv_Kp7sK_sErtLFZmDSsS7Zc&q=' + jsonData.address + '" allowfullscreen></iframe>';
        document.getElementById("address").innerHTML = jsonData.address;
        document.getElementById("lifeFunction").innerHTML = jsonData.lifeFunction;
        document.getElementById("nearHospital").innerHTML = jsonData.nearHospital;
        document.getElementById("traffic").innerHTML = jsonData.traffic;
        document.getElementById("squareFootage").innerHTML = jsonData.squareFootage;
        document.getElementById("roomLayout").innerHTML = jsonData.roomLayout;
        document.getElementById("totalFloor").innerHTML = jsonData.totalFloor;
        document.getElementById("style").innerHTML = jsonData.style;
        document.getElementById("roomDescription").innerHTML = jsonData.roomDescription;
        document.getElementById("feature").innerHTML = jsonData.feature;
        if (jsonData.planimetricMap == "系統建置中") {
            $('#planimetricMap').attr("height", 0);
        } else {
            $('#planimetricMap').attr("src", API_url + jsonData.planimetricMap);
        }
        if (jsonData.fullDegreePanorama == "系統建置中") {
            $('#iframe_fullDegreePanorama').attr("style", "width:0; height:0; border:0; border:none")
        } else {
            // document.getElementById("iframe_fullDegreePanorama").style.display = "width:100%; height:50 vh; min-height: 400px;";
            document.getElementById("img_fullDegreePanorama").setAttribute("src", API_url + jsonData.fullDegreePanorama);
            // document.getElementById("iframe_fullDegreePanorama").setAttribute("style", "max-height: 400px;")
            // $('#iframe_fullDegreePanorama').attr("src", "https://cdn.pannellum.org/2.5/pannellum.htm#panorama=" + API_url + jsonData.fullDegreePanorama);
        }

    }).catch((err) => {
        console.log('錯誤:', err);
    });

    $('.carousel').carousel({
        interval: 1000
    })
}