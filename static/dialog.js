function otpPress(){
    email = document.getElementById("email").value;

    
    // document.getElementById("otp").placeholder = 'Conform new password';
    document.getElementById("recover-submitA").href = './newPassword.html';
    document.getElementById("recover-submit").value = "Submit"
    alert('otp sent successfully');
}