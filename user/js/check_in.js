var dateToday = new Date();
var merge_enddate = '';
var locationData;
var publicFurniture;
var privateFurniture;

window.onload = function () {

    var date_year = '' + dateToday.getFullYear();
    var date_month = '' + (dateToday.getMonth() + 1);
    var date_day = '' + dateToday.getDate();

    if (parseInt(date_month) < 10) {
        date_month = "0" + date_month;
    }

    if (parseInt(date_day) < 10) {
        date_day = "0" + date_day;
    }

    // 取得房號
    var today = (date_year + '-' + date_month + '-' + date_day);

    // 取得所有愛心棧的名稱
    fetch(API_url + '/v1/api/checkin/eligible/' + today, {
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
                var where = 'check_in';
                fetch_error(response, where);
            }

        })
        .then((jsonData) => {
            if (JSON.stringify(jsonData).length <= 2) {
                var select = document.getElementById("SelectHouse");
                select.innerHTML = '<option id=house>無今日紀錄</option>';
                show_alert('今天不是入住日期，請待入住日再進行入住程序');
                setTimeout(function () {
                    window.location.href = 'index.html';
                }, 3000);
            }
            else {

                locationData = jsonData;

                var select = document.getElementById("SelectHouse");
                select.innerHTML = '<option id=house>' + jsonData.hname + '</option>';
                localStorage.setItem('roomstateId', locationData.id)

                if (locationData.countForms > 0) {
                    show_alert('已經填過入住確認了喔！');
                    setTimeout(function () {
                        window.location.href = 'index.html';
                    }, 3000);
                } else {
                    var getRoomName = $("#SelectHouse :selected").text();
                    getInfo(getRoomName);

                    if (locationData.hname == "台北南海棧" || locationData.hname == "高雄鹽埕棧") {
                        document.getElementById("div_lock").style.display = "";
                    }

                    if (locationData.hname == "新北淡水棧" || locationData.hname == "高雄鹽埕棧") {
                        document.getElementById("div_heater").style.display = "";
                    }
                }

            }
        }).catch((err) => {
            console.log('錯誤:', err);
        });



}


function getInfo(getRoomName) {
    document.getElementById("form1").style.display = "inline-block";


    // 取得所有公有家具
    fetch(API_url + '/v1/api/checkin/room/' + locationData.rid + '/furniture/public', {
        method: 'GET',
        headers: new Headers({
            'Content-Type': 'application/json'
        })

    }).then(function checkStatus(response) {
        if (response.status == 200) {
            return response.json();
        }
        else {
            var where = 'index';
            fetch_error(response, where);
        }
    }).then((jsonData) => {
        publicFurnitureName = jsonData;
        publicFurniture = jsonData;

        var select = document.getElementById("public_for");
        for (var i = 0; i < publicFurniture.length; i++) {
            var innerText = "<div ";
            if (i == publicFurniture.length - 1) { innerText += "style=\"padding-top: 10px;\""; } else { innerText += "class=\"div_item\""; }
            innerText += ">";
            innerText += "            <label class=\"col-form-label\">" + publicFurnitureName[i].publicFurnitureName + "</label><br/>";
            innerText += "            <input type =\"radio\" id=\"public_normal" + i + "\" name=\"public" + i + "\"><label for=\"public_normal" + i + "\">正常</label>";
            innerText += "            <input type=\"radio\" id=\"public_disable" + i + "\" name=\"public" + i + "\"><label for=\"public_disable" + i + "\">異常</label>";
            innerText += "        </div>";
            select.innerHTML += innerText;
        }
    }).catch((err) => {
        console.log('錯誤:', err);
    });

    // 取得所有私有家具
    fetch(API_url + '/v1/api/checkin/room/' + locationData.rid + '/furniture/private', {
        method: 'GET',
        headers: new Headers({
            'Content-Type': 'application/json'
        })

    }).then(function checkStatus(response) {
        if (response.status == 200) {
            return response.json();
        }
        else {
            var where = 'index';
            fetch_error(response, where);
        }
    }).then((jsonData) => {
        privateFurnitureName = jsonData;
        privateFurniture = privateFurnitureName;

        var select = document.getElementById("private_for");
        for (var i = 0; i < privateFurniture.length; i++) {
            var innerText = "<div ";
            if (i == privateFurniture.length - 1) { innerText += "style=\"padding-top: 10px;\""; } else { innerText += "class=\"div_item\""; }
            innerText += ">";
            innerText += "            <label class=\"col-form-label\">" + privateFurnitureName[i].privateFurnitureName + "</label><br/>";
            innerText += "            <input type =\"radio\" id=\"private_normal" + i + "\" name=\"private" + i + "\"><label for=\"private_normal" + i + "\">正常</label>";
            innerText += "            <input type=\"radio\" id=\"private_disable" + i + "\" name=\"private" + i + "\"><label for=\"private_disable" + i + "\">異常</label>";
            innerText += "        </div>";
            select.innerHTML += innerText;
        }
    }).catch((err) => {
        console.log('錯誤:', err);
    });
}


