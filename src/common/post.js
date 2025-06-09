export default async function post (action, x0, v0, omega0, beta, f, omega, vdotEQ, xdotEQ, id) {
    let url = "https://spring-2a245-default-rtdb.firebaseio.com/.json";
    let date = new Date()
    let data = {
        cookie: document.cookie,
        time: (date.toLocaleString() + " " + String(date.getMilliseconds()-10)+" ms"),
        action: action,
        x0: x0,
        v0: v0,
        omega0: omega0,
        beta: beta,
        f: f,
        omega: omega,
        vdotEQ: vdotEQ,
        xdotEQ: xdotEQ,
        id: id
    };

    await fetch(url, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json'
        }
    })
    // .then(res => res.json())
    //     .catch(error => console.error('Error'))
    //     .then(response => console.log('Success'));

}