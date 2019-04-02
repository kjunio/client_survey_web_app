function SurveyNumberStorage(id) {
    var surveyid = id.slice(-1);
    sessionStorage.setItem("surveynum", surveyid);
    console.log(sessionStorage.getItem("surveynum"));
    window.open("../html/survey.html", "_self");
}

function FeedbackNumberStorage(id) {
    var feedbackid = id.slice(-1);
    sessionStorage.setItem("feedbacknum", feedbackid);
    console.log(sessionStorage.getItem("feedbacknum"));
    window.open("../html/feedback.html", "_self");
}

function Initialize() {
    document.getElementById('username').innerHTML = sessionStorage.getItem("username");
}