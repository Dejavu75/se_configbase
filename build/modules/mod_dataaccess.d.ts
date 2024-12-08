import { Connection, RowDataPacket } from "mysql2";
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
export declare class mod_dataaccess_generico extends mod_dataaccess {
    connection?: Connection | undefined;
    constructor(mscode?: undefined, instancia?: undefined, database?: undefined);
    obtenerConexion(multiple?: boolean): Connection;
    obtenerConexionado(multiple: boolean): Connection;
    recuperarDatos(tabla: string, condiciones?: any): Promise<RowDataPacket[]>;
    crearDatos(tabla: string, data: any): Promise<any>;
    actualizarDatos(tabla: string, data: any, condiciones: any): Promise<any>;
    eliminarDatos(tabla: string, data: any, condiciones: any): Promise<any>;
}
