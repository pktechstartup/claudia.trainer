/* ============================================================
   CARRITO.JS - Lógica Universal del Carrito (con LocalStorage)
   ============================================================ */

// 1. Inicializar carrito desde la memoria del navegador (o vacío si es la primera vez)
let carrito = JSON.parse(localStorage.getItem('carritoClaudia')) || [];

// 2. Función universal para agregar cualquier cosa (Planes o Productos)
function agregarItemAlCarrito(nombreItem, precioItem) {
    carrito.push({ nombre: nombreItem, precio: parseFloat(precioItem) });
    guardarCarrito();
    actualizarInterfazCarrito();

    // Abre el sidebar automáticamente para que el usuario vea que se agregó
    const sidebar = document.getElementById('cart-sidebar');
    if (sidebar) sidebar.classList.add('active');
}

// 3. Eliminar un item
function eliminarDelCarrito(index) {
    carrito.splice(index, 1);
    guardarCarrito();
    actualizarInterfazCarrito();
}

// 4. Guardar en memoria
function guardarCarrito() {
    localStorage.setItem('carritoClaudia', JSON.stringify(carrito));
}

// 5. Actualizar los textos e interfaz visual del carrito
function actualizarInterfazCarrito() {
    const cartItems = document.getElementById('cart-items');
    const cartCount = document.getElementById('cart-count');
    const cartTotal = document.getElementById('cart-total');

    // Evitar errores si la página actual no tiene el HTML del carrito
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

// 6. Abrir / Cerrar el menú lateral
function toggleCart() {
    const sidebar = document.getElementById('cart-sidebar');
    if (sidebar) sidebar.classList.toggle('active');
}
// 9. Abrir / Cerrar el menú lateral (Hamburguesa)
function toggleMenu() {
    const nav = document.getElementById('mobileNav');
    if (nav) {
        nav.classList.toggle('active');
    }
}
// 7. Enviar a WhatsApp
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

// 8. Auto-renderizar el carrito al cargar cualquier página de la web
document.addEventListener('DOMContentLoaded', () => {
    actualizarInterfazCarrito();
});
