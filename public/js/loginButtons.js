
$(document).ready(function() {
    $("#loginFailedAlert").hide();
});

var loginButton = document.getElementById("loginButton");
loginButton.onclick = loginIntoSnooZzz;

$(document).keyup(function(e) {
    if(e.keyCode === 13) {
        if(document.activeElement.id === "email" ||
           document.activeElement.id === "password")
            loginIntoSnooZzz();
    }
});

function loginIntoSnooZzz() {
    var compareVisited = 'compareVisited:0;';
    var graphVisited = 'graphVisited=0;';

    // Post data to JSON
    $.ajax({
        type: 'POST',
        url: '/user/login',
        data: {
            "email": $("#email").val(),
            "password": $("#password").val()
        },
        success: function() {
            document.cookie = compareVisited;
            document.cookie = graphVisited;
            window.location = "./index";
        },
        error: function() {
            $("#loginFailedAlert").fadeIn();
            setTimeout(function() {
                $("#loginFailedAlert").fadeOut();
            }, 4000);
        }
    });
}