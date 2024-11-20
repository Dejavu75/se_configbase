import { registerService } from './controllers/conf_default_config';
import { mod_dataaccess } from './modules/mod_dataaccess';

export * from './schemas/sch_config';
export * from './controllers/conf_default_config';
export * from './modules/mod_dataaccess';
export * from './modules/mod_dataupdater';
export * from './controllers/con_dataaccess';
export * from './controllers/con_log';


// let oCon = new mod_dataaccess();
// oCon.controlarMSDATA().then((bResult) => {
//     console.log("ControlarMSDATA", oCon.database);
// }).catch((err) => {
//     console.log("Error en controlarMSDATA", err);
// });

// let mod3: mod2 = new mod2();
// mod3.iniciarUpdates(mod3.obtenerConexion(true)).then((result) => {console.log(result)});
//registerService();

import nodemailer from 'nodemailer';



const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: 'ec.solinges@gmail.com',
        pass: ''
    },
});

let respuesta: string = "Correo no enviado";
interface MailOptions {
    from: string;
    to: string;
    subject: string;
    text: string;
    attachments?: { filename: string; path: string }[];
}


let mailOptions: MailOptions = {
    from: 'ec.solinges@gmail.com', // Dirección desde la cual se envía el correo
    to: "prueba@gobeyond.com.ar; diego@solinges.com.ar", // Lista de destinatarios
    subject:  "Mail desde NAGES", // Asunto
    text: "Texto del mail"
};
 transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
        respuesta = error.message;
    } else {
        respuesta = 'Correo enviado: ' + info.response;
    }
    console.log(respuesta);
}   );
