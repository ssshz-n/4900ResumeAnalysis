/*Updates the UI with user data stored in localStorage once the DOM is ready.*/
document.addEventListener('DOMContentLoaded', () => {
    const name = localStorage.getItem('userName');
    if (name) {
        // Update Sidebar Name using the class we have
        const sideName = document.querySelector('.sidebar-text p');
        if (sideName) sideName.innerText = name;
        // Update Initials using the class we have
        const avatar = document.querySelector('.w-10.h-10.shrink-0.rounded-full');
        if (avatar) {
            const initials = name.split(' ').map(n => n[0]).join('').toUpperCase();
            avatar.innerText = initials;
        }
    }
});

//Displays The Resume Builder modal, prevents the background scrolling
function openCreateModal(){
            document.getElementById('createModal').classList.remove('hidden');
            document.body.style.overflow = 'hidden';
        }

//closes resume builder modal, resumes background scrolling
function closeCreateModal() {
    document.getElementById('createModal').classList.add('hidden');
    document.body.style.overflow ='auto';
}

//the function that allows users to add additional experience
//clones the work experience input block and resets the new fields
function addExperience(){
    const container = document.getElementById('experience');
    const original = container.querySelector('.experience-card');
    const newCard = original.cloneNode(true);
    const inputs = newCard.querySelectorAll('input, textarea');

    inputs.forEach(input=>input.value ='');
    newCard.style.opacity = '0'
    newCard.style.transform = 'translateY(10px)';
    container.appendChild(newCard);
    
    setTimeout(() =>{
        newCard.style.transition = 'all 0.3s ease';
        newCard.style.opacity ='1';
        newCard.style.transform = 'translateY(0)';
    }, 10);
}

const fileInput = document.getElementById("resumeFile");

const formData = new FormData();
formData.append("file",fileInput.files[0]);

fetch("https://your-unique-codespace-url-8080.app.github.dev/upload",{
    method:"POST",
    body:formData
})
.then(response => response.text())
.then(data => {
    console.log(data);
})