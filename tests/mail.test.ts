import nodemailer from 'nodemailer';
import { getMailConfig } from '../controllers/conf_default_config';
import { AgesLog } from '../controllers/con_log';

AgesLog.sendMail("diego@solinges.com.ar","Prueba de mail","Esto es una prueba de mail","","","EC Test").then((result) => {console.log(result)}).catch((err) => {console.error(err)})  
AgesLog.sendMail("diego@solinges.com.ar","Prueba de mail","Esto es una prueba de mail","","").then((result) => {console.log(result)}).catch((err) => {console.error(err)})  