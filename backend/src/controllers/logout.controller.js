const logout = (req, res) => {
    res.clearCookie("token", {
      httpOnly: true,
      secure: false,  // Cambia a true en producción con HTTPS
      sameSite: "strict",
    });
  
    return res.json({
      success: true,
      message: "Sesión cerrada correctamente",
    });
  };
  
  export const mthodHTTP = {
    logout,
  };
  