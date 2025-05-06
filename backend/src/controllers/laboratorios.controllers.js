import getConnection from "./../db/database.js"
const getlaboratorios = async (req, res)=>{
    try {
    const connection = await getConnection();
    const result=await connection.query("SELECT id, nombre, direccion, telefono, created_at, updated_at FROM laboratorios")
    res.json(result);
    } catch (error) {
        console.error("error 500");
    }
}

const postlaboratoriosADMIN = async (req,res)=>{
    try {
        console.log("BODY:", req.body);
    
        const {
          nombre,
          direccion,
          telefono
        } = req.body;


        const created_at = new Date();
    
        const laboratory = {
          nombre,
          direccion,
          telefono,
          created_at,
        };
       const connection = await getConnection();
       const result=await connection.query("INSERT INTO laboratorios SET ?",laboratory)
        
        res.json(result)

    } catch (error) {
        console.error("error 500");
    }
}

const deletelaboratoriosADMIN= async (req, res)=>{
    try {
        console.log("id de laboratorio a borrar",req.body);
        const{id}=req.body
    const connection = await getConnection();
    const result=await connection.query("DELETE FROM laboratorios WHERE id =?",id)
    res.json(result);
    } catch (error) {
        console.error("error 500");
    }
}

const updatelaboratoriosADMIN = async (req,res)=>{
    try {

        const {
          id,
          nombre,
          direccion,
          telefono
        } = req.body;
    
        const updated_at = new Date();
    
        console.log(id);
    
        const id1 =id;
    
        const category = {
          nombre,
          direccion,
          telefono,
          updated_at,
        };
            const connection = await getConnection();
            const result=await connection.query("UPDATE laboratorios SET ? WHERE id= ? ",[category, id1])
            
            res.json(result)
            
        } catch (error) {
            console.error("error 500");
        }
}
export const mthodHTTP={
    getlaboratorios,
    postlaboratoriosADMIN,
    deletelaboratoriosADMIN,
    updatelaboratoriosADMIN
}