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

/*Used to normalize full state names (e.g., "California") to codes (e.g., "ca") for search matching.*/
const stateMap = {
           "alabama": "al", "alaska": "ak", "arizona": "az", "arkansas": "ar", "california": "ca",
           "colorado": "co", "connecticut": "ct", "delaware": "de", "florida": "fl", "georgia": "ga",
           "hawaii": "hi", "idaho": "id", "illinois": "il", "indiana": "in", "iowa": "ia",
           "kansas": "ks", "kentucky": "ky", "louisiana": "la", "maine": "me", "maryland": "md",
           "massachusetts": "ma", "michigan": "mi", "minnesota": "mn", "mississippi": "ms", "missouri": "mo",
           "montana": "mt", "nebraska": "ne", "nevada": "nv", "new hampshire": "nh", "new jersey": "nj",
           "new mexico": "nm", "new york": "ny", "north carolina": "nc", "north dakota": "nd", "ohio": "oh",
           "oklahoma": "ok", "oregon": "or", "pennsylvania": "pa", "rhode island": "ri", "south carolina": "sc",
           "south dakota": "sd", "tennessee": "tn", "texas": "tx", "utah": "ut", "vermont": "vt",
           "virginia": "va", "washington": "wa", "west virginia": "wv", "wisconsin": "wi", "wyoming": "wy"
       };

// Switches the filter modal between visible and hidden
function toggleModal(){
    const modal = document.getElementById("filterModal");
    modal.style.display = (modal.style.display === 'flex') ? 'none' : 'flex';
}

// Closes the modal only if the user clicks the background overlay
function closeModal(e){
    if(e.target.id === 'filterModal') toggleModal();
}

// Applies the search logic and closes the modal
function applyFilter(){
    search(true);
    toggleModal();
}

//Handles the expansion and closing of the navigation sidebar
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const logo = document.getElementById('sidebar-logo'); 
    const texts = document.querySelectorAll('.sidebar-text');
    
    //Checks if sidebar is currently expanded
    if (sidebar.classList.contains('w-64')) {
        //Shrink sidebar width
        sidebar.classList.replace('w-64', 'w-20');
        logo.classList.add('hidden');
        texts.forEach(t => t.classList.add('hidden'));
    } 
    else {
        sidebar.classList.replace('w-20', 'w-64');
        logo.classList.remove('hidden');
        texts.forEach(t => t.classList.remove('hidden'));
    }
}

//Updates the percentage text next to the slider in real-time.
const slider = document.getElementById('slider');
const matchValue = document.getElementById('matchValue');
if(slider){
    slider.addEventListener('input', ()=>matchValue.textContent = slider.value + '%');
}
//Clears all input fields, resets dropdowns/sliders to defaults, and refreshes search.
function clearAll(){
    document.getElementById('filter-title').value ='';
    document.getElementById('filter-location').value ='';
    document.getElementById('filter-min-salary').value ='';
    document.getElementById('filter-distance').value ="25";
    document.getElementById('filter-type').selectedIndex =0;
    document.getElementById('filter-experience').selectedIndex =0;
    document.getElementById('filter-date').selectedIndex =0;
    document.getElementById('setting-all').checked = true;
    slider.value = 85;
    matchValue.textContent = '85%';
    search(true);
}

//Converts strings to lowercase and replaces full state names with abbreviations
function normalizeLocation(str){
    let normalized = str.toLowerCase().replace(/,/g, ' ').trim();
    for(const [full, abbr] of Object.entries(stateMap)){
        const regex = new RegExp(`\\b${full}\\b`, 'g');
        normalized = normalized.replace(regex, abbr);
    }
    return normalized;
}

//For the search functions
let currentPage = 1; //For tracking Adzuna page
let isLoading = false;//to preven multiple simultaneous API calls while scrolling
let hasMore = true;//Becomes false when API has no more results

