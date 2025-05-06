import getConnection from "./../db/database.js";
import multer from "multer";
import path from "path";

const getProductosADMIN = async (req, res) => {
  try {
    const connection = await getConnection();
    const result = await connection.query(
      "SELECT id, codigo_interno, nombre,  descripcion, categoria_id, laboratorio_id, precio_venta, iva, disponibilidad, imagen, created_at, updated_at FROM productos"
    );
    res.json(result);
  } catch (error) {
    console.error("error 500");
  }
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "../frontend/img"); // asegúrate que esta ruta exista y sea correcta
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

export default upload;

const postProductosADMIN = async (req, res) => {
  try {
    console.log("BODY:", req.body);
    console.log("FILE:", req.file);

    const {
      codigo_interno,
      nombre,
      descripcion,
      categoria_id,
      laboratorio_id,
      precio_venta,
      iva,
      disponibilidad,
    } = req.body;
    const precio_venta_num = parseFloat(precio_venta);
    const iva_num = parseFloat(iva);

    // El archivo se accede así:
    const imagen = req.file ? req.file.filename : null;
    const created_at = new Date();

    const product = {
      codigo_interno,
      nombre,
      descripcion,
      categoria_id,
      laboratorio_id,
      precio_venta: precio_venta_num,
      iva: iva_num,
      disponibilidad,
      imagen, // guardas el nombre del archivo
      created_at,
    };
    const connection = await getConnection();
    const result = await connection.query(
      "INSERT INTO productos SET ?",
      product
    );

    res.json(result);
  } catch (error) {
    console.error(error);
  }
};

const updateProductosADMIN = async (req, res) => {
  try {

    console.log("BODY:", req.body);
    console.log("FILE:", req.file);

    const {
      id,
      codigo_interno,
      nombre,
      descripcion,
      categoria_id,
      laboratorio_id,
      precio_venta,
      iva,
      disponibilidad,
    } = req.body;
    const precio_venta_num = parseFloat(precio_venta);
    const iva_num = parseFloat(iva);

    // El archivo se accede así:
    const imagen = req.file ? req.file.filename : req.body.imagenNombreActual;

    if (req.file) {
      product.imagen = req.file.filename;
    }
    const updated_at = new Date();

    console.log(id);

    const id1 =id;

    
    const product = {
      codigo_interno,
      nombre,
      descripcion,
      categoria_id,
      laboratorio_id,
      precio_venta: precio_venta_num,
      iva: iva_num,
      disponibilidad,
      imagen, // guardas el nombre del archivo
      updated_at,
    };
    const connection = await getConnection();
    const result = await connection.query(
      "UPDATE productos SET ? WHERE id= ? ",
      [product, id1]
    );

    res.json(result);
  } catch (error) {
    console.error("error 500");
  }
};

const deleteProductosADMIN= async (req, res)=>{
  try {
      console.log("id de categoria a borrar",req.body);
      const{id}=req.body
  const connection = await getConnection();
  const result=await connection.query("DELETE FROM productos WHERE id=?",id)
  res.json(result);
  } catch (error) {
      console.error("error 500");
  }
}

export const mthodHTTP = {
  getProductosADMIN,
  updateProductosADMIN,
  postProductosADMIN,
  deleteProductosADMIN
};
