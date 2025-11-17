export function parseValidationError(err) {
  if (!err || err.name !== "ValidationError") return null;
  const messages = Object.values(err.errors).map(e => e.message);
  return messages.join(". ");
}

// Para errores de clave duplicada (unique) — ej: email duplicado
export function parseDuplicateKeyError(err) {
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern)[0];
    return `Ya existe un registro con ese ${field}`;
  }
  return null;
}
