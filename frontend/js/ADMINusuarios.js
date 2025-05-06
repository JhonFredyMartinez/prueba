const url = "http://localhost:5000/api/ADMINusuarios";
fetch(url);

import { obtainADMINusuarios } from "../apiConnection/consumeApi.js";

let usuariosFiltrables = [];

document.addEventListener("DOMContentLoaded", () => {
  getADMINusuarios();

  const buscador = document.querySelector("input[placeholder='Buscar usuario...']");
  if (buscador) {
    buscador.addEventListener("input", (e) => {
      const texto = e.target.value.toLowerCase();
      const resultados = usuariosFiltrables.filter(user => {
        const matchID = user.id.toString().includes(texto);
        const matchNombre = (user.nombres + " " + user.apellidos).toLowerCase().includes(texto);
        const matchDocumento = user.numero_documento.toString().includes(texto);
        return matchID || matchNombre || matchDocumento;
      });
      renderizarUsuarios(resultados);
    });
  }
});

async function getADMINusuarios() {
  const ADMINusuariosObteined = await obtainADMINusuarios();
  usuariosFiltrables = ADMINusuariosObteined;
  renderizarUsuarios(ADMINusuariosObteined);
}

function renderizarUsuarios(lista) {
  const container = document.querySelector("#usuarios-filter");
  container.innerHTML = "";

  lista.forEach((users) => {
    const {
      id,
      nombre_drogueria,
      nombres,
      apellidos,
      tipo_documento,
      numero_documento,
      email,
      telefono,
      departamento,
      ciudad,
      direccion,
    } = users;

    const row = document.createElement("tr");
    row.innerHTML = `
      <td class="p-2">${id}</td>
      <td class="p-2">${nombres} ${apellidos}</td>
      <td class="p-2">${numero_documento}</td>
      <td class="p-2">${telefono}</td>
      <td class="p-2">${ciudad}</td>
      <td class="p-2">${direccion}</td>
    `;

    container.appendChild(row);
  });
}
