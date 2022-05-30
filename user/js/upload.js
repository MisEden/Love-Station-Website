window.onload = function () {

  var url = location.href;
  var temp = url.split("?");
  var vars = temp[1].split("=");
  get_id = vars[1];

  //document.getElementById("file1").href = API_url + '/v1/api/storage/checkin-application';//入住契約書
  document.getElementById("file1").href = 'https://drive.google.com/file/d/1qcrHJYZMBYt_cj_jnfeKe1VVwa9WBwDM/view?usp=sharing';//入住契約書改為google雲端硬碟檔案
  document.getElementById("file1").target = '_blank';
  //document.getElementById("file2").href = API_url + '/v1/api/storage/affidavit';//切結書
  document.getElementById("file2").href = 'https://drive.google.com/file/d/1F-lQxj1j-lT3xpZiBIl33Bxw8A0WIN4R/view?usp=sharing';//切結書改為google雲端硬碟檔案
  document.getElementById("file2").target = '_blank';

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
}


function sendImg() {

  const myFile = document.querySelector('#file-uploader1');
  const upload = myFile.files[0];

  const myFile2 = document.querySelector('#file-uploader2');
  const upload2 = myFile2.files[0];

  let formData = new FormData()

  formData.append('rentImage', upload);
  formData.append('affidavitImage', upload2);

  $.ajax({
    url: API_url + '/v1/api/checkin-applications/' + get_id + '/first-stage/files',
    type: 'POST',
    headers: {
      'x-eden-token': localStorage.getItem('token'),
    },
    contentType: false, //required
    processData: false, // required
    mimeType: 'multipart/form-data',
    data: formData,
    beforeSend: function () { // Before we send the request, remove the .hidden class from the spinner and default to inline-block.
      $('#loader').removeClass('hidden')
    },
    success: function (data, textStatus, request) {
      show_alert('送出成功，系統將自動跳轉');
      setTimeout(function () {
        window.location.href = 'index.html';
      }, 3000);
    },
    complete: function () { // Set our complete callback, adding the .hidden class and hiding the spinner.
      $('#loader').addClass('hidden');
    },
    error: function (xhr, thrownError) {
      var where = 'applyList';
      ajax_error(xhr, thrownError, where);
    }
  })
}
