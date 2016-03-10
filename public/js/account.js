var updateEmailButton = document.getElementById("updateEmail");
var updatePasswordButton = document.getElementById("updatePassword");

updateEmailButton.onclick = function() {

    // boolean variables
    var eM = 0, nEM = 0, cEM = 0;

    // old email validation
    var oldEmail = $("#email").val();
    if(oldEmail.search(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/i) === -1) {
        $("#emailFieldset").attr("class", "form-group has-error");
        eM = 0;
    } else {
        $("#emailFieldset").attr("class", "form-group");
        eM = 1;
    }

    // new email validation
    var newEmail = $("#newEmail").val();
    if(newEmail.search(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/i) === -1) {
        $("#newEmailFieldset").attr("class", "form-group has-error");
        nEM = 0;
    } else {
        $("#newEmailFieldset").attr("class", "form-group");
        nEM = 1;
    }

    // confirm email validation
    var confirmEmail = $("#confirmEmail").val();
    if(newEmail !== confirmEmail) {
        $("#confirmEmailFieldset").attr("class", "form-group has-error");
        cEM = 0;
    } else {
        $("#confirmEmailFieldset").attr("class", "form-group");
        cEM = 1;
    }

    if(eM && nEM && cEM) {
        console.log("Updating Email");
         //if all checks pass then redirect
        $.ajax({
            type: 'PUT',
            url: '/user/updateEmail',
            data: {
                "currentEmail": oldEmail,
                "newEmail":     newEmail,
                "confirmEmail": confirmEmail
            },
            success: function() {
                $("#email").val(newEmail);
                $("#newEmail").val("");
                $("#confirmEmail").val("");
                alert("Email Updated!");
            }, error: function() {
                alert("Make sure you have filled out all fields pertaining to Email correctly " +
                    "or that the Email doesn't already exist");
            }
        });
    }
};

updatePasswordButton.onclick = function() {

    // boolean variables
    var pW = 0, nPW = 0, cP = 0;

    // old password validation
    var password = $("#password").val();
    if(password.search(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/) === -1) {
        $("#passwordFieldset").attr("class", "form-group has-error");
        console.log("hello");
        pW = 0;
    } else {
        $("#passwordFieldset").attr("class", "form-group");
        pW = 1;
    }

    // new password validation
    var newPassword = $("#newPassword").val();
    if(newPassword.search(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/) === -1) {
        $("#newPasswordFieldset").attr("class", "form-group has-error");
        nPW = 0;
    } else {
        $("#newPasswordFieldset").attr("class", "form-group");
        nPW = 1;
    }

    // confirm password validation
    var confirmPassword = $("#confirmPassword").val();
    if(newPassword !== confirmPassword) {
        $("#confirmPasswordFieldset").attr("class", "form-group has-error");
        cP = 0;
    } else {
        $("#confirmPasswordFieldset").attr("class", "form-group");
        cP = 1;
    }

    if(pW && nPW && cP) {
        console.log("Updating Password");
        // if all checks pass then redirect
        $.ajax({
            type: 'PUT',
            url: '/user/updatePassword',
            data: {
                "currentPassword": password,
                "newPassword": newPassword,
                "confirmPassword": confirmPassword
            },
            success: function() {
                $("#password").val("");
                $("#newPassword").val("");
                $("#confirmPassword").val("");
                alert("Password Updated!");
            }, error: function() {
                alert("Make sure you have filled out all fields pertaining to Passwor correctly ");
            }
        });
    }
};

//************************************************************
//
//************************************************************

$("#yesDeleteAccount").click(function() {
    $.ajax({
        type: 'DELETE',
        url: '/user',
        success: function() {
            // send user to login page
            window.location = './';
        }
    });
});

$(document).ready(function() {
    $.ajax({
        type: 'GET',
        url: '/user',
        success: function(req) {
            var firstName = req.firstName;
            var lastName = req.lastName;
            var email = req.email;

            var headerName = firstName + " " + lastName;
            var fullName = "Hello, " + firstName + " " + lastName;
            // $("#firstName").html(firstName);
            // $("#lastName").html(lastName);
            $("#headerName").html(headerName);
            $("#name").html(fullName);
            $("#email").val(email);
        }
    });
});
