
import express from "express";
import cors from "cors"
import productosRoutes from "./routes/productos.routes.js"
import categoriasRoutes from "./routes/categorias.routes.js";
import laboratoriosRoutes from "./routes/laboratorios.routes.js";
import loginRoutes from "./routes/login.routes.js";
import sesionRoutes from "./routes/sesion.routes.js";
import usuariosRoutes from "./routes/usuarios.routes.js";
import ADMINproductosRoutes from "./routes/ADMINproductos.routes.js";
import ADMINusuariosRoutes from "./routes/ADMINusuarios.routes.js";
import logoutRoutes from "./routes/auth.routes.js";
/* */
import cookieParser from "cookie-parser";

const app= express();

app.set("port",5000);

app.use(express.json());

app.use(cors({
    origin: 'http://127.0.0.1:5500',
    credentials: true
}));
app.use(cookieParser());

app.use("/api/productos",productosRoutes)
app.use("/api/categorias", categoriasRoutes);
app.use("/api/laboratorios", laboratoriosRoutes);
app.use("/api/login", loginRoutes);
app.use("/api", logoutRoutes);  
app.use("/api", sesionRoutes);
app.use("/api/usuarios", usuariosRoutes);
app.use("/api/ADMINproductos", ADMINproductosRoutes);
app.use("/api/ADMINusuarios", ADMINusuariosRoutes);


export default app;