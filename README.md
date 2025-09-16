# LogiFlow 🚚

CRUD básico de envíos con Node.js, Express, Pug y base de datos en JSON.

## 🚀 Instalación

1. Clonar o descomprimir el proyecto.
2. Abrir la carpeta en VS Code.
3. Instalar dependencias:
   ```bash
   npm install
   ```

## ▶️ Ejecución

```bash
npm start
```

El servidor se abrirá en: [http://localhost:3000](http://localhost:3000)

## 📌 Funcionalidades

- Listar envíos
- Crear envío
- Editar envío
- Eliminar envío

- Listar clientes
- Crear cliente
- Editar cliente
- Eliminar cliente

## 🧪 API Endpoints

- Clientes

  - GET /clients → Listar clientes

  - POST /clients → Crear cliente

  - PUT /clients/:id → Actualizar cliente

  - DELETE /clients/:id → Eliminar cliente

- Envíos

  - GET /shipments → Listar envíos

  - POST /shipments → Crear envío

  - PUT /shipments/:id → Actualizar envío

  - DELETE /shipments/:id → Eliminar envío

Base de datos persistida en **data/db.json** (próximamente migraremos a MongoDB)

👥 Autores

Hillcoat, Juan Pablo

Leone, Milena Nahir

Rodriguez, Carlos Douglas

Molina, Maria Julieta

Kalas, Jorge Adrian
