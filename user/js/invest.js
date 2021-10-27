$('.ui.rating')
  .rating({
    maxRating: 5
  })
  ;
var dateToday = new Date();
var merge_enddate = ''
window.onload = function () {
  today = (dateToday.getFullYear() + '-' + (dateToday.getMonth() + 1) + '-' + dateToday.getDate())
  roomstateId = localStorage.getItem('roomstateId')

  // document.getElementById("first2").style.visibility = "visible";
  // 取得toekn

  fetch(API_url + '/v1/api/checkout-applications/' + roomstateId + '/investigation/isExisted', {
    method: 'GET',
    headers: new Headers({
      'Content-Type': 'application/json',
      'x-eden-token': localStorage.getItem('token')
    })
  }).then(response => {
    return response.json()
    //return response.text()
  }).then(myJson => {
    if (myJson.existed == true) {
      show_alert('你已經填過問卷了');
      setTimeout(function () {
        window.location.href = 'index.html';
      }, 3000);
    }
    else {
      document.getElementById("form1").style.display = "inline-block";
    }
  });
}

function finish() {

  var arr = [];
  for (var i = 1; i <= 12; i++) {
    var score = $('#rank' + i).rating('get rating');
    arr.push(score);
  }

  var Jsonarr =
  {
    "serviceEfficiency": arr[0],
    "serviceAttitude": arr[1],
    "serviceQuality": arr[2],
    "equipmentFurniture": arr[3],
    "equipmentElectricDevice": arr[4],
    "equipmentAssistive": arr[5],
    "equipmentBedding": arr[6],
    "equipmentBarrierFreeEnvironment": arr[7],
    "environmentClean": arr[8],
    "environmentComfort": arr[9],
    "safetyFirefighting": arr[10],
    "safetySecomEmergencySystem": arr[11]
  }

  fetch(API_url + '/v1/api/checkout-applications/' + roomstateId + '/investigation', {
    method: 'POST', // or 'PUT'
    body: JSON.stringify(Jsonarr), // data can be `string` or {object}!
    headers: new Headers({
      'Content-Type': 'application/json',
      'x-eden-token': localStorage.getItem('token')
    })
  }).then(response => {
    console.log('Success:', response)
    show_alert('已成功送出')
    location.href = './index.html';
  });
}


