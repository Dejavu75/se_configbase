import { modelBase } from "se_contractholder";
export type MySQLConfig = {
    host: string;
    user: string;
    password: string;
    database: string;
    database2: string;
    dataclientes: string;
    port: string;
};
export type servingConfig = {
    port: string;
    port_local: string;
    port_ssl: string;
};
export type localdirConfig = {
    backupdir: string;
    gesdir: string;
    logdir: string;
    iibbdir: string;
    certdir: string;
    certafipdir: string;
    logfile: string;
    errorfile: string;
};
export type schSettings = {
    notificaciones_base: string;
    notificaciones_activaciones: string;
    notificaciones_generales: string;
    notificaciones_debug: string;
    notificaciones_debug_enviar: number;
};
export type sch_afip = {
    debug: boolean;
    prod: boolean;
    crt: string;
    key: string;
    pfx: string;
    pfxclave: string;
    cuit: string;
};
export type sch_msconfig = {
    mscode: string;
    msinstance: string;
    msdb: string;
    version: number;
    serviceType: string;
    heartbeatMonitor: string;
};
export type sch_msidentity = {
    mscode: string;
    msinstance: string;
    version: number;
    url: string;
    expectedInterval: number;
    serviceType: string;
    extraData: string;
};
export type schMailSettings = {
    host: string;
    port: number;
    secure: boolean;
    from: string;
    fromName: string;
    auth: {
        user: string;
        pass: string;
    };
};
export type schModelBases = {
    pallets: modelBase;
    products: modelBase;
    warehouses: modelBase;
};
