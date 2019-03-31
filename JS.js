var count = 1;
document.getElementById(count).style.background='black';
document.getElementById("questionNumber").innerHTML=" "+count;

function move() {
  var elem = document.getElementById("myBar");   
  var width = 20;
  var id = setInterval(frame, 10);
  function frame() {
    if (width >= 100) {
      clearInterval(id);
    } else {
      width++; 
      elem.style.width = width + '%'; 
      elem.innerHTML = width * 1  + '%';
    }
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
  if (x.className.indexOf("w3-show") == -1) {
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
  if (document.getElementById("textBox").value=="") {
    showID("warningDisplay")
    hideID("feedbackForm");
  }
  else{
    document.getElementById('id01').style.display='block'
  }
}

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
  
  if (count<11){
  document.getElementById(count).style.background='black';
  document.getElementById("questionNumber").innerHTML=" " + count;
  }

  else{
    for (var i = count-1; i > 0; i--) {
      document.getElementById(i).style.background='grey';
    }
    count=1;
    document.getElementById(count).style.background='black';
    document.getElementById("questionNumber").innerHTML=" "+count;
  }

}
