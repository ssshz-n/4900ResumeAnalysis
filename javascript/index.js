//Get elements with that id
const modal = document.getElementById('auth-modal'); //container
const modalTitle = document.getElementById('modal-title'); 
const nameField = document.getElementById('name-field');

//function to open signUp
function signUp(){
   //clears email and password fields when exit/not submitted
   document.getElementById('auth-pass').value = ""; // clears
   document.getElementById('auth-email').value = "";

   //show sign up 
   modal.classList.remove('hidden');
   modalTitle.innerText = "Create Account"; //set container title
   nameField.classList.remove('hidden'); //show name input field
}


//function to open the login
function logIn(){
   //clears email and password fields when exit/not submitted
   document.getElementById('auth-pass').value ="";
   document.getElementById('auth-email').value ="";

   //show logIn box/container/form thing
   modal.classList.remove('hidden');
   modalTitle.innerText = "Welcome Back!"; //set title 
   nameField.classList.add('hidden'); //hide name input field (login), don't need it for login
}

//function to close modal
function closeModal(){
   modal.classList.add('hidden');
}

//function for handling form submission (placeholder)
async function handleAuth(event){
   event.preventDefault();//prevent form from refreshing the page

   const email = document.getElementById('auth-email').value;//get email from user

   //check if its to create account or is in login -> need to continue to construct a search on database for the user if its in login
   const type = modalTitle.innerText === "Create Account" ? "signing up" : "logging in";

   //we dont have an database yet, so we set an temporary alert as a placeholder for this function
   alert(`Ready to send ${email} to the MySQL database for ${type}!`);

//close login or sign up when the form is submitted
   closeModal();
}

//function for toggling password visibility
function eye(){
   const pwInput = document.getElementById('auth-pass');//password input
   const slash = document.getElementById('eye-slash'); //the slash line for the eye


   if(pwInput.type === 'password'){
     pwInput.type = 'text';//show password
     slash.classList.add ('hidden'); //get rid of the line
   }
   else{
       pwInput.type = 'password';//hide password
       slash.classList.remove('hidden'); //turn the line back, hide password
   }
}
