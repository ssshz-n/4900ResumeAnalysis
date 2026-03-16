const modal = document.getElementById('auth-modal');
const modalTitle = document.getElementById('modal-title');
const nameField = document.getElementById('name-field');


function signUp(){
   document.getElementById('auth-pass').value = ""; // clears
   document.getElementById('auth-email').value = "";
  
   modal.classList.remove('hidden');
   modalTitle.innerText = "Create Account";
   nameField.classList.remove('hidden');
}




function logIn(){
   document.getElementById('auth-pass').value ="";
   document.getElementById('auth-email').value ="";
  
   modal.classList.remove('hidden');
   modalTitle.innerText = "Welcome Back!";
   nameField.classList.add('hidden'); //hide name field (login)
}


function closeModal(){
   modal.classList.add('hidden');
}


async function handleAuth(event){
   event.preventDefault();
   const email = document.getElementById('auth-email').value;
   const type = modalTitle.innerText === "Create Account" ? "signing up" : "logging in";


   alert(`Ready to send ${email} to the MySQL database for ${type}!`);


   closeModal();
}


function eye(){
   const pwInput = document.getElementById('auth-pass');
   const slash = document.getElementById('eye-slash');


   if(pwInput.type === 'password'){
     pwInput.type = 'text';
     slash.classList.add ('hidden'); //get rid of the line
   }
   else{
       pwInput.type = 'password';
       slash.classList.remove('hidden'); //turn the line back, hide password
   }
}
