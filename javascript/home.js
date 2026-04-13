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