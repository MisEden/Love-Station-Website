var currentTab = "checkin";
var today = new Date();
var todayDate = today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate();

var path = window.location.pathname;
var where = path.split("/").pop().split(".")[0];

var countApply_checkin;
var countApply_file;
var countApply_change;
var count_unassigned;
var count_service_landlord;
var count_service_volunteer;
var count_service_firmEmployee;


window.onload = function() {
    if (!isError) { getApply_ChackinApplication(); } else { process.exit(); }

    if (!isError) { getApply_ChackinApplicationImage(); } else { process.exit(); }

    if (!isError) { getApply_ChangeApply(); } else { process.exit(); }

    if (!isError) { getUnassignedRoster(); } else { process.exit(); }

    if (!isError) { getTodayList(); } else { process.exit(); }

    if (!isError) { getNonViewService(); } else { process.exit(); }


    for (var i = 0; i < 1; i++) {
        setTimeout(function() {
            if (countApply_checkin !== undefined && countApply_file !== undefined && countApply_change !== undefined && count_unassigned !== undefined && count_service_landlord != undefined && count_service_volunteer != undefined && count_service_firmEmployee != undefined) {
                if (!isError) { getAlertMessage(); } else { return; }
            } else {
                i--;
            }
        }, 1000);
    }



}

function changeTab(tabName) {
    currentTab = tabName;
    if (tabName == "checkin") {
        document.getElementById("navItem_checkin").classList.add("btn");
        document.getElementById("navItem_checkin").classList.add("btn-primary");
        document.getElementById("navItem_checkin").classList.add("text-white");
        document.getElementById("navItem_checkout").classList.remove("btn");
        document.getElementById("navItem_checkout").classList.remove("btn-primary");
        document.getElementById("navItem_checkout").classList.remove("text-white");
    } else if (tabName == "checkout") {
        document.getElementById("navItem_checkin").classList.remove("btn");
        document.getElementById("navItem_checkin").classList.remove("btn-primary");
        document.getElementById("navItem_checkin").classList.remove("text-white");
        document.getElementById("navItem_checkout").classList.add("btn");
        document.getElementById("navItem_checkout").classList.add("btn-primary");
        document.getElementById("navItem_checkout").classList.add("text-white");
    }

    getTodayList();
}

function getApply_ChackinApplication() {
    var table1 = document.getElementById("table_apply_checkinApplication").getElementsByTagName('tbody')[0];

    // ???????????????????????????????????????
    fetch(API_url + '/v1/api/admins/index/checkin-applications/detail?stage=first&currentPage=0', {
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
                isError = true;
                process.exit();
            }
        }).then((jsonData) => {
            var totalPage = jsonData.totalPage;

            if (totalPage > 0) {

                for (var i = 0; i < jsonData.checkinApplications.length; i++) {
                    var row = table1.insertRow(0);
                    var cell1 = row.insertCell(0);
                    var cell2 = row.insertCell(1);
                    var cell3 = row.insertCell(2);
                    var cell4 = row.insertCell(3);



                    cell1.innerHTML = "<a href='check_apply.html?id=" + jsonData.checkinApplications[i].id + "'>" + (jsonData.checkinApplications[i].id).substring(0, 16) + "...</a>"
                    cell2.innerHTML = jsonData.checkinApplications[i].referralDate
                    cell3.innerHTML = jsonData.checkinApplications[i].referralHospitalChineseName;
                    cell4.innerHTML = jsonData.checkinApplications[i].referralEmployeeName + jsonData.checkinApplications[i].referralTitleName;

                }

                if (totalPage > 1) {
                    var row_more = table1.insertRow();
                    var cell_more = row_more.insertCell(0);
                    cell_more.innerHTML = "<a class=\"mr-3\" href=\"review_checkin.html?currentPage=0\">??????????????????...</a>";
                    cell_more.colSpan = 4;
                    cell_more.classList.add("px-3");
                    cell_more.classList.add("text-lg-right");
                    cell_more.classList.add("text-md-center");
                    cell_more.classList.add("text-left");

                    countApply_checkin = 6;
                } else {
                    countApply_checkin = jsonData.checkinApplications.length;
                }

            } else {
                var row = table1.insertRow(0);
                var cell1 = row.insertCell(0);
                cell1.innerHTML = "??????????????????????????????";
                cell1.colSpan = 5;
                cell1.classList.add("text-center");

                countApply_checkin = 0;
            }

        }).catch((err) => {
            console.log('??????:', err);
        });

}

