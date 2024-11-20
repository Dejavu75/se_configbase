import nodemailer from 'nodemailer';
const transporter = nodemailer.createTransport({
    host: 'mail.solinges.com.ar',
    port: 465,
    secure: true,
    auth: {
        user: 'nages@solinges.com.ar',
        pass: ''
    }
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
    from: 'nages@solinges.com.ar', // Dirección desde la cual se envía el correo
    to: "diego@solinges.com.ar", // Lista de destinatarios
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
