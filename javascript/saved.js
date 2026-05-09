//for debugging
console.log("LocalStorage Content:", localStorage.getItem('savedJobs'));
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
    renderSavedJobs();
});

//Gets jobs in local storage into the save page
function renderSavedJobs() {
    //get the jobs
    const container = document.querySelector('#job-listings-container') || document.querySelector('main section');
    const savedJobs = JSON.parse(localStorage.getItem('savedJobs')) || [];
    // Clear placeholders
    container.innerHTML = '';

    //if no jobs, update count
    if (savedJobs.length === 0) {
        updateJobCount();
        return;
    }
    
    //loop through each object in the arr
    savedJobs.forEach((job, index) => {
        //create new div element
        const card = document.createElement('div');
        card.className = "job-card bg-white p-5 rounded-3xl shadow-sm border border-navy/5 hover:shadow-xl transition-all flex flex-col md:flex-row justify-between items-start gap-4 mb-4";
        //card format
        card.innerHTML = `
            <div class="w-20 h-20 bg-[#F8FAFC] rounded-3xl flex items-center justify-center text-blue-600 font-black text-2xl border border-[#0A192F]/5">
            ${job.logo}
            </div>
            <div class="flex-grow space-y-1">
                <div class="flex items-center gap-3">
                    <h3 class="text-xl font-bold text-[#0A192F]">${job.title}</h3>
                    <span class="px-3 py-1 bg-green-100 text-green-700 text-[10px] font-black uppercase rounded-full tracking-wider">Saved</span>
                </div>
                <p class="font-medium text-[#0A192F]/60">${job.company} • ${job.location}</p>
                <div class="flex gap-2 pt-2">
                    <span class="text-[10px] font-bold text-[#0A192F]/40 bg-[#F8FAFC] px-2 py-1 rounded-md uppercase">${job.salary}</span>
                </div>
            </div>
            
            <div class="flex flex-row md:flex-col gap-3 w-full md:w-auto">
                <!-- Apply Button -->
                <a href="${job.url}" target="_blank" class="flex-grow px-8 py-3 bg-[#0A192F] text-white text-center rounded-2xl font-bold hover:bg-blue-600 transition-all shadow-lg shadow-blue-900/10">
                    Apply Now
                </a>
                
                <!--Remove Button -->
                <button onclick="removeJob(${index})" class="px-5 py-3 bg-white border border-red-200 text-red-500 rounded-2xl font-bold hover:bg-red-50 hover:border-red-300 transition-all flex items-center justify-center gap-2 group/btn">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 transition-transform group-hover/btn:scale-110" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    <span class="text-xs uppercase tracking-wider">Remove</span>
                </button>
            </div>
        `;
        //show the card onto the page
        container.appendChild(card);
    });
    
    //update total saved jobs
    updateJobCount();
}

// Function for removing the job from storage and the UI
function removeJob(index) {
    //load list from local storage
    let savedJobs = JSON.parse(localStorage.getItem('savedJobs')) || [];
    
    // Find the card element to remove and apply removing animation
    const cards = document.querySelectorAll('.job-card');
    const temp = cards[index];
    
    //exit animation
    temp.style.opacity = '0';
    temp.style.transform = 'translateX(20px)';
    
    //wait for removing animation befor eupdating UI
    setTimeout(() => {
        // Remove from Array
        savedJobs.splice(index, 1);
        // Update LocalStorage
        localStorage.setItem('savedJobs', JSON.stringify(savedJobs));
        // Refresh the page
        renderSavedJobs();
    }, 300);
}

//For opening and closing side bar
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

//Function to update the total saved jobs number in the header
function updateJobCount(){
    //find where the count should be displayes
    const countElement = document.querySelector('header span.text-blue-600');
    //count job cards
    const currentCards = document.querySelectorAll('.job-card').length;
    
    //update amount
    if(countElement){
        countElement.textContent = currentCards;
    }
    
    //if empty shows that its empty
    const empty = document.querySelector('.empty-state');
    //otherwise show card
    if (currentCards > 0 && empty) {
        empty.remove();
    }
    
    //If no jobs were saved, show this
    if(currentCards === 0 && !document.querySelector('.empty-state')){
        const mainContent = document.querySelector('main');
        //this is for the empty state
        mainContent.innerHTML += `
            <div class="empty-state flex flex-col items-center justify-center py-20 text-center opacity-0 transition-opacity duration-500" style="opacity: 1;">
                <div class="text-6xl mb-4">⭐⭐⭐</div>
                <h3 class="text-2xl font-bold text-navy">No saved jobs yet</h3>
                <p class="text-navy/50">Explore the Job Search tab to find your perfect match.</p>
                <a href="results.html" class="mt-6 px-6 py-3 bg-navy text-white rounded-xl font-bold hover:bg-blue transition-all">Find Jobs</a>
            </div>
        `;
    }
}

//Removal of jobs/fixed placholder cards from the list if it shows up
document.addEventListener('DOMContentLoaded', () => {
    //look for static cards wirh that button
    document.querySelectorAll('.job-card button.text-red-500').forEach(button => {
        button.addEventListener('click', function () {
            const card = this.closest('.job-card');
            //apply animation
            card.style.opacity = '0';
            card.style.transform = 'translateX(20px)';
            
            //wait for animation
            setTimeout(() => {
                card.remove();
                //recaculate count
                updateJobCount();
            }, 300);
        });
    });
});

