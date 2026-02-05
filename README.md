# E-commerce Backend - Coderhouse

Este proyecto consiste en un servidor robusto de E-commerce desarrollado con **Node.js** y **Express**. Implementa una arquitectura profesional con persistencia en **MongoDB** y un sistema de seguridad avanzado mediante **Passport** y **JWT**.

## 🚀 Tecnologías y Herramientas

* **Node.js & Express**: Framework principal para la gestión del servidor y rutas.
* **MongoDB & Mongoose**: Base de datos NoSQL y modelado de datos.
* **Passport.js**: Middleware de autenticación con estrategias personalizadas.
* **JSON Web Token (JWT)**: Gestión de sesiones mediante tokens seguros.
* **Bcrypt**: Encriptación de contraseñas mediante hashing.
* **Handlebars (HBS)**: Motor de plantillas para el renderizado de vistas.

## 🛠️ Estructura del Proyecto

Basado en la organización de carpetas del repositorio:

```text
src/
├── config/             # Configuración de Passport y DB
├── models/             # Esquemas de Mongoose (User, Product, Cart)
├── routes/             # Definición de endpoints (Sessions, Products, Carts)
├── utils/              # Herramientas de encriptación y __dirname
├── views/              # Vistas de Handlebars y layouts
└── app.js              # Punto de entrada de la aplicación