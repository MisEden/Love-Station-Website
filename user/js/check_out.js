var dateToday = new Date();
var merge_enddate = ''
feedback = []
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


    if (localStorage.getItem('token') == null) {
        show_alert('您沒有權限');
        setTimeout(function () {
            window.location.href = 'login.html';
        }, 3000);
    }
    else {
        roomstateId = localStorage.getItem('roomstateId')

        fetch(API_url + '/v1/api/checkout-applications/status', {
            method: 'GET',
            headers: new Headers({
                'Content-Type': 'application/json',
                'x-eden-token': localStorage.getItem('token')
            })
        }).then(function checkStatus(response) {
            if (response.status == 404) {
                show_alert('你尚未填寫入住回報');
                setTimeout(function () {
                    window.location.href = 'check_in.html';
                }, 3000);
            }
            else {
                return response.json();
            }
        }).then((jsonData) => {
            check_out_info = jsonData
            if (check_out_info.endDate == today) {
                check_out_exist();
            }
            else {
                show_alert('您不是今天退房，請確認退房時間後再進行退房程序');
                setTimeout(function () {
                    window.location.href = 'index.html';
                }, 4000);
            }
        }).catch((err) => {
            console.log('錯誤:', err);
        });

    }


}


function check_out_exist() {
    fetch(API_url + '/v1/api/checkout-applications/' + roomstateId + '/feedback/isExisted', {
        method: 'GET',
        headers: new Headers({
            'Content-Type': 'application/json',
            'x-eden-token': localStorage.getItem('token')
        })
    }).then(function checkStatus(response) {

        if (response.status == 200) {
            return response.json();
        }
        else {
            var where = 'check_out';
            fetch_error(response, where);
        }

    }).then(check_out1 => {
        if (check_out1.existed == true) {
            fetch(API_url + '/v1/api/checkout-applications/' + roomstateId + '/investigation/isExisted', {
                method: 'GET',
                headers: new Headers({
                    'Content-Type': 'application/json',
                    'x-eden-token': localStorage.getItem('token')
                })
            }).then(response => {
                return response.json()
                //return response.text()
            }).then(invest1 => {
                if (invest1.existed == true) {
                    show_alert('你已經填過退房回報和問卷了');
                    setTimeout(function () {
                        window.location.href = 'index.html';
                    }, 3000);
                }
                else {
                    show_alert('你已填寫退房問卷,即將導入問卷頁面');
                    setTimeout(function () {
                        window.location.href = 'investigation.html';
                    }, 5000);
                }
            });
        }
        else {
            document.getElementById("form1").style.display = "inline-block";
        }
    });
}
function validate_all() {
    // 寢具
    if (document.getElementById('bedding_no').checked) {
        if (document.getElementById('bedding_reason').value.length == 0) {
            show_alert("表單有尚未選擇的選項<br>" + "寢具 - 原因");
            return;
        } else {
            bedding = document.getElementById("bedding_reason").value;
        }
    } else if (!document.getElementById('bedding_ok').checked) {
        show_alert("表單有尚未選擇的選項<br>" + "寢具");
        return;
    } else {
        bedding = "";
    }
    // 衛浴
    if (document.getElementById('shower_no').checked) {
        if (document.getElementById('shower_reason').value.length == 0) {
            show_alert("表單有尚未選擇的選項<br>" + "衛浴 - 原因");
            return;
        } else {
            shower = document.getElementById("shower_reason").value;
        }
    } else if (!document.getElementById('shower_ok').checked) {
        show_alert("表單有尚未選擇的選項<br>" + "衛浴");
        return;
    } else {
        shower = "";
    }
    // 冰箱
    if (document.getElementById('frig_no').checked) {
        if (document.getElementById('frig_reason').value.length == 0) {
            show_alert("表單有尚未選擇的選項<br>" + "冰箱 - 原因");
            return;
        } else {
            frig = document.getElementById("frig_reason").value;
        }
    } else if (!document.getElementById('frig_ok').checked) {
        show_alert("表單有尚未選擇的選項<br>" + "冰箱");
        return;
    } else {
        frig = "";
    }
    // 私人物品
    if (document.getElementById('personal_stuff_no').checked) {
        if (document.getElementById('personal_stuff_reason').value.length == 0) {
            show_alert("表單有尚未選擇的選項<br>" + "私人物品 - 原因");
            return;
        } else {
            personal_stuff = document.getElementById("personal_stuff_reason").value;
        }
    } else if (!document.getElementById('personal_stuff_ok').checked) {
        show_alert("表單有尚未選擇的選項<br>" + "私人物品");
        return;
    } else {
        personal_stuff = "";
    }
    // 垃圾
    if (document.getElementById('garbage_no').checked) {
        if (document.getElementById('garbage_reason').value.length == 0) {
            show_alert("表單有尚未選擇的選項<br>" + "垃圾 - 原因");
            return;
        } else {
            garbage = document.getElementById("garbage_reason").value;
        }
    } else if (!document.getElementById('garbage_ok').checked) {
        show_alert("表單有尚未選擇的選項<br>" + "垃圾");
        return;
    } else {
        garbage = "";
    }
    // 門窗/電源
    if (document.getElementById('door_power_no').checked) {
        if (document.getElementById('door_power_reason').value.length == 0) {
            show_alert("表單有尚未選擇的選項<br>" + "門窗/電源 - 原因");
            return;
        } else {
            door_power = document.getElementById("door_power_reason").value;
        }
    } else if (!document.getElementById('door_power_ok').checked) {
        show_alert("表單有尚未選擇的選項<br>" + "門窗/電源");
        return;
    } else {
        door_power = "";
    }
    // 通報保全
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
        security = "";
    }
    // 繳回入住文件
    if (document.getElementById('return_no').checked) {
        if (document.getElementById('return_reason').value.length == 0) {
            show_alert("表單有尚未選擇的選項<br>" + "繳回入住文件 - 原因");
            return;
        } else {
            return_file = document.getElementById("return_reason").value;
        }
    } else if (!document.getElementById('return_ok').checked) {
        show_alert("表單有尚未選擇的選項<br>" + "繳回入住文件");
        return;
    } else {
        return_file = "";
    }
    // 交還鑰匙
    if (document.getElementById('key_no').checked) {
        if (document.getElementById('key_reason').value.length == 0) {
            show_alert("表單有尚未選擇的選項<br>" + "交還鑰匙 - 原因");
            return;
        } else {
            key = document.getElementById("key_reason").value;
        }
    } else if (!document.getElementById('key_ok').checked) {
        show_alert("表單有尚未選擇的選項<br>" + "交還鑰匙");
        return;
    } else {
        key = "";
    }
    if (roomstateId != null) {
        // 送出退房問題

        var problem =
        {
            "bedding": '',
            "beddingFeedback": bedding,
            "bathroom": '',
            "bathroomFeedback": shower,
            "refrigerator": '',
            "refrigeratorFeedback": frig,
            "privateItem": '',
            "privateItemFeedback": personal_stuff,
            "garbage": '',
            "garbageFeedback": garbage,
            "doorsWindowsPower": '',
            "doorsWindowsPowerFeedback": door_power,
            "securityNotification": '',
            "securityNotificationFeedback": security,
            "returnKey": '',
            "returnKeyFeedback": key,
            "returnCheckinFile": '',
            "returnCheckinFileFeedback": return_file
        }
        console.log(JSON.stringify(problem))
        fetch(API_url + '/v1/api/checkout-applications/' + roomstateId + '/feedback', {
            method: 'POST',
            body: JSON.stringify(problem),
            headers: new Headers({
                'Content-Type': 'application/json',
                'x-eden-token': localStorage.getItem('token')
            })
        }).then((response) => {
            console.log('Success:', response);
        }).then(() => {
            sendproblme = true;
            if (sendproblme == true) {
                location.href = './investigation.html';
            }
        })
    }

}

function checkRadio(radioName) {
    return $("input[name=" + radioName + "]:checked").val() == null ? false : true;
}

