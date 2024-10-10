import { Connection } from "mysql2";
import { sch_configbase } from "se_contractholder/build/MS08/database";
export declare class mod_dataaccess {
    Connection: Connection;
    mscode: string;
    instancia: string;
    database: string;
    constructor(mscode: string, instancia: string, database?: string);
    obtenerConexion(): Connection;
    obtenerConfigBase(): Connection;
    inicializarConfigBase(): Promise<sch_configbase | null>;
    controlarConfigBase(): Promise<sch_configbase | null>;
    conexionBase(): Promise<Connection>;
}
