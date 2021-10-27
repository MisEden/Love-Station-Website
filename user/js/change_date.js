var ogdate_in;
var ogdate_out;
var appid;
var housename;
var roomnumber;
var roomid;
var current_houseId;
var changedItem;
var getName;
var getNumber;
var house = [];
var getOrderDate = [];
var thisyears = new Date();
var date = thisyears.getFullYear() + '-' + (thisyears.getMonth() - 1) + '-' + thisyears.getDate();
var dateToday = new Date();
var dateLow = new Date(dateToday.getFullYear(), dateToday.getMonth() - 1, dateToday.getDate());
var dateMax = new Date(dateToday.getFullYear() + 1, dateToday.getMonth(), dateToday.getDate());
var today = new Date();
var dd = String(today.getDate()).padStart(2, '0');
var mm = String(today.getMonth() + 1).padStart(2, '0');
var yyyy = today.getFullYear();
today = yyyy + '-' + mm + '-' + dd;

window.onload = function () {
    getdetail();
    change_display();
    gethousename();

}
function getTheDate(datestr) {
    var temp = datestr.split("-");
    temp[1] = temp[1] - 1;
    var date = new Date(temp[0], temp[1], temp[2]);
    return date;
}
// 取得所有愛心棧的名稱
function gethousename() {
    const timeout = ms => new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve();
        }, ms);
    });
    const ajax1 = () => timeout(800).then(() => {
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
                }
                else {
                    fetch_error(response, where);
                }
            }).then((jsonData) => {
                getName = jsonData;
                for (i = 0; i < getName.length; i++) {
                    house.push({
                        houseId: getName[i].id,
                        houseName: getName[i].name
                    });
                }
            }).catch((err) => {
                console.log('錯誤:', err);
            });
    });

    const ajax2 = () => timeout(600).then(() => {
        for (var i = 0; i < getName.length; i++) {
            if (housename == house[i].houseName) {
                current_houseId = house[i].houseId
            }
        }
    });

    const ajax3 = () => timeout(400).then(() => {
        getRoomNumber();
    });

    const ajax4 = () => timeout(200).then(() => {
        verified();
    });

    const mergePromise = async ajaxArray => {
        let data = [];
        for (let aj of ajaxArray) {
            let res = await aj();
            data.push(res);
        }
        return data;
    };

    mergePromise([ajax1, ajax2, ajax3, ajax4]).then(data => {
        console.log('done');
    });

}

function getRoomNumber() {
    fetch(API_url + '/v1/api/houses/' + current_houseId + '/room-numbers', {
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
            else {
                fetch_error(response, where);
            }
        }).then((jsonData) => {
            getNumber = jsonData;

            for (var i = 0; i < getNumber.length; i++) {
                if (roomnumber == getNumber[i].number) {
                    roomid = getNumber[i].id
                }
            }
        }).catch((err) => {
            console.log('錯誤:', err);
        });
}

function verified() {
    const timeout = ms => new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve();
        }, ms);
    });
    const getid1 = () => timeout(400).then(() => {
        fetch(API_url + '/v1/api/rooms/' + roomid + '/reservations/dates?date=' + date, {
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
                else {
                    fetch_error(response, where);
                }
            }).then((jsonData) => {
                getNumber = jsonData;
                for (var i = 0; i < getNumber.length; i++) {
                    if (roomnumber == getNumber[i].number) {
                        roomid = getNumber[i].id
                    }
                }
            }).catch((err) => {
                console.log('錯誤:', err);
            });
    });
    const getcal = () => timeout(200).then(() => {
        for (var i = 0; i < getNumber.length; i++) {
            var startDate = getTheDate(getNumber[i].startDate);
            var endDate = getTheDate(getNumber[i].endDate);

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
            beforeShowDay: function (date) {
                var string = jQuery.datepicker.formatDate('yy-mm-dd', date);
                return [getOrderDate.indexOf(string) == -1]
            },
            firstDay: 7,
            minDate: dateLow,
            maxDate: dateMax
        })
        $('#show_date').datepicker("setDate", dateToday);
        $(".ring").remove();
        $(".text").remove();
        document.getElementById('line').style.display = 'none'
    });

    const mergePromise = async ajaxArray => {
        let data = [];
        for (let aj of ajaxArray) {
            let res = await aj();
            data.push(res);
        }
        return data;
    };

    mergePromise([getid1, getcal]).then(data => {
        console.log('done');
    });
}

