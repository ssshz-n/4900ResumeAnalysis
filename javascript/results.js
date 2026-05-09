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
    search();
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
slider.addEventListener('input', ()=>matchValue.textContent = slider.value + '%');

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
    currentPage = 1;
    hasMore = true;
    document.getElementById('job-listings-container').innerHTML = '';
    search(true); // true means this is a fresh search
}

// Detects when the user is at the end of the page it loads and make it scrollable again
function setupInfiniteScroll() {
    const mainContent = document.getElementById('main-content');
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
                    <button class="md:w-36 bg-white border border-navy/10 text-navy px-5 py-2.5 rounded-xl font-bold text-xs hover:bg-cream transition-all">Save Job</button>
                </div>
            `;
            //put new card in
            container.appendChild(card);
        });

    } 
    catch (error) {
        console.error("Fetch Error:", error);
    } 
    finally {
        isLoading = false;
    }
}
