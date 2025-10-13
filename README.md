LogiFlow
=========

Descripción General
-------------------
LogiFlow es una aplicación web desarrollada con Node.js, Express y MongoDB para la gestión integral de operaciones logísticas. Permite administrar clientes, productos, envíos y facturas dentro de una arquitectura MVC (Model-View-Controller) con vistas construidas en Pug y estilizadas con Bootstrap.  

La aplicación ofrece una interfaz moderna, fácil de usar y optimizada para visualizar, crear y editar datos relacionados con los procesos logísticos de una empresa.

---

Tecnologías Utilizadas
----------------------

Backend:
Node.js
Express.js
MongoDB con Mongoose
Nodemon (para desarrollo)
Method Override para soportar PUT y DELETE desde formularios

Frontend:
Pug (motor de plantillas)
Bootstrap 5
JavaScript vanilla para interactividad dinámica (búsqueda, filtrado, etc.)

Arquitectura:
Modelo MVC (Model, View, Controller)
Rutas separadas para cada módulo
Organización modular por carpetas

---

Estructura del Proyecto
-----------------------

logiflow_project/
│
├── src/
│   ├── config/
│   │   └── mongo.js
│   ├── controllers/
│   │   ├── client.controller.js
│   │   ├── product.controller.js
│   │   ├── shipment.controller.js
│   │   └── invoice.controller.js
│   ├── models/
│   │   ├── client.model.js
│   │   ├── product.model.js
│   │   ├── shipment.model.js
│   │   └── invoice.model.js
│   ├── routes/
│   │   ├── client.routes.js
│   │   ├── product.routes.js
│   │   ├── shipment.routes.js
│   │   └── invoice.routes.js
│   └── views/
│       ├── layout.pug
│       ├── home.pug
│       ├── clients/
│       ├── products/
│       ├── shipments/
│       └── invoices/
│
├── package.json
└── app.js

---

Instalación y Configuración
---------------------------

1. Clonar el repositorio:
git clone https://github.com/jorgekalas/LogiFlowBackend
cd logiflow_project

2. Instalar dependencias:
npm install

3. Configurar la conexión a MongoDB:
Editar el archivo src/config/mongo.js y colocar la URI de conexión de MongoDB local o Atlas.

Ejemplo:
import mongoose from "mongoose";

mongoose.connect("mongodb://127.0.0.1:27017/logiflow")
  .then(() => console.log("Conectado a MongoDB"))
  .catch(err => console.error("Error al conectar:", err));

---

Ejecución del Proyecto
----------------------

Modo normal:
npm start

Modo desarrollo con reinicio automático:
npm run dev

El servidor se iniciará por defecto en:
http://localhost:3000

---

Funcionalidades Principales
---------------------------

Módulo de Clientes:
Permite crear, editar y eliminar clientes.  
Campos obligatorios: nombre, apellido, DNI y email.  
Listado de clientes con opciones de edición y eliminación.

Módulo de Productos:
Alta, edición y eliminación de productos.  
Campos: nombre, descripción, stock y precio.  
Visualización en tabla ordenada con acciones rápidas.

Módulo de Envíos:
Creación de nuevos envíos asociados a clientes.  
Selección dinámica de productos con buscador en tiempo real.  
Control de stock automático al registrar o editar envíos.  
Redirección automática a facturación al confirmar un envío.

Módulo de Facturación:
Creación y gestión de facturas asociadas a envíos.  
Preselección automática del envío recién creado.  
Campos: número, fecha, monto y envío asociado.

Página de Inicio:
Interfaz moderna con diseño 2x2.  
Tarjetas pastel para navegación rápida entre módulos.  
Diseño centrado y responsivo.

---

Scripts Disponibles
-------------------

"scripts": {
  "start": "node app.js",
  "dev": "nodemon app.js"
}

---

Buenas Prácticas Implementadas
------------------------------

Separación clara entre lógica de negocio, vistas y modelos.  
Código legible y modular.  
Formularios consistentes con Bootstrap 5.  
Validaciones básicas en backend (campos requeridos).  
Filtrado de productos en tiempo real sin recargar la página.  
Compatibilidad con navegadores modernos.

---

Requisitos Previos
------------------

Node.js versión 18 o superior.  
MongoDB instalado y en ejecución.  
Navegador actualizado con soporte ES6.

---

Créditos
--------

Desarrollado por:
- Hillcoat, Juan Pablo; 
- Leone, Milena Nadin; 
- Rodriguez, Carlos Douglas; 
- Molina, María Julieta; 
- Kalas, Jorge Adrian  
Proyecto académico de gestión logística con Node.js y MongoDB.  
Diseño y estética basados en Bootstrap 5 y Pug.

---

Licencia
--------

Este proyecto se distribuye bajo la licencia MIT.  
Puedes usarlo, modificarlo y distribuirlo libremente con fines educativos o profesionales.
