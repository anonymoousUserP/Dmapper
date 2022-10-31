var password = document.getElementById("password"), 
confirm_password = document.getElementById("confirmPassword");

function validatePassword() {
    const password = document.getElementById("password"), 
    confirm_password = document.getElementById("confirmPassword");

    if (password.value != confirm_password.value) {
        confirm_password.setCustomValidity("Passwords Don't Match");
        return false;
    } else {
        confirm_password.setCustomValidity('');
        return true;
    }
}

document.addEventListener('DOMContentLoaded', ()=>{
    password = document.getElementById("password"), 
    confirm_password = document.getElementById("confirmPassword");

    if(!localStorage.getItem("otpToken")){
        disableSubmitButton();
    }
    enableSubmitButton();
    password.onchange = validatePassword();
    confirm_password.onkeyup = validatePassword();
    console.log('hii');
});

function enableSubmitButton() {
    document.getElementById('submitButton').disabled = false;
    document.getElementById('loader').style.display = 'none';
}


function disableSubmitButton() {
    document.getElementById('submitButton').disabled = true;
    document.getElementById('loader').style.display = 'unset';
}

async function validateSignupForm() {
    var form = document.getElementById('signupForm');

    for (var i = 0; i < form.elements.length; i++) {
        if (form.elements[i].value === '' && form.elements[i].hasAttribute('required')) {
            console.log('There are some required fields!');
            return false;
        }
    }

    if (!validatePassword()) {
        return false;
    }
    await onSignup();
}

async function onSignup() {
    password = document.getElementById("password").value
    const token = localStorage.getItem("otpToken");
    const email = localStorage.getItem("email");

    // Making a post request to the server for the reset parrsword.
    const result = await fetch('/api/updatePassword', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            token : token,
            newPassword : password,
            email : email
        })
    }).then((res) => res.json())
    
    if (result.status === 'ok') {
        alert(result.msg);
        window.location.href = './index.html';
    } else {
        alert(result.error);
    }

}