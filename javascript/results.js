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
    
function toggleModal(){
    const modal = document.getElementById("filterModal");
    modal.style.display = (modal.style.display === 'flex') ? 'none' : 'flex';
}

function closeModal(e){
    if(e.target.id === 'filterModal') toggleModal();
}

function applyFilter(){
    search();
    toggleModal();
}
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

const slider = document.getElementById('slider');
const matchValue = document.getElementById('matchValue');
slider.addEventListener('input', ()=>matchValue.textContent = slider.value + '%');

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
    search();
}

function normalizeLocation(str){
    let normalized = str.toLowerCase().replace(/,/g, ' ').trim();
    for(const [full, abbr] of Object.entries(stateMap)){
        const regex = new RegExp(`\\b${full}\\b`, 'g');
        normalized = normalized.replace(regex, abbr);
    }
    return normalized;
}

function search(){
    const title = document.getElementById('filter-title').value.toLowerCase();
    const enteredLocation = document.getElementById('filter-location').value;
    const location = normalizeLocation(enteredLocation);
    const type = document.getElementById('filter-type').value.toLowerCase();
    const minSalaryInput = document.getElementById('filter-min-salary').value;
    const experience = document.getElementById('filter-experience').value.toLowerCase();
    const date = document.getElementById('filter-date').value;

    const workSetting = document.querySelector ('input[name="workSetting"]:checked');
    const workSettingValue = workSetting ? workSetting.value.toLowerCase() : "";
    const minMatchValue = parseInt(slider.value);
    const cards = document.querySelectorAll('.job-card');

    cards.forEach(card => {
        const cardText = normalizeLocation(card.innerText);
        const cardLocation = normalizeLocation(card.getAttribute('data-location') || "");
        const fitBadge = card.querySelector('span[class*="uppercase"]').innerText;
        const fitValue = parseInt(fitBadge);
        const cardDate = card.getAttribute('data-date');
        const matchesTitle = cardText.includes(title);
        const words = location.split(/\s+/).filter(w => w.length >1);
        let matchesLocation = true;
        if(words.length>0){
            matchesLocation = words.some(word => cardText.includes(word) || cardLocation.includes(word));
        }
        const matchesSetting = workSettingValue = "" || cardText.includes(workSettingValue);
        const matchesType = type === "" || cardText.includes(type);
        const matchesExp = experience ==="" || cardText.includes(experience);
        const matchesDate = date ==="" || cardDate === date;
        
        let matchesSalary = true;
        if(minSalaryInput !==""){
            const salaryMatch = cardText.match(/\$(\d+)/);
            if(salaryMatch){
                const cardSalaryValue = parseInt(salaryMatch[1]);
                const userMinSalary = parseInt(minSalaryInput);
                matchesSalary = cardSalaryValue >= userMinSalary;
            }
        }
        const matchesScore = fitValue >= minMatchValue;
        if (matchesTitle && matchesLocation && matchesType && matchesSalary && matchesExp && matchesScore && matchesSetting && matchesDate) {
            card.style.display = 'flex';
        } 
        else {
            card.style.display = 'none';
        }
    });
}