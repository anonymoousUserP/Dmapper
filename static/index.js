const signUpButton = document.getElementById("signUp");
const signInButton = document.getElementById("signIn");
const container = document.getElementById("container");

signUpButton.addEventListener("click", () => {
    container.classList.add("right-panel-active");
});

signInButton.addEventListener("click", () => {
    container.classList.remove("right-panel-active");
    debugger;
});

// validation funtion for the email
async function emailCheck (val){

    // Making a post request to the server for the email validation.
    const result = await fetch('/api/emailCheck', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            email : val
        })
    }).then((res) => res.json());

    console.log(result.data);
    return val.length < 30 && result.data;
}

// name validation. 
const nameCheck = (val) => val.length > 5 && val.length < 30;

// password validation
const passwordCheck = (val) => val.length > 8 && val.length < 30;

// We will get the user id and password, then will make a post request to the server and in resposne it will it send a ok message alog with a jwt token which we attach to the url of the user.
// This function will do the authentication for the user.

document.getElementById("signin-btn").addEventListener("click", async ()=>{
    debugger;

    const username = document.getElementById('SigninUsername').value
    const password = document.getElementById('SigninPassword').value

    const eCheck = emailCheck(username)
    if(!eCheck){
        alert('Invalid email');
        return;
    }

    if(!passwordCheck(password)){
        alert('Invalid password');
        return;
    }


    console.log(username,password);
    debugger;

    // Making a post request to the server.
    const result = await fetch('/api/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            username: username,
            password : password
        })
    }).then((res) => res.json())

    if (result.status === 'ok') {
        // everythign went fine
        console.log('Got the token: ', result.data)
        localStorage.setItem('token', result.data)
        alert('Success')
    } else {
        alert(result.error)
    }
})

async function signUpPress(oEvent){

    const username = document.getElementById('username').value
    const password = document.getElementById('password').value

    console.log(username,password);
    debugger;

    // Making a post request to the server for the user signUp.
    const result = await fetch('/api/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            username: username,
            password : password
        })
    }).then((res) => res.json())

    if (result.status === 'ok') {
        // everythign went fine
        console.log('Got the token: ', result.data)
        localStorage.setItem('token', result.data)
        alert('Success')
    } else {
        alert(result.error)
    }
}