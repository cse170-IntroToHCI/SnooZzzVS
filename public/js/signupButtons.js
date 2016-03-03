
var submitButton = document.getElementById("submitButton");
submitButton.onclick = function() {

    // boolean variables
    var fN = 0, lN = 0, eM = 0, pW = 0, cP = 0, cB = 0;

    // first name validation
    var firstName = $("#firstName").val();
    if(firstName.search(/^\s*$/) !== -1) {
        $("#firstNameFieldset").attr("class", "form-group has-error");
        fN = 0;
    } else {
        $("#firstNameFieldset").attr("class", "form-group");
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

    // accept the agreement
    var checkbox = $("#checkbox").prop("checked");
    if(!checkbox) {
        $("#checkboxFieldset").attr("class", "checkbox text-center has-error");
        $("#checkboxLabel").css("font-weight", "bold");
        cB = 0;
    } else {
        $("#checkboxFieldset").attr("class", "checkbox text-center");
        $("#checkboxLabel").css("font-weight", "");
        cB = 1;
    }

    if(fN && lN && eM && pW && cP && cB) {
        // if all checks pass then redirect
        $.ajax({
            type: 'POST',
            url: '/user',
            data: {
                "firstName": firstName,
                "lastName": lastName,
                "email": email,
                "password": password
            },
            success: function() {
                window.location = "./index";
            },
            error: function() {
                $("#email").attr("data-original-title", "Email is already registered");
                $("#email").tooltip('show');
                setTimeout(function() {
                    $("#email").tooltip('hide');
                }, 2000);
            }
        });
    }
};

var loginButton = document.getElementById("loginButton");
loginButton.onclick = function() {
    window.location = "./login";
};