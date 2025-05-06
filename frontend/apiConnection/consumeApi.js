const urlp="http://localhost:5000/api/productos"
const urlc="http://localhost:5000/api/categorias"
const urll="http://localhost:5000/api/laboratorios"
const urlap="http://localhost:5000/api/ADMINproductos"
const urlau="http://localhost:5000/api/ADMINusuarios"

export const obtainproductos = async ()=>{
    try {
        const resultado = await fetch(urlp);
        const productos = await resultado.json();
        return productos
    } catch (error) {
        console.error("error");
        
    }
}
export const obtainCategories = async ()=>{
    try {
        const resultado = await fetch(urlc);
        const categorias = await resultado.json();
        return categorias
    } catch (error) {
        console.error("error");
        
    }
}
export const obtainLaboratories = async ()=>{
    try {
        const resultado = await fetch(urll);
        const laboratorios = await resultado.json();
        return laboratorios
    } catch (error) {
        console.error("error");
        
    }
}
export const obtainproductosADMIN = async ()=>{
    try {
        const resultado = await fetch(urlap);
        const productos = await resultado.json();
        return productos
    } catch (error) {
        console.error("error");
        
    }
}
export const obtainADMINusuarios = async ()=>{
    try {
        const resultado = await fetch(urlau);
        const usuarios = await resultado.json();
        return usuarios
    } catch (error) {
        console.error("error");
        
    }
}
