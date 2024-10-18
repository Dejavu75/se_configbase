import { cnt_heartbeat } from "se_contractholder";
import { MySQLConfig, servingConfig, localdirConfig, schSettings, sch_msconfig, sch_msidentity } from "../schemas/sch_config";
export declare function getHeartBeat(): cnt_heartbeat;
export declare function getMSIdentity(): sch_msidentity;
export declare function getMSConfig(): sch_msconfig;
export declare function getMySQLConfig(): MySQLConfig;
export declare function getServingConfig(): servingConfig;
export declare function getLocalDirConfig(): localdirConfig;
export declare function getAfipConfig(): {
    debug: string | boolean;
    prod: string | boolean;
    crt: string;
    key: string;
    pfx: string;
    pfxclave: string;
    cuit: string;
};
export declare function getSettingsConfig(): schSettings;
