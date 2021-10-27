var housename;
var roomnumber;
var service = []
var FirmId;
var FirmName;
var FirmEmployeeId;
var FirmEmployeeName;
var currentdate = new Date();
var datetime = currentdate.getFullYear() + '-' + (currentdate.getMonth() + 1) + '-' + currentdate.getDate()

window.onload = function () {
    $(".custom-file-input").on("change", function () {
        var fileName = $(this).val().split("\\").pop();
        $(this).siblings(".custom-file-label").addClass("selected").html(fileName);
    });

    let image_url = new URL(location.href);
    image_url = image_url.search
    arr = image_url.split("splitid=");

    housename = (decodeURIComponent(arr[1]))
    roomnumber = (decodeURIComponent(arr[2]))
    appid = (decodeURIComponent(arr[3]))

    document.getElementById('WorkNumber').value = localStorage.getItem('FirmId');
    document.getElementById('WorkDate').value = datetime;
    document.getElementById('CompanyName').value = localStorage.getItem('FirmName');;
    document.getElementById('WorkerName').value = localStorage.getItem('FirmEmployeeName');;;
    document.getElementById('WorkPlace').value = housename;
    document.getElementById('WorkRoomNumber').value = roomnumber;

}

function submit_firm() {
    FirmEmployeeId = localStorage.getItem('FirmId');
    console.log(FirmEmployeeId)
    const myFile = document.querySelector('#file-uploader1')
    myFile.addEventListener('change', function (e) {

        if ($("#img1").length > 0) {
            $("#image").empty();
        }
        const upload = myFile.files[0];

        if (upload.size > 50000000) {
            show_alert('檔案過大，請重新選擇');
        }
        else {
            watermark([upload])
                .image(watermark.text.center('僅供伊甸使用', '80vw serif', 'red', 0.5))
                .then(img => {
                    img.id = "img1";
                    img.width = 300;
                    document.getElementById('image').appendChild(img);

                });
            if (document.getElementsByTagName('img').length == 2) {
                document.getElementById("sendFile").style.display = "inline-block";
            }
        }
    })

    const myFile2 = document.querySelector('#file-uploader2')
    myFile2.addEventListener('change', function (e) {

        if ($("#img2").length > 0) {
            $("#image2").empty();
        }

        const upload2 = myFile2.files[0];

        if (upload2.size > 50000000) {
            show_alert('檔案過大，請重新選擇');
        }
        else {
            watermark([upload2])
                .image(watermark.text.center('僅供伊甸使用', '80vw serif', 'red', 0.5))
                .then(img => {
                    img.id = "img2";
                    img.width = 300;
                    document.getElementById('image2').appendChild(img);
                });

            if (document.getElementsByTagName('img').length == 2) {
                document.getElementById("sendFile").style.display = "inline-block";
            }
        }
    })
    const upload = myFile.files[0];
    const upload2 = myFile2.files[0];
    service = document.getElementsByName("service");
    check_val = [];
    for (i in service) {
        if (service[i].checked)
            check_val.push(service[i].value);
    }


    let formData = new FormData();

    formData.append('beforeImage', upload);
    formData.append('afterImage', upload2);
    formData.append('checkinAppId', appid);
    formData.append('firmEmployeeId', FirmEmployeeId);
    formData.append('houseName', housename);
    formData.append('roomNumber', roomnumber);
    formData.append('service', check_val);

    if (check_val.length == 0) {
        show_alert('請選擇至少一樣施作內容');
        return;
    }
    else if (upload == null) {
        show_alert('請上傳清潔前照片');
        return;
    }
    else if (upload2 == null) {
        show_alert('請上傳清潔後照片');
        return;
    }
    else {
        fetch(API_url + '/v1/api/firm-employees/service/record', {
            method: 'POST',
            body: formData,
            headers: new Headers({
                'x-eden-token': localStorage.getItem('token')
            })
        }).then(function (response) {
            if (response.status == 200) {
                return response;
            }
            else if (response.status == 409) {
                show_alert('圖片格式錯誤，必須是(jpg、jpeg、png格式)')
            }
            else {
                var where = 'view_applyList.html';
                fetch_error(response, where);
            }
        }).then(function (text) {
            console.log(text);
            show_alert('已成功送出回報，將自動導回搜尋頁面')
            setTimeout(function () {
                window.location.href = 'view_applyList.html';
            }, 3000);
        }).catch(function (error) {
            console.log(error);
        });
    }

}




