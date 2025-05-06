
import getConnection from "./../db/database.js"
const getproductos = async (req, res)=>{
    try {
    const connection = await getConnection();
    const result=await connection.query("SELECT id, nombre, categoria_id, laboratorio_id, precio_venta, iva, disponibilidad, imagen FROM productos")
    res.json(result);
    } catch (error) {
        console.error("error 500");
    }

    
}
export const mthodHTTP={
    getproductos
}
