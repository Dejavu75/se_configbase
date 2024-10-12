import { Connection } from "mysql2";
import { sch_configbase } from "se_contractholder/build/MS08/database";
import { mod_dataupdater } from "./mod_dataupdater";
export declare class mod_dataaccess {
    Connection?: Connection;
    mscode: string;
    instancia: string;
    database: string;
    constructor(mscode?: string, instancia?: string, database?: string);
    obtenerConexion(multiple?: boolean): Connection;
    controlarMSDATA(): Promise<void>;
    crearMSDBData(): Promise<boolean>;
    obtenerCreateString(): string;
    crearMSDBConfig(): Promise<boolean>;
    crearMSDB(): Promise<boolean>;
    controlarMSDB(): Promise<Connection | null>;
    obtenerUpdates(): mod_dataupdater;
    controlarUpdates(): Promise<boolean>;
    obtenerMySQLConfig(): import("..").MySQLConfig;
    obtenerConfigBase(multiple?: boolean): Connection;
    inicializarConfigBase(): Promise<sch_configbase | null>;
    controlarConfigBase(): Promise<sch_configbase | null>;
    conexionBase(): Promise<Connection>;
}
