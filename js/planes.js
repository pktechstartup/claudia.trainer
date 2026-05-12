const products = [
    {
        id: 101,
        name: "Asesoría Definición",
        originalPrice: 150.00,
        currentPrice: 120.00,
        videoSrc: "vid/vid_1.mp4",
        thumbColor: "#513682", // Morado Claudia
        bgColor: "#513682",
    },
    {
        id: 102,
        name: "Asesoría 1 a 1 VIP",
        originalPrice: 300.00,
        currentPrice: 250.00,
        videoSrc: "vid/vid_2.mp4",
        thumbColor: "#18C79A", // Verde Claudia
        bgColor: "#18C79A",
    }
];

let currentIndex = 0;
let isMuted = true;

const track = document.getElementById('carouselTrack');
const dotsEl = document.getElementById('dots');
const cardContainer = document.getElementById('productCardContainer');

function buildSlides() {
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
            video.muted = true;
            video.playsInline = true;
            video.preload = 'auto';
            vw.appendChild(video);
        }

        const muteBtn = document.createElement('button');
        muteBtn.className = 'mute-btn';
        muteBtn.innerHTML = muteIcon(isMuted);
        muteBtn.onclick = (e) => { e.stopPropagation(); toggleMute(); };
        vw.appendChild(muteBtn);

        slide.appendChild(vw);
        slide.onclick = () => goTo(i);
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
    const savings = (p.originalPrice - p.currentPrice).toFixed(2);
    cardContainer.innerHTML = `
        <div class="product-card">
            <div class="product-thumb" style="background:${p.thumbColor}">
                <img src="img/icono-plan.png" style="width:100%; height:100%; object-fit:contain;">
            </div>
            <div class="product-info">
                <div class="product-name">${p.name}</div>
                <div class="price-row">
                    <span class="price-original">S/. ${p.originalPrice.toFixed(2)}</span>
                    <span class="price-current">S/. ${p.currentPrice.toFixed(2)}</span>
                    <span class="badge-savings">Ahorras S/. ${savings}</span>
                </div>
            </div>
            <button class="btn-cart" onclick="agregarAlCarrito(${p.id})">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
            </button>
        </div>`;
}

// ... (Copia aquí las funciones updateTrack, goTo, toggleMute y muteIcon de tu código original)
// Solo asegúrate de añadir esta línea al final de goTo:
function goTo(index) {
    stopVideo(currentIndex);
    currentIndex = (index + products.length) % products.length;
    updateTrack();
    renderCard();
    playVideo(currentIndex);
}

// Inicialización
buildSlides();
setTimeout(() => { updateTrack(false); playVideo(0); }, 100);
window.addEventListener('resize', () => updateTrack(false));