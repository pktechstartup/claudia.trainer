const products = [
    {
        id: 101,
        name: "Plan 2 veces por semana",
        subtitle: "Constancia y adaptación para recuperar tu fuerza.",
        videoSrc: "vid/video1.webm",
        features: [
            "8 clases mensuales",
            "Entrenamiento personalizado",
            "Monitoreo de técnica y progreso"
        ]
    },
    {
        id: 102,
        name: "Plan 3 veces por semana",
        subtitle: "El equilibrio perfecto para crear un hábito real.",
        videoSrc: "vid/video3.webm",
        features: [
            "12 clases mensuales",
            "Entrenamiento personalizado",
            "Acompañamiento prioritario"
        ]
    },
    {
        id: 103,
        name: "Evaluación + Rutina Personalizada",
        subtitle: "Ideal para entrenar por tu cuenta con una guía segura.",
        videoSrc: "vid/video2.webm",
        features: [
            "Evaluación física completa",
            "Diseño de rutina personalizada",
            "Pautas de movimiento seguro",
            "Resolución de dudas"
        ]
    }
];

let currentIndex = 0;
let isMuted = true;
let track;
let cardContainer;

function buildSlides() {
    track = document.getElementById('carouselTrack');
    cardContainer = document.getElementById('productCardContainer');

    track.innerHTML = '';

    products.forEach((p, i) => {
        const slide = document.createElement('div');
        slide.className = 'slide';
        slide.dataset.index = i;

        const vw = document.createElement('div');
        vw.className = 'video-wrapper';

        if (p.videoSrc) {
            const video = document.createElement('video');
            video.src = p.videoSrc;
            video.loop = true;
            video.muted = isMuted;
            video.playsInline = true;
            video.preload = 'auto';
            video.setAttribute('playsinline', '');
            video.setAttribute('muted', '');
            vw.appendChild(video);
        }

        const muteBtn = document.createElement('button');
        muteBtn.className = 'mute-btn';
        muteBtn.innerHTML = muteIcon(isMuted);
        muteBtn.onclick = (e) => { e.stopPropagation(); toggleMute(); };
        vw.appendChild(muteBtn);

        slide.appendChild(vw);

        slide.onclick = () => {
            if (i !== currentIndex) goTo(i);
        };

        track.appendChild(slide);
    });

    updateTrack();
    renderCard(false); 
}

function updateTrack() {
    const slides = document.querySelectorAll('.slide');
    const total = slides.length;

    slides.forEach((slide, index) => {
        slide.classList.remove('active', 'prev', 'next');

        if (index === currentIndex) {
            slide.classList.add('active');
        } else if (index === (currentIndex - 1 + total) % total) {
            slide.classList.add('prev');
        } else if (index === (currentIndex + 1) % total) {
            slide.classList.add('next');
        }
    });
}

function renderCard(animate = true) {
    const p = products[currentIndex];

    const featuresList = p.features.map(feature => `
        <li style="display: flex; align-items: flex-start; gap: 10px; margin-bottom: 10px; font-size: 0.9rem; color: #4a4a4a; font-family: 'Nunito Sans', sans-serif;">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width: 18px; height: 18px; color: var(--verde-claudia); flex-shrink: 0; margin-top: 2px;">
                <polyline points="20 6 9 17 4 12"></polyline>
            </svg> 
            ${feature}
        </li>
    `).join('');

    const numeroWhatsApp = "51960510332"; 
    const mensajePredefinido = `Hola Claudia, estoy interesada en el "${p.name}". Me gustaría recibir más información.`;
    const enlaceWhatsApp = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(mensajePredefinido)}`;

    const cardHTML = `
        <div class="product-card">
            <div class="product-header">
                <h3 class="product-name">${p.name}</h3>
                <p class="product-subtitle">${p.subtitle}</p>
            </div>
            
            <ul class="product-features">
                ${featuresList}
            </ul>

            <a href="${enlaceWhatsApp}" target="_blank" rel="noopener noreferrer" class="btn-whatsapp-plan">
                <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                </svg>
                Quiero este plan
            </a>
        </div>`;

    if (animate) {
        cardContainer.style.opacity = '0';
        cardContainer.style.transform = 'translateY(10px)';
        setTimeout(() => {
            cardContainer.innerHTML = cardHTML;
            cardContainer.style.opacity = '1';
            cardContainer.style.transform = 'translateY(0)';
        }, 300);
    } else {
        cardContainer.innerHTML = cardHTML;
    }
}

function goTo(index) {
    stopVideo(currentIndex);
    currentIndex = ((index % products.length) + products.length) % products.length;
    updateTrack();
    renderCard(true);
    setTimeout(() => playVideo(currentIndex), 100);
}

function playVideo(index) {
    const slides = document.querySelectorAll('.slide');
    slides.forEach((slide, i) => {
        const video = slide.querySelector('video');
        if (video) {
            if (i === index) {
                video.play().catch(err => console.log('Play failed:', err));
            } else {
                video.pause();
            }
        }
    });
}

function stopVideo(index) {
    const slides = document.querySelectorAll('.slide');
    const video = slides[index]?.querySelector('video');
    if (video) {
        video.pause();
        video.currentTime = 0;
    }
}


function toggleMute() {
    isMuted = !isMuted;
    const videos = document.querySelectorAll('video');
    videos.forEach(video => video.muted = isMuted);
    const muteButtons = document.querySelectorAll('.mute-btn');
    muteButtons.forEach(btn => btn.innerHTML = muteIcon(isMuted));
}

function muteIcon(muted) {
    return muted ?
        `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><line x1="23" y1="9" x2="17" y2="15"></line><line x1="17" y1="9" x2="23" y2="15"></line></svg>` :
        `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path><path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path></svg>`;
}

document.addEventListener('DOMContentLoaded', function () {
    buildSlides();
    setTimeout(() => { playVideo(0); }, 200);

    document.getElementById('prevBtn').addEventListener('click', () => goTo(currentIndex - 1));
    document.getElementById('nextBtn').addEventListener('click', () => goTo(currentIndex + 1));

    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') goTo(currentIndex - 1);
        if (e.key === 'ArrowRight') goTo(currentIndex + 1);
    });
});