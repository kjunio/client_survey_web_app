function SurveyNumberStorage(id) {
    var surveyid = id.slice(-1);
    sessionStorage.setItem("surveyid", surveyid);
    console.log(sessionStorage.getItem("surveyid"));
}