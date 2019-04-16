var progressCount = 0;
var questions;
var questionIds;

//window.addEventListener("unload", function (event) {
//    window.sessionStorage.surveyName = undefined;
//    window.sessionStorage.surveyId = undefined;
//});

function Initialize() {
    console.log('finished loading');
    document.getElementById('username').innerHTML = sessionStorage.getItem("username");
    document.getElementById('surveyTitle').innerHTML = sessionStorage.getItem("surveyName");
    LoadSurvey();
}

function LoadSurvey() {
    var survId = sessionStorage.getItem("surveyId")
    var webMethod = "../WebServices.asmx/LoadSurvey";
    var parameters = "{\"surveyId\":\"" + encodeURI(survId) + "\"}";
    $.ajax({
        type: "POST",
        url: webMethod,
        data: parameters,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (msg) {
            console.log(msg.d);
            if (msg.d != null) {
                questionsJson = msg.d;
                questions = questionsJson.questions;
                questionIds = questionsJson.questionIds;
                genDivs();
            }
        },
        error: function (e) {
            console.log("boo...");
        }
    });
}

function NextQuestion() {
    if (progressCount < 9) {
        //id of the current question/next question
        currentId = 'div' + questionIds[progressCount];
        nextId =    'div' + questionIds[progressCount+1];
        
        SwitchVisibilty(currentId);
        SwitchVisibilty(nextId);

        //incriment progress bar, count, question number
        document.getElementById(progressCount).style.background = 'black';
        progressCount++;
        document.getElementById("questionNumber").innerHTML = progressCount+1;
    }
    else {
        document.getElementById(10).style.background = 'black';
    }
    if (progressCount > 0) 
        document.getElementById('backBtn').disabled = false;    
    else
        document.getElementById('backBtn').disabled = true;

    console.log('progress count: '+progressCount);
    if (progressCount == 9) {
        document.getElementById('nextBtn').disabled = true;
        document.getElementById('skipBtn').disabled = true;
        document.getElementById('submitBtn').disabled = false;
        SwitchVisibilty('nextBtn');
        SwitchVisibilty('submitBtn');
        //hide next button show submit button
        //eventually will show feedback and rating then it will submit
    }    
}

function PreviousQuestion() {
    if (progressCount > 0) {
        //id of the current question/next question
        currentId = 'div' + questionIds[progressCount]
        prevId =    'div' + questionIds[progressCount-1]

        SwitchVisibilty(currentId);
        SwitchVisibilty(prevId);

        //incriment progress bar, count, question number
        document.getElementById(progressCount).style.background = '#BBBBBB';
        progressCount--;
        document.getElementById("questionNumber").innerHTML = progressCount + 1;
    }
    else {
        return;
    }
    if (progressCount <= 0)
        document.getElementById('backBtn').disabled = true; 
    console.log('progress count: ' + progressCount);
    if (progressCount == 9) {
        document.getElementById('nextBtn').disabled = true;
        document.getElementById('submitBtn').disabled = false;
        SwitchVisibilty('nextBtn');
        SwitchVisibilty('submitBtn');
    }
    else {
        document.getElementById('nextBtn').disabled = false;
        document.getElementById('skipBtn').disabled = false;
        document.getElementById('submitBtn').disabled = true;
        document.getElementById('nextBtn').style.display = '';
        document.getElementById('submitBtn').style.display = 'none';
    }
}

function SwitchVisibilty(id) {
    if (document.getElementById(id).style.display == 'none')
        document.getElementById(id).style.display = '';
    else
        document.getElementById(id).style.display = 'none';
}

