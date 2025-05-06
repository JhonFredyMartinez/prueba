import getConnection from "./../db/database.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";

const postlogin = async (req, res) => {
  try {
    const { numero_documento, password } = req.body;
    console.log("Body recibido:", req.body);

    const connection = await getConnection();

    // ✅ Hacer la consulta y acceder correctamente al usuario
    const result = await connection.query(
      "SELECT id, numero_documento, password, rol FROM usuarios WHERE numero_documento = ?",
      [numero_documento]
    );

    console.log("result:",result);
    
    const usuario = result[0]; // ← Aquí está el truco

    console.log("Resultado MySQL:", usuario);

    if (!usuario) {
      return res.status(401).json({
        success: false,
        message: "Usuario no encontrado",
      });
    }

    // ✅ Verificar contraseña
    const passwordMatch = await bcrypt.compare(password, usuario.password);

    if (!passwordMatch) {
      return res.status(401).json({
        success: false,
        message: "Contraseña incorrecta",
      });
    }

    // ✅ Generar JWT
    const token = jwt.sign(
      {
        id: usuario.id,
        numero_documento: usuario.numero_documento,
        rol: usuario.rol,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: false, // true solo si estás en HTTPS
      sameSite: "lax", // o "None" si usas HTTPS cruzado
      maxAge: 60 * 60 * 1000 // 1 hora
    });

    res.send({usuario, token})
    

    // ✅ Responder con éxito
    return res.json({
      success: true,
      redirectTo: usuario.rol === "admin" ? "/frontend/ADMINproductos.html" : "/frontend/home.html",
      user: {
        id: usuario.id,
        numero_documento: usuario.numero_documento,
        rol: usuario.rol,
      },
    });


  } catch (error) {
    console.error("Error en login:", error);
    return res.status(500).json({ success: false, message: "Error del servidor" });
  }
};

const getMe = (req, res) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ success: false, message: "No autenticado" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return res.json({
      success: true,
      user: decoded,
    });
  } catch (error) {
    return res.status(401).json({ success: false, message: "Token inválido" });
  }
};



export const mthodHTTP = {
  postlogin,
  getMe,
};
