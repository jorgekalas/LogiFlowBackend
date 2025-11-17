export const notFoundHandler = (req, res, next) => {
  res.status(404);

  if (req.accepts("html")) {
    return res.render("error", {
      status: 404,
      message: "La página que buscás no existe."
    });
  }

  if (req.accepts("json")) {
    return res.json({ error: "Recurso no encontrado" });
  }

  res.type("txt").send("404 - Not Found");
};

export const errorHandler = (err, req, res, next) => {
  console.error("Unhandled error:", err);

  const status = err.status || 500;
  const message =
    status === 500
      ? "Ocurrió un error inesperado. Reintentá más tarde."
      : err.message;

  res.status(status);

  if (req.accepts("html")) {
    return res.render("error", { status, message });
  }

  if (req.accepts("json")) {
    return res.json({ error: message });
  }

  res.type("txt").send(message);
};
