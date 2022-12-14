async function otpPress(event){
    if(document.getElementById("recover-submit").value === "Submit"){
        checkOtp();
        return;
    }

    const email = document.getElementById("email").value;
    if(!email){
        alert('Please Enter the email address');
        return ;
    }

    const eCheck = await emailCheck(email)
    if(!eCheck){
        alert('Invalid email');
        return;
    }

    // Making a post request to the server for the otp send.
    const result = await fetch('/api/sendOtp', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            email : email
        })
    }).then((res) => res.json())
    
    if (result.status === 'ok') {
        // everythign went fine
        // document.getElementById("recover-submitA").href = './newPassword.html';
        document.getElementById("recover-submit").value = "Submit";
        alert('otp sent successfully');
        
    } else {
        alert(result.error)
    }
}

// validation funtion for the email
async function emailCheck (val){

    // Making a post request to the server for the email validation.
    const data = await fetch('/api/emailCheck', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            email : val
        })
    }).then((res) => res.json());
    return val.length < 30 && data.result;
}

// function to check the otp.
async function checkOtp(){
    const otp = document.getElementById('otp').value;
    const email = document.getElementById('email').value;

    // Making a post request to the server for the otp send.
    const result = await fetch('/api/otpCheck', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            otp : otp,
            email : email
        })
    }).then((res) => res.json())
    
    if (result.status === 'ok') {
        alert(result.msg);
        window.location.href = './newPassword.html';
        localStorage.setItem("otpToken", result.token);
        localStorage.setItem("email",email);
    } else {
        alert(result.error);
        if(result.error=='Otp varification time out.'){
            window.location.href = './index.html';
        }
    }
}