function getApply_ChackinApplicationImage() {

    var table2 = document.getElementById("table_apply_chackinApplicationImage").getElementsByTagName('tbody')[0];

    // ?????????????????????????????????
    fetch(API_url + '/v1/api/admins/index/checkin-applications/detail?stage=second&currentPage=0', {
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
                isError = true;
            }
        }).then((jsonData) => {

            var totalPage = jsonData.totalPage;

            if (totalPage > 0) {

                for (var i = 0; i < jsonData.checkinApplications.length; i++) {
                    var row = table2.insertRow(0);
                    var cell1 = row.insertCell(0);
                    var cell2 = row.insertCell(1);
                    var cell3 = row.insertCell(2);
                    var cell4 = row.insertCell(3);
                    var cell5 = row.insertCell(4);

                    cell1.innerHTML = "<a href='check_file.html?id=" + jsonData.checkinApplications[i].id + "'>" + (jsonData.checkinApplications[i].id).substring(0, 16) + "...</a>";
                    cell2.innerHTML = jsonData.checkinApplications[i].userName;
                    cell3.innerHTML = jsonData.checkinApplications[i].referralDate
                    cell4.innerHTML = jsonData.checkinApplications[i].referralHospitalChineseName;
                    cell5.innerHTML = jsonData.checkinApplications[i].referralEmployeeName + jsonData.checkinApplications[i].referralTitleName;

                }

                if (totalPage > 1) {
                    var row_more = table2.insertRow();
                    var cell_more = row_more.insertCell(0);
                    cell_more.innerHTML = "<a class=\"mr-3\" href=\"review_file.html?currentPage=0\">??????????????????...</a>";
                    cell_more.colSpan = 5;
                    cell_more.classList.add("px-3");
                    cell_more.classList.add("text-lg-right");
                    cell_more.classList.add("text-md-center");
                    cell_more.classList.add("text-left");

                    countApply_file = 6;
                } else {
                    countApply_file = jsonData.checkinApplications.length;
                }

            } else {
                var row = table2.insertRow(0);
                var cell1 = row.insertCell(0);
                cell1.innerHTML = "??????????????????????????????";
                cell1.colSpan = 5;
                cell1.classList.add("text-center");

                countApply_file = 0;
            }

        }).catch((err) => {
            console.log('??????:', err);
        });
}