// Run the API immediately when the page loads
document.addEventListener('DOMContentLoaded', () => {
    loadInitialJobs();
    setupInfiniteScroll();
});

//To make sure its not empty when user comes in
//used for first load or when user performs a new search
function loadInitialJobs() {
    search(true); // true means this is a fresh search
}

// Detects when the user is at the end of the page it loads and make it scrollable again
function setupInfiniteScroll() {
    const mainContent = document.getElementById('main-content');
    if(!mainContent) return;
    mainContent.addEventListener('scroll', () => {
        // If the user is close to the bottom, load more
        if (mainContent.scrollTop + mainContent.clientHeight >= mainContent.scrollHeight - 100) {
            if (!isLoading && hasMore) {
                currentPage++;
                search(false); //append to existing list
            }
        }
    });
}

//Filters job based on title, location, salary, experience, and match score, and filters it before it is sent to the webpage.
//Search function that would puts and searches with real time jobs by using Adzuna's job API
async function search(isNew = true) {
   //resets and clear jobs if there is a new search
    if(isLoading) return;
    if (isNew) {
        currentPage = 1;
        hasMore = true;
        document.getElementById('job-listings-container').innerHTML = '';
    }
    
    //Get values from HTML filter elements
    //use Developer and USA as default inputs, if there are no search there would still be stuff shown
    const title = document.getElementById('filter-title').value || "Developer";
    const location = document.getElementById('filter-location').value || "";
    const minSalary = document.getElementById('filter-min-salary').value;
    const jobType = document.getElementById('filter-type').value; // e.g., 'full_time'
  
    const container = document.getElementById('job-listings-container');

    //API key
    const APP_ID = 'b12697e4';
    const APP_KEY = '4c4c12ab3293378ad819e6789111f730';

    //Loading state for infinite scroll
    isLoading = true;

    //API URL
    let url = `https://api.adzuna.com/v1/api/jobs/us/search/${currentPage}?app_id=${APP_ID}&app_key=${APP_KEY}&results_per_page=15&what=${encodeURIComponent(title)}`;
  
    // Only apply these if the user has apply them
    if (location) url += `&where=${encodeURIComponent(location)}`;
    if (minSalary) url += `&salary_min=${minSalary}`;
    if (jobType && jobType !== "") url += `&contract_time=${jobType}`;

    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
      
        //if results are empty
        if (data.results.length === 0) {
            hasMore = false;
            if (isNew) container.innerHTML = '<p class="text-center p-10">No jobs found matching these filters.</p>';
            return;
        }

        // show the results
        data.results.forEach(job => {
            
            //format salary input
            const salary = job.salary_min ? `$${job.salary_min.toLocaleString()}` : "Salary Undisclosed";
            //create card ID
            const card = document.createElement('div');
            //Store unique Adzuna ID on the element
            card.setAttribute('data-job-id', job.id);
            card.className = "job-card bg-white p-5 rounded-3xl shadow-sm border border-navy/5 hover:shadow-xl transition-all flex flex-col md:flex-row justify-between items-start gap-4 mb-4";
            
            //put job data into the card
            card.innerHTML = `
                <div class="flex gap-4">
                    <div class="w-14 h-14 bg-cream rounded-xl flex items-center justify-center font-bold text-blue shrink-0 text-xl border border-navy/5">
                        ${job.company.display_name.charAt(0)}
                    </div>
                    <div class="space-y-0.5">
                        <div class="flex items-center gap-2.5">
                            <h4 class="font-bold text-lg text-navy">${job.title}</h4>
                        </div>
                        <p class="text-navy/60 font-medium text-sm">${job.company.display_name} • ${job.location.display_name}</p>
                        <div class="flex gap-2 pt-1 text-[9px] font-bold text-navy/40 uppercase">
                            <span>${job.contract_time ? job.contract_time.replace('_', ' ') : 'Full-time'}</span> •
                            <span class="text-blue">${salary}</span> •
                            <span>${job.category.label}</span>
                        </div>
                    </div>
                </div>
                <div class="flex flex-col gap-2 w-full md:w-auto shrink-0">
                    <a href="${job.redirect_url}" target="_blank" class="text-center md:w-36 bg-navy text-white px-5 py-2.5 rounded-xl font-bold text-xs hover:bg-blue transition-all">Apply externally</a>
                    <button onclick = "saveJob(this)" class="md:w-36 bg-white border border-navy/10 text-navy px-5 py-2.5 rounded-xl font-bold text-xs hover:bg-cream transition-all">Save Job</button>
                </div>
            `;
            //put new card in
            container.appendChild(card);
        });
         syncSaveButtons();

    } 
    catch (error) {
        console.error("Fetch Error:", error);
    } 
    finally {
        isLoading = false;
    }
}

