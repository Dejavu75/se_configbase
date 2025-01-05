import cors from 'cors';
import { cnt_ECEndpoints, cnt_HAEndpoints, cnt_heartbeat, cnt_MSEndpoints } from "se_contractholder";
import { MySQLConfig, servingConfig, localdirConfig, schSettings, sch_msconfig, sch_msidentity, schMailSettings } from "../schemas/sch_config";
export declare function registerService(): Promise<void>;
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
export declare function getMailConfig(): schMailSettings;
export declare function getECEndpoints(): cnt_ECEndpoints;
export declare function getMSEndpoint(): cnt_MSEndpoints;
export declare function getHAEndpoint(): cnt_HAEndpoints;
export declare function getFullCors(): (req: cors.CorsRequest, res: {
    statusCode?: number | undefined;
    setHeader(key: string, value: string): any;
    end(): any;
}, next: (err?: any) => any) => void;
