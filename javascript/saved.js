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
        },150);
    }
}

//Function to update the number in the header
function updateJobCount(){
    const countElement = document.querySelector('header span.text-blue-600');
    const currentCards = document.querySelectorAll('.job-card').length;

    if(countElement){
        countElement.textContent = currentCards;
    }

    const empty = document.querySelector('.empty-state');
    if (currentCards > 0 && empty) {
        empty.remove();
    }
    
    //If no jobs were saved
    if(currentCards === 0 && !document.querySelector('.empty-state')){
        const mainContent = document.querySelector('main');
        mainContent.innerHTML += `
            <div class="empty-state flex flex-col items-center justify-center py-20 text-center opacity-0 transition-opacity duration-500" style="opacity: 1;">
                <div class="text-6xl mb-4">📂</div>
                <h3 class="text-2xl font-bold text-navy">No saved jobs yet</h3>
                <p class="text-navy/50">Explore the Job Search tab to find your perfect match.</p>
                <a href="results.html" class="mt-6 px-6 py-3 bg-navy text-white rounded-xl font-bold hover:bg-blue transition-all">Find Jobs</a>
            </div>
        `;
    }
}

//Removal of jobs from the list
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.job-card button.text-red-500').forEach(button => {
        button.addEventListener('click', function () {
            const card = this.closest('.job-card');

            card.style.opacity = '0';
            card.style.transform = 'translateX(20px)';

            setTimeout(() => {
                card.remove();
                updateJobCount();
            }, 300);
        });
    });
});