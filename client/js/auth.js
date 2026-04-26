const API = `${BACKEND_URL}/api/auth`;

// Regular Expressions for Validation
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// Password requires at least 6 characters, including at least one letter and one number
const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d).{6,}$/;

async function signup(){
    const email=document.getElementById("email").value;
    const password=document.getElementById("password").value;

    if (!emailRegex.test(email)) {
        alert("Please enter a valid email address.");
        return;
    }
    if (!passwordRegex.test(password)) {
        alert("Password must be at least 6 characters long and contain at least one letter and one number.");
        return;
    }

    const res=await fetch(`${API}/signup`, {
        method:"POST",
        headers: {
            "Content-Type":"application/json"
        },
        body:JSON.stringify({email, password})
    });
    const data=await res.json();
    alert(data.message);
    if (res.ok) {
        window.location.href = "login.html";
    }
}

async function login()
{
    const email=document.getElementById("email").value;
    const password=document.getElementById("password").value;

    if (!emailRegex.test(email)) {
        alert("Please enter a valid email address.");
        return;
    }

    const res=await fetch(`${API}/login`,{
        method:"POST",
        headers:{
            "Content-Type":"application/json"
        },
        body:JSON.stringify({email, password})
    });
    const data=await res.json();

    if(data.token){
        localStorage.setItem("token", data.token);
        window.location.href="dashboard.html";
    }
    else{
        alert(data.message);
    }
}