# E-commerce Backend - Coderhouse (Entrega Final)

Este proyecto es un servidor robusto de E-commerce desarrollado con **Node.js** y **Express**. Implementa una arquitectura profesional basada en el **Patrón Repository** y **DAO (Data Access Object)**, garantizando escalabilidad, mantenibilidad y un código limpio.

## 🚀 Funcionalidades Principales

* **Gestión de Productos**: CRUD completo con soporte para paginación, ordenamiento y filtrado avanzado.
* **Carrito de Compras**: Sistema de persistencia vinculado a usuarios mediante MongoDB, con soporte para múltiples carritos por usuario.
* **Proceso de Compra (Purchase)**: Lógica de negocio avanzada que valida stock en tiempo real, gestiona productos no procesados y envía notificaciones.
* **Generación de Tickets**: Creación automática de comprobantes de compra con códigos únicos generados por **UUID**.
* **Seguridad**: Autenticación con **Passport JWT** y autorización basada en roles (`user` / `admin`).
* **Websockets**: Comunicación en tiempo real para actualizaciones dinámicas de productos y carritos.

## 🛠️ Stack Tecnológico

* **Node.js & Express**: Framework principal del servidor.
* **MongoDB & Mongoose**: Base de datos NoSQL y modelado de datos.
* **Arquitectura en Capas**: Implementación de **DAO**, **DTO** y **Repository**.
* **Passport.js**: Estrategia de autenticación `current` mediante cookies seguras.
* **UUID**: Generación de identificadores únicos para la facturación.
* **Handlebars (HBS)**: Motor de plantillas para renderizado de vistas dinámicas.
* **Websockets**: Implementación de comunicación bidireccional en tiempo real.
* **Multer**: Gestión de subida de archivos para imágenes de productos.

---

## 🏗️ Estructura del Proyecto

La organización sigue las mejores prácticas para separar la lógica de infraestructura de la lógica de negocio:

```text
src/
├── config/             # Configuración de variables de entorno y Passport
├── dao/                # Data Access Object (Persistencia en MongoDB)
│   ├── models/         # Esquemas de Mongoose (User, Product, Cart, Ticket)
│   └── managers        # Clases de gestión directa con la base de datos
├── repositories/       # Capa de Negocio (Abstracción del DAO)
├── routes/             # Definición de Endpoints (Sessions, Products, Carts)
├── middlewares/        # Validaciones de roles y autenticación (auth.middleware)
├── services/           # Lógica de negocio adicional (e.g., envío de correos)
├── utils/              # Herramientas generales (Bcrypt, Multer, etc.)
├── views/              # Plantillas Handlebars para renderizado dinámico
└── app.js              # Punto de entrada de la aplicación
```

---

## 📂 Recursos Adicionales

* **Documentación de MongoDB**: [https://www.mongodb.com/docs/](https://www.mongodb.com/docs/)
* **Guía de Node.js**: [https://nodejs.org/en/docs/](https://nodejs.org/en/docs/)
* **Handlebars**: [https://handlebarsjs.com/](https://handlebarsjs.com/)

---

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Consulta el archivo `LICENSE` para más detalles.