function getApply_ChangeApply() {

    var table = document.getElementById("table_apply_changeApply").getElementsByTagName('tbody')[0];

    // ?????????????????????????????????
    fetch(API_url + '/v1/api/admins/checkin-applications/room-states/change?currentPage=0', {
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
                isError = true;
            }
        }).then((jsonData) => {

            var totalPage = jsonData.totalPage;

            if (totalPage > 0) {

                for (var i = 0; i < jsonData.checkinApplicationWithRoomStateChangeDetails.length; i++) {
                    var row = table.insertRow(0);
                    var cell_id = row.insertCell(0);
                    var cell_date = row.insertCell(1);
                    var cell_referral = row.insertCell(2);
                    var cell_referralEmployee = row.insertCell(3);

                    cell_id.innerHTML = "<a id='in' target='_blank' href='check_change.html?id=" + jsonData.checkinApplicationWithRoomStateChangeDetails[i].checkinAppId + "'>" + jsonData.checkinApplicationWithRoomStateChangeDetails[i].checkinAppId + "</a>";
                    cell_date.innerHTML = jsonData.checkinApplicationWithRoomStateChangeDetails[i].roomStateChangeDate;
                    cell_referral.innerHTML = jsonData.checkinApplicationWithRoomStateChangeDetails[i].referralName;
                    cell_referralEmployee.innerHTML = jsonData.checkinApplicationWithRoomStateChangeDetails[i].referralEmployeeName;

                }

                if (totalPage > 1) {
                    var row_more = table.insertRow();
                    var cell_more = row_more.insertCell(0);
                    cell_more.innerHTML = "<a class=\"mr-3\" href=\"review_change.html?currentPage=0\">??????????????????...</a>";
                    cell_more.colSpan = 5;
                    cell_more.classList.add("px-3");
                    cell_more.classList.add("text-lg-right");
                    cell_more.classList.add("text-md-center");
                    cell_more.classList.add("text-left");

                    countApply_change = 6;
                } else {
                    countApply_change = jsonData.checkinApplicationWithRoomStateChangeDetails.length;
                }

            } else {
                var row = table.insertRow(0);
                var cell1 = row.insertCell(0);
                cell1.innerHTML = "??????????????????????????????";
                cell1.colSpan = 5;
                cell1.classList.add("text-center");

                countApply_change = 0;
            }

        }).catch((err) => {
            console.log('??????:', err);
        });
}

function getAlertMessage() {
    var alertBlock = document.getElementById("alert_main");
    var alert_title = alertBlock.getElementsByTagName('h4')[0];
    var alert_content = alertBlock.getElementsByTagName('span')[0];
    var alert_content_unassigned = alertBlock.getElementsByTagName('span')[1];
    var alert_content_service = alertBlock.getElementsByTagName('span')[2];


    if (countApply_checkin == 0 && countApply_file == 0 && countApply_change == 0 && count_unassigned == 0 && count_service_landlord == 0 && count_service_volunteer == 0 && count_service_firmEmployee == 0) {
        alertBlock.classList.add("alert-info");
        alert_title.innerHTML = "<i class=\"fas fa-info-circle\"></i> ????????????";
        alert_content.innerHTML = "?????? <strong>?????????????????????</strong>";
    } else {
        alertBlock.classList.add("alert-warning");
        alert_title.innerHTML = "<i class=\"fas fa-exclamation-triangle\"></i> ????????????";



        if (countApply_checkin != 0 || countApply_file != 0 || countApply_change != 0) {
            alert_content.innerHTML = "???????????????";

            if (countApply_checkin > 5) {
                alert_content.innerHTML += "<strong> 5+ ???</strong>????????????????????????";
            } else {
                alert_content.innerHTML += "<strong> " + countApply_checkin + " ???</strong>????????????????????????";
            }

            if (countApply_file > 5) {
                alert_content.innerHTML += "<strong> 5+ ???</strong>???????????????????????????";
            } else {
                alert_content.innerHTML += "<strong> " + countApply_file + " ???</strong>???????????????????????????";
            }

            if (countApply_change > 5) {
                alert_content.innerHTML += "<strong> 5+ ???</strong>?????????????????????";
            } else {
                alert_content.innerHTML += "<strong> " + countApply_change + " ???</strong>?????????????????????";
            }

            alert_content.innerHTML += "?????????<br/>";
        } else {
            alert_content.style.display = "none";
        }


        if (count_unassigned != 0) {
            alert_content_unassigned.innerHTML = "???????????????";

            if (count_unassigned > 5) {
                alert_content_unassigned.innerHTML += "<strong> 5+ ???</strong>??????????????????????????????<br/>";
            } else {
                alert_content_unassigned.innerHTML += "<strong> " + count_unassigned + " ???</strong>??????????????????????????????<br/>";
            }
        } else {
            alert_content_unassigned.style.display = "none";
        }


        if (count_service_landlord != 0 || count_service_volunteer != 0 || count_service_firmEmployee != 0) {
            alert_content_service.innerHTML = "???????????????";

            if (count_service_landlord > 5) {
                alert_content_service.innerHTML += "<strong> 5+ ???</strong>?????????????????????";
            } else {
                alert_content_service.innerHTML += "<strong> " + count_service_landlord + " ???</strong>?????????????????????";
            }

            if (count_service_volunteer > 5) {
                alert_content_service.innerHTML += "<strong> 5+ ???</strong>?????????????????????";
            } else {
                alert_content_service.innerHTML += "<strong> " + count_service_volunteer + " ???</strong>?????????????????????";
            }

            if (count_service_firmEmployee > 5) {
                alert_content_service.innerHTML += "<strong> 5+ ???</strong>??????????????????";
            } else {
                alert_content_service.innerHTML += "<strong> " + count_service_firmEmployee + " ???</strong>??????????????????";
            }
            alert_content_service.innerHTML += "?????????<br/>";
        } else {
            alert_content_service.style.display = "none";
        }
    }

    alertBlock.style.display = "";
}

