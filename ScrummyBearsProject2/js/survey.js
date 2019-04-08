function Initialize() {
    document.getElementById('username').innerHTML = sessionStorage.getItem("username");

}

function LoadSurvey() {
    var webMethod = "../WebServices.asmx/LoadSurvey";
    $.ajax({
        type: "POST",
        url: webMethod,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (msg) {
            console.log(msg.d);
            if (msg.d.length > 0) {
                
                var survey = msg.d;
                
                $("#YYYY").empty();
                for (var i = 0; i < survey.questions/length; i++) {
                    console.log(survey.questions[i])
                }                
            }
        },
        error: function (e) {
            alert("boo...");
        }
    });
}

