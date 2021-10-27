var getName;
var getRoom;
var dateToday = new Date();
var dateMax = new Date(dateToday.getFullYear() + 1, dateToday.getMonth(), dateToday.getDate());

window.onload = function() {

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
                var where = 'rent';
                fetch_error(response, where);
            }

        }).then((jsonData) => {
            getName = jsonData;
            var select = document.getElementById("SelectHouse");
            for (var i = 0; i < getName.length; i++) {
                select.innerHTML += '<option>' + getName[i].name + '</option>';
            }
        }).catch((err) => {
            console.log('錯誤:', err);
        });

    setTime();

    $("#SelectHouse").change(function() {
        document.getElementById("show_date").style.display = "none";
        document.getElementById("apply_rent").style.display = "none";
        document.getElementById("smallWord").style.display = "none";
    })

    $("#SelectRoom").change(function() {
        document.getElementById("show_date").style.display = "none";
        document.getElementById("apply_rent").style.display = "none";
        document.getElementById("smallWord").style.display = "none";
    })

    $("#input_date_in").change(function() {
        $("#input_date_out").attr("min", document.getElementById("input_date_in").value);
    })
    $("#input_date_out").change(function() {
        if ($("#input_date_out").value != '') {
            $("#input_date_in").attr("max", document.getElementById("input_date_out").value);
        }
    })

}

function clearToken() {
    localStorage.clear();
    show_alert('清除完成');
}

function setTime() {
    var Today_year = dateToday.getFullYear();
    var Today_mon = dateToday.getMonth() + 1 < 10 ? "0" + (dateToday.getMonth() + 1) : (dateToday.getMonth() + 1); //
    var Today_dat = dateToday.getDate() < 10 ? "0" + dateToday.getDate() : dateToday.getDate();
    $("#input_date_in").val('');
    $("#input_date_out").val('');

    $("#input_date_in").attr("min", Today_year + "-" + Today_mon + "-" + Today_dat);
    $("#input_date_in").attr("max", '');

    $("#input_date_out").attr("min", Today_year + "-" + Today_mon + "-" + Today_dat);
}


var getNameId;
// 取得愛心棧的房號
$("#SelectHouse").change(function() {
    var getNameindex = document.getElementById("SelectHouse").selectedIndex - 1;
    if (getNameindex >= 0) {

        getNameId = getName[getNameindex].id;
        fetch(API_url + '/v1/api/houses/' + getNameId + '/room-numbers', {
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
                    var where = 'rent';
                    fetch_error(response, where);
                }

            }).then((jsonData) => {
                getRoom = jsonData;
                var select = document.getElementById("SelectRoom");
                $("#SelectRoom").empty();
                for (var i = 0; i < getRoom.length; i++) {
                    select.innerHTML += '<option> ' + getRoom[i].number + '</option>';
                }
            }).catch((err) => {
                console.log('錯誤:', err);
            });
    }

});

var check = 0;
var getOrderDate = [];
var getRoomId;

function getTheDate(datestr) {
    var temp = datestr.split("-");
    temp[1] = temp[1] - 1;
    var date = new Date(temp[0], temp[1], temp[2]);
    return date;
}

function query() {

    if (document.getElementById("SelectHouse").value == 0) {
        show_alert('請先選擇棧點並選擇房號');
        $("#SelectRoom").empty();
        document.getElementById("show_date").style.display = "none";
        document.getElementById("apply_rent").style.display = "none";
        document.getElementById("smallWord").style.display = "none";
    } else {
        var getRoomindex = document.getElementById("SelectRoom").selectedIndex;
        getRoomId = getRoom[getRoomindex].id;

        fetch(API_url + '/v1/api/rooms/' + getRoomId + '/reservations/dates?date=' + dateToday.yyyymmdd(), {
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
                    var where = 'rent';
                    fetch_error(response, where);
                }

            }).then((jsonData) => {

                getStatus = jsonData;
                getOrderDate = [];
                for (var i = 0; i < getStatus.length; i++) {
                    var startDate = getTheDate(getStatus[i].startDate);
                    var endDate = getTheDate(getStatus[i].endDate);

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
                        return [getOrderDate.indexOf(string) == -1]
                    },
                    firstDay: 7,
                    minDate: 0,
                    maxDate: dateMax //"2021-02-22"
                })
                $('#show_date').datepicker("setDate", dateToday);
                document.getElementById("show_date").style.display = "block";
                document.getElementById("apply_rent").style.display = "block";
                document.getElementById("smallWord").style.display = "";

            }).catch((err) => {
                console.log('錯誤:', err);
            });

    }

}

function apply() {
    var par = 0;
    var date_in = document.getElementById("input_date_in").value;
    var date_out = document.getElementById("input_date_out").value;
    var HouseName = $('#SelectHouse :selected').text();
    var RoomName = $('#SelectRoom :selected').text();

    if (date_in == "" || date_out == "") {
        show_alert('請選擇入住日期及退房日期');
    } else if (date_in > date_out) {
        show_alert('退房日期需在訂房日期之後');
    } else {
        var startTime = getTheDate(date_in);
        var endTime = getTheDate(date_out);
        if (startTime <= dateToday || endTime <= dateToday) {
            show_alert('日期需在今天之後');
            par = 1;
        } else if (startTime > dateMax || endTime > dateMax) {
            show_alert('日期需在一年之內');
            par = 1;
        } else {
            while ((endTime.getTime() - startTime.getTime()) >= 0) {
                var year = startTime.getFullYear();
                var month = (startTime.getMonth() + 1).toString().length == 1 ? "0" + (startTime.getMonth() + 1).toString() : (startTime.getMonth() + 1);
                var day = startTime.getDate().toString().length == 1 ? "0" + startTime.getDate() : startTime.getDate();
                var not_day = year + "-" + month + "-" + day;
                if (getOrderDate.includes(not_day) == true) {
                    setTime();
                    show_alert('此日期無法入住，請重新確認日期');
                    par = 1;
                    break;
                }
                startTime.setDate(startTime.getDate() + 1);
            }
            if (par != 1) {
                window.open('apply.html?house=' + HouseName + '&roomName=' + RoomName + '&roomid=' + getRoomId + '&date_in=' + date_in + '&date_out=' + date_out, '_self');
            }
        }
    }


}

Date.prototype.yyyymmdd = function() {
    var mm = this.getMonth() + 1; // getMonth() is zero-based
    var dd = this.getDate();

    return [this.getFullYear(),
        (mm > 9 ? '' : '0') + mm,
        (dd > 9 ? '' : '0') + dd
    ].join('-');
};