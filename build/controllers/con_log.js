"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AgesLog = void 0;
exports.fn_ageslog = fn_ageslog;
exports.fn_ageslog_download = fn_ageslog_download;
exports.dtString = dtString;
exports.datetoTZ = datetoTZ;
exports.fn_logshow = fn_logshow;
const fs_1 = __importDefault(require("fs"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const conf_default_config_1 = require("./conf_default_config");
let oconf = (0, conf_default_config_1.getLocalDirConfig)();
var colors = require('colors');
const outputFile = oconf.logdir + '/' + oconf.logfile;
const errorFile = oconf.logdir + '/' + oconf.errorfile;
const outputLog = fs_1.default.createWriteStream(outputFile, { flags: 'a' });
const errorsLog = fs_1.default.createWriteStream(errorFile, { flags: 'a' });
const mailConfig = (0, conf_default_config_1.getMailConfig)();
const transporter = nodemailer_1.default.createTransport(mailConfig);
const date_fns_tz_1 = require("date-fns-tz");
const timeZone = 'America/Argentina/Buenos_Aires';
const consoler = new console.Console(outputLog, errorsLog);
function fn_ageslog(_req, _res) {
    _res.send(fs_1.default.readFileSync(outputFile, 'utf8'));
}
function fn_ageslog_download(_req, _res) {
    _res.setHeader('Content-disposition', 'attachment; filename=ages_outputLog.log');
    _res.setHeader('Content-type', 'text/plain');
    _res.send(fs_1.default.readFileSync(outputFile, 'utf8'));
    //_res.sendFile(__dirname +'/../outputLog.log',{dotfiles:'allow'},'utf8' )
}
function dtString(date) {
    //const zonedDate = datetoTZ(date)
    date.setHours(date.getHours() - 3);
    return (0, date_fns_tz_1.format)(date, 'dd-MM-yyyy HH:mm:ss', { timeZone });
}
function datetoTZ(date) {
    const zonedDate = (0, date_fns_tz_1.toZonedTime)(date, timeZone);
    return zonedDate;
}
function fn_logshow(app) {
    app.use((req, _res, next) => {
        if (req.headers['x_ages_loglevel'] != undefined) {
            //
        }
        switch (req.headers['x_ages_loglevel']) {
            case '0':
                break;
            case '1':
                AgesLog.log(dtString(new Date()), `[${req.method}] ${req.originalUrl}`);
                AgesLog.log(colors.blue("Headers:"), req.headers);
                break;
            case '2':
                AgesLog.log("Headers:", req.headers);
                AgesLog.log("Body:", req.body);
                break;
            case '3':
                AgesLog.log("Headers:", req.headers);
                AgesLog.log("Body:", req.body);
                AgesLog.log("Query:", req.query);
                break;
            default:
        }
        next();
    });
}
class AgesLog {
    static debug(...args) {
        consoler.debug(dtString(new Date()), ...args);
        console.debug(dtString(new Date()), ...args);
    }
    static infox(texto, req, ...args) {
        const fechaHora = dtString(new Date());
        if (req == undefined || (req.headers['x_ages_key_sistema'] == undefined && req.headers['x_ages_user'] == undefined && req.headers['x_ages_computer'] == undefined)) {
            consoler.info(fechaHora, texto, ...args);
            console.info(fechaHora, texto);
        }
        else {
            const keySistema = (req.headers['x_ages_key_sistema'] || '').padEnd(10, ' ').slice(0, 10);
            const userID = (req.headers['x_ages_user'] || '').padStart(3, ' ');
            const equipoID = (req.headers['x_ages_computer'] || '').padStart(3, ' ');
            consoler.info(fechaHora, "K: " + keySistema, "U:" + userID, "E:" + equipoID, texto, ...args);
            console.info(fechaHora, "K: " + keySistema, "U:" + userID, "E:" + equipoID, texto, ...args);
        }
    }
    static errorx(texto, req, ...args) {
        const fechaHora = dtString(new Date());
        if (req == undefined || (req.headers['x_ages_key_sistema'] == undefined && req.headers['x_ages_user'] == undefined && req.headers['x_ages_computer'] == undefined)) {
            consoler.error(fechaHora, texto, ...args);
            console.error(fechaHora, texto);
        }
        else {
            const keySistema = (req.headers['x_ages_key_sistema'] || '').padEnd(10, ' ').slice(0, 10);
            const userID = (req.headers['x_ages_user'] || '').padStart(3, ' ');
            const equipoID = (req.headers['x_ages_computer'] || '').padStart(3, ' ');
            consoler.error(fechaHora, "K: " + keySistema, "U:" + userID, "E:" + equipoID, texto, ...args);
            console.error(fechaHora, "K: " + keySistema, "U:" + userID, "E:" + equipoID, texto, ...args);
        }
    }
    static info(...args) {
        consoler.info(dtString(new Date()), ...args);
        console.info(dtString(new Date()), ...args);
    }
    static logx(texto, req, ...args) {
        const fechaHora = dtString(new Date());
        if (req == undefined || (req.headers['x_ages_key_sistema'] == undefined && req.headers['x_ages_user'] == undefined && req.headers['x_ages_computer'] == undefined)) {
            consoler.log(fechaHora, texto, ...args);
            console.log(fechaHora, texto);
        }
        else {
            const keySistema = (req.headers['x_ages_key_sistema'] || '').padEnd(10, ' ').slice(0, 10);
            const userID = (req.headers['x_ages_user'] || '').padStart(3, ' ');
            const equipoID = (req.headers['x_ages_computer'] || '').padStart(3, ' ');
            consoler.log(fechaHora, "K: " + keySistema, "U:" + userID, "E:" + equipoID, texto, ...args);
            console.log(fechaHora, "K: " + keySistema, "U:" + userID, "E:" + equipoID, texto, ...args);
        }
    }
    static log(...args) {
        consoler.log(dtString(new Date()), ...args);
        console.log(dtString(new Date()), ...args);
    }
    static warn(...args) {
        consoler.warn(dtString(new Date()), ...args);
        console.warn(dtString(new Date()), ...args);
    }
    static error(...args) {
        consoler.error(dtString(new Date()), ...args);
        console.error(dtString(new Date()), ...args);
    }
    static sendLog(para, asunto, texto) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.sendMail(para, asunto, texto, outputFile, errorFile);
        });
    }
    static sendMailDebug(asunto, texto, filePath1, filePath2) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.sendMail((0, conf_default_config_1.getSettingsConfig)().notificaciones_debug, asunto, texto, filePath1, filePath2);
        });
    }
    static sendMail(para_1, asunto_1, texto_1) {
        return __awaiter(this, arguments, void 0, function* (para, asunto, texto, filePath1 = "", filePath2 = "", from = "") {
            let respuesta = "Correo no enviado";
            // Lógica para determinar el campo "from"
            let finalFrom;
            // Si "from" contiene un correo, úsalo directamente.
            if (from && from.includes("@")) {
                finalFrom = from;
            }
            else if (from || mailConfig.fromName) {
                // Si "from" o "fromName" contienen solo un nombre, agrega el correo correspondiente.
                const name = from || mailConfig.fromName; // Prioriza "from" sobre "fromName"
                const email = mailConfig.from || mailConfig.auth.user; // Usa mailConfig.from, si no, usa auth.user
                finalFrom = `"${name}" <${email}>`; // Formato estándar para nombre y correo
            }
            else {
                // Si "from" y "fromName" están vacíos, usa mailConfig.from o mailConfig.auth.user
                finalFrom = mailConfig.from || mailConfig.auth.user;
            }
            // Construcción del objeto "mailOptions"
            let mailOptions = {
                from: finalFrom, // Dirección desde la cual se envía el correo
                to: para || "diego@solinges.com.ar", // Lista de destinatarios
                subject: asunto || "Mail desde NAGES", // Asunto
                text: texto, // Texto plano del mensaje
                attachments: [] // Archivos adjuntos
            };
            // Agregar el primer adjunto si la ruta no está vacía
            if (filePath1 && filePath1.trim() !== '') {
                mailOptions.attachments.push({
                    filename: filePath1.split('/').pop(), // Nombre del archivo adjunto 1
                    path: filePath1 // Ruta al archivo adjunto 1
                });
            }
            // Agregar el segundo adjunto si la ruta no está vacía
            if (filePath2 && filePath2.trim() !== '') {
                mailOptions.attachments.push({
                    filename: filePath2.split('/').pop(), // Nombre del archivo adjunto 2
                    path: filePath2 // Ruta al archivo adjunto 2
                });
            }
            // Si no hay adjuntos, se elimina la propiedad attachments
            if (mailOptions.attachments.length === 0) {
                delete mailOptions.attachments;
            }
            try {
                const info = yield transporter.sendMail(mailOptions);
                respuesta = 'Correo enviado: ' + info.response;
            }
            catch (error) {
                respuesta = 'Error al enviar el correo:' + error;
            }
            return new Promise((resolve, _reject) => { resolve(respuesta); });
        });
    }
    ;
}
exports.AgesLog = AgesLog;
