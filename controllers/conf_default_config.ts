import { MySQLConfig, servingConfig,localdirConfig, schSettings } from "../schemas/sch_config"

require('dotenv').config();

export function getMySQLConfig() {
  const mysqlconfig:MySQLConfig = {
    host: process.env.MYSQL_HOST || 'localhost',
   user:  process.env.MYSQL_USER || 'user',
   password:  process.env.MYSQL_PASS || 'password',
   database:  process.env.MYSQL_DATA || 'database',
   database2:  process.env.MYSQL_DATA2 || 'database2',
   dataclientes:  process.env.MYSQL_CLIENTES || 'dataclientes',
   port:  process.env.MYSQL_PORT || "3306"
  }
  return mysqlconfig
}
export function getServingConfig() {
  const servingconfig:servingConfig = {
    port:  process.env.PORT || "80",
    port_local:  process.env.PORT_LOCAL || "3000",
    port_ssl:  process.env.PORT_SSL || "443"
  }
  return servingconfig
}
export function getLocalDirConfig() {
  const localdirConfig:localdirConfig = {
    backupdir:  process.env.BACKUPDIR || "/etc/nages2/backupdir",
    gesdir:  process.env.GESDIR || "/etc/nages2/gesdir",
    iibbdir:  process.env.IIBBDIR || "/etc/nages2/iibb",    
    logdir:  process.env.LOGDIR || "/etc/nages2/logdir",
    certdir:  process.env.CERTDIR || "/etc/nages2/certdir", 
    certafipdir:  process.env.CERTAFIPDIR || "/etc/nages2/certafipdir"    
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
  const settingsConfig:schSettings = {
    notificaciones_base: process.env.NOTIFICACIONES_BASE || "diego@solinges.com.ar",
    notificaciones_generales:  process.env.NOTIFICACIONES_GENERALES || "",
    notificaciones_activaciones:  process.env.NOTIFICACIONES_ACTIVACIONES ||"",
    notificaciones_debug:  process.env.NOTIFICACIONES_DEBUG || "",
    notificaciones_debug_enviar:  parseInt(process.env.NOTIFICACIONES_DEBUG_ENVIAR || "1")
  }
  if (settingsConfig.notificaciones_generales=="") settingsConfig.notificaciones_generales = settingsConfig.notificaciones_base
  if (settingsConfig.notificaciones_activaciones=="") settingsConfig.notificaciones_activaciones = settingsConfig.notificaciones_generales
  if (settingsConfig.notificaciones_debug=="") settingsConfig.notificaciones_debug = settingsConfig.notificaciones_generales
  return settingsConfig
}
