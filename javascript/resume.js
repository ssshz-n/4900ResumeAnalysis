//function for closing and opening the navigation side bar
function openSidebar(){
    const sidebar = document.getElementById('sidebar');
    const logo = document.getElementById('sidebar-title');
    const text = document.querySelectorAll('.sidebar-text');
    if(sidebar.classList.contains('w-64')){
        sidebar.classList.replace('w-64', 'w-20');
        logo.classList.add('hidden');
        text.forEach(t => t.classList.add('hidden'));
    }
    else{
        sidebar.classList.replace('w-20', 'w-64');
        setTimeout(()=>{
            logo.classList.remove('hidden');
            text.forEach(t => t.classList.remove('hidden'));
        }, 150);
    }
}

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
