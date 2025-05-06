const url = "http://localhost:5000/api/categorias";
fetch(url);
import { obtainCategories } from "../apiConnection/consumeApi.js";

let categoriasFiltrables = [];

async function getADMINCategories() {
  const categoriesObteined = await obtainCategories();
  categoriasFiltrables = categoriesObteined; // guardamos la lista original
  renderizarCategorias(categoriesObteined);
}

function renderizarCategorias(lista) {
  const container = document.querySelector("#categoria-filter");
  container.innerHTML = "";

  lista.forEach((category) => {
    const { id, nombre, descripcion } = category;
    const row = document.createElement("tr");
    row.innerHTML = `
      <td class="p-2">${id}</td>
      <td class="p-2">${nombre}</td>
      <td class="p-2">${descripcion}</td>
      <td class="p-2 flex gap-2">
        <button class="editar bg-yellow-400 px-3 py-1 text-white rounded hover:bg-yellow-500" data-id="${id}">Editar</button>
        <button class="eliminar bg-red-500 px-3 py-1 text-white rounded hover:bg-red-600" data-id="${id}">Eliminar</button>
      </td>
    `;
    container.appendChild(row);
  });

  document.querySelectorAll(".editar").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const idSeleccionado = e.target.dataset.id;
      const categoria = categoriasFiltrables.find((p) => p.id == idSeleccionado);
      cargarEnFormulario(categoria);
    });
  });

  document.querySelectorAll(".eliminar").forEach((btn) => {
    btn.addEventListener("click", async (e) => {
      const idSeleccionado = e.target.dataset.id;

      const { value: confirmacion } = await Swal.fire({
        title: 'Confirmación requerida',
        text: 'Para eliminar esta categoria, escribe: "eliminar"',
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
        const response = await fetch("http://localhost:5000/api/categorias", {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ id: idSeleccionado })
        });

        if (response.ok) {
          Swal.fire({
            icon: 'success',
            title: '¡Categoria eliminada!',
            text: 'Se eliminó correctamente.',
            confirmButtonText: 'OK'
          }).then(() => {
            location.reload();
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: '¡Error!',
            text: 'No se pudo eliminar la categoria.',
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

document.addEventListener("DOMContentLoaded", () => {
  getADMINCategories();

  const buscador = document.querySelector("input[placeholder='Buscar Categoría...']");
  buscador.addEventListener("input", (e) => {
    const texto = e.target.value.toLowerCase();
    const resultados = categoriasFiltrables.filter(cat => {
      const matchNombre = cat.nombre.toLowerCase().includes(texto);
      const matchID = cat.id.toString().includes(texto);
      return matchNombre || matchID;
    });
    renderizarCategorias(resultados);
  });
});

function cargarEnFormulario(categoria) {
  document.getElementById("nombre").value = categoria.nombre;
  document.getElementById("descripcion").value = categoria.descripcion;
  document.getElementById("formulario-producto").dataset.id = categoria.id;
}
