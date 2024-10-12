import { mod_dataupdater } from "../modules/mod_dataupdater";
import { Connection } from "mysql2";
export declare class mod2 extends mod_dataupdater {
    constructor();
    crearPreUpdates(): void;
    crearUpdates(): void;
    obtenerConexion(multipleStatements?: boolean): Connection;
}
