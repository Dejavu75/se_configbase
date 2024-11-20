import fs from 'fs';
//import os from 'os';
import { Express } from "express";
import nodemailer from 'nodemailer';
import { getLocalDirConfig, getMailConfig, getSettingsConfig } from "./conf_default_config"

let oconf=getLocalDirConfig();
var colors = require('colors');
const outputFile = oconf.logdir+'/'+oconf.logfile;
const errorFile = oconf.logdir+'/'+oconf.errorfile;
const outputLog = fs.createWriteStream(outputFile, { flags: 'a' });
const errorsLog = fs.createWriteStream(errorFile, { flags: 'a' });
const mailConfig = getMailConfig();
const transporter = nodemailer.createTransport(mailConfig);

import { format, toZonedTime } from 'date-fns-tz';
const timeZone = 'America/Argentina/Buenos_Aires';


const consoler = new console.Console(outputLog, errorsLog);

export function fn_ageslog(_req: any, _res: any) {
  _res.send(fs.readFileSync(outputFile, 'utf8'))
}
export function fn_ageslog_download(_req: any, _res: any) {

  _res.setHeader('Content-disposition', 'attachment; filename=ages_outputLog.log');
  _res.setHeader('Content-type', 'text/plain');
  _res.send(fs.readFileSync(outputFile, 'utf8'))
  //_res.sendFile(__dirname +'/../outputLog.log',{dotfiles:'allow'},'utf8' )
}
export function dtString(date: Date) {
  //const zonedDate = datetoTZ(date)
  date.setHours(date.getHours() - 3);
  return format(date, 'dd-MM-yyyy HH:mm:ss', { timeZone });
}

export function datetoTZ(date: Date) {
  const zonedDate = toZonedTime(date, timeZone);
  return zonedDate
}
export function fn_logshow(app: Express) {
  app.use((req, _res, next) => {
    if (req.headers['x_ages_loglevel'] != undefined) {
      //
    }

    switch (req.headers['x_ages_loglevel']) {
      case '0':

        break;
      case '1':
        AgesLog.log(dtString(new Date()), `[${req.method}] ${req.originalUrl}`)
        AgesLog.log(colors.blue("Headers:"), req.headers)
        break;
      case '2':
        AgesLog.log("Headers:", req.headers)
        AgesLog.log("Body:", req.body)
        break;
      case '3':
        AgesLog.log("Headers:", req.headers)
        AgesLog.log("Body:", req.body)
        AgesLog.log("Query:", req.query)
        break;
      default:

    }
    next()
  })
}
export class AgesLog {
  public static debug(...args: any[]) {
    consoler.debug(dtString(new Date()),...args);
    console.debug(dtString(new Date()),...args);
  }
  public static infox(texto: string, req: any, ...args: any[]) {
    const fechaHora = dtString(new Date());
    if (req == undefined || (req.headers['x_ages_key_sistema'] == undefined && req.headers['x_ages_user'] == undefined && req.headers['x_ages_computer'] == undefined)) {
      consoler.info(fechaHora, texto, ...args)
      console.info(fechaHora, texto)
    } else {
      const keySistema = (req.headers['x_ages_key_sistema'] || '').padEnd(10, ' ').slice(0, 10);
      const userID = (req.headers['x_ages_user'] || '').padStart(3, ' ');
      const equipoID = (req.headers['x_ages_computer'] || '').padStart(3, ' ');    
      consoler.info(fechaHora, "K: " + keySistema, "U:" + userID, "E:" + equipoID, texto, ...args);
      console.info(fechaHora, "K: " + keySistema, "U:" + userID, "E:" + equipoID, texto, ...args);
    }
  }
  public static errorx(texto: string, req: any, ...args: any[]) {
    const fechaHora = dtString(new Date());
    if (req == undefined || (req.headers['x_ages_key_sistema'] == undefined && req.headers['x_ages_user'] == undefined && req.headers['x_ages_computer'] == undefined)) {
      consoler.error(fechaHora, texto, ...args)
      console.error(fechaHora, texto)
    } else {
      const keySistema = (req.headers['x_ages_key_sistema'] || '').padEnd(10, ' ').slice(0, 10);
      const userID = (req.headers['x_ages_user'] || '').padStart(3, ' ');
      const equipoID = (req.headers['x_ages_computer'] || '').padStart(3, ' ');    
      consoler.error(fechaHora, "K: " + keySistema, "U:" + userID, "E:" + equipoID, texto, ...args);
      console.error(fechaHora, "K: " + keySistema, "U:" + userID, "E:" + equipoID, texto, ...args);
    }
  }
  public static info(...args: any[]) {
    consoler.info(dtString(new Date()),...args);
    console.info(dtString(new Date()),...args);
  }
  public static logx(texto: string, req: any, ...args: any[]) {
    const fechaHora = dtString(new Date());
    if (req == undefined || (req.headers['x_ages_key_sistema'] == undefined && req.headers['x_ages_user'] == undefined && req.headers['x_ages_computer'] == undefined)) {
      consoler.log(fechaHora, texto, ...args)
      console.log(fechaHora, texto)
    } else {
      const keySistema = (req.headers['x_ages_key_sistema'] || '').padEnd(10, ' ').slice(0, 10);
      const userID = (req.headers['x_ages_user'] || '').padStart(3, ' ');
      const equipoID = (req.headers['x_ages_computer'] || '').padStart(3, ' ');    
      consoler.log(fechaHora, "K: " + keySistema, "U:" + userID, "E:" + equipoID, texto, ...args);
      console.log(fechaHora, "K: " + keySistema, "U:" + userID, "E:" + equipoID, texto, ...args);
    }
  }
  public static log(...args: any[]) {
    consoler.log(dtString(new Date()),...args);
    console.log(dtString(new Date()),...args);
  }

