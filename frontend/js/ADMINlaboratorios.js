const url = "http://localhost:5000/api/laboratorios";
fetch(url);

import { obtainLaboratories } from "../apiConnection/consumeApi.js";

let laboratoriosFiltrables = [];

document.addEventListener("DOMContentLoaded", () => {
  getADMINLaboratories();

  const buscador = document.querySelector("input[placeholder='Buscar laboratorio...']");
  if (buscador) {
    buscador.addEventListener("input", (e) => {
      const texto = e.target.value.toLowerCase();
      const resultados = laboratoriosFiltrables.filter(lab => {
        const matchNombre = lab.nombre.toLowerCase().includes(texto);
        const matchID = lab.id.toString().includes(texto);
        return matchNombre || matchID;
      });
      renderizarLaboratorios(resultados);
    });
  }
});

async function getADMINLaboratories() {
  const laboratoriesObteined = await obtainLaboratories();
  laboratoriosFiltrables = laboratoriesObteined;
  renderizarLaboratorios(laboratoriesObteined);
}

function renderizarLaboratorios(lista) {
  const container = document.querySelector("#laboratorio-filter");
  container.innerHTML = "";

  lista.forEach((laboratory) => {
    const { id, nombre, direccion, telefono } = laboratory;
    const row = document.createElement("tr");
    row.innerHTML = `
      <td class="p-2">${id}</td>
      <td class="p-2">${nombre}</td>
      <td class="p-2">${direccion}</td>
      <td class="p-2">${telefono}</td>
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
      const laboratorio = laboratoriosFiltrables.find((p) => p.id == idSeleccionado);
      cargarEnFormulario(laboratorio);
    });
  });

  document.querySelectorAll(".eliminar").forEach((btn) => {
    btn.addEventListener("click", async (e) => {
      const idSeleccionado = e.target.dataset.id;

      const { value: confirmacion } = await Swal.fire({
        title: 'Confirmación requerida',
        text: 'Para eliminar este laboratorio, escribe: "eliminar"',
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
        const response = await fetch("http://localhost:5000/api/laboratorios", {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ id: idSeleccionado })
        });

        if (response.ok) {
          Swal.fire({
            icon: 'success',
            title: '¡Laboratorio eliminado!',
            text: 'Se eliminó correctamente.',
            confirmButtonText: 'OK'
          }).then(() => {
            location.reload();
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: '¡Error!',
            text: 'No se pudo eliminar el laboratorio.',
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

function cargarEnFormulario(laboratorio) {
  document.getElementById("nombre").value = laboratorio.nombre;
  document.getElementById("direccion").value = laboratorio.direccion;
  document.getElementById("telefono").value = laboratorio.telefono;
  document.getElementById("formulario-laboratorio").dataset.id = laboratorio.id;
}