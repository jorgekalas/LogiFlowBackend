import User from "../models/user.model.js";

export const showLogin = (req, res) => {
  res.render("auth/login");
};

export const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username, password });
    if (!user) {
      return res.render("auth/login", { error: "Usuario o contraseña incorrectos" });
    }
    req.session.user = user;
    res.redirect("/");
  } catch (err) {
    res.status(500).send("Error interno del servidor");
  }
};

export const logout = (req, res) => {
  req.session.destroy(() => {
    res.redirect("/login");
  });
};
