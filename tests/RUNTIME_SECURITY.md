# Verificación de las dependencias de runtime

Nodemailer se actualiza a `^10.1.4`. `ts-node-dev` queda explícitamente como
dependencia de desarrollo y la compilación resuelve el TypeScript real, no el
paquete npm homónimo `tsc` filtrado por dependencias anteriores.

Con las dependencias instaladas:

```sh
node --test tests/runtime-dependencies.test.cjs tests/mail-compatibility.test.cjs
npm run tsc
```

La prueba de correo carga el helper compilado distribuido en una VM con
configuración sintética y sin abrir logs. Usa el transporte stream real de
Nodemailer: comprueba remitente, dos adjuntos y las respuestas de éxito/error.
No conecta SMTP, no carga credenciales ni verifica un proveedor real. Los
adjuntos temporales se generan fuera del checkout; su limpieza es independiente.

Antes de integrar se observaron compilaciones de ambos paquetes y de MS01/CH01
en un fixture compuesto externo, con 25/25 y 15/15 pruebas de consumidor.
La suite permanente pasó 5/5 en Node 22.22.2 y Node 24.22.2 aislado sin red.
Las declaraciones fallaban antes del cambio y ahora pasan; los casos de correo
son regresiones de comportamiento existente, sin modificar la implementación.

Además se ejecutó una prueba externa diferencial de Nodemailer 9.0.3 y 10.1.4
con este mismo helper compilado contra un servidor SMTP TLS de loopback. Pasaron
5/5 casos en Node 24.22.2: AUTH, MAIL, RCPT, DATA, adjuntos MIME, respuesta de
éxito y rechazo controlado resuelto como string. El certificado sintético se
validó con una CA de prueba y `rejectUnauthorized: true`. El padre repitió los
5/5 casos comprobando antes el hash del helper. No se incluyeron claves de
prueba ni la versión vulnerable anterior como dependencias del paquete.
Este resultado no acredita las políticas TLS/SMTP de un proveedor externo.

Esto no acredita todavía el cierre transitivo de los locks Git reales. El ciclo
entre paquetes puede conservar revisiones anteriores: regenerar y verificar los
locks de los consumidores después de integrar ambos repositorios. No promover
imágenes por el solo hecho de que el fixture local pase.

## Cierre real de dependencias del 2 de noviembre de 2026

El lock v3 se generó con npm 11.19.1 sin editarlo a mano. Fija el contrato
`se_contractholder` al commit revisado `8f5857b070a60efea1590783e64f2b6798d674d1`.
La URL SSH serializada por npm no acredita una conexión SSH: en estas pruebas
se redirigió únicamente ese repositorio a un mirror local del bundle verificado.
El SHA-256 del lock es `9420404b689c96d165e06ee0354859c54dba2cc16dd638b7e0209071ed58edf7`.

`npm ci --ignore-scripts` resolvió Nodemailer 10.3.1; no se reutiliza la prueba
histórica de 10.1.4 como prueba de esa versión. Compilación y seis pruebas
pasaron en Node 24.22.2 y 22.23.3 sin red. La instalación separada con
`--omit=dev` conservó Nodemailer y holder, sin TypeScript ni ts-node-dev.
Una guarda adicional del lock pasó después de copiarlo por hash al checkout.
Esto todavía no demuestra instalación de consumidores reales desde GitHub,
política TLS del proveedor de correo ni aceptación productiva.
