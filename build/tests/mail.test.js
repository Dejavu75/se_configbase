"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const nodemailer_1 = __importDefault(require("nodemailer"));
const transporter = nodemailer_1.default.createTransport({
    host: 'mail.solinges.com.ar',
    port: 465,
    secure: true,
    auth: {
        user: 'nages@solinges.com.ar',
        pass: ''
    }
});
let respuesta = "Correo no enviado";
let mailOptions = {
    from: 'nages@solinges.com.ar', // Dirección desde la cual se envía el correo
    to: "diego@solinges.com.ar", // Lista de destinatarios
    subject: "Mail desde NAGES", // Asunto
    text: "Texto del mail"
};
transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
        respuesta = error.message;
    }
    else {
        respuesta = 'Correo enviado: ' + info.response;
    }
    console.log(respuesta);
});
