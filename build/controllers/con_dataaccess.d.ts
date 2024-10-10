import mysql, { Connection } from "mysql2";
export declare class con_dataaccess {
    Connection: mysql.Connection;
    constructor();
    conectar(conexion?: Connection): Promise<Connection>;
    obtenerConexion(): Connection;
    iniciar(): Promise<false | undefined>;
    validarConfiguracion(conexion?: Connection): Promise<false | undefined>;
    inicializar(): Promise<void>;
}
