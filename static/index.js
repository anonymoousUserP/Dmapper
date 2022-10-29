const signUpButton = document.getElementById("signUp");
const signInButton = document.getElementById("signIn");
const container = document.getElementById("container");

signUpButton.addEventListener("click", () => {
    container.classList.add("right-panel-active");
});

signInButton.addEventListener("click", () => {
    container.classList.remove("right-panel-active");
});

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

// name validation. 
const nameCheck = (val) => val.length > 5 && val.length < 30;

// password validation
const passwordCheck = (val) => val.length >= 8 && val.length < 30;


document.getElementById("signin-btn").addEventListener("click", async ()=>{

    const username = document.getElementById('SigninUsername').value
    const password = document.getElementById('SigninPassword').value

    const eCheck = await emailCheck(username)
    if(!eCheck){
        alert('Invalid email');
        return;
    }

    if(!passwordCheck(password)){
        alert('Invalid password');
        return;
    }

    // Making a post request to the server.
    const result = await fetch('/api/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            email: username,
            password : password
        })
    }).then((res) => res.json())

    if (result.status === 'ok') {
        // everythign went fine
        console.log('Got the token: ', result.data)
        localStorage.setItem('token', result.data)
        alert('Successfully logged in');
    } else {
        alert(result.error)
    }
})

document.getElementById("signup-btn").addEventListener("click", async ()=>{
    debugger;

    const username = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // Making a post request to the server for the user signUp.
    const result = await fetch('/api/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            name: username,
            password : password,
            email : email
        })
    }).then((res) => res.json())

    if (result.status === 'ok') {
        alert('User successfully registered');
    } else {
        alert(result.error)
    }
})