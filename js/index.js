const scrollContainer = document.querySelector('.content-side');
const pieces = document.querySelectorAll('.logo-piece');

if (scrollContainer && pieces.length > 0) {
    scrollContainer.addEventListener('scroll', () => {
        const scrolled = scrollContainer.scrollTop / (scrollContainer.scrollHeight - scrollContainer.clientHeight);
        
        const factor = Math.max(0, 1 - (scrolled * 1.5)); 
        
        pieces[0].style.transform = `translate(${factor * -200}px, ${factor * -200}px) rotate(0deg)`;
        pieces[1].style.transform = `translate(${factor * 200}px, ${factor * -200}px) rotate(120deg)`;
        pieces[2].style.transform = `translate(0px, ${factor * 250}px) rotate(240deg)`;
        
        const opacityValue = 0.1 + (scrolled * 1.5);
        pieces.forEach(p => p.style.opacity = Math.min(1, opacityValue));
    });
}