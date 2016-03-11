
$(document).ready(function() {
    $("#loginFailedAlert").hide();
});

// var signupButton = document.getElementById("signupButton");
// signupButton.onclick = function() {
//     window.location = "./signup";
// };

var loginButton = document.getElementById("loginButton");
loginButton.onclick = function() {

    var compareVisited = 'compareVisited:0;';
    var graphVisited = 'graphVisited=0;';
    // Post data to JSON
    $.ajax({
        type: 'POST',
        url: '/user/login',
        data: {
            "email": $("#email").val(),
            "password": $("#password").val()
            //"cookie": document.cookie
        },
        success: function() {
            document.cookie =
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
};