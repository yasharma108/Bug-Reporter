const API = `${BACKEND_URL}/api/auth`;

async function signup(){
    const email=document.getElementById("email").value;
    const password=document.getElementById("password").value;

    const res=await fetch(`${API}/signup`, {
        method:"POST",
        headers: {
            "Content-Type":"application/json"
        },
        body:JSON.stringify({email, password})
    });
    const data=await res.json();
    alert(data.message);
}

async function login()
{
    const email=document.getElementById("email").value;
    const password=document.getElementById("password").value;

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