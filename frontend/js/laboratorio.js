const url="http://localhost:5000/api/laboratorios"
fetch (url)
/*.then(resultado=>{
    
    return resultado.json();
})
.then(data=>{
   
   showndata(data)
})*/
import { obtainLaboratories } from "../apiConnection/consumeApi.js"

document.addEventListener("DOMContentLoaded",()=>{
    getLaboratories();
})



async function getLaboratories(){
    const laboratoriesObteined= await obtainLaboratories();
    const container = document.querySelector('laboratorio-filter')
    laboratoriesObteined.forEach((laboratory)=>{
        const {id, nombre, created_at, updated_at} =laboratory
        const row= document.createElement('tr');
        row.innerHTML=`
        <td>
        ${id}
        </td>
        <td>
        ${nombre}
        </td>
        `;
        container.appendChild(row)
    })
    
    
}
