import getConnection from "./../db/database.js"

const getADMINusuarios = async (req, res)=>{
    try {
    const connection = await getConnection();
    const result=await connection.query("SELECT id, nombre_drogueria, nombres, apellidos, tipo_documento, numero_documento, email, telefono, departamento, ciudad, direccion FROM usuarios")
    res.json(result);
    } catch (error) {
        console.error("error 500");
    }

}
export const mthodHTTP={
    getADMINusuarios
}