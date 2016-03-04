var updateButton = document.getElementById("updateButton");
updateButton.onclick = function() {

    // boolean variables
    var fN = 0, lN = 0, eM = 0, pW = 0, cP = 0;

    // first name validation
    var firstName = $("#firstName").val();
    if(firstName.search(/^\s*$/) !== -1) {
        $("#firstNameFieldset").attr("class", "form-group has-error");
        console.log("1");
        fN = 0;
    } else {
        $("#firstNameFieldset").attr("class", "form-group");
        console.log("2");
        fN = 1;
    }

    // last name validation
    var lastName = $("#lastName").val();
    if(lastName.search(/^\s*$/) !== -1) {
        $("#lastNameFieldset").attr("class", "form-group has-error");
        lN = 0;
    } else {
        $("#lastNameFieldset").attr("class", "form-group");
        lN = 1;
    }

    // email validation
    var email = $("#email").val();
    if(email.search(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/i) === -1) {
        $("#emailFieldset").attr("class", "form-group has-error");
        eM = 0;
    } else {
        $("#emailFieldset").attr("class", "form-group");
        eM = 1;
    }

    // password validation
    var password = $("#password").val();
    if(password.search(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/) === -1) {
        $("#passwordFieldset").attr("class", "form-group has-error");
        pW = 0;
    } else {
        $("#passwordFieldset").attr("class", "form-group");
        pW = 1;
    }

    // confirm password validation
    var confirmPassword = $("#confirmPassword").val();
    if(password !== confirmPassword) {
        $("#confirmPasswordFieldset").attr("class", "form-group has-error");
        cP = 0;
    } else {
        $("#confirmPasswordFieldset").attr("class", "form-group");
        cP = 1;
    }

    if(fN && lN && eM && pW && cP) {
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

            $("#firstName").val(firstName);
            $("#lastName").val(lastName);
            $("#email").val(email);
        }
    });
});