function getUnassignedRoster() {
    var table = document.getElementById("table_apply_chackinApplicationAssign").getElementsByTagName('tbody')[0];

    // ????????????????????????????????????
    fetch(API_url + '/v1/api/admins/checkin-applications/volunteer-date/firm-employee-date?yearAndMonth=' + today.getFullYear() + "-" + (today.getMonth() + 1) + '&currentPage=0', {
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
                isError = true;
            }
        }).then((jsonData) => {
            var totalPage = jsonData.totalPage;

            if (totalPage > 0) {

                for (var i = 0; i < jsonData.checkinApplicationBriefs.length; i++) {

                    var row = table.insertRow(0);
                    var cell_id = row.insertCell(0);
                    var cell_house = row.insertCell(1);
                    var cell_room = row.insertCell(2);
                    var cell_date = row.insertCell(3);
                    var cell_user = row.insertCell(4);
                    var cell_edit = row.insertCell(5);

                    cell_id.innerHTML = (jsonData.checkinApplicationBriefs[i].checkinAppId).substring(0, 16) + "...</a>";
                    cell_house.innerHTML = jsonData.checkinApplicationBriefs[i].house;
                    cell_room.innerHTML = jsonData.checkinApplicationBriefs[i].roomNumber;
                    cell_date.innerHTML = jsonData.checkinApplicationBriefs[i].createdAt
                    cell_user.innerHTML = jsonData.checkinApplicationBriefs[i].chineseName;
                    cell_edit.innerHTML = "<a target=\"_blank\" href=\"assign_service.html?id=" + jsonData.checkinApplicationBriefs[i].checkinAppId + "\">????????????</a>";

                }

                if (totalPage > 1) {
                    var row_more = table.insertRow();
                    var cell_more = row_more.insertCell(0);
                    cell_more.innerHTML = "<a class=\"mr-3\" href=\"review_unassigned.html?currentPage=0\">??????????????????...</a>";
                    cell_more.colSpan = 5;
                    cell_more.classList.add("px-3");
                    cell_more.classList.add("text-lg-right");
                    cell_more.classList.add("text-md-center");
                    cell_more.classList.add("text-left");

                    count_unassigned = 6;
                } else {
                    count_unassigned = jsonData.checkinApplicationBriefs.length;
                }

            } else {
                var row = table.insertRow(0);
                var cell1 = row.insertCell(0);
                cell1.innerHTML = "??????????????????????????????";
                cell1.colSpan = 6;
                cell1.classList.add("text-center");
            }

        }).catch((err) => {
            console.log('??????:', err);
        });

}

function getTodayList() {
    if (currentTab === "checkin") {
        getTodayList_checkIn();
    } else {
        getTodayList_checkOut()
    }
}

