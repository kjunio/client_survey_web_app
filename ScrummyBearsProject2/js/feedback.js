var feedbackType;

//pulls feedback type, user id, anonymity, text box values, and then posts the results
function submitFeedback() {
    var userid = sessionStorage.getItem("userid");
    var feedbacknum = sessionStorage.getItem("feedbacknum");
    var anonymity = 0;
    var feedbackText = $('#feedbackInput').val();
    var feedbackTags = "";
    if ($('#yesCheck').is(':checked')) {
        anonymity = 1;
    }
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
        
}
//stores type selection, hides type selection, shows input selection
function feedbackTypeClick(id) {
    $('#feedbackForm').show();
    $('#feedbackSelection').hide();
    feedbackType = id;
}
//hides input section, shows feedback type selection
function backClick() {
    $('#feedbackForm').hide();
    $('#feedbackSelection').show();
}

function anonymousBox() {
    if ($("#feedbackInput").val() === "") {
        $("#warningDisplay").show()
        $("#feedbackForm").hide();
    }
    else {
        $('#id01').show();
    }
}

function warningClick() {
    $("#warningDisplay").hide();
    $("#feedbackForm").show;
}