function SubmitSurvey(btn) {
    console.log('submitting...');
    var answerArray = [];
    var divArray = document.getElementById('questionsContainerId').children;
    for (var i = 0; i < divArray.length; i++) {
        var childArray = divArray[i].lastChild.children;
        var answerAdded = false;
        for (var j = 0; j < childArray.length; j++) {
            var input = childArray[j].children[0];
            if (input.checked) {
                str = input.id.toString();
                str = str.slice(7, 8);
                answerArray.push(str);
                answerAdded = true;
            }
        }
        if (!answerAdded) {
            answerArray.push('-1');
        }
    }
    console.log(answerArray);

    var transmissionAnswerArray = answerArray[0];
    var transmissionQuestionArray = questionIds[0];

    //function Answer(qId, aId) {
    //    this.questionID = qId;
    //    this.answerID = aId;
    //}

    for (var i = 1; i < answerArray.length; i++) {
        //tempAnswer = new Answer(questionIds[i],answerArray[i])

        //transmissionArray.push(tempAnswer);
        transmissionAnswerArray = transmissionAnswerArray +',' +answerArray[i];
        transmissionQuestionArray = transmissionQuestionArray +',' +questionIds[i];
    }
    console.log(transmissionAnswerArray);
    console.log(transmissionQuestionArray);
    btn.disabled = true;

    //you would probably want to bring up the  reflectionBox here? make sure the function below runs though.... <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
    SendSurvey(transmissionAnswerArray, transmissionQuestionArray);

    document.getElementById('id02').style.display='none';
    window.location.href='home.html';
    hideID("reflectionBox");
    document.getElementById("textBox").value="";
}

function SendSurvey(transmissionAnswerArray, transmissionQuestionArray) {
    var survId = sessionStorage.getItem("surveyId")
    var webMethod = "../WebServices.asmx/StoreAnswers";
    var parameters = "{\"surveyId\":\"" + encodeURI(survId) + "\",\"answerIdarrayURL\":\"" + encodeURI(transmissionAnswerArray) + "\",\"questionIdarrayURL\":\"" + encodeURI(transmissionQuestionArray) + "\"}";
    $.ajax({
        type: "POST",
        url: webMethod,
        data: parameters,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (msg) {
            console.log(msg.d);
            if (msg.d) {
                console.log('Sent');
                MarkDone();
            }
            else
                console.log('Did not work');
        },
        error: function (e) {
            console.log("boo...");
        }
    });
}

function MarkDone() {
    var survId = sessionStorage.getItem("surveyId")
    var webMethod = "../WebServices.asmx/MarkSurveyComplete";
    var parameters = "{\"surveyId\":\"" + encodeURI(survId) + "\"}";
    $.ajax({
        type: "POST",
        url: webMethod,
        data: parameters,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (msg) {
            console.log(msg.d);
            if (msg.d) {
                console.log('marked complete');
                window.open("../html/home.html", "_self");
            }
            else
                console.log('oof, not marked');
        },
        error: function (e) {
            console.log("boo...");
        }
    });
}

//things should be an array of questions
function genDivs() {
    for (var i = 0; i < questions.length; i++) {
        var tempDiv = document.createElement('div');
        var tempH1 = document.createElement('h1');
        tempDiv.id = 'div' + questionIds[i];
        //tempDiv.id = 'questionDiv'+i;
        if (i > 0)
            tempDiv.style.display = 'none';
        tempH1.innerHTML = questions[i];
        tempH1.className = 'w3-border-bottom';
        tempDiv.appendChild(tempH1);


        var tempForm = document.createElement('form');
        tempForm.id = 'form' + i;

        var answersArray = ['Awesome!', 'Pretty Good', 'Not the Best', 'Bad'];

        for (var j = 0; j < 4; j++) {
            var tempInput = document.createElement('input');
            tempInput.id = i+'answer' + j;
            tempInput.type = 'radio';
            tempInput.name = 'radio' + i;
            //tempInput.onclick = function () { MarkAnswer(this.id); }
            var tempSpan = document.createElement('span');
            tempSpan.className = 'checkmark'

            var tempLabel = document.createElement('label');
            tempLabel.setAttribute('for', tempInput.id);
            tempLabel.innerHTML = answersArray[j];
            tempLabel.className = 'container w3-hover-grey w3-round'

            tempLabel.appendChild(tempInput);
            tempLabel.appendChild(tempSpan);
            tempForm.appendChild(tempLabel);            
        }
        tempDiv.appendChild(tempForm);
        //tempDiv.style.display = 'none';

        document.getElementById('questionsContainerId').appendChild(tempDiv);
    }
    //document.getElementById('questionDiv0').style.display = '';
}




