var path = window.location.pathname;
var where = path.split("/").pop().split(".")[0];


window.onload = function() {
    var path = ["首頁", "入住管理", "棧點使用狀態"];
    showBreadcrumb(path);

    if (!isError) {
        getHouse();
    }

    $("#SelectHouse").change(function() {
        document.getElementById("show_date").style.display = "none";
        document.getElementById("show_date_note").style.display = "none";
    });

    $("#SelectRoom").change(function() {
        document.getElementById("show_date").style.display = "none";
        document.getElementById("show_date_note").style.display = "none";
    });
}

function getHouse() {
    // 取得所有愛心棧的名稱
    fetch(API_url + '/v1/api/houses/names', {
            method: 'GET',
            headers: new Headers({
                'Content-Type': 'application/json',
                'x-eden-token': localStorage.getItem('token')
            })
        })
        .then(function checkStatus(response) {
            if (response.status == 200) {
                return response.json();
            } else {
                fetch_error(response, where);
            }
        }).then((jsonData) => {

            var select = document.getElementById("SelectHouse");
            for (var i = 0; i < jsonData.length; i++) {
                select.innerHTML += "<option value=\"" + jsonData[i].id + "\">" + jsonData[i].name + "</option>";
            }

        }).catch((err) => {
            console.log('錯誤:', err);
        });

}

$("#SelectHouse").change(function() {
    var getNameindex = document.getElementById("SelectHouse").selectedIndex - 1;

    if (getNameindex >= 0) {

        var houseId = document.getElementById("SelectHouse").value;

        fetch(API_url + '/v1/api/houses/' + houseId + '/room-numbers', {
                method: 'GET',
                headers: new Headers({
                    'Content-Type': 'application/json',
                    'x-eden-token': localStorage.getItem('token')
                })
            })
            .then(function checkStatus(response) {
                if (response.status == 200) {
                    return response.json();
                } else {
                    fetch_error(response, where);
                }
            }).then((jsonData) => {


                var select = document.getElementById("SelectRoom");
                $("#SelectRoom ").empty();

                for (var i = 0; i < jsonData.length; i++) {
                    select.innerHTML += "<option value=\"" + jsonData[i].id + "\">" + jsonData[i].number + "</option>";
                }

            }).catch((err) => {
                console.log('錯誤:', err);
            });
    } else {
        $("#SelectRoom ").empty();
    }

});

function query() {
    var houseId = document.getElementById("SelectHouse").value;
    var roomId = document.getElementById("SelectRoom").value;

    if (houseId.indexOf("-") == -1 || roomId.indexOf("-") == -1) {
        alert('請先選擇棧點並選擇房號');
    } else {

        var dateToday = new Date();
        var dateMax = new Date(dateToday.getFullYear() + 1, dateToday.getMonth(), dateToday.getDate());
        fetch(API_url + '/v1/api/rooms/' + roomId + '/reservations/dates?date=' + dateToday.yyyymmdd(), {
                method: 'GET',
                headers: new Headers({
                    'Content-Type': 'application/json',
                    'x-eden-token': localStorage.getItem('token')
                })
            })
            .then(function checkStatus(response) {
                if (response.status == 200) {
                    return response.json();
                } else {
                    fetch_error(response, where);
                }
            }).then((jsonData) => {


                getOrderDate = [];

                for (var i = 0; i < jsonData.length; i++) {

                    var startDate = getTheDate(jsonData[i].startDate);
                    var endDate = getTheDate(jsonData[i].endDate);

                    while ((endDate.getTime() - startDate.getTime()) >= 0) {
                        var year = startDate.getFullYear();
                        var month = (startDate.getMonth() + 1).toString().length == 1 ? "0" + (startDate.getMonth() + 1).toString() : (startDate.getMonth() + 1);
                        var day = startDate.getDate().toString().length == 1 ? "0" + startDate.getDate() : startDate.getDate();
                        var not_day = year + "-" + month + "-" + day;
                        getOrderDate.push(not_day);
                        startDate.setDate(startDate.getDate() + 1);
                    }

                };

                $("#show_date").datepicker({
                    dateFormat: 'yy-mm-dd',
                    beforeShowDay: function(date) {
                        var string = jQuery.datepicker.formatDate('yy-mm-dd', date);
                        return [getOrderDate.indexOf(string) == -1];
                    },
                    firstDay: 7,
                    minDate: 0,
                    maxDate: dateMax
                })

                $('#show_date').datepicker("setDate", dateToday);

            }).catch((err) => {
                console.log('錯誤:', err);
            });


        document.getElementById("show_date").style.display = "";
        document.getElementById("show_date_note").style.display = "";
    }

}

function getTheDate(datestr) {
    var temp = datestr.split("-");
    temp[1] = temp[1] - 1;
    var date = new Date(temp[0], temp[1], temp[2]);
    return date;
}

Date.prototype.yyyymmdd = function() {
    var mm = this.getMonth() + 1; // getMonth() is zero-based
    var dd = this.getDate();

    return [this.getFullYear(),
        (mm > 9 ? '' : '0') + mm,
        (dd > 9 ? '' : '0') + dd
    ].join('-');
};