//function for checking removal and adding of saved job,
//checks the entire page to see if its saved if it is change button status
//if removed change button status
function syncSaveButtons() {
    //gets the list of saved jobs from local storage, or empty if there are none
    const savedJobs = JSON.parse(localStorage.getItem('savedJobs')) || [];
    //select all job cards that is shown on the page
    const cards = document.querySelectorAll('.job-card');
    
    cards.forEach(card => {
        //get the specific job id for specific job cards, instead of company names
        const jobId = card.getAttribute('data-job-id');
        const button = card.querySelector('.save-btn');
        
        //check if job is already saved
        const isAlreadySaved = savedJobs.some(j => j.id ===jobId);
        
        if (isAlreadySaved) {
            // change the button on the job page to show that the job is already saved
            button.innerText = "Saved!";
            button.classList.remove('bg-white', 'text-navy');
            button.classList.add('bg-blue', 'text-white');
            //disable click to prevent user to click on it to save again
            button.onclick = null;
            button.style.cursor = 'default';
        }
        else {
            // when the job card is removed it will turn back to not saves
            button.innerText = "Save Job";
            button.classList.add('bg-white', 'text-navy');
            button.classList.remove('bg-blue', 'text-white');
            //savejob function again and reset the pointer
            button.onclick = function() { saveJob(this); };
            button.style.cursor = 'pointer';
        }
    });
}

//event listener for updating page infor everytime the page is shown
window.addEventListener('pageshow', () => {
    syncSaveButtons();
});

//function for when clicking the save button, saves data to local storage
function saveJob(buttonElement) {
    //get job card container
    const card = buttonElement.closest('.job-card');
    const jobId = card.getAttribute('data-job-id');
    // Extract the data from the UI elements
    const jobData = {
        id: jobId,
        title: card.querySelector('h4').innerText,
        // splits the string
        company: card.querySelector('.text-navy\\/60').innerText.split(' • ')[0],
        location: card.querySelector('.text-navy\\/60').innerText.split(' • ')[1] || "Remote",
        // Gets the salary
        salary: card.querySelector('.text-blue') ? card.querySelector('.text-blue').innerText : "Salary Undisclosed",
        // Gets the first letter for the logo
        logo: card.querySelector('.w-14').innerText,
        // Gets the application link if it's an API result, if there isnt then nothing happens
        url: card.querySelector('a') ? card.querySelector('a').href : "#"
    };
    
    // load from local stroage
    let savedJobs = JSON.parse(localStorage.getItem('savedJobs')) || [];
    // Check for duplicates based on Title and Company
    const isDuplicate = savedJobs.some(j => j.id ===jobId);
    
    if (isDuplicate) {
        alert("You have already saved this job!");
    }
    else {
        //add new job to local storage
        savedJobs.push(jobData);
        localStorage.setItem('savedJobs', JSON.stringify(savedJobs));
        // Visual feedback
        buttonElement.innerText = "Saved!";
        buttonElement.classList.remove('bg-white', 'text-navy');
        buttonElement.classList.add('bg-blue', 'text-white');
        buttonElement.onclick = null;
        alert("Job saved successfully!");
    }
}