  public static warn(...args: any[]) {
    consoler.warn(dtString(new Date()),...args);
    console.warn(dtString(new Date()),...args);
  }

  public static error(...args: any[]) {
    consoler.error(dtString(new Date()),...args);
    console.error(dtString(new Date()),...args);
  }
  public static async sendLog(para: string, asunto: string, texto: string){
    return this.sendMail(para, asunto, texto, outputFile, errorFile)
  }
  public static async sendMailDebug(asunto: string, texto: string, filePath1: string, filePath2: string): Promise <String> {
      return await this.sendMail(getSettingsConfig().notificaciones_debug, asunto, texto, filePath1, filePath2);
  }    
  public static async sendMail(para: string, asunto: string, texto: string, filePath1: string, filePath2: string): Promise <String> {
    let respuesta: string = "Correo no enviado";
    interface MailOptions {
      from: string;
      to: string;
      subject: string;
      text: string;
      attachments?: { filename: string; path: string }[];
    }
    
    let mailOptions: MailOptions = {
      from: mailConfig.from, // Dirección desde la cual se envía el correo
      to: para || "diego@solinges.com.ar", // Lista de destinatarios
      subject: asunto || "Mail desde NAGES", // Asunto
      text: texto, // Texto plano del mensaje
      attachments: []
    };
    
    // Agregar el primer adjunto si la ruta no está vacía
    if (filePath1 && filePath1.trim() !== '') {
      mailOptions.attachments!.push({
        filename: filePath1.split('/').pop()!, // Nombre del archivo adjunto 1
        path: filePath1 // Ruta al archivo adjunto 1
      });
    }
    
    // Agregar el segundo adjunto si la ruta no está vacía
    if (filePath2 && filePath2.trim() !== '') {
      mailOptions.attachments!.push({
        filename: filePath2.split('/').pop()!, // Nombre del archivo adjunto 2
        path: filePath2 // Ruta al archivo adjunto 2
      });
    }
    
    // Si no hay adjuntos, se elimina la propiedad attachments
    if (mailOptions.attachments!.length === 0) {
      delete mailOptions.attachments;
    }
    
    try {
      const info = await transporter.sendMail(mailOptions);
      respuesta='Correo enviado: ' + info.response;
    } catch (error) {
      respuesta='Error al enviar el correo:'+error;
    }
  
  return new Promise((resolve,_reject) => {resolve(respuesta)})};

}
