var phone;

window.onload = function () {
    const defaultLiffId = "1655081006-yjAYjdqv";
    let myLiffId = "";

    myLiffId = defaultLiffId;
    initializeLiffOrDie(myLiffId);
}

function initializeLiffOrDie(myLiffId) {
    if (!myLiffId) {
        console.log('LIFF Die');
    } else {
        initializeLiff(myLiffId);
    }
    document.getElementById("contract").href = API_url + '/v1/api/storage/personal-agreement-info';
    document.getElementById("contract").target = '_blank';
}

function initializeLiff(myLiffId) {
    liff
        .init({
            liffId: myLiffId
        })
        .then(() => {
            initializeApp();
        })
        .catch((err) => {
            console.log(err);
        });
}

var lineUserId = '';

function initializeApp() {
    if (liff.isLoggedIn()) {
        liff.getProfile().then(function (profile) {
            lineUserId = profile.userId;
            show_alert('提醒您要先向轉介單位(就診醫院)申請後才能開始註冊');
        }).catch(function (error) {
            show_alert('抓取LINE資訊失敗<br>' + error);
        });

    } else {
        show_alert('請先用LINE登入');
        liff.login();
    }
}

document.getElementById("inputCode").addEventListener("change", defined);

//給輸入驗證碼的input添加監聽事件，當輸入框的值改變的時候，觸發defined()函數。
var code = " ";

function defined() {
    var text = document.getElementById("inputCode").value.toUpperCase();

    //獲取輸入框的值，並用toUpperCase()將其轉化為大寫。
    function clearAndUpdate() {
        //定義clearAndUpdate()函數。用於在驗證碼錯誤的情況下刷新驗證碼和清空輸入框的值。
        document.getElementById("inputCode").value = '';
        //清空輸入框的值。
        drawPic();
    }

    //對驗證碼進行驗證。
    if (text.length < 0) {
        //判斷為空的情況，彈出提示框。
        show_alert("請輸入驗證碼");
    } else if (text == code) {
        //比較驗證碼
        show_alert("通過驗證");
    } else {
        show_alert("驗證碼錯誤");
        clearAndUpdate();
    }
}

//生成一個隨機數
function randomNum(min, max) {
    //在max和min之間生成隨機數。
    return Math.floor(Math.random() * (max - min) + min);
}

//生成一個隨機色
function randomColor(min, max) {
    //採用rgb顏色，注意顏色是0-255。
    var r = randomNum(min, max);
    var g = randomNum(min, max);
    var b = randomNum(min, max);

    return "rgb(" + r + "," + g + "," + b + ")";
}

drawPic();

//點擊驗證碼，則刷新驗證碼

document.getElementById("canvas").onclick = function (e) {
    e.preventDefault();
    drawPic();
};

//繪製驗證碼圖片            
function drawPic() {
    //獲取畫布容器
    var canvas = document.getElementById("canvas");

    //分別獲取畫布的寬和高。
    var width = canvas.width;
    var height = canvas.height;

    //獲取該canvas的2D繪圖環境對象
    var ctx = canvas.getContext('2d');

    ctx.textBaseline = 'bottom';

    //繪製背景色
    //顏色若太深可能導致看不清
    ctx.fillStyle = randomColor(200, 240);
    //畫出矩形
    ctx.fillRect(0, 0, width, height);

    //繪製文字
    //選擇全部大寫字母和數字
    var str = 'ABCEFGHJKLMNPQRSTWXY123456789';
    code = "";
    for (var i = 0; i < 4; i++) {
        //隨機獲取str的一個元素。
        var txt = str[randomNum(0, str.length)];
        //將元素加入到code里。
        code += txt;
        //隨機生成字體顏色
        ctx.fillStyle = randomColor(50, 160);
        //隨機生成字體大小
        ctx.font = randomNum(15, 30) + 'px SimHei';
        //元素在水平方向上的位置。
        var x = 10 + i * 25;
        //元素在豎直方向上的位置，儘量保持在中間，防止部分元素在畫布外。
        var y = randomNum(25, 35);
        //隨機生成旋轉角度。
        var deg = randomNum(-45, 45);

        //修改坐標原點和旋轉角度
        //平移元素
        ctx.translate(x, y);
        //旋轉元素
        ctx.rotate(deg * Math.PI / 180);

        ctx.fillText(txt, 0, 0);

        //恢復坐標原點和旋轉角度
        ctx.rotate(-deg * Math.PI / 180);
        ctx.translate(-x, -y);
    }

    //繪製干擾線
    for (var i = 0; i < 2; i++) {
        //干擾線顏色。
        ctx.strokeStyle = randomColor(40, 180);
        //開始繪製。
        ctx.beginPath();
        //起點位置
        ctx.moveTo(randomNum(0, width), randomNum(0, height));
        //終點位置
        ctx.lineTo(randomNum(0, width), randomNum(0, height));
        ctx.stroke();
    }

    //繪製干擾點
    for (var i = 0; i < 50; i++) {
        ctx.fillStyle = randomColor(0, 255);
        ctx.beginPath();
        ctx.arc(randomNum(0, width), randomNum(0, height), 1, 0, 2 * Math.PI);
        ctx.fill();
    }
}

