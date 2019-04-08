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
                //this clears out the div that will hold our account info
                //clear out the temp data in html
                $("#YYYY").empty();

                
                //for (var i = 0; i < surveysArray.length; i++) {
                //    //we grab on to a specific html element in jQuery
                //    //by using a  # followed by that element's id.
                //    var surv;
                //    if (surveysArray[i].surveyId != null) {
                //        surv = document.createElement("button");
                //        surv.id = surveysArray[i].surveyId;
                //        surv.innerHTML = surveysArray[i].surveyName;
                //        //surv.addEventListener("click", NavToSurvey);
                //        surv.onclick = function () {
                //            console.log('navigating to survey:' + this.id);
                //            sessionStorage.setItem("surveyId", this.id);
                //            window.location.href = 'survey.html';
                //        };
                //        surv.classList.add('w3-button', 'w3-border', 'w3-round', 'w3-green', 'w3-block', 'surveyButton')
                //    }
                //    $("#surveyButtonsDiv").append(
                //        surv
                //    );
                }
            }
        },
        error: function (e) {
            alert("boo...");
        }
    });
}

