const AUTH_USER = "unface";
const AUTH_PASS = "Pass123";

function login(){
  const u = document.getElementById('username').value.trim();
  const p = document.getElementById('password').value.trim();
  const err = document.getElementById('err');
  if(u === AUTH_USER && p === AUTH_PASS){
    localStorage.setItem('loggedIn','1');
    localStorage.setItem('username', u);
    window.location.href = 'index.html';
  }else{
    err.innerText = 'Invalid username or password';
  }
}

function requireAuth(){
  if(localStorage.getItem('loggedIn') !== '1'){
    window.location.href = 'login.html';
  }
}

function logout(){
  localStorage.removeItem('loggedIn');
  localStorage.removeItem('username');
  window.location.href = 'login.html';
}