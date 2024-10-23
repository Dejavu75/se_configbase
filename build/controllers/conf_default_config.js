"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getHeartBeat = getHeartBeat;
exports.getMSIdentity = getMSIdentity;
exports.getMSConfig = getMSConfig;
exports.getMySQLConfig = getMySQLConfig;
exports.getServingConfig = getServingConfig;
exports.getLocalDirConfig = getLocalDirConfig;
exports.getAfipConfig = getAfipConfig;
exports.getSettingsConfig = getSettingsConfig;
const se_contractholder_1 = require("se_contractholder");
require('dotenv').config();
function getHeartBeat() {
    let cntB = se_contractholder_1.cnt_heartbeat.fromMSIdentity(getMSIdentity());
    cntB.status = "OK";
    cntB.action = "beat";
    return cntB;
}
function getMSIdentity() {
    const msidentity = {
        mscode: process.env.MSCODE || "MSXX",
        msinstance: process.env.MSINSTANCE || "UNICA",
        version: parseInt(process.env.MSVERSION || ""),
        url: process.env.MSURL || "",
        expectedInterval: parseInt(process.env.MSMONINTERVAL || "600"),
        serviceType: process.env.MSSERVICETYPE || "unknown",
        extraData: process.env.MSEXTRADATA || ""
    };
    return msidentity;
}
function getMSConfig() {
    const msconfig = {
        mscode: process.env.MSCODE || "MSXX",
        msinstance: process.env.MSINSTANCE || "UNICA",
        msdb: process.env.MSDB || "MSXX",
        version: 0,
        serviceType: process.env.MSSERVICETYPE || "unknown"
    };
    return msconfig;
}
function getMySQLConfig() {
    const mysqlconfig = {
        host: process.env.MYSQL_HOST || 'localhost',
        user: process.env.MYSQL_USER || 'user',
        password: process.env.MYSQL_PASS || 'password',
        database: process.env.MYSQL_DATA || 'database',
        database2: process.env.MYSQL_DATA2 || 'database2',
        dataclientes: process.env.MYSQL_CLIENTES || 'dataclientes',
        port: process.env.MYSQL_PORT || "3306"
    };
    return mysqlconfig;
}
function getServingConfig() {
    const servingconfig = {
        port: process.env.PORT || "80",
        port_local: process.env.PORT_LOCAL || "3000",
        port_ssl: process.env.PORT_SSL || "443"
    };
    return servingconfig;
}
function getLocalDirConfig() {
    const localdirConfig = {
        backupdir: process.env.BACKUPDIR || "/etc/nages2/backupdir",
        gesdir: process.env.GESDIR || "/etc/nages2/gesdir",
        iibbdir: process.env.IIBBDIR || "/etc/nages2/iibb",
        logdir: process.env.LOGDIR || "/etc/nages2/logdir",
        certdir: process.env.CERTDIR || "/etc/nages2/certdir",
        certafipdir: process.env.CERTAFIPDIR || "/etc/nages2/certafipdir",
        logfile: process.env.LOGFILE || "ages_outputLog.log",
        errorfile: process.env.ERRORFILE || "ages_errorsLog.log"
    };
    return localdirConfig;
}
function getAfipConfig() {
    const afipconfig = {
        debug: process.env.AFIP_DEBUG || false,
        prod: process.env.AFIP_PROD || true,
        crt: process.env.AFIP_CRT || "dvs_certificado.crt",
        key: process.env.AFIP_KEY || "dvs_privada.key",
        pfx: process.env.AFIP_PFX || "",
        pfxclave: process.env.AFIP_PFXCLAVE || "",
        cuit: process.env.AFIP_CUIT || "20247602640"
    };
    return afipconfig;
}
function getSettingsConfig() {
    const settingsConfig = {
        notificaciones_base: process.env.NOTIFICACIONES_BASE || "diego@solinges.com.ar",
        notificaciones_generales: process.env.NOTIFICACIONES_GENERALES || "",
        notificaciones_activaciones: process.env.NOTIFICACIONES_ACTIVACIONES || "",
        notificaciones_debug: process.env.NOTIFICACIONES_DEBUG || "",
        notificaciones_debug_enviar: parseInt(process.env.NOTIFICACIONES_DEBUG_ENVIAR || "1")
    };
    if (settingsConfig.notificaciones_generales == "")
        settingsConfig.notificaciones_generales = settingsConfig.notificaciones_base;
    if (settingsConfig.notificaciones_activaciones == "")
        settingsConfig.notificaciones_activaciones = settingsConfig.notificaciones_generales;
    if (settingsConfig.notificaciones_debug == "")
        settingsConfig.notificaciones_debug = settingsConfig.notificaciones_generales;
    return settingsConfig;
}
