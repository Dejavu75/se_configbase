import cors from 'cors';
import { cnt_ECEndpoints, cnt_HAEndpoints, cnt_heartbeat, cnt_MSEndpoints } from "se_contractholder";
import { MySQLConfig, servingConfig, localdirConfig, schSettings, sch_msconfig, sch_msidentity, schMailSettings } from "../schemas/sch_config"

require('dotenv').config();
export async function registerService() {
  const cntb: cnt_heartbeat = cnt_heartbeat.fromMSIdentity(getMSIdentity())
  cntb.status = "starting"
  cntb.action = "register"
  const msconfig = getMSConfig()
  if (msconfig.heartbeatMonitor != "") {
    const url = msconfig.heartbeatMonitor
    const response =  fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(cntb),
    }).catch(error => console.error('Error al registrar el ms: ', error.TypeError));
  }
}
export function getHeartBeat(){
  let cntB:cnt_heartbeat = cnt_heartbeat.fromMSIdentity(getMSIdentity())
  cntB.status = "OK"
  cntB.action = "beat"
  return cntB
}
export function getMSIdentity() {
  const msidentity: sch_msidentity = {
    mscode: process.env.MSCODE || "MSXX",
    msinstance: process.env.MSINSTANCE || "UNICA",
    version: parseInt(process.env.MSVERSION || ""),
    url: process.env.MSURL || "",
    expectedInterval: parseInt(process.env.MSMONINTERVAL || "600"),
    serviceType: process.env.MSSERVICETYPE || "unknown",
    extraData: process.env.MSEXTRADATA || ""
  }
  return msidentity
}
export function getMSConfig() {
  const msconfig: sch_msconfig = {
    mscode: process.env.MSCODE || "MSXX",
    msinstance: process.env.MSINSTANCE || "UNICA",
    msdb: process.env.MSDB || "MSXX",
    version:0,
    serviceType: process.env.MSSERVICETYPE || "unknown",
    heartbeatMonitor: process.env.MSHEARTBEATMONITOR || ""
  }
  return msconfig
}

export function getMySQLConfig() {
  const mysqlconfig: MySQLConfig = {
    host: process.env.MYSQL_HOST || 'localhost',
    user: process.env.MYSQL_USER || 'user',
    password: process.env.MYSQL_PASS || 'password',
    database: process.env.MYSQL_DATA || 'database',
    database2: process.env.MYSQL_DATA2 || 'database2',
    dataclientes: process.env.MYSQL_CLIENTES || 'dataclientes',
    port: process.env.MYSQL_PORT || "3306"
  }
  return mysqlconfig
}
export function getServingConfig() {
  const servingconfig: servingConfig = {
    port: process.env.PORT || "80",
    port_local: process.env.PORT_LOCAL || "3000",
    port_ssl: process.env.PORT_SSL || "443"
  }
  return servingconfig
}
export function getLocalDirConfig() {
  const localdirConfig: localdirConfig = {
    backupdir: process.env.BACKUPDIR || "/etc/nages2/backupdir",
    gesdir: process.env.GESDIR || "/etc/nages2/gesdir",
    iibbdir: process.env.IIBBDIR || "/etc/nages2/iibb",
    logdir: process.env.LOGDIR || "/etc/nages2/logdir",
    certdir: process.env.CERTDIR || "/etc/nages2/certdir",
    certafipdir: process.env.CERTAFIPDIR || "/etc/nages2/certafipdir",
    logfile: process.env.LOGFILE || "ages_outputLog.log",
    errorfile: process.env.ERRORFILE || "ages_errorsLog.log"
  }
  return localdirConfig
}
export function getAfipConfig() {
  const afipconfig = {
    debug: process.env.AFIP_DEBUG || false,
    prod: process.env.AFIP_PROD || true,
    crt: process.env.AFIP_CRT || "dvs_certificado.crt",
    key: process.env.AFIP_KEY || "dvs_privada.key",
    pfx: process.env.AFIP_PFX || "",
    pfxclave: process.env.AFIP_PFXCLAVE || "",
    cuit: process.env.AFIP_CUIT || "20247602640"
  }
  return afipconfig
}
export function getSettingsConfig() {
  const settingsConfig: schSettings = {
    notificaciones_base: process.env.NOTIFICACIONES_BASE || "diego@solinges.com.ar",
    notificaciones_generales: process.env.NOTIFICACIONES_GENERALES || "",
    notificaciones_activaciones: process.env.NOTIFICACIONES_ACTIVACIONES || "",
    notificaciones_debug: process.env.NOTIFICACIONES_DEBUG || "",
    notificaciones_debug_enviar: parseInt(process.env.NOTIFICACIONES_DEBUG_ENVIAR || "1")
  }
  if (settingsConfig.notificaciones_generales == "") settingsConfig.notificaciones_generales = settingsConfig.notificaciones_base
  if (settingsConfig.notificaciones_activaciones == "") settingsConfig.notificaciones_activaciones = settingsConfig.notificaciones_generales
  if (settingsConfig.notificaciones_debug == "") settingsConfig.notificaciones_debug = settingsConfig.notificaciones_generales
  return settingsConfig
}
export function getMailConfig() {
  const mailconfig: schMailSettings = {
    host: process.env.MAIL_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.MAIL_PORT  || "465"),
    secure: process.env.MAIL_SECURE === 'true' || true,
    from: process.env.MAIL_FROM || process.env.MAIL_USER || '',
    fromName: process.env.MAIL_FROMNAME || 'Solinges Ecosystem',
    auth: {
      user: process.env.MAIL_USER || '',
      pass: process.env.MAIL_PASS || ''
    }
  }
  return mailconfig   ;
}
export function getECEndpoints() {
  const schEco: cnt_ECEndpoints = new cnt_ECEndpoints(
    getHAEndpoint(),
    getMSEndpoint()
  )
  return schEco
}

export function getMSEndpoint() {
  const schMSE: cnt_MSEndpoints =  new cnt_MSEndpoints(
     process.env.MSHEARTBEATMONITOR || "http://localhost:3007/healthmonitor/heartbeat/register"
    )
  return schMSE
}
export function getHAEndpoint():cnt_HAEndpoints {
  const haEndPoint: cnt_HAEndpoints = new cnt_HAEndpoints(
     process.env.HAFOREIGN || "http://localhost:41052/foreign",
     process.env.HACREDENTIALS || "http://localhost:41081/security/credentials", 
     process.env.HAINFORMATION || "http://localhost:41081/security/information",
     process.env.HAAGES || "http://localhost/ages"
  )
  return haEndPoint
}
export function getFullCors(){
  return cors({
    origin: '*', // Permite todos los orígenes
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'], // Permite todos los métodos HTTP
    allowedHeaders: '*', // Permite todos los headers
    exposedHeaders: '*', // Permite exponer todos los headers
  })
}
