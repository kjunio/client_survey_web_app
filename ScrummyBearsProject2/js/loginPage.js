function LogOnUser() {
    var id = $("#signin_username").val();
    var pwd = $("#signin_password").val();

    LogOn(id, pwd);
}

function LogOn(userId, pass) {

    var webMethod = "WebServices.asmx/LogOn";
    var parameters = "{\"uid\":\"" + encodeURI(userId) + "\",\"pass\":\"" + encodeURI(pass) + "\"}";
    $.ajax({
        type: "POST",
        url: webMethod,
        data: parameters,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (msg) {
            if (msg.d) {
                window.open("../html/home.html","_self");
            }
            else {
                alert("Your username or password is incorrect. Please try logging in again!");
            }
        },
        error: function (e) {
            alert("Error");
        }
    });
}