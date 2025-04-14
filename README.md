# CITIKOLD - Sistema de Gestión de Pedidos

![CITIKOLD Logo](../GestionInventario/frontend/src/assets/citikold.png) 

## Descripción del Proyecto

CITIKOLD es una aplicación web integral diseñada para la gestión de pedidos. Permite a los usuarios crear, visualizar y administrar pedidos de clientes y productos de manera intuitiva y centralizada. La aplicación se compone de un frontend dinámico construido con React, un backend robusto desarrollado en .NET, y una base de datos escalable utilizando SQL Server.

Este proyecto se ha desarrollado desde cero, abarcando la planificación, diseño e implementación de todas sus funcionalidades.

## Tecnologías Utilizadas

**Frontend:**

* **React:** Biblioteca de JavaScript para construir interfaces de usuario dinámicas y reactivas.
* **React Router:** Para la navegación entre las diferentes secciones de la aplicación.
* **Context API:** Para la gestión global del estado de autenticación.
* **Hooks Personalizados (`useDebounce`, `useDebounceProduct`):** Para optimizar la funcionalidad de búsqueda con retardo.
* **Axios (`apiClient` personalizado):** Para realizar peticiones HTTP al backend.
* **Tailwind CSS:** Framework de CSS utilitario para un diseño rápido y adaptable.
* **PDF Generation (`generateInvoicePDF`):** Funcionalidad para generar facturas en formato PDF.

**Backend:**

* **.NET:** Framework de desarrollo de Microsoft para construir aplicaciones web robustas y escalables.
* **ASP.NET Core Web API:** Para la creación de APIs RESTful que comunican con el frontend.
* **Autenticación con Tokens (JWT):** Para asegurar las rutas y proteger los recursos de la aplicación.
* **Endpoints para:**
    * Gestión de Clientes (búsqueda, listado).
    * Creación y administración de Productos (búsqueda, listado).
    * Creación de Pedidos.
    * Creación, logueo, reseteo de contraseña de los Usuarios.

**Base de Datos:**

* **SQL Server:** Sistema de gestión de bases de datos relacional para el almacenamiento persistente de la información de clientes, usuarios, productos y pedidos.

## Funcionalidades Principales (Frontend)

El frontend del proyecto ofrece las siguientes funcionalidades:

* **Autenticación de Usuarios:** Un sistema seguro para que los usuarios puedan iniciar y cerrar sesión en la aplicación.
* **Gestión de Clientes:**
    * Búsqueda de clientes por nombre o RUC con sugerencias en tiempo real (implementado con `useDebounce`).
    * Selección de clientes para la creación de pedidos.
* **Gestión de Productos:**
    * Búsqueda de productos por nombre con sugerencias en tiempo real (implementado con `useDebounceProduct`).
    * Selección de productos para agregar al detalle del pedido.
* **Creación de Pedidos:**
    * Selección de la fecha del pedido.
    * Adición de múltiples productos al detalle del pedido con especificación de cantidad.
    * Cálculo automático del subtotal, impuesto (IVA del 12%), y total del pedido.
    * Eliminación de productos del detalle del pedido.
* **Guardado de Pedidos:** Envío de la información del pedido al backend para su almacenamiento.
* **Generación de Facturas en PDF:** Descarga automática de la factura del pedido tras su creación.
* **Interfaz de Usuario Reactiva y Moderna:** Diseño intuitivo y adaptable gracias a React y Tailwind CSS.
* **Navegación Clara:** Utilización de React Router para una navegación fluida entre las diferentes secciones (ej. listado de productos, listado de clientes, etc. - si se implementaron).
* **Mensajes de Carga y Error:** Indicadores visuales para mantener al usuario informado durante las operaciones asíncronas.

## Funcionalidades Principales (Backend)

El backend del proyecto proporciona las siguientes funcionalidades a través de su API RESTful:

* **Autenticación, Autorización, ForgotPassword, ResetPassword:** Protección de los endpoints mediante la verificación de tokens JWT.
* * **Endpoints de Clientes:**
  * `/Auth/register`: Permite registrar un usuario.
  * `/Auth/login`: Permite iniciar sesión al usuario.
  * `/Auth/reset-password`: Permite resetear la contraseña del usuario.
  * `/Auth/forgot-password`: Permite enviar un correo para resetear la contraseña del usuario.
  * `/Auth/seed-roles`: Permite crear los roles para administración de los usuarios.
  * `/Auth/make-admin`: Permite asignarle el rol de administrador a un usuario.
