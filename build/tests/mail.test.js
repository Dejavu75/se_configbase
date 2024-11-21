"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const con_log_1 = require("../controllers/con_log");
con_log_1.AgesLog.sendMail("diego@solinges.com.ar", "Prueba de mail", "Esto es una prueba de mail", "", "", "EC Test").then((result) => { console.log(result); }).catch((err) => { console.error(err); });
con_log_1.AgesLog.sendMail("diego@solinges.com.ar", "Prueba de mail", "Esto es una prueba de mail", "", "").then((result) => { console.log(result); }).catch((err) => { console.error(err); });