function change_display() {
    const timeout = ms => new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve();
        }, ms);
    });
    const ajax1 = () => timeout(700).then(() => {
        $("#changedItem").change(function () {
            var changedItem = document.getElementById("changedItem").value;
            if (changedItem == '取消入住') {
                document.getElementById("newdate_in").value = '';
                document.getElementById("newdate_out").value = '';
                document.getElementById("show_date_in").style.display = "none";
                document.getElementById("show_date_out").style.display = "none";
                document.getElementById("show_apply2").style.display = "inline-block";
            }
            else if (changedItem == '延後入住' || changedItem == '提前入住') {
                document.getElementById("newdate_in").disabled = false;
                document.getElementById("newdate_out").disabled = true;
                document.getElementById("newdate_in").value = '';
                document.getElementById("newdate_out").value = ogdate_out;
                document.getElementById("show_date_in").style.display = "inline-block";
                document.getElementById("show_date_out").style.display = "inline-block";
                document.getElementById("show_apply2").style.display = "inline-block";
            }
            else if (changedItem == '延後退房' || changedItem == '提前退房') {
                document.getElementById("newdate_in").disabled = true;
                document.getElementById("newdate_out").disabled = false;
                document.getElementById("newdate_in").value = ogdate_in;
                document.getElementById("newdate_out").value = '';
                document.getElementById("show_date_in").style.display = "inline-block";
                document.getElementById("show_date_out").style.display = "inline-block";
                document.getElementById("show_apply2").style.display = "inline-block";
            }
            else if (changedItem == '變更入住及退房時間') {
                document.getElementById("newdate_in").disabled = false;
                document.getElementById("newdate_out").disabled = false;
                document.getElementById("newdate_in").value = '';
                document.getElementById("newdate_out").value = '';
                document.getElementById("show_date_in").style.display = "inline-block";
                document.getElementById("show_date_out").style.display = "inline-block";
                document.getElementById("show_apply2").style.display = "inline-block";
            }



        });
    });
    const ajax2 = () => timeout(250).then(() => {
        document.getElementById("ogdate_in").value = ogdate_in;
        document.getElementById("ogdate_out").value = ogdate_out;
    });

    const mergePromise = async ajaxArray => {
        let data = [];
        for (let aj of ajaxArray) {
            let res = await aj();
            data.push(res);
        }
        return data;
    };

    mergePromise([ajax1, ajax2]).then(data => {
        console.log('done');
    });
}

function change() {

    changedItem = document.getElementById("changedItem").value;
    if (changedItem == '取消入住') {
        newdate_in = document.getElementById('ogdate_in').value;
        newdate_out = document.getElementById('ogdate_out').value;
    }
    else if (changedItem == '延後入住') {
        newdate_in = document.getElementById('newdate_in').value;
        newdate_out = document.getElementById('ogdate_out').value;
    }
    else if (changedItem == '延後退房') {
        newdate_in = document.getElementById("ogdate_in").value;
        newdate_out = document.getElementById("newdate_out").value;
    }
    else if (changedItem == '提前退房') {
        newdate_in = document.getElementById("ogdate_in").value;
        newdate_out = document.getElementById("newdate_out").value;
    }

    else if (changedItem == '變更入住及退房時間') {
        newdate_in = document.getElementById("newdate_in").value;
        newdate_out = document.getElementById("newdate_out").value;
    }


    reason = document.getElementById("reason").value;
    // 送出更改today
    if (changedItem == '延後入住') {
        if (Date.parse(newdate_in) <= Date.parse(today)) {
            show_alert('不能選擇今天或今天之前的日期');
            return;
        }
        if (Date.parse(newdate_in) <= Date.parse(ogdate_in)) {
            show_alert('(延後入住):新入住日期需在原入住日期之後');
            return;
        }
    }
    if (changedItem == '延後退房') {
        if (Date.parse(newdate_out) <= Date.parse(today)) {
            show_alert('不能選擇今天或今天之前的日期');
            return;
        }
        if (Date.parse(newdate_out) <= Date.parse(ogdate_out)) {
            show_alert('(延後退房):新退房日期需在原退房日期之後')
            return;
        }
    }
    if (changedItem == '提前入住') {
        if (Date.parse(newdate_in) <= Date.parse(today)) {
            show_alert('不能選擇今天或今天之前的日期');
            return;
        }
        if (Date.parse(newdate_in) >= Date.parse(ogdate_in)) {
            show_alert('(提前入住):新入住日期需在原入住日期之前')
            return;
        }
    }
    if (changedItem == '提前退房') {
        if (Date.parse(newdate_out) <= Date.parse(today)) {
            show_alert('不能選擇今天或今天之前的日期');
            return;
        }
        if (Date.parse(newdate_out) >= Date.parse(ogdate_out)) {
            show_alert('(提前退房):新退房日期需在原退房日期之前')
            return;
        }
    }

    if (changedItem == '變更入住及退房時間') {
        if (Date.parse(newdate_in) <= Date.parse(today) || Date.parse(newdate_out) < Date.parse(today)) {
            show_alert('不能選擇今天或今天之前的日期');
            return;
        }
    }

    if (Date.parse(newdate_in) > Date.parse(newdate_out)) {
        show_alert('入住日期需在退房日期之前')
        return;
    }
    else if (Date.parse(newdate_in) == Date.parse(newdate_out)) {
        show_alert('入住日期不得等於退房日期')
        return;
    }
    else {
        var change =
        {
            "newStartDate": newdate_in,
            "newEndDate": newdate_out,
            "changedItem": changedItem,
            "reason": reason,
        }
        fetch(API_url + '/v1/api/checkin-applications/' + appid + '/roomState/new', {
            method: 'POST',
            body: JSON.stringify(change),
            headers: new Headers({
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            })
        }).then(response => {
            if (response.status == 200) {
                return response;
            }
            else if (response.status == 409) {
                show_alert('您選擇日期已被占用，請更換日期')
            }
            else {
                var where = 'applyList.html';
                fetch_error(response, where);
            }
        }).then(jsonData => {
            if (jsonData.status) {
                show_alert('送出成功!!請等待審核')
                setTimeout(function () {
                    window.location.href = 'applyList.html';
                }, 3000);
            }
        })

    }


}

function getdetail() {

    // 取得入住資訊
    let orrul = new URL(location.href);
    orrul = orrul.search
    arr = orrul.split("splitid=");

    ogdate_in = (decodeURIComponent(arr[1]))
    ogdate_out = (decodeURIComponent(arr[2]))
    appid = (decodeURIComponent(arr[3]))
    housename = (decodeURIComponent(arr[4]))
    roomnumber = (decodeURIComponent(arr[5]))
}
