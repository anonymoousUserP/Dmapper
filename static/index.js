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

// We will get the user id and password, then will make a post request to the server and in resposne it will it send a ok message alog with a jwt token which we attach to the url of the user.

// This function will do the authentication for the user.
async function signinPress(oEvent){

    const username = document.getElementById('SigninUsername').value
    const password = document.getElementById('SigninPassword').value

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
}