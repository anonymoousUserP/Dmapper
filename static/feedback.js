let selected = '';

const clickedFunc = (oEvent)=>{
    for(let i = 1;i<=5;i++){
        document.getElementById("level-"+i).style.color = '#4b537c';
    }
    document.getElementById(oEvent.currentTarget.id).style.color = '#fe71a4';
    selected = oEvent.currentTarget.id;
}

for(let i = 1;i<=5;i++){
    document.getElementById("level-"+i).addEventListener('click',clickedFunc);
}

document.getElementById("feedbackSubmit").addEventListener('click', async ()=>{

    if(selected === undefined){
        return;
    }

    const feedbackText = document.getElementById("feedbackText").value;
    const join = document.getElementById("feedbackCheckBox").checked ? 1 : 0;
    const data = {
        feedbackText : feedbackText,
        rating : selected[6],
        join : join
    }
    console.log(data);
    // debugger;

    // Making a post request to the server for the feedback save.
    const result = await fetch('/api/feedback', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    }).then((res) => {
        console.log(res);
        return res.json()
    })

    if (result.status === 'ok') {
        alert('Feed Back submitted successfully');
    } else {
        alert(result.error)
    }
})