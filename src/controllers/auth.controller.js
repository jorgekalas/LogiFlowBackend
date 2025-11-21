import bcrypt from "bcrypt";
import User from "../models/user.model.js";

export const showLogin = (req, res) => {
  res.render("auth/login");
};

export const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validación básica del controlador
    if (!username || !password) {
      return res.status(400).render("auth/login", {
        error: "Ingresá usuario y contraseña"
      });
    }

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).render("auth/login", {
        error: "Usuario o contraseña incorrectos"
      });
    }

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) {
      return res.status(401).render("auth/login", {
        error: "Usuario o contraseña incorrectos"
      });
    }

    // Guardamos solo datos mínimos en sesión
    req.session.user = { id: user._id, username: user.username };
    res.redirect("/");
  } catch (err) {
    console.error("Error en login:", err);
    res.status(500).render("auth/login", {
      error: "Ocurrió un error. Intentá nuevamente."
    });
  }
};

export const logout = (req, res) => {
  req.session.destroy(() => {
    res.redirect("/login");
  });
};


