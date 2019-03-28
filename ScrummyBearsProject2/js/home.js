function SurveyNumberStorage(id) {
    var surveyid = id.slice(-1);
    sessionStorage.setItem("surveyid", surveyid);
    console.log(sessionStorage.getItem("surveyid"));
}
function Initialize() {
    document.getElementById('username').innerHTML = sessionStorage.getItem("username");
}