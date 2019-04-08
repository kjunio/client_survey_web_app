//function SurveyNumberStorage(id) {
//    var surveyid = id.slice(-1);
//    sessionStorage.setItem("surveyid", surveyid);
//    console.log(sessionStorage.getItem("surveyid"));
//}
function Initialize() {
    document.getElementById('username').innerHTML = sessionStorage.getItem("username");
    GetSurveys();

}

//function NavToSurvey(survey) {
//    console.log('navigating to survey:'+);

//}

//this function grabs accounts and loads our account window
function GetSurveys() {
    var webMethod = "../WebServices.asmx/GetSurveys";
    $.ajax({
        type: "POST",
        url: webMethod,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (msg) {
            console.log(msg.d);
            if (msg.d.length > 0) {
                //let's put our accounts that we get from the
                //server into our surveysArray variable
                //so we can use them in other functions as well
                var surveysArray = msg.d;
                //this clears out the div that will hold our account info
                $("#surveyButtonsDiv").empty();
                //again, we assume we're not an admin unless we see data from the server
                //that we know only admins can see
                for (var i = 0; i < surveysArray.length; i++) {
                    //we grab on to a specific html element in jQuery
                    //by using a  # followed by that element's id.
                    var surv;
                    if (surveysArray[i].surveyId != null) {
                        surv = document.createElement("button");
                        surv.id = surveysArray[i].surveyId;
                        surv.innerHTML = surveysArray[i].surveyName;
                        //surv.addEventListener("click", NavToSurvey);
                        surv.onclick = function () {
                            console.log('navigating to survey:' + this.id);
                            sessionStorage.setItem("surveyId", this.id);
                            sessionStorage.setItem("surveyName", this.surveyName);
                            window.location.href = 'survey.html';
                        };
                        surv.classList.add('w3-button', 'w3-border', 'w3-round', 'w3-green', 'w3-block', 'surveyButton')
                    }
                    $("#surveyButtonsDiv").append(
                        surv
                    );
                }
            }         
        },
        error: function (e) {
            alert("boo...");
        }
    });
}