function getTodayList_checkIn() {
    var table = document.getElementById("table_TodayList").getElementsByTagName('tbody')[0];
    table.innerHTML = "";

    // ????????????????????????
    fetch(API_url + '/v1/api/admins/index/scheduled-checkin/' + todayDate, {
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
                isError = true;
            }
        }).then((jsonData) => {

            var totalPage = jsonData.totalPage;

            if (totalPage > 0) {

                for (var i = 0; i < jsonData.infoAdminNeeds.length; i++) {
                    var row = table.insertRow(0);
                    var cell_house = row.insertCell();
                    var cell_checkinDate = row.insertCell();
                    var cell_checkoutDate = row.insertCell();
                    var cell_applyName = row.insertCell();
                    var cell_applyPhone = row.insertCell();
                    var cell_carer = row.insertCell();
                    var cell_finishDate = row.insertCell();
                    var cell_alert_message = row.insertCell();
                    var cell_alert = row.insertCell();

                    cell_house.innerHTML = jsonData.infoAdminNeeds[i].house;
                    cell_checkinDate.innerHTML = jsonData.infoAdminNeeds[i].startDate;
                    cell_checkoutDate.innerHTML = jsonData.infoAdminNeeds[i].endDate;
                    cell_applyName.innerHTML = jsonData.infoAdminNeeds[i].chineseName;
                    cell_applyPhone.innerHTML = jsonData.infoAdminNeeds[i].cellphone;
                    cell_carer.innerHTML = jsonData.infoAdminNeeds[i].caregiverName;

                    if (jsonData.infoAdminNeeds[i].notificationDate == null) {
                        cell_alert_message.innerHTML = "????????????";
                    } else {
                        cell_alert_message.innerHTML = jsonData.infoAdminNeeds[i].notificationDate;
                    }

                    // judgeTime
                    var now_hour = new Date().getHours();
                    var dataDate = new Date(jsonData.infoAdminNeeds[i].checkinActualTime);
                    var data_hour = dataDate.getHours();

                    var isOvertime = !(now_hour < 15);
                    var isNull = (jsonData.infoAdminNeeds[i].checkinActualTime == null);

                    if (isNull) {
                        if (isOvertime) {
                            // ??????????????????
                            cell_finishDate.classList.add("text-danger");
                            cell_finishDate.innerHTML = "????????????";
                        } else {
                            // ?????????????????????
                            cell_finishDate.innerHTML = "????????????";
                        }

                        // ????????? -> ?????????
                        if (adminAuthority === "admin_readonly") {
                            cell_alert.innerHTML = "<input type=\"button\" class=\"btn btn-info disabled\" value=\"????????????\" id=\"notification-btn\" onclick=\"return false;\" disabled>";
                        } else {
                            cell_alert.innerHTML = "<input type=\"button\" class=\"btn btn-info disabled\" value=\"??????????????????\" id=\"notification-btn\" onclick=\"return false;\" disabled>";
                        }
                    } else {
                        if (data_hour >= 15) {
                            // ??????????????????
                            cell_finishDate.classList.add("text-danger");
                            cell_finishDate.innerHTML = jsonData.infoAdminNeeds[i].checkinActualTime;
                        } else {
                            // ?????????????????????
                            cell_finishDate.innerHTML = jsonData.infoAdminNeeds[i].checkinActualTime;
                        }

                        // ????????? -> ????????????
                        if (adminAuthority === "admin_readonly") {
                            cell_alert.innerHTML = "<input type=\"button\" class=\"btn btn-info disabled\" value=\"????????????\" id=\"notification-btn\" onclick=\"return false;\" disabled>";
                        } else {
                            cell_alert.innerHTML = "<input type=\"button\" class=\"btn btn-info\" value=\"??????\" id=\"notification-btn\" onclick=\"sendNotification('finish-checkin', '" + jsonData.infoAdminNeeds[i].checkinAppId + "')\">";
                        }
                    }




                }

                if (totalPage > 1) {
                    var row_more = table.insertRow();
                    var cell_more = row_more.insertCell(0);
                    cell_more.innerHTML = "<a class=\"mr-3\" href=\"review_today.html?currentTab=checkin&currentPage=0\">??????????????????...</a>";
                    cell_more.colSpan = 9;
                    cell_more.classList.add("px-3");
                    cell_more.classList.add("text-lg-right");
                    cell_more.classList.add("text-md-center");
                    cell_more.classList.add("text-left");
                }

            } else {
                var row = table.insertRow(0);
                var cell1 = row.insertCell(0);
                cell1.innerHTML = "??????????????????????????????";
                cell1.colSpan = 9;
                cell1.classList.add("text-center");
            }

        }).catch((err) => {
            console.log('??????:', err);
        });
}

