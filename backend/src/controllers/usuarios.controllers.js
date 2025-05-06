import getConnection from "./../db/database.js";
import bcrypt from "bcryptjs";

const getUsuarios = async (req, res) => {
  try {
    const connection = await getConnection();
    const result = await connection.query(
      "SELECT id, nombre_drogueria, nombres, apellidos, tipo_documento, numero_documento, email, telefono, departamento, ciudad, direccion, rol, created_at, updated_at, deleted_at FROM usuarios"
    );
    res.json(result);
  } catch (error) {
    console.error("Error al obtener usuarios:", error);
    res.status(500).json({ success: false, message: "Error al obtener usuarios" });
  }
};

const postUsuarios = async (req, res) => {
  try {
    console.log("Datos recibidos en el servidor:", req.body);

    const {
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
      password,
    } = req.body;

    const connection = await getConnection();

    // Validar si ya existe el documento
    const usuarioPorDocumento = await connection.query(
      "SELECT id FROM usuarios WHERE numero_documento = ?",
      [numero_documento]
    );
    if (usuarioPorDocumento.length > 0) {
      return res.status(400).json({
        success: false,
        message: "El número de documento ya está registrado.",
      });
    }

    // Validar si ya existe el correo
    const usuarioPorEmail = await connection.query(
      "SELECT id FROM usuarios WHERE email = ?",
      [email]
    );
    if (usuarioPorEmail.length > 0) {
      return res.status(400).json({
        success: false,
        message: "El correo electrónico ya está registrado.",
      });
    }

    // Cifrar contraseña
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Crear nuevo usuario
    const created_at = new Date();
    const usuary = {
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
      password: hashedPassword,
      rol: "cliente",
      created_at,
    };

    const result = await connection.query("INSERT INTO usuarios SET ?", [usuary]);

    if (result.affectedRows > 0) {
      res.json({ success: true, message: "Usuario creado correctamente" });
    } else {
      res.status(500).json({ success: false, message: "No se pudo crear el usuario." });
    }

  } catch (error) {
    console.error("Error al registrar usuario:", error);
    res.status(500).json({ success: false, message: "Error del servidor." });
  }
};

export const mthodHTTP = {
  getUsuarios,
  postUsuarios,
};
