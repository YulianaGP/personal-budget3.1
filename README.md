# Comparativo: Antes vs Después de Refactorización en Personal Budget

Este documento compara la implementación inicial del sistema de gestión de finanzas con su versión refactorizada para cumplir con la historia de usuario: “Renderizar objetos en el DOM”.

| **Aspecto**                         | **Antes**                                                                                                    | **Después**                                                                                                           |
|------------------------------------|--------------------------------------------------------------------------------------------------------------|------------------------------------------------------------------------------------------------------------------------|
| **Diseño del modelo**              | Un solo constructor `Movimiento` con validación, tipo como propiedad y lógica incluida.                      | Clase base `Movimiento` + subclases `Ingreso` y `Egreso` usando herencia prototipal.                                   |
| **Atributos**                      | `nombre`, `monto`, `tipo`, `fecha`, `id`.                                                                   | `descripcion`, `monto`, `tipo` (definido por subclases), `fecha`, `id`.                                                |
| **Método `render()`**             | Construía una fila HTML (`<tr>`) con clases de color y botón de eliminar.                                    | Se mantiene la lógica pero con clases de estilo mejoradas (Tailwind CSS) y nombres más descriptivos.                  |
| **Validación**                     | Dentro del constructor de `Movimiento`.                                                                     | En la clase base `Movimiento`; validación solo para `descripcion` y `monto`.                                           |
| **Tipo de movimiento**             | Se pasaba como argumento al constructor.                                                                     | Lo establecen internamente las subclases `Ingreso` y `Egreso`.                                                         |
| **Gestión de interfaz**            | Lógica embebida en el flujo principal (formulario, tabla, balance).                                          | Separada en clase `VistaFinanzas` que encapsula mostrar movimientos, balance, errores, y limpiar formulario.          |
| **Balance**                        | Calculado desde el array `movimientos` usando `reduce`.                                                     | Igual, pero con método `mostrarBalance()` encapsulado en `VistaFinanzas`.                                              |
| **Actualización de vista**         | Función `actualizarVista()` manipulando directamente el DOM.                                                | Misma función pero usando los métodos de la clase `VistaFinanzas`.                                                     |
| **Manejo de eventos**              | Directo en `formulario` y `tabla`, con validación y renderizado ad hoc.                                     | Centralizado, usando `VistaFinanzas` y las subclases para crear y renderizar.                                          |
| **Escalabilidad y claridad**       | Funcional pero monolítico, difícil de escalar.                                                              | Modular, usando orientación a objetos y herencia prototipal para facilitar extensión en futuros laboratorios.         |

---

**Resumen:**  
La refactorización facilita la separación de responsabilidades, mejora la legibilidad y prepara el código para extensiones como herencia, composición y reutilización de componentes visuales.