function enroll() {
    var zone = document.getElementById("inputZone").value;
    var telephone = document.getElementById("inputTelephone").value;
    var Ext = document.getElementById("inputExt").value;
    phone = zone.concat('-', telephone, '#', Ext);
    var vercode = document.getElementById("inputCode").value;
    var lineId = lineUserId;
    var account = document.getElementById("inputAccount").value;
    var password = document.getElementById("inputPassword1").value;
    var password2 = document.getElementById("inputPassword2").value;
    var chineseName = document.getElementById("inputChName").value;
    var englishName = document.getElementById("inputEnName").value;
    var email = document.getElementById("inputEmail").value;
    var bir_str = document.getElementById("inputBirth").value;
    var birthday = bir_str.replace(/\//g, "-");
    var blood_type = document.getElementById("inputBlood").value;
    var identityCard = document.getElementById("inputId").value;
    var gender = document.getElementById("inputSexual").value;
    var address = $("#twzipcode").twzipcode('get', 'county') + $("#twzipcode").twzipcode('get', 'district') + document.getElementById("inputAddress").value;
    var cellphone = document.getElementById("inputPhone").value;

    if (cellphone.length == 10) {
        cellphone = cellphone.substring(0, 4) + "-" + cellphone.substring(4, 7) + "-" + cellphone.substring(7, 10);
    } else {
        show_alert('行動電話格式錯誤<br/><br/>請填寫共10碼的純數字電話號碼');
        return;
    }

    if (Ext == '') {
        phone = zone.concat('-', telephone);
        console.log(phone)
    }
    else {
        phone = zone.concat('-', telephone, '#', Ext);
        console.log(phone)
    }

    var agreePersonalInformation = false;
    if (document.getElementById("agree").checked == true) {
        agreePersonalInformation = true;
    }
    else {
        agreePersonalInformation = false;
    }

    if (account == '' || password == '' || chineseName == '' || email == '' || birthday == '' || vercode == '' || identityCard == '' || gender == '' || address == '' || phone == '' || cellphone == '' || agreePersonalInformation == '' || document.getElementById("inputAddress").value == '') {
        show_alert('請填完表單');
    }
    else if (password != password2) {
        show_alert('密碼與確認密碼不同')
    }
    else {
        var enroll_data = {
            "lineId": lineId,
            "account": account,
            "password": password,
            "chineseName": chineseName,
            "englishName": englishName,
            "email": email,
            "birthday": birthday,
            "bloodType": blood_type,
            "identityCard": identityCard,
            "gender": gender,
            "address": address,
            "phone": phone,
            "cellphone": cellphone,
            "agreePersonalInformation": agreePersonalInformation
        };

        $.ajax({
            type: "POST",
            url: API_url + "/v1/api/users",
            async: false,
            data: JSON.stringify(enroll_data),
            contentType: "application/json;",
            dataType: 'json',

            // success: function(data, textStatus, request){
            success: function () {
                // var response_json = JSON.stringify(data);
                show_alert('感謝申請，請等待審核結果');
                setTimeout(function () {
                    window.location.href = 'index.html';
                }, 3000);
            },
            error: function (xhr, thrownError) {
                var where = '';
                ajax_error(xhr, thrownError, where);
            }
        });

        // fetch(API_url + "/v1/api/users", {
        //   method: 'POST',
        //   headers: {
        //     'content-type': 'application/json'
        //   },
        //   body: JSON.stringify(enroll_data)
        // })
        // .then((response) =>{

        //   if (response.status == 201) {
        //     alert('註冊成功，請等待審核');
        //     return response.json();
        //   }
        //   else{
        //     where= '';
        //     fetch_error(response, where);
        //     var error = new Error(response.statusText);
        // 		error.response = response;
        //     throw error;
        //   } 
        // }).then((jsonData) => {
        //   alert(jsonData);
        // }).catch((err) => {
        //   alert('錯誤:', err);
        // });
    }
}