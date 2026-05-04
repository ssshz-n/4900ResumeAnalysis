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