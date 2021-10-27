var getHouse;
var getName;
var startDate = [];
var endDate = [];
var appid = [];
var housename = [];
var list_housename = [];
var fd
var ld
var apply_list = []
var total_list = 0
window.onload = function () {

    //取得當月第一天和最後一天
    var Today = new Date();
    today1 = Today.getFullYear() + "-" + (Today.getMonth() + 1) + "-";
    var date = new Date(), y = date.getFullYear(), m = date.getMonth();
    var firstDay = new Date(y, m, 1);
    var lastDay = new Date(y, m + 1, 0);
    firstDay = firstDay.toString().split(' ');
    lastDay = lastDay.toString().split(' ');
    fd = today1 + firstDay[2]
    ld = today1 + lastDay[2]

    const timeout = ms => new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve();
        }, ms);
    });
    const ajax1 = () => timeout(1000).then(() => {
        // 取得所有愛心棧的名稱
        fetch(API_url + '/v1/api/houses/names', {
            method: 'GET',
            headers: new Headers({
                'Content-Type': 'application/json'
            })
        }).then(function checkStatus(response) {
            if (response.status == 200) {
                return response.json();
            }
            else {
                var where = 'applyList.html';
                fetch_error(response, where);
            }
        }).then((jsonData) => {
            getName = jsonData;
            var select = document.getElementById("SelectHouse");
            for (var i = 0; i < getName.length; i++) {
                select.innerHTML += '<option>' + getName[i].name + '</option>';
                housename[i] = getName[i].name
            }
        }).catch((err) => {
            console.log('錯誤:', err);
        });
    });

    const ajax2 = () => timeout(250).then(() => {
        preload_data()
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

function clearToken() {
    localStorage.clear();
    show_alert('清除完成');
}

//自動載入當月入住紀錄
function preload_data() {

    var table = document.getElementById("table1").getElementsByTagName('tbody')[0];

    // 取得區間內所有入住名單
    fetch(API_url + '/v1/api/checkin-applications/user/search/interval?startDate=' + fd + '&endDate=' + ld + '&currentPage=0', {
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
                var where = 'applyList.html';
                fetch_error(response, where);
            }
        }).then((jsonData) => {
            var rowCount = table.rows.length;
            for (var i = 0; i < rowCount; i++) {
                table.deleteRow(0);
            }

            var totalPage = jsonData.totalPage;

            if (totalPage == 0) {
                show_alert('該時段無入住紀錄')
            }
            else {
                for (var i = 0; i < totalPage; i++) {
                    // 取得所有負責的名單
                    fetch(API_url + '/v1/api/checkin-applications/user/search/interval?startDate=' + fd + '&endDate=' + ld + '&currentPage=' + i, {
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
                                var where = 'applyList.html';
                                fetch_error(response, where);
                            }
                        }).then((jsonData) => {
                            for (var i = 0; i < jsonData.checkinApplications.length; i++) {
                                var row = table.insertRow(0);
                                var cell1 = row.insertCell(0);
                                var cell2 = row.insertCell(1);
                                var cell3 = row.insertCell(2);
                                var cell4 = row.insertCell(3);
                                var cell5 = row.insertCell(4);

                                cell2.innerHTML = jsonData.checkinApplications[i].houseName;
                                cell3.innerHTML = jsonData.checkinApplications[i].startDate;
                                cell4.innerHTML = jsonData.checkinApplications[i].endDate;
                                cell1.innerHTML = "<a href='apply.html?id=" + jsonData.checkinApplications[i].id + "'>" + (jsonData.checkinApplications[i].id).substring(0, 16) + "...</a>";
                                if (jsonData.checkinApplications[i].firstVerified == null) {
                                    cell5.innerHTML = "入住申請單<br>待審核";
                                }
                                else if (jsonData.checkinApplications[i].firstVerified == false) {
                                    cell5.innerHTML = "入住申請單<br>審核未通過";
                                }
                                else {

                                    if (jsonData.checkinApplications[i].rentImage == null) {
                                        cell5.innerHTML = "入住申請單<br>審核通過";
                                    }
                                    else if (jsonData.checkinApplications[i].secondVerified == null) {
                                        cell5.innerHTML = "入住文件<br>待審核";
                                    }
                                    else if (jsonData.checkinApplications[i].secondVerified == false) {
                                        cell5.innerHTML = "入住文件<br>審核未通過";
                                    }
                                    else if (jsonData.checkinApplications[i].secondVerified == true) {
                                        cell5.innerHTML = "入住文件<br>審核通過";
                                    }
                                }

                            }
                        }).catch((err) => {
                            console.log('錯誤:', err);
                        });

                }
            }
        }).catch((err) => {
            console.log('錯誤:', err);
        });







    document.getElementById("show_apply").style.display = "inline-block";
}
//依條件搜尋
function query() {
    var date_in = document.getElementById("date_first").value;
    var date_out = document.getElementById("date_end").value;

    var table = document.getElementById("table1").getElementsByTagName('tbody')[0];

    if (date_in == "" || date_out == "") {
        show_alert('請選擇完整欲搜尋期間');
    }
    else if (date_in > date_out) {
        show_alert('搜尋終止日需在開始日期之後');
    }
    else if (document.getElementById("SelectHouse").value == 0) {
        show_alert('請選擇棧點');
    }
    else {
        var getHouse = document.getElementById("SelectHouse").value;
        // 取得所有負責的名單
        fetch(API_url + '/v1/api/checkin-applications/user/search?houseName=' + getHouse + '&startDate=' + date_in + '&endDate=' + date_out + '&currentPage=0', {
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
                    var where = 'applyList';
                    fetch_error(response, where);
                }
            }).then((jsonData) => {
                var rowCount = table.rows.length;
                for (var i = 0; i < rowCount; i++) {
                    table.deleteRow(0);
                }

                var totalPage = jsonData.totalPage;

                if (totalPage == 0) {
                    show_alert('該時段無入住紀錄')
                }
                else {
                    for (var i = 0; i < totalPage; i++) {

                        // 取得所有負責的名單
                        fetch(API_url + '/v1/api/checkin-applications/user/search?houseName=' + getHouse + '&startDate=' + date_in + '&endDate=' + date_out + '&currentPage=' + i, {
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
                                    var where = 'applyList.html';
                                    fetch_error(response, where);
                                }
                            }).then((jsonData) => {
                                for (var i = 0; i < jsonData.checkinApplications.length; i++) {
                                    var row = table.insertRow(0);
                                    var cell1 = row.insertCell(0);
                                    var cell2 = row.insertCell(1);
                                    var cell3 = row.insertCell(2);
                                    var cell4 = row.insertCell(3);
                                    var cell5 = row.insertCell(4);

                                    cell2.innerHTML = jsonData.checkinApplications[i].houseName;
                                    cell3.innerHTML = jsonData.checkinApplications[i].startDate;
                                    cell4.innerHTML = jsonData.checkinApplications[i].endDate;
                                    cell1.innerHTML = "<a href='apply.html?id=" + jsonData.checkinApplications[i].id + "'>" + (jsonData.checkinApplications[i].id).substring(0, 16) + "...</a>";
                                    if (jsonData.checkinApplications[i].firstVerified == null) {
                                        cell5.innerHTML = "入住申請單<br>待審核";
                                    }
                                    else if (jsonData.checkinApplications[i].firstVerified == false) {
                                        cell5.innerHTML = "入住申請單<br>審核未通過";
                                    }
                                    else {

                                        if (jsonData.checkinApplications[i].rentImage == null) {
                                            cell5.innerHTML = "入住申請單<br>審核通過";
                                        }
                                        else if (jsonData.checkinApplications[i].secondVerified == null) {
                                            cell5.innerHTML = "入住文件<br>待審核";
                                        }
                                        else if (jsonData.checkinApplications[i].secondVerified == false) {
                                            cell5.innerHTML = "入住文件<br>審核未通過";
                                        }
                                        else if (jsonData.checkinApplications[i].secondVerified == true) {
                                            cell5.innerHTML = "入住文件<br>審核通過";
                                        }
                                    }

                                }
                            }).catch((err) => {
                                console.log('錯誤:', err);
                            });

                    }
                }

            }).catch((err) => {
                console.log('錯誤:', err);
            });

        document.getElementById("show_apply").style.display = "inline-block";
    }


}