const products = [
    {
        id: 101,
        name: "Plan 2 veces por semana",
        originalPrice: 150.00,
        currentPrice: 120.00,
        videoSrc: "vid/video1.webm",
        thumbColor: "#513682", // Morado Claudia
        bgColor: "#513682",
    },
    {
        id: 102,
        name: "Plan 3 veces por semana",
        originalPrice: 300.00,
        currentPrice: 250.00,
        videoSrc: "vid/video2.webm",
        thumbColor: "#18C79A", // Verde Claudia
        bgColor: "#18C79A",
    },
    {
        id: 103,
        name: "Asesoría Grupal",
        originalPrice: 200.00,
        currentPrice: 180.00,
        videoSrc: "vid/video3.webm",
        thumbColor: "#18C79A", // Verde Claudia
        bgColor: "#18C79A",
    }
];

let currentIndex = 0;
let isMuted = true;

let track;
let dotsEl;
let cardContainer;

function buildSlides() {
    track = document.getElementById('carouselTrack');
    dotsEl = document.getElementById('dots');
    cardContainer = document.getElementById('productCardContainer');

    track.innerHTML = '';
    dotsEl.innerHTML = '';

    products.forEach((p, i) => {
        const slide = document.createElement('div');
        slide.className = 'slide' + (i === currentIndex ? ' active' : '');
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
            video.style.width = '100%';
            video.style.height = '100%';
            video.style.display = 'block';
            if (i === currentIndex) {
                video.autoplay = true;
                video.setAttribute('autoplay', '');
            }
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
        track.appendChild(slide);

        const dot = document.createElement('button');
        dot.className = 'dot' + (i === currentIndex ? ' active' : '');
        dot.onclick = () => goTo(i);
        dotsEl.appendChild(dot);
    });

    renderCard();
    updateTrack(false);
}

function renderCard() {
    const p = products[currentIndex];

    cardContainer.innerHTML = `
        <div class="product-card">
            <div class="product-info">
                <div class="product-name">${p.name}</div>
                <div class="price-row">
                    <span class="price-original">S/. ${p.originalPrice.toFixed(2)}</span>
                    <span class="price-current">S/. ${p.currentPrice.toFixed(2)}</span>
                </div>
            </div>

            <button class="btn-cart" onclick="agregarAlCarrito(${p.id})">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="9" cy="21" r="1"/>
                    <circle cx="20" cy="21" r="1"/>
                    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
                </svg>
            </button>
        </div>`;
}

function updateTrack(animate = true) {
    const slides = document.querySelectorAll('.slide');

    // Calcular offset: el slide activo siempre se centra
    // Para eso, necesitamos saber el ancho total y posicionar el slide activo en el centro
    slides.forEach((slide, index) => {
        const isActive = index === currentIndex;
        slide.classList.toggle('active', isActive);
    });

    const dots = document.querySelectorAll('.dot');
    dots.forEach((d, i) => d.classList.toggle('active', i === currentIndex));

    // El carrusel usa flexbox y perspective, así que la animación es más visual que por offsetX
    track.style.transition = animate ? 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)' : 'none';
}

function goTo(index) {
    stopVideo(currentIndex);
    // Navegación circular: si es negativo, va al final; si excede, va al principio
    currentIndex = ((index % products.length) + products.length) % products.length;
    updateTrack(true);
    renderCard();
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
    if (muted) {
        return `
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                <line x1="23" y1="9" x2="17" y2="15"></line>
                <line x1="17" y1="9" x2="23" y2="15"></line>
            </svg>
        `;
    } else {
        return `
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
                <path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path>
            </svg>
        `;
    }
}

// Inicialización
document.addEventListener('DOMContentLoaded', function () {
    buildSlides();
    setTimeout(() => { updateTrack(false); playVideo(0); }, 200);

    // Navegación con flechas - Navegación circular
    document.getElementById('prevBtn').addEventListener('click', () => goTo(currentIndex - 1));
    document.getElementById('nextBtn').addEventListener('click', () => goTo(currentIndex + 1));

    // Soporte para teclado
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') goTo(currentIndex - 1);
        if (e.key === 'ArrowRight') goTo(currentIndex + 1);
    });
});

window.addEventListener('resize', () => updateTrack(false));