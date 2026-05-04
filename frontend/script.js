document.getElementById("registerForm").addEventListener("submit", function(e){
    e.preventDefault();

    const form = e.target;

    const name = form.querySelector("input[name='name']").value.trim();
    const email = form.querySelector("input[name='email']").value.trim();
    const phone = form.querySelector("input[name='phone']").value.trim();
    const password = form.querySelector("input[name='password']").value.trim();

    console.log("DATA:", name, email, phone, password);

    if(!name || !email || !phone || !password){
        alert("Please fill all fields");
        return;
    }

    fetch("http://127.0.0.1:8000/api/register/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            name: name,
            email: email,
            phone: phone,
            password: password
        })
    })
    .then(res => res.json())
    .then(data => {
    console.log("LOGIN RESPONSE:", data);

    if(data.status === "success"){
        alert("Registration successful! Please sign in to continue.");

        // clear any existing user data
        localStorage.removeItem("user_id");
        localStorage.removeItem("name");
        localStorage.removeItem("email");
        localStorage.removeItem("phone");

        // switch to sign in form
        const container = document.getElementById('container');
        container.classList.remove("active");
        
        // clear registration form
        form.reset();
        
    } else {
        alert(data.error || data.message || "Error occurred");
    }
})
    .catch(err => {
        alert("Server error");
        console.error(err);
    });
});

// TOGGLE LOGIN / REGISTER
const container = document.getElementById('container');
const registerBtn = document.getElementById('register');
const loginBtn = document.getElementById('login');

registerBtn.addEventListener('click', () => {
    container.classList.add("active");
});

loginBtn.addEventListener('click', () => {
    container.classList.remove("active");
});


// LOGIN FUNCTION
document.getElementById("loginForm").addEventListener("submit", function(e){
    e.preventDefault();

    const email = document.querySelector("#loginForm input[name='email']").value;
    const password = document.querySelector("#loginForm input[name='password']").value;

    fetch("http://127.0.0.1:8000/api/login/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            email: email,
            password: password
        })
    })
    .then(res => res.json())
    .then(data => {

        if(data.status === "success"){

            localStorage.setItem("user_id", data.user_id);
            localStorage.setItem("name", data.name);
            localStorage.setItem("email", data.email);

            window.location.href = "dashboard.html";

        } else {
            alert(data.message || "Invalid email or password");
        }

    })
    .catch(err => {
        alert("Server error");
        console.error(err);
    });
});