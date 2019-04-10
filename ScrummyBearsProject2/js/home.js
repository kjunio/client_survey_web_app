function SurveyNumberStorage(id) {
    var surveyid = id.slice(-1);
    sessionStorage.setItem("surveynum", surveyid);
    console.log(sessionStorage.getItem("surveynum"));
    window.open("../html/survey.html", "_self");
}

function FeedbackNumberStorage() {
    sessionStorage.setItem("feedbackType", 'general');
    console.log(sessionStorage.getItem("feedbackType"));
    window.open("../html/feedback.html", "_self");
}

function Initialize() {
    $('#userName').val() = sessionStorage.getItem("username");
}