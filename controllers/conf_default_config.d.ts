import { MySQLConfig, servingConfig, localdirConfig, schSettings } from "../schemas/sch_config";
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
