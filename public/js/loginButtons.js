
$(document).ready(function() {
    $("#loginFailedAlert").hide();
});

var signupButton = document.getElementById("signupButton");
signupButton.onclick = function() {
    window.location = "./signup";
};

var loginButton = document.getElementById("loginButton");
loginButton.onclick = function() {

    // Post data to JSON
    $.ajax({
        type: 'POST',
        url: 'login',
        data: {
            "email": $("#email").val(),
            "password": $("#password").val()
        },
        success: function() {
            window.location = "./index";
        },
        error: function() {
            $("#loginFailedAlert").fadeIn();
        }
    });
};