* **Endpoints de Clientes:**
    * `/Customers/search?searchTerm={termino}`: Permite buscar clientes por nombre o RUC.
    * `/Customers`: Endpoint para listar todos los clientes (si se implementó).
* **Endpoints de Productos:**
    * `/Products?name={termino}`: Permite buscar productos por nombre.
    * `/Products`: Endpoint para listar todos los productos.
* **Endpoint de Pedidos:**
    * `/Orders/CreateSimple`: Recibe los datos del pedido del frontend y los guarda en la base de datos.

* **Lógica de Negocio:** Implementación de la lógica para la creación de pedidos, cálculo de totales e impuestos.
* **Comunicación con la Base de Datos:** Interacción con SQL Server para la lectura y escritura de datos.

## Base de Datos (SQL Server)

La base de datos de Proyecto en SQL Server almacena la siguiente información:

* **Tabla `Customers`:** Información de los clientes (Id, Nombre, Ruc, etc.).
* **Tabla `Auth`:** Administra la seguridad del módulo usuarios.
* **Tabla `Products`:** Información de los productos (Id, Nombre, Precio, Descripción, etc.).
* **Tabla `Orders`:** Encabezado de los pedidos (Id, CustomerId, OrderDate, Subtotal, Iva, Total, etc.).
* **Tabla `OrderDetails`:** Detalles de cada pedido, relacionando el pedido con los productos y sus cantidades (Id, OrderId, ProductId, Quantity, UnitPrice, etc.).

## Instalación y Configuración

Para ejecutar el proyecto localmente, sigue estos pasos:

**Frontend (React):**

1.  **Clonar el repositorio:**
    ```bash
    git clone https://github.com/STEVEN2199/PruebaBackendCitikold.git
    cd frontend
    ```
2.  **Instalar las dependencias:**
    ```bash
    npm install
    # o
    yarn install
    # o
    bun install
    ```
3.  **Configurar las variables de entorno:** Crea un archivo `.env` en la raíz del proyecto frontend y la ruta necesaria acorde a la URL del backend:
    ```env
    REACT_APP_API_BASE_URL=[https://tu-backend.com/api](https://tu-backend.com/api)
    ```
    Reemplaza `https://tu-backend.com/api` con la URL real de tu backend.
4.  **Ejecutar la aplicación:**
    ```bash
    npm start
    # o
    yarn start
    # o
    bun dev
    ```
    La aplicación frontend estará disponible en `http://localhost:3000` (u otro puerto si está en uso).

**Backend (.NET):**

1.  **Restaurar las dependencias del proyecto .NET:**
    ```bash
    dotnet restore
    ```
2.  **Configurar la conexión a la base de datos:** Abre el archivo de configuración de la aplicación (por ejemplo, `appsettings.json`) y configura la cadena de conexión a tu instancia de SQL Server:
    ```json
    {
      "ConnectionStrings": {
        "DefaultConnection": "Server=tu-servidor;Database=tu-basededatos;User Id=tu-usuario;Password=tu-contraseña;TrustServerCertificate=true"
      },
      
    }
    ```
    Reemplaza los valores con la información de tu servidor SQL Server.
3.  **Aplicar las migraciones de la base de datos (si utilizas Entity Framework Core) dentro de la consola de administración de paquetes:**
    ```bash
    Add-Migration nombre-migración
    Update-Database
    ```
4.  **Ejecutar la aplicación:**
    ```bash
    dotnet run
    ```
    La API del backend estará disponible en el puerto configurado (generalmente `http://localhost:5000` o `https://localhost:5001`).

**Base de Datos (SQL Server):**

1.  **Asegúrate de tener SQL Server instalado y en ejecución.**
2.  **Crea la base de datos `tu-basededatos` (si aún no existe).**
3.  Entity Framework Core gestionará la creación de tablas a través de las migraciones.

## Contribuciones

Las contribuciones al proyecto son bienvenidas. Si deseas contribuir, por favor sigue estos pasos:

1.  Realiza un fork del repositorio.
2.  Crea una rama para tu funcionalidad (`git checkout -b feature/nueva-funcionalidad`).
3.  Realiza tus cambios y commitea (`git commit -am 'Añade nueva funcionalidad'`).
4.  Sube los cambios a la rama (`git push origin feature/nueva-funcionalidad`).
5.  Crea un Pull Request.

---

**¡Gracias por explorar mi proyecto!**
