#  Ecommerce Analytics API
Este proyecto es una API RESTful construida con **Node.js**, **Express** y **MongoDB**, utilizando **TypeScript** desde el inicio para garantizar escalabilidad y tipado seguro.
Es un sistema de comercio electrónico enfocado en la gestión de productos, carritos de compra, pedidos y análisis de ventas.
Incluye autenticación por roles, gestión de inventario, estadísticas de ventas, y panel de análisis administrativo.
Cada etapa fue diseñada cuidadosamente para cumplir con reglas de negocio coherentes.
Actualmente el backend está completamente funcional, probado con Thunder Client y listo para integrarse con un frontend en desarrollo.

# Funcionalidades principales
- Registro y login de usuarios con JWT
- Roles diferenciados: `cliente`, `administrador`

-GESTON DE PRODUCTOS
- Crear, actualizar, eliminar y listar productos (solo admin)

-CARRITO DE COMPRAS
- Agregar productos al carrito: Los usuarios pueden añadir productos especificando la cantidad deseada.
- Eliminar productos del carrito: Posibilidad de eliminar productos específicos.
- Actualizar cantidades: Modificar la cantidad de un producto en el carrito.
- Checkout: Convertir el carrito en un pedido, validando el stock y calculando el total.
- Vaciar carrito: Eliminar todos los productos del carrito tras el checkout

-ANALISIS DE DATOS
- Productos más vendidos: Identificación de los productos con mayores ventas.
- Clientes principales: Listado de los clientes que más han gastado.
- Alertas de stock bajo: Detección de productos con bajo nivel de inventario

#  Roles de usuario

| Rol         | Permisos principales |
|-------------|----------------------|
| Cliente     | Gestionar su carrito y pedidos propios |
| Administrador | Gestionar productos, pedidos de todos los usuarios y analisis de venta |

#  Tecnologías utilizadas

- **Node.js**
- **Express**
- **TypeScript**
- **MongoDB + Mongoose**
- **JWT** (Autenticación)
- **bcryptjs** (Encriptación de contraseñas)
- **dotenv** (Variables de entorno)
- **Postman** (para testing de endpoints)