
let carrito = JSON.parse(localStorage.getItem('carritoClaudia')) || [];

function agregarItemAlCarrito(nombreItem, precioItem) {
    carrito.push({ nombre: nombreItem, precio: parseFloat(precioItem) });
    guardarCarrito();
    actualizarInterfazCarrito();
    const sidebar = document.getElementById('cart-sidebar');
    if (sidebar) sidebar.classList.add('active');
}

function eliminarDelCarrito(index) {
    carrito.splice(index, 1);
    guardarCarrito();
    actualizarInterfazCarrito();
}

function guardarCarrito() {
    localStorage.setItem('carritoClaudia', JSON.stringify(carrito));
}

function actualizarInterfazCarrito() {
    const cartItems = document.getElementById('cart-items');
    const cartCount = document.getElementById('cart-count');
    const cartTotal = document.getElementById('cart-total');

    if (!cartItems || !cartCount || !cartTotal) return;

    cartCount.innerText = carrito.length;

    cartItems.innerHTML = carrito.map((p, i) => `
        <div class="cart-item" style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;border-bottom:1px solid #eee;padding-bottom:8px;">
            <div>
                <p style="font-size:0.85rem;margin:0;line-height:1.2;font-family:'Nunito Sans', sans-serif;font-weight:700;">${p.nombre}</p>
                <small style="color:var(--morado);font-weight:800;">S/ ${p.precio.toFixed(2)}</small>
            </div>
            <button onclick="eliminarDelCarrito(${i})" style="background:none;border:none;color:#ff4d4d;cursor:pointer;font-size:1.2rem;transition:transform 0.2s;" onmouseover="this.style.transform='scale(1.1)'" onmouseout="this.style.transform='scale(1)'">🗑️</button>
        </div>
    `).join('');

    const total = carrito.reduce((sum, p) => sum + p.precio, 0);
    cartTotal.innerText = total.toFixed(2);
}

function toggleCart() {
    const sidebar = document.getElementById('cart-sidebar');
    if (sidebar) sidebar.classList.toggle('active');
}

function toggleMenu() {
    const nav = document.getElementById('mobileNav');
    if (nav) {
        nav.classList.toggle('active');
    }
}

function enviarWhatsApp() {
    if (carrito.length === 0) {
        alert("El carrito está vacío. ¡Agrega algunos productos o planes primero!");
        return;
    }

    let mensaje = "¡Hola Claudia! Deseo realizar el siguiente pedido:\n\n";
    carrito.forEach(p => {
        mensaje += `• ${p.nombre} (S/ ${p.precio.toFixed(2)})\n`;
    });

    const total = carrito.reduce((sum, p) => sum + p.precio, 0);
    mensaje += `\nTotal a pagar: S/ ${total.toFixed(2)}`;

    window.open(`https://wa.me/51960510332?text=${encodeURIComponent(mensaje)}`, '_blank');
}

document.addEventListener('DOMContentLoaded', () => {
    actualizarInterfazCarrito();
});
