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

const isLocal = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";

const BACKEND_BASE = isLocal 
    ? "http://localhost:8080" 
    : "https://" + window.location.hostname.replace("-5500", "-8080") + ".app.github.dev";

const chatForm = document.getElementById('chat-form');
const userInput = document.getElementById('user-input');
const chatContainer = document.getElementById('chat-container');

chatForm.addEventListener('submit', async (e) =>{
    e.preventDefault();
    
    const text = userInput.value.trim();
    if(!text) return;

    //Display user message
    addMessage(text, 'user');
    userInput.value = '';

    //Show AI thinking bubble
    const tempId = "loading-" + Date.now();
    addMessage("Your AI coach is thinking...", 'ai', tempId);

    try{
        const response = await fetch(`${BACKEND_BASE}/chat`, { // Path added here
        method: "POST",
        headers: {"Content-Type": "text/plain"},
        body: text
        });

        const data = await response.json();

        //Remove AI thinking bubble
        document.getElementById(tempId).remove();

        const botResponse = data.candidate || data.response || "No response received";

        addMessage(botResponse, 'ai');

        // if(data.error){
        //     addMessage(`Error: ${data.error.message}`, 'ai');
        // }
        // else{
        //     const botResponse = data.candidates[0].content.parts[0].text;
        //     addMessage(botResponse,'ai');
        // }
    }
    catch(err){
        document.getElementById(tempId).remove();
        addMessage("Connection error", 'ai');
    }
});

function addMessage(content, sender, id = null){
    const div = document.createElement('div');
    div.className = sender === 'user' ? 'flex justify-end' : 'flex gap-4 max-w-3xl';

    if(id){
        div.id = id;
    }

    const html = sender === 'user'
       ? `<div class="bg-blue text-white p-5 rounded-2xl rounded-tr-none shadow-md max-w-md">${content}</div>`
       : `<div class="w-10 h-10 rounded-xl bg-navy flex items-center justify-center text-skyblue shrink-0 shadow-lg">
               <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
          </div>
          <div class="glass p-5 rounded-2xl rounded-tl-none shadow-sm text-navy whitespace-pre-wrap">${content}</div>`;

    div.innerHTML = html;
    chatContainer.appendChild(div);
    chatContainer.scrollTop = chatContainer.scrollHeight;

}
