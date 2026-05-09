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

function toggleFaq(header){
    const item = header.parentElement;
    item.classList.toggle('active');
}

//search by keyword
function filterFAQs(){
    const input = document.getElementById('faqSearch').value.toLowerCase();
    const items = document.querySelectorAll('.faq-item');

    items.forEach(item =>{
        const text = item.innerText.toLowerCase();
        item.style.display = text.includes(input)?"block":"none";
    });
}

const mainScroll = document.getElementById('main-scroll');
const btt = document.getElementById('backToTop');

mainScroll.onscroll = function(){
    if(mainScroll.scrollTop > 300){
        btt.style.display = "block";
    }
    else{
        btt.style.display = "none";
    }
}

function scrollToTop(){
    mainScroll.scrollTo({top:0,behavior:'smooth'});
}