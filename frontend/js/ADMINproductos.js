const url = "http://localhost:5000/api/ADMINproductos";
fetch(url);

import { obtainproductosADMIN } from "../apiConnection/consumeApi.js";

let productosFiltrables = [];

document.addEventListener("DOMContentLoaded", () => {
  getProductosADMIN();

  const buscador = document.querySelector("input[placeholder='Buscar producto...']");
  if (buscador) {
    buscador.addEventListener("input", (e) => {
      const texto = e.target.value.toLowerCase();
      const resultados = productosFiltrables.filter(prod => {
        const matchID = prod.id.toString().includes(texto);
        const matchNombre = prod.nombre.toLowerCase().includes(texto);
        const matchCodigo = prod.codigo_interno.toLowerCase().includes(texto);
        return matchID || matchNombre || matchCodigo;
      });
      renderizarProductos(resultados);
    });
  }
});

async function getProductosADMIN() {
  const productosADMINObteined = await obtainproductosADMIN();
  productosFiltrables = productosADMINObteined;
  renderizarProductos(productosADMINObteined);
}

function renderizarProductos(lista) {
  const container = document.querySelector("#productos-filter");
  container.innerHTML = "";

  lista.forEach((product) => {
    const {
      id,
      codigo_interno,
      nombre,
      descripcion,
      categoria_id,
      laboratorio_id,
      precio_venta,
      iva,
      disponibilidad,
      imagen
    } = product;

    const row = document.createElement("tr");
    row.innerHTML = `
      <td class="p-2">${id}</td>
      <td class="p-2">${nombre}</td>
      <td class="p-2">$${precio_venta}</td>
      <td class="p-2">${iva === 0.19 ? "Sí" : "No"}</td>
      <td class="p-2">
        <span class="font-semibold ${
          disponibilidad === "disponible"
            ? "text-green-600"
            : disponibilidad === "se_consigue"
            ? "text-yellow-500"
            : "text-red-600"
        }">
          ${
            disponibilidad === "disponible"
              ? "Disponible"
              : disponibilidad === "se_consigue"
              ? "Se consigue"
              : "Agotado"
          }
        </span>
      </td>
      <td class="p-2 flex gap-2">
        <button class="editar bg-yellow-400 px-3 py-1 text-white rounded hover:bg-yellow-500" data-id="${id}">Editar</button>
        <button id="eliminar" class="eliminar bg-red-500 px-3 py-1 text-white rounded hover:bg-red-600" data-id="${id}">Eliminar</button>
      </td>
    `;

    container.appendChild(row);
  });

  document.querySelectorAll(".editar").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const idSeleccionado = e.target.dataset.id;
      const producto = productosFiltrables.find(p => p.id == idSeleccionado);
      cargarEnFormulario(producto);
    });
  });

  document.querySelectorAll(".eliminar").forEach((btn) => {
    btn.addEventListener("click", async (e) => {
      const idSeleccionado = e.target.dataset.id;

      const { value: confirmacion } = await Swal.fire({
        title: 'Confirmación requerida',
        text: 'Para eliminar este producto, escribe: "eliminar"',
        input: 'text',
        inputPlaceholder: 'Escribe "eliminar"',
        inputAttributes: {
          autocapitalize: 'off'
        },
        showCancelButton: true,
        confirmButtonText: 'Continuar',
        cancelButtonText: 'Cancelar',
        preConfirm: (valor) => {
          if (valor.trim().toLowerCase() !== "eliminar") {
            Swal.showValidationMessage('Debes escribir exactamente: "eliminar"');
            return false;
          }
        }
      });

      if (confirmacion !== "eliminar") return;

      const { isConfirmed } = await Swal.fire({
        title: '¿Estás completamente seguro?',
        text: "Esta acción no se puede deshacer.",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
      });

      if (!isConfirmed) return;

      try {
        const response = await fetch("http://localhost:5000/api/ADMINproductos", {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ id: idSeleccionado })
        });

        if (response.ok) {
          Swal.fire({
            icon: 'success',
            title: '¡Producto eliminado!',
            text: 'Se eliminó correctamente.',
            confirmButtonText: 'OK'
          }).then(() => {
            location.reload();
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: '¡Error!',
            text: 'No se pudo eliminar el producto.',
            confirmButtonText: 'Entendido'
          });
        }
      } catch (error) {
        console.error("Error al eliminar:", error);
        Swal.fire({
          icon: 'error',
          title: 'Error del servidor',
          text: 'Intenta más tarde.',
          confirmButtonText: 'Cerrar'
        });
      }
    });
  });
}

function cargarEnFormulario(producto) {
  document.getElementById("codigo_i").value = producto.codigo_interno;
  document.getElementById("nombre").value = producto.nombre;
  document.getElementById("descripcion").value = producto.descripcion;
  document.getElementById("precio").value = producto.precio_venta;
  document.getElementById("iva").value = producto.iva;
  document.getElementById("categoria-filter").value = producto.categoria_id;
  document.getElementById("laboratorio-filter").value = producto.laboratorio_id;
  document.getElementById("estado").value = producto.disponibilidad;
  document.getElementById("imagen-nombre-actual").value = producto.imagen;
  document.getElementById("formulario-producto").dataset.id = producto.id;
}
