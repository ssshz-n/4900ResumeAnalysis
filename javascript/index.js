//Get elements with that id
const modal = document.getElementById('auth-modal'); //container
const modalTitle = document.getElementById('modal-title'); 
const nameField = document.getElementById('name-field');

let supaBase = null;

//Sets up the connection to supabase using credientals from CONFIG
function initSupabase(){
   try{
      //Checks if CONFIG exists
      if(typeof CONFIG == 'undefined'){
         console.error("CONFIG file is missing. File path might be wrong");
         return false;
      }
      //initialize users
      supaBase = supabase.createClient(CONFIG.URL, CONFIG.KEY);
      console.log("Supabase connected");
      return true;
   }
   catch(e){
      console.error("Connection error:", e);
      return false;
   }
}

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
   
   //Connecting to Supabase
   if(!supaBase){
      const success = initSupabase();
      if(!success){
         alert("Database connection failed. Check for errors.");
         return;
      }
   }
   //gets users information
   const name = document.getElementById('auth-name').value; //get User name
   const email = document.getElementById('auth-email').value;//get email from user
   const password = document.getElementById('auth-pass').value;//gets password from sign up
   const isSignUp = modalTitle.innerText == "Create Account";//determines if its signup or not

   try{
      //if its Sign up put new users/new user data into the data base
      if(isSignUp){
         const {data, error} = await supaBase.from('users').insert([{fullname: name, email: email, password: password}]);
         if(error){
            throw error;
         }
         alert("Account Successfully Created!");
      }
      else{
         //Login: Checks for users in Supabase users table, matching email and password
         const{data, error} = await supaBase.from('users').select('*').eq('email', email).eq('password', password).single();
         if(error|| !data){
            alert("Invalid Email Or Password.");
            return;
         }
         //Save name in browser memory
         localStorage.setItem('userName', data.fullname);
         //Redirect: Go to home page
         window.location.href = 'home.html';
      }
      //close login or sign up when the form is submitted
      closeModal();
   }
   catch(err){
      console.error("DataBase Error: ", err.message);
      alert("Error: " + err.message);
   }

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