function getTodayList_checkOut() {
    var table = document.getElementById("table_TodayList").getElementsByTagName('tbody')[0];
    table.innerHTML = "";

    // ????????????????????????
    fetch(API_url + '/v1/api/admins/index/scheduled-checkout/' + todayDate, {
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
                isError = true;
            }
        }).then((jsonData) => {

            var totalPage = jsonData.totalPage;

            if (totalPage > 0) {

                for (var i = 0; i < jsonData.infoAdminNeeds.length; i++) {
                    var row = table.insertRow(0);
                    var cell_house = row.insertCell();
                    var cell_checkinDate = row.insertCell();
                    var cell_checkoutDate = row.insertCell();
                    var cell_applyName = row.insertCell();
                    var cell_applyPhone = row.insertCell();
                    var cell_carer = row.insertCell();
                    var cell_finishDate = row.insertCell();
                    var cell_alert_message = row.insertCell();
                    var cell_alert = row.insertCell();

                    cell_house.innerHTML = jsonData.infoAdminNeeds[i].house;
                    cell_checkinDate.innerHTML = jsonData.infoAdminNeeds[i].startDate;
                    cell_checkoutDate.innerHTML = jsonData.infoAdminNeeds[i].endDate;
                    cell_applyName.innerHTML = jsonData.infoAdminNeeds[i].chineseName;
                    cell_applyPhone.innerHTML = jsonData.infoAdminNeeds[i].cellphone;
                    cell_carer.innerHTML = jsonData.infoAdminNeeds[i].caregiverName;

                    if (jsonData.infoAdminNeeds[i].notificationDate == null) {
                        cell_alert_message.innerHTML = "????????????";
                    } else {
                        cell_alert_message.innerHTML = jsonData.infoAdminNeeds[i].notificationDate;
                    }


                    // judgeTime
                    var now_hour = new Date().getHours();
                    var dataDate = new Date(jsonData.infoAdminNeeds[i].checkinActualTime);
                    var data_hour = dataDate.getHours();

                    var isOvertime = !(now_hour < 17);
                    var isNull = (jsonData.infoAdminNeeds[i].checkoutActualTime == null);

                    if (isNull) {
                        if (isOvertime) {
                            // ??????????????????
                            cell_finishDate.classList.add("text-danger");
                            cell_finishDate.innerHTML = "????????????";
                        } else {
                            // ?????????????????????
                            cell_finishDate.innerHTML = "????????????";
                        }

                        // ????????? -> ?????????
                        if (adminAuthority === "admin_readonly") {
                            cell_alert.innerHTML = "<input type=\"button\" class=\"btn btn-info disabled\" value=\"????????????\" id=\"notification-btn\" onclick=\"return false;\" disabled>";
                        } else {
                            cell_alert.innerHTML = "<input type=\"button\" class=\"btn btn-info disabled\" value=\"??????????????????\" id=\"notification-btn\" onclick=\"return false;\" disabled>";
                        }
                    } else {
                        if (data_hour >= 17) {
                            // ??????????????????
                            cell_finishDate.classList.add("text-danger");
                            cell_finishDate.innerHTML = jsonData.infoAdminNeeds[i].checkoutActualTime;
                        } else {
                            // ?????????????????????
                            cell_finishDate.innerHTML = jsonData.infoAdminNeeds[i].checkoutActualTime;
                        }

                        // ????????? -> ????????????
                        if (adminAuthority === "admin_readonly") {
                            cell_alert.innerHTML = "<input type=\"button\" class=\"btn btn-info disabled\" value=\"????????????\" id=\"notification-btn\" onclick=\"return false;\" disabled>";
                        } else {
                            cell_alert.innerHTML = "<input type=\"button\" class=\"btn btn-info\" value=\"??????\" id=\"notification-btn\" onclick=\"sendNotification('finish-checkout', '" + jsonData.infoAdminNeeds[i].checkinAppId + "')\">";
                        }
                    }




                }

                if (totalPage > 1) {
                    var row_more = table.insertRow();
                    var cell_more = row_more.insertCell(0);
                    cell_more.innerHTML = "<a class=\"mr-3\" href=\"review_today.html?currentTab=checkout&currentPage=0\">??????????????????...</a>";
                    cell_more.colSpan = 9;
                    cell_more.classList.add("px-3");
                    cell_more.classList.add("text-lg-right");
                    cell_more.classList.add("text-md-center");
                    cell_more.classList.add("text-left");
                }

            } else {
                var row = table.insertRow(0);
                var cell1 = row.insertCell(0);
                cell1.innerHTML = "??????????????????????????????";
                cell1.colSpan = 9;
                cell1.classList.add("text-center");
            }

        }).catch((err) => {
            console.log('??????:', err);
        });
}


