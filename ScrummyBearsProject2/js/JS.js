var count = 1;
var progCount=0; 
var progTotal = 9;

document.getElementById(count).style.background='black';
document.getElementById("questionNumber").innerHTML=" "+count;

function move() {
  var elem = document.getElementById("myBar");   

  progCount+=1
  var width= Math.round((progCount/progTotal)*100);

  if (progCount<progTotal+1){ 
    elem.style.width = width + '%';
    elem.innerHTML = progCount + "/9";
    }
}

// Script for side navigation
function w3_open() {
  var x = document.getElementById("mySidebar");
  x.style.width = "300px";
  x.style.paddingTop = "10%";
  x.style.display = "block";
}

// Close side navigation
function w3_close() {
  document.getElementById("mySidebar").style.display = "none";
}

// Used to toggle the menu on smaller screens when clicking on the menu button
function openNav() {
  var x = document.getElementById("navDemo");
  if (x.className.indexOf("w3-show") === -1) {
    x.className += " w3-show";
  } else { 
    x.className = x.className.replace(" w3-show", "");
  }
}

function clearText()
{
  document.getElementById("textBox").value="";
}

function anonymouseBox()
{
  if (document.getElementById("textBox").value==="") {
    showID("warningDisplay")
    hideID("feedbackForm");
  }
  else{
    document.getElementById('id01').style.display='block'
  }
}

//function surveySubmitClick(){
//  document.getElementById('id02').style.display='none';
//  window.location.href='home.html';
//  hideID("reflectionBox");
//  document.getElementById("textBox").value="";
//}

function hideID(id){
  document.getElementById(id).style.display='none'
}

function showID(id){
  document.getElementById(id).style.display='block'
}

function feedbackClick(){
  showID("feedbackForm");
  hideID("feedbackSelection");
}

function submitClick(){
  document.getElementById('id01').style.display='none';
  showID("feedbackSelection");
  hideID("feedbackForm");
  document.getElementById("textBox").value="";
}

function warningClick(){
  hideID("warningDisplay");
  showID("feedbackForm");
}


function nextClick(){
  count+=1;
  var questionList= ["Are you good at coding?", "What do you think about CIS", "Can your dog code", "What code is best", 
  "What bear is best", "Are you a dwight fan", "What is better office or parks and wreck", "What is the best pizza", "Does pinapple go on pizza"]
  if (count<11){
  document.getElementById(count).style.background='black';
  document.getElementById("questionNumber").innerHTML=" " + count;
  document.getElementById("surveyQuestion").innerHTML=" " + questionList[count-2];
  }

  else{
    for (var i = count-1; i > 0; i--) {
      document.getElementById('id02').style.display='block'
      document.getElementById(i).style.background='grey';
      document.getElementById("surveyQuestion").innerHTML="How is my Coding?";

    }
    count=1;
    document.getElementById(count).style.background='black';
    document.getElementById("questionNumber").innerHTML=" "+count;
  }



}
