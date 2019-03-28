function LogOnUser() {
    var username = $("#signin_username").val();
    var pass = $("#signin_password").val();
    LogOn(username, pass);
}

function LogOn(username, pass) {

    var webMethod = "../WebServices.asmx/LogOn";
    var parameters = "{\"username\":\"" + encodeURI(username) + "\",\"pass\":\"" + encodeURI(pass) + "\"}";
    $.ajax({
        type: "POST",
        url: webMethod,
        data: parameters,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (msg) {
            if (msg.d) {
                sessionStorage.setItem("username", username);
                console.log('Username:'+sessionStorage.getItem("username"));
                alert("yay!");                
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