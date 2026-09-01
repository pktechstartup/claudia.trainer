/* ========================================
   products.js — Lógica de productos
   Fuente de datos: data/products.json
   ======================================== */

let productos = [];

function buildCardHTML(p, isCarousel) {
    const cardClass = isCarousel ? 'product-card carousel-card' : 'product-card';
    return `
        <div class="${cardClass}">
            ${p.estado ? `<span class="badge">${p.estado}</span>` : ''}
            <img src="${p.imagen}" alt="${p.nombre}" onerror="this.src='https://via.placeholder.com/150?text=Suplemento'">
            <div class="info">
                <span class="brand">${p.laboratorio}</span>
                <h3>${p.nombre}</h3>
                <p class="price">S/ ${p.precio.toFixed(2)}</p>
                ${p.promo ? `<p class="promo-tag">${p.promo}</p>` : ''}
                <div class="card-buttons">
                    <button onclick="agregarAlCarrito(${p.id})" class="btn-add">Añadir al carrito</button>
                    <button onclick="comprarDirecto(${p.id})" class="btn-now">Comprar ahora</button>
                </div>
            </div>
        </div>
    `;
}

function renderizar(data, isHome = false) {
    const container = document.getElementById('productsGrid');

    if (data.length === 0) {
        container.innerHTML = `<p style="text-align:center;padding:50px;width:100%;">No se encontraron productos.</p>`;
        container.className = 'products-grid';
        return;
    }

    if (isHome) {
        container.className = 'home-layout';
        let htmlFinal = '';

        let promos = data.filter(p => p.promo !== null);
        if (promos.length > 0) {
            promos.sort((a, b) => {
                if (a.destacado && !b.destacado) return -1;
                if (!a.destacado && b.destacado) return 1;
                return 0;
            });
            htmlFinal += buildCarousel('Promociones del mes', promos, false);
        }

        let novedades = data.filter(p => p.estado !== null);
        if (novedades.length > 0) {
            novedades.sort((a, b) => (a.destacado === b.destacado) ? 0 : a.destacado ? -1 : 1);
            htmlFinal += buildCarousel('Novedades y Restock', novedades, false);
        }

        const shuffled = [...data].sort(() => 0.5 - Math.random());
        const random5 = shuffled.slice(0, 5);
        htmlFinal += buildCarousel('Descubre', random5, true);

        container.innerHTML = htmlFinal;
    } else {
        container.className = 'products-grid';
        container.innerHTML = data.map(p => buildCardHTML(p, false)).join('');
    }
}

function buildCarousel(titulo, productosData, showVerTodos) {
    const cards = productosData.map(p => buildCardHTML(p, true)).join('');
    const carouselId = 'carousel-' + Math.random().toString(36).substr(2, 9);

    let headerHtml = `<h2 class="carousel-title">${titulo}</h2>`;
    if (showVerTodos) {
        headerHtml = `
            <div class="carousel-header">
                <h2 class="carousel-title" style="margin-bottom:0;">${titulo}</h2>
                <button onclick="verTodosGrid()" class="btn-ver-todos-text">Ver todos &rarr;</button>
            </div>
        `;
    }

    return `
        <div class="carousel-section">
            ${headerHtml}
            <div class="carousel-wrapper">
                <button class="carousel-arrow left-arrow" onclick="scrollCarousel('${carouselId}', -1)">&#10094;</button>
                <div class="carousel-container" id="${carouselId}">
                    ${cards}
                    ${showVerTodos ? `
                    <div class="product-card carousel-card ver-todos-card" onclick="verTodosGrid()">
                        <span>Ver todo el <br> catálogo &rarr;</span>
                    </div>
                    ` : ''}
                </div>
                <button class="carousel-arrow right-arrow" onclick="scrollCarousel('${carouselId}', 1)">&#10095;</button>
            </div>
        </div>
    `;
}

function scrollCarousel(id, direccion) {
    const container = document.getElementById(id);
    container.scrollBy({ left: 300 * direccion, behavior: 'smooth' });
}

function verTodosGrid() {
    document.querySelectorAll('#categoryFilters .cat-link').forEach(b => b.classList.remove('active'));
    const btnTodos = document.querySelector('.cat-link[data-category="todos"]');
    if (btnTodos) btnTodos.classList.add('active');

    const productosActivos = productos.filter(p => p.activo === true);
    renderizar(productosActivos, false);
    window.scrollTo({ top: document.getElementById('productsGrid').offsetTop - 20, behavior: 'smooth' });
}

function agregarAlCarrito(id) {
    const producto = productos.find(p => p.id === id);
    if (producto) {
        agregarItemAlCarrito(producto.nombre, producto.precio);
    }
}

function comprarDirecto(id) {
    const producto = productos.find(p => p.id === id);
    if (!producto) return;

    const numeroWhatsApp = "51960510332";
    const mensaje = `¡Hola Claudia! Quiero comprar este producto:\n\n• ${producto.nombre}\nMarca: ${producto.laboratorio}\nPrecio: S/ ${producto.precio.toFixed(2)}\n\nMe gustaría coordinar el pedido por WhatsApp.`.trim();
    window.open(`https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(mensaje)}`, "_blank", "noopener,noreferrer");
}

/* ========================================
   Inicialización: cargar JSON y arrancar
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {
    fetch('data/products.json')
        .then(response => {
            if (!response.ok) throw new Error('Error cargando productos');
            return response.json();
        })
        .then(data => {
            productos = data;
            const productosActivos = productos.filter(p => p.activo === true);

            renderizar(productosActivos, true);

            document.getElementById('searchInput').addEventListener('input', (e) => {
                const term = e.target.value.toLowerCase().trim();
                const filtrados = productosActivos.filter(p =>
                    p.nombre.toLowerCase().includes(term) ||
                    p.laboratorio.toLowerCase().includes(term)
                );
                renderizar(filtrados, false);
            });

            document.getElementById('categoryFilters').addEventListener('click', (e) => {
                const btn = e.target.closest('.cat-link');
                if (!btn) return;

                document.querySelectorAll('#categoryFilters .cat-link').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                const cat = btn.dataset.category;

                if (cat === 'principal') {
                    renderizar(productosActivos, true);
                } else if (cat === 'todos') {
                    renderizar(productosActivos, false);
                } else {
                    const filtrados = productosActivos.filter(p => p.categoria === cat);
                    renderizar(filtrados, false);
                }
            });
        })
        .catch(error => {
            console.error('Error:', error);
            document.getElementById('productsGrid').innerHTML =
                '<p style="text-align:center;padding:50px;width:100%;color:red;">Error al cargar los productos. Intenta recargar la página.</p>';
        });
});
