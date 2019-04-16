var feedbackTags;

//pulls feedback type, user id, anonymity, text box values, and then posts the results
function submitFeedback() {
    var userid = sessionStorage.getItem("userid");
    var feedbackType = sessionStorage.getItem("feedbackType");
    var feedbacknum = 0;
    var anonymity = 0;
    var feedbackText = $('#feedbackInput').val();
     
     if ($("#feedbackInput").val() == "") {
        $("#warningDisplay").show();
        $("#feedbackForm").hide();
    }
    
    else {
    if ($('#yesCheck').is(':checked')) {
        anonymity = 1;
    }
    console.log(userid);
    console.log(feedbacknum);
    console.log(feedbackType);
    console.log(feedbackText);
    console.log(feedbackTags);
    console.log(anonymity);
    var webMethod = "../WebServices.asmx/ProvideFeedback";
    var parameters = "{\"userid\":\"" + encodeURI(userid) + "\",\"feedbackNum\":\"" + encodeURI(feedbacknum) + "\",\"feedbackType\":\"" + encodeURI(feedbackType) + "\",\"feedbackText\":\"" + encodeURI(feedbackText) + "\",\"feedbackTags\":\"" + encodeURI(feedbackTags) + "\",\"anonymity\":\"" + encodeURI(anonymity) + "\"}";

    $.ajax({
        type: "POST",
        url: webMethod,
        data: parameters,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (msg) {

                alert("Feedback saved");
        },
        error: function (e) {
            alert("boo...");
        }
    });   

        window.location.href = 'home.html';
    }
        
}
//stores type selection, hides type selection, shows input selection
function feedbackTagClick(id) {
    $('#feedbackForm').show();
    $('#feedbackSelection').hide();
    feedbackTags = id;
}
//hides input section, shows feedback type selection
function backClick() {
    window.location.href = 'home.html';
}

function anonymousBox() {
    if ($("#feedbackInput").val() === "") {
        $("#warningDisplay").show();
        $("#feedbackForm").hide();
    }
    else {
        document.getElementById("feedbackInput").value="";
        $('#id01').show();
    }
}


function clearText(){
    document.getElementById("feedbackInput").value="";
}