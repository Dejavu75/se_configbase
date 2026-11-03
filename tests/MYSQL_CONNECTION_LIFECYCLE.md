# Recuperación de conexiones MySQL

Las dos factories de `mod_dataaccess` conservan el objeto `Connection` de mysql2
y sus opciones existentes. Registran un listener persistente de `error` antes de
devolverlo; el evento invalida esa conexión sin abrir otra ni repetir consultas.
El evento `end` también la marca como no utilizable.

`mod_dataaccess_generico.obtenerConexionado()` reutiliza una conexión sana y
crea otra únicamente cuando una operación posterior pide una conexión inválida.
Los errores tardíos de una conexión anterior no invalidan su reemplazo ni otras
instancias. El driver conserva la responsabilidad de notificar los callbacks y
cerrar su conexión; este código no reproduce comandos ni cambia sus resultados.
Una transacción pertenece al objeto `Connection` original: no se reconstruyen
transacciones ni estado de sesión al abrir una conexión para otra operación.

Si un consumidor mantiene su propio getter/cache, debe consultar el export
`isConnectionUsable(connection)` antes de reutilizarlo, o delegar al getter
genérico. Agregar solamente el listener no corrige caches externos indefinidos.

Se registra un mensaje constante por conexión fallida, sin el error del driver,
su configuración, credenciales, SQL ni contenido de respuesta.

## Prueba determinista

```sh
node --test tests/mysql-connection-lifecycle.test.cjs
```

La suite carga el módulo JavaScript distribuido en una VM con configuración y
mysql2 sintéticos. Comprueba error fatal idle, reemplazo perezoso, aislamiento,
errores tardíos, cierre, comportamiento normal y rechazo único de una escritura
en curso sin replay. No usa una DB, SMTP, credenciales ni servicios reales.
La compilación debe actualizar el JavaScript y su declaración antes de ejecutarla.

Esto no acredita todavía la integración de los getters propios de MS01/CH01,
sus imágenes nuevas ni la aceptación productiva.
