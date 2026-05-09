/*Updates the UI with user data stored in localStorage once the DOM is ready.*/
document.addEventListener('DOMContentLoaded', () => {
    const name = localStorage.getItem('userName');
    if (name) {
        // Update Sidebar Name using the  class we have
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

function toggleSidebar(){
    const sidebar = document.getElementById('sidebar');
    const logo = document.getElementById('sidebar-logo');
    const textElements = document.querySelectorAll('.sidebar-text');

    //Checks if sidebar is currently expanded
    if(sidebar.classList.contains('w-64')){
        //Shrink sidebar width
        sidebar.classList.replace('w-64','w-20');
        logo.classList.add('hidden');
        textElements.forEach(el => el.classList.add('hidden'));
    }
    else{
        sidebar.classList.replace('w-20','w-64');
        setTimeout(()=>{
            logo.classList.remove('hidden');
            textElements.forEach(el => el.classList.remove('hidden'));
        },100);
    }
}