function validate() {
    var lock = "";
    var power = "";
    var convention = ["", ""];
    var contract = "";
    var security = "";
    var heater = "";

    // 電子鎖
    if (document.getElementById("div_lock").style.display == "") {
        if (document.getElementById('lock_no').checked) {
            if (document.getElementById('lock_reason').value.length == 0) {
                show_alert("表單有尚未選擇的選項<br>" + "電子鎖 - 原因");
                return;
            } else {
                lock = document.getElementById("lock_reason").value;
            }
        } else if (!document.getElementById('lock_ok').checked) {
            show_alert("表單有尚未選擇的選項<br>" + "電子鎖");
            return;
        } else {
            lock = "已完成";
        }
    } else {
        lock = "無設備";
    }



    // 電源
    if (document.getElementById('power_no').checked) {
        if (document.getElementById('power_reason').value.length == 0) {
            show_alert("表單有尚未選擇的選項<br>" + "開啟總電源 - 原因");
            return;
        } else {
            power = document.getElementById("power_reason").value;
        }
    } else if (!document.getElementById('power_ok').checked) {
        show_alert("表單有尚未選擇的選項<br>" + "開啟總電源");
        return;
    } else {
        power = "已完成";
    }

    // 入住須知
    if (document.getElementById('convention_paper').checked == false && document.getElementById('convention_online').checked == false) {
        show_alert("表單有尚未選擇的選項<br>" + "閱讀入住須知");
        return;
    } else {
        if (document.getElementById('convention_paper').checked == true) {
            convention[0] = "已完成";
        }
        if (document.getElementById('convention_online').checked == true) {
            convention[1] = "已完成";
        }
    }

    // 契約
    if (!document.getElementById('contract').checked) {
        show_alert("表單有尚未選擇的選項<br>" + "簽署入住契約文件");
        return;
    } else {
        contract = "已完成";
    }

    // 保全
    if (document.getElementById('security_no').checked) {
        if (document.getElementById('security_reason').value.length == 0) {
            show_alert("表單有尚未選擇的選項<br>" + "通報保全 - 原因");
            return;
        } else {
            security = document.getElementById("security_reason").value;
        }
    } else if (!document.getElementById('security_ok').checked) {
        show_alert("表單有尚未選擇的選項<br>" + "通報保全");
        return;
    } else {
        security = "已完成";
    }

    // 熱水器注意事項
    if (document.getElementById("div_heater").style.display != "none") {
        if (!document.getElementById('heater_ok').checked) {
            show_alert("表單有尚未選擇的選項<br>" + "電熱水器使用須知");
            return;
        } else {
            heater = "已完成";
        }
    } else {
        heater = "無設備";
    }




    // 衛浴
    if (!document.getElementById('shower').checked) {
        show_alert("表單有尚未選擇的選項<br>" + "衛浴、寢具、垃圾回收、衣物 - 衛浴");
        return;
    }

    // 寢具
    if (!document.getElementById('bed').checked) {
        show_alert("表單有尚未選擇的選項<br>" + "衛浴、寢具、垃圾回收、衣物 - 寢具");
        return;
    }

    // 垃圾回收
    if (!document.getElementById('gar').checked) {
        show_alert("表單有尚未選擇的選項<br>" + "衛浴、寢具、垃圾回收、衣物 - 垃圾回收");
        return;
    }

    // 衣物
    if (!document.getElementById('clean').checked) {
        show_alert("表單有尚未選擇的選項<br>" + "衛浴、寢具、垃圾回收、衣物 - 衣物");
        return;
    }

    exitstPublicFurniture_array = [];
    disablePublicFurniture_array = [];
    exitstPrivateFurniture_array = [];
    disablePrivateFurniture_array = [];

    // 驗證公有
    if (publicFurniture.length != 0) {
        for (var i = 0; i < publicFurniture.length; i++) {
            var normalPublicFurniture = document.getElementById('public_normal' + i).checked;
            var disablePublicFurniture = document.getElementById('public_disable' + i).checked;

            if (normalPublicFurniture == false && disablePublicFurniture == false) {
                show_alert("表單有尚未選擇的選項<br>" + "檢查公共設備之電器設備 - " + publicFurniture[i].publicFurnitureName);
                return;
            } else {
                exitstPublicFurniture_array.push(publicFurniture[i].publicFurnitureName);

                if (disablePublicFurniture) {
                    //此公有家具異常
                    disablePublicFurniture_array.push(publicFurniture[i].publicFurnitureName);
                }
            }
        }
    }

    // 驗證私有
    if (privateFurniture.length != 0) {
        for (var i = 0; i < privateFurniture.length; i++) {
            var normalPrivateFurniture = document.getElementById('private_normal' + i).checked;
            var disablePrivateFurniture = document.getElementById('private_disable' + i).checked;

            if (normalPrivateFurniture == false && disablePrivateFurniture == false) {
                show_alert("表單有尚未選擇的選項<br>" + "檢查房間內之電器設備 - " + privateFurniture[i].privateFurnitureName);
                return;
            } else {
                exitstPrivateFurniture_array.push(privateFurniture[i].privateFurnitureName);

                if (disablePrivateFurniture) {
                    //此私有家具異常
                    disablePrivateFurniture_array.push(privateFurniture[i].privateFurnitureName);
                }
            }
        }
    }

    // 確定不修改
    if (!document.getElementById('check_onlyOneChance').checked) {
        show_alert("表單有尚未選擇的選項<br>" + "「確定不修改」確認");
        return;
    }

    //呼叫送出資料

    //轉換為ＪＳＯＮ
    var Jsonarr = {
        'roomStateId': locationData.id,
        'existPublicFurnitures': exitstPublicFurniture_array,
        'brokenPublicFurnitures': disablePublicFurniture_array,
        'existPrivateFurnitures': exitstPrivateFurniture_array,
        'brokenPrivateFurnitures': disablePrivateFurniture_array,
        'lock': lock,
        'power': power,
        'convention': convention,
        'contract': contract,
        'security': security,
        'heater': heater
    }

    //儲存post結果
    fetch(API_url + '/v1/api/checkin/', {
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
            show_alert('成功送出');
            location.href = './index.html';
        });
}

function checkAll() {
    document.getElementById('power_ok').checked = true;
    document.getElementById('convention_paper').checked = true;
    document.getElementById('contract').checked = true;
    document.getElementById('security_ok').checked = true;
    document.getElementById('shower').checked = true;
    document.getElementById('bed').checked = true;
    document.getElementById('gar').checked = true;
    document.getElementById('clean').checked = true;

    if (publicFurniture.length != 0) {
        for (var i = 0; i < publicFurniture.length; i++) {
            document.getElementById('public_normal' + i).checked = true;
        }
    }

    if (privateFurniture.length != 0) {
        for (var i = 0; i < privateFurniture.length; i++) {
            document.getElementById('private_normal' + i).checked = true;
        }
    }
}