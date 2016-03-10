var updateEmailButton = document.getElementById("updateEmail");
var updatePasswordButton = document.getElementById("updatePassword");

updateEmailButton.onclick = function() {

    // boolean variables
    // var fN = 0, lN = 0, eM = 0, pW = 0, cP = 0;
    var eM = 0, nEM = 0, cEM = 0;

    // // first name validation
    // var firstName = $("#firstName").val();
    // if(firstName.search(/^\s*$/) !== -1) {
    //     $("#firstNameFieldset").attr("class", "form-group has-error");
    //     console.log("1");
    //     fN = 0;
    // } else {
    //     $("#firstNameFieldset").attr("class", "form-group");
    //     console.log("2");
    //     fN = 1;
    // }

    // // last name validation
    // var lastName = $("#lastName").val();
    // if(lastName.search(/^\s*$/) !== -1) {
    //     $("#lastNameFieldset").attr("class", "form-group has-error");
    //     lN = 0;
    // } else {
    //     $("#lastNameFieldset").attr("class", "form-group");
    //     lN = 1;
    // }

    // old email validation
    var oldEmail = $("#email").val();
    if(email.search(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/i) === -1) {
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
        console.log("updating");
        // if all checks pass then redirect
        //$.ajax({
        //    type: 'PUT',
        //    url: '/user',
        //    data: {
        //        "firstName": firstName,
        //        "lastName": lastName,
        //        "email": email,
        //        "password": password
        //    },
        //    success: function() {
        //        window.location = "./index";
        //    }
        //});
    }
};

updatePasswordButton.onclick = function() {

    // boolean variables
    var pW = 0, nPW = 0, cP = 0;

    // old password validation
    var password = $("#password").val();
    if(password.search(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/) === -1) {
        $("#passwordFieldset").attr("class", "form-group has-error");
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
        console.log("updating");
        // if all checks pass then redirect
        //$.ajax({
        //    type: 'PUT',
        //    url: '/user',
        //    data: {
        //        "firstName": firstName,
        //        "lastName": lastName,
        //        "email": email,
        //        "password": password
        //    },
        //    success: function() {
        //        window.location = "./index";
        //    }
        //});
    }
};

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
