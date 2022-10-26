function otpPress(){
    email = document.getElementById("email").value;

    
    document.getElementById("otp").placeholder = 'Conform new password';
    document.getElementById("email").placeholder = 'Enter new password';
    document.getElementById("recover-submit").value = "Submit"
    alert('otp sent successfully');
}