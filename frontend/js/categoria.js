const url = "http://localhost:5000/api/categorias"
fetch(url);

import { obtainCategories } from "../apiConnection/consumeApi.js"

document.addEventListener("DOMContentLoaded", () => {
    getCategories();
});

async function getCategories() {
    const categoriesObteined = await obtainCategories();
    const select = document.querySelector('#categoria-filter');

    if (!select) return;

    categoriesObteined.forEach(category => {
        const option = document.createElement('option');
        option.value = category.id.toString();
        option.textContent = category.nombre;
        select.appendChild(option);
    });
} 
