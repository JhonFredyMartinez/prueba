const url = "http://localhost:5000/api/productos";
fetch(url);

import { obtainproductos } from "../apiConnection/consumeApi.js";

let productosGlobal = [];
let laboratoriosMap = {};
let categoriasMap={};

// Espera que el DOM esté listo
document.addEventListener("DOMContentLoaded", () => {
  cargarLaboratorios();
  cargarcategorias();
});

async function cargarLaboratorios() {
  const res = await fetch("http://localhost:5000/api/laboratorios");
  const labs = await res.json();

  // Convertir a mapa para acceso rápido
  laboratoriosMap = Object.fromEntries(labs.map(l => [l.id, l.nombre]));

  getproductos();
}

async function cargarcategorias() {
    const res = await fetch("http://localhost:5000/api/categorias");
    const cats = await res.json();
  
    // Convertir a mapa para acceso rápido
    categoriasMap = Object.fromEntries(cats.map(l => [l.id, l.nombre]));
  
    getproductos();
  }

async function getproductos() {
  const productosObteined = await obtainproductos();
  productosGlobal = productosObteined;
  renderizarProductos(productosObteined);

  // Escuchar filtros
  document.getElementById("search-input").addEventListener("input", aplicarFiltros);
  document.getElementById("laboratorio-filter").addEventListener("change", aplicarFiltros);
  document.getElementById("categoria-filter").addEventListener("change", aplicarFiltros);
  document.getElementById("disponibilidad-filter").addEventListener("change", aplicarFiltros);
  document.getElementById("precio-filter").addEventListener("change", aplicarFiltros);
}

function aplicarFiltros() {
  const texto = document.getElementById("search-input").value.toLowerCase();
  const filtroLab = document.getElementById("laboratorio-filter").value;
  const filtroCat = document.getElementById("categoria-filter").value;
  const filtroDisp = document.getElementById("disponibilidad-filter").value;
  const ordenPrecio = document.getElementById("precio-filter").value;

  let filtrados = productosGlobal.filter(p => {
    const nombreMatch = p.nombre.toLowerCase().includes(texto);
    const descMatch = p.descripcion?.toLowerCase().includes(texto);
    const idMatch = p.id.toString().includes(texto);

    const laboratorioMatch = !filtroLab || p.laboratorio_id == filtroLab;
    const categoriaMatch = !filtroCat || p.categoria_id == filtroCat;
    const dispMatch = !filtroDisp || p.disponibilidad === filtroDisp;

    console.log("Comparando:", p.categoria_id, filtroCat);
    return (nombreMatch || descMatch || idMatch) && laboratorioMatch && categoriaMatch && dispMatch;
  });

  if (ordenPrecio === "asc") {
    filtrados.sort((a, b) => a.precio_venta - b.precio_venta);
  } else if (ordenPrecio === "desc") {
    filtrados.sort((a, b) => b.precio_venta - a.precio_venta);
  }

  renderizarProductos(filtrados);
}

function renderizarProductos(productos) {
  const container = document.querySelector('#productos-container');
  container.innerHTML = '';

  productos.forEach((product) => {
    const {
      id,
      nombre,
      categoria_id,
      laboratorio_id,
      precio_venta,
      iva,
      disponibilidad,
      imagen
    } = product;

    const imgSrc = imagen && imagen !== ''
      ? `/frontend/img/${imagen}`
      : '/images/default-product.png';

    const precioFormateado = `$${Number(precio_venta).toLocaleString('es-CO')}`;

    let stockHTML = '';
    let addToCartHTML = '';

    if (disponibilidad === 'disponible' || disponibilidad === 'se_consigue') {
      const label = disponibilidad === 'disponible' ? 'Disponible' : 'Se consigue';
      const bgColor = disponibilidad === 'disponible' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800';

      stockHTML = `<span class="px-2 py-1 ${bgColor} text-xs rounded-full">${label}</span>
        <div class="d-flex align-items-center gap-2 mb-4">
          <label class="form-label mb-0">Unidades:</label>
          <input type="number" id="unidades" class="form-control border border-primary rounded-3 shadow fw-semibold text-center" value="1" min="1" style="width: 80px; border-width: 2px; background-color: #fdfdfd;">
        </div>`;

      addToCartHTML = `
        <div class="mt-4">
          <button onclick="agregarAlCarrito(${id})" class="w-full bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition">
            🛒 Agregar al carrito
          </button>
        </div>`;
    } else {
      stockHTML = `<span class="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">Agotado</span>`;
      addToCartHTML = `
        <button disabled class="mt-4 w-full bg-gray-300 text-gray-500 px-4 py-2 rounded cursor-not-allowed">
          No disponible
        </button>`;
    }

    const llevaiva = iva == 0.19
      ? `<span class="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Iva: Si</span>`
      : `<span class="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">Iva: No</span>`;

    const nombreLaboratorio = laboratoriosMap[laboratorio_id] || "Laboratorio desconocido";

    const card = document.createElement("div");
    card.className = "bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition";

    card.innerHTML = `
      <div class="bg-gray-100 rounded-lg overflow-hidden h-40 flex items-center justify-center">
        <img src="${imgSrc}" alt="${nombre}" class="w-full h-full object-cover" loading="lazy">
      </div>
      <h3 class="text-lg font-semibold mt-2">${nombre}</h3>
      <p class="text-gray-600">${nombreLaboratorio}</p>
      <p class="text-blue-600 font-bold mt-1">${precioFormateado}</p>
      <div class="mt-2">${llevaiva}</div>
      <div class="mt-2">${stockHTML}</div>
      ${addToCartHTML}`;

    container.appendChild(card);
  });
}
