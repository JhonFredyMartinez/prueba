
import getConnection from "./../db/database.js"



const getcategorias = async (req, res)=>{
    try {
    const connection = await getConnection();
    const result=await connection.query("SELECT id, nombre, descripcion, created_at, updated_at FROM categorias")
    res.json(result);
    } catch (error) {
        console.error("error 500");
    }
}

const postcategoriasADMIN = async (req,res)=>{
    try {
        console.log("BODY:", req.body);
    
        const {
          nombre,
          descripcion,
        } = req.body;


        const created_at = new Date();
    
        const category = {
          nombre,
          descripcion,
          created_at,
        };
       const connection = await getConnection();
       const result=await connection.query("INSERT INTO categorias SET ?",category)
        
        res.json(result)

    } catch (error) {
        console.error("error 500");
    }
}

const updatecategoriasADMIN = async (req,res)=>{
    try {

    const {
      id,
      nombre,
      descripcion,
    } = req.body;

    const updated_at = new Date();

    console.log(id);

    const id1 =id;

    const category = {
      nombre,
      descripcion,
      updated_at,
    };
        const connection = await getConnection();
        const result=await connection.query("UPDATE categorias SET ? WHERE id= ? ",[category, id1])
        
        res.json(result)
        
    } catch (error) {
        console.error("error 500");
    }
}


const deletecategoriasADMIN= async (req, res)=>{
    try {
        console.log("id de categoria a borrar",req.body);
        const{id}=req.body
    const connection = await getConnection();
    const result=await connection.query("DELETE FROM categorias WHERE id =?",id)
    res.json(result);
    } catch (error) {
        console.error("error 500");
    }
}


export const mthodHTTP={
    getcategorias,
    postcategoriasADMIN,
    deletecategoriasADMIN,
    updatecategoriasADMIN,
}