function getNonViewService() {
    var table = document.getElementById("table_nonView_service").getElementsByTagName('tbody')[0];

    // ????????????????????????????????????
    fetch(API_url + '/v1/api/admins/index/service/number', {
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
                isError = true;
            }
        }).then((jsonData) => {

            var nonView_landlord = jsonData.landlord;
            var nonView_volunteer = jsonData.volunteer;
            var nonView_firm_employee = jsonData.firm_employee;



            count_service_landlord = parseInt(nonView_landlord);
            count_service_volunteer = parseInt(nonView_volunteer);
            count_service_firmEmployee = parseInt(nonView_firm_employee);

            var row_landlord = table.insertRow();
            var landlordCell_type = row_landlord.insertCell();
            var landlordCell_number = row_landlord.insertCell();
            var landlordCell_edit = row_landlord.insertCell();
            landlordCell_type.innerHTML = "???????????? <small>????????????</small>";
            landlordCell_number.innerHTML = nonView_landlord + " <small>???</small>";
            landlordCell_edit.innerHTML = "<a href=\"view_service.html?currentTab=landlord\">????????????</a>";

            var row_volunteer = table.insertRow();
            var volunteerCell_type = row_volunteer.insertCell();
            var volunteerCell_number = row_volunteer.insertCell();
            var volunteerCell_edit = row_volunteer.insertCell();
            volunteerCell_type.innerHTML = "???????????? <small>????????????</small>";
            volunteerCell_number.innerHTML = nonView_volunteer + " <small>???</small>";
            volunteerCell_edit.innerHTML = "<a href=\"view_service.html?currentTab=volunteer\">????????????</a>";


            var row_firm_employee = table.insertRow();
            var firm_employeeCell_type = row_firm_employee.insertCell();
            var firm_employeeCell_number = row_firm_employee.insertCell();
            var firm_employeeCell_edit = row_firm_employee.insertCell();
            firm_employeeCell_type.innerHTML = "???????????? <small>????????????</small>";
            firm_employeeCell_number.innerHTML = nonView_firm_employee + " <small>???</small>";
            firm_employeeCell_edit.innerHTML = "<a href=\"view_cleaning.html\">????????????</a>";



        }).catch((err) => {
            console.log('??????:', err);
        });

}

//finish-checkin / finish-checkout
function sendNotification(type, checkinApplicationId) {

    var jsonData = {}

    $.ajax({
        headers: {
            'Content-Type': 'application/json',
            'x-eden-token': localStorage.getItem('token')
        },
        url: API_url + '/v1/api/notifications/' + type + "?checkinAppId=" + checkinApplicationId,
        type: 'POST',
        data: JSON.stringify(jsonData),
        error: function(err) {
            alert(err);
            alert("????????????!");
        },
        success: function(data) {
            alert("????????????!");
            getTodayList();
        }
    });
}