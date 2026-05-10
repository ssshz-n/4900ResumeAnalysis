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

// const fileInput = document.getElementById("resumeFile");

// const formData = new FormData();
// formData.append("file",fileInput.files[0]);

// fetch("https://your-unique-codespace-url-8080.app.github.dev/upload",{
//     method:"POST",
//     body:formData
// })
// .then(response => response.text())
// .then(data => {
//     console.log(data);
// })

async function analyzeResume(){
    const fileInput = document.getElementById("resumeFile");
    const resultsDiv = document.getElementById("analysisResults");

    if(!fileInput.files.length){
        alert("Please upload a resume first.");
        return;
    }

    const file = fileInput.files[0];

    const formData = new FormData();
    formData.append("file", file);

    resultsDiv.classList.remove("hidden");

    resultsDiv.innerHTML = `
        <p class="font-bold text-slate-700">
            Analyzing resume...
        </p>
    `;

    try{
        const response = await fetch("https://stunning-disco-4jv4wgr4p9pqh5qv4-8080.app.github.dev/upload",{
            method:"POST",
            body: formData
        });

        const analysis = await response.text();

        resultsDiv.innerHTML = `
            <div class="space-y-6">

            <h3 class="text-3xl font-black text-slate-900">
                AI Resume Feedback
            </h3>

            <div class="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                <pre class="whitespace-pre-wrap text-sm leading-7 text-slate-700 font-medium">
                    ${analysis}
                </pre>
            </div>
        </div>
`;
    }
    catch(error){
        console.error(error);
        resultsDiv.innerHTML = `
            <p class="text-red-500 font-bold">
                Failed to analyze resume.
            </p>
        `;
    }
}

const resumeInput = document.getElementById("resumeFile");

resumeInput.addEventListener("change", ()=>{
    const fileName = document.getElementById("uploadedFileName");

    if(resumeInput.files.length > 0){
        fileName.textContent = resumeInput.files[0].name;
    }
});