import mysql, { Connection, RowDataPacket } from "mysql2";
import { sch_configbase } from "se_contractholder/build/MS08/database";
import { getMSConfig, getMySQLConfig } from "../controllers/conf_default_config";
import { mod_dataupdater } from "./mod_dataupdater";


export class mod_dataaccess {
    Connection?: Connection = undefined;
    mscode = "";
    instancia = "";
    database = "";
    constructor(mscode: string = "", instancia: string = "", database: string = "") {
        let oConfig = getMSConfig();
        if (mscode === "") mscode = oConfig.mscode;
        if (instancia === "") instancia = oConfig.msinstance;
        if (database === "") database = oConfig.msdb;

        this.mscode = mscode;
        this.instancia = instancia;
        this.database = database;
    }
    obtenerConexion(multiple:boolean=false): Connection {
        let oConfig = getMySQLConfig();
        let connection: Connection = mysql.createConnection({
            host: oConfig.host || 'localhost',
            user: oConfig.user || 'user',
            password: oConfig.password || 'password',
            database: this.database,
            multipleStatements: multiple
        });
        //console.log("Conexión a la base de datos", connection.config);
        return connection;
    }
    async controlarMSDATA() {
        //console.log("ControlarMSDATA");
        return this.controlarConfigBase().then(async (oConfig) => {
            //console.log("controlarConfigBase then ", oConfig);
            await this.controlarMSDB();
        });

    }
    async crearMSDBData(): Promise<boolean> {
        console.log("Se debe definir crearMSDBData para", this.mscode, this.instancia, this.database);
        return false
    }
    obtenerCreateString(): string {
        
        let sql = "CREATE TABLE config (mscode varchar(30) NOT NULL,instancia varchar(30) NOT NULL,msdb varchar(30) DEFAULT NULL,version decimal(12,0) NOT NULL DEFAULT '0')"
        sql += 'ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;';
        return sql;
    }
    async crearMSDBConfig(): Promise<boolean> {
        //console.log("crearMSDBConfig");
        this.Connection = this.obtenerConexion();
        let sql = this.obtenerCreateString();
        if (this.Connection) {
            return new Promise((resolve, reject) => {
                //console.log("crearMSDBConfig promise");
                this.Connection!.query(sql, async (err: any, result: any) => {
                    //console.log("crearMSDBConfig query");
                    if (err) {
                        this.Connection!.end();
                        console.error("Error al crear base de datos", err);
                        return reject(false);
                    }
                    //console.log("crearMSDBConfig insert");
                    sql = `INSERT INTO config (mscode, instancia, msdb) VALUES ('${this.mscode}', '${this.instancia}', '${this.database}')`;
                    this.Connection!.query(sql, async (err: any, result: any) => {
                        //console.log("crearMSDBConfig insert dentro");
                        if (err) {
                            this.Connection!.end();
                            console.error("Error al registro de configuración", err);
                            return reject(false);
                        }
                        //console.log("crearMSDBConfig insert resolve");
                        resolve(true);
                    });
                });
            });
        } else {
            console.error("crearMSDBConfig No se pudo establecer la conexión a la base de datos");
            return Promise.reject('No se pudo establecer la conexión a la base de datos'); // Rechazamos la promesa
        }
    }
    async crearMSDB(): Promise<boolean> {
        //console.log("crearMSDB");
        let oCon: Connection = this.obtenerConfigBase();
        if (oCon) {
            //console.log("crearMSDB Conexión establecida");
            let sql = `CREATE DATABASE ${this.database}`;
            return new Promise((resolve, reject) => {
                //console.log("crearMSDB query");
                oCon.query(sql, async (err: any, result: any) => {
                    oCon.end();
                    if (err) {
                        console.error("Error al crear base de datos", err);
                        return reject(false);
                    }
                    //console.log("crearMSDB preawait ");
                    await this.crearMSDBConfig()
                    resolve(true);
                });
            });
        } else {
            return Promise.reject('No se pudo establecer la conexión a la base de datos'); // Rechazamos la promesa
        }
    }
    async controlarMSDB(): Promise<Connection | null> {
        //console.log("controlarMSDB ");
        this.Connection = this.obtenerConexion();
        return new Promise((resolve, reject) => {
            //console.log("controlarMSDB promise");
            this.Connection!.connect(async (err) => {
                if (err) {
                    if (err.code === 'ER_BAD_DB_ERROR') {
                        //console.log("precrearMSDB");
                        if (await this.crearMSDB()) {
                            //console.log("if crearMSDB");
                            return resolve(this.Connection!);
                        } else {
                            console.error("Error al conectar a la base MS", this.Connection!.config.database, err);
                            return reject(null);
                        }
                    }
                }

                //console.log("Conectada a la base de datos " + this.Connection!.config.database);
                await this.controlarUpdates().then((result) => {
                    return resolve(this.Connection!);
                })
            });
        });
    }
    obtenerUpdates(){
        return new mod_dataupdater(this.mscode, this.instancia);
    }
    async controlarUpdates(): Promise<boolean> {
        //console.log("Controlar updates")
        let oUpdater = this.obtenerUpdates();
        this.Connection!.config.multipleStatements = true;

        return await oUpdater.iniciarUpdates(this.Connection)
    }
    obtenerMySQLConfig() {
        return getMySQLConfig();
    }
    obtenerConfigBase(multiple:boolean=false): Connection {
        let oConfig = this.obtenerMySQLConfig();
        let connection: Connection = mysql.createConnection({
            host: oConfig.host || 'localhost',
            user: oConfig.user || 'user',
            password: oConfig.password || 'password',
            database: 'configbase',
            multipleStatements: true            
        });
        //console.log("Obtener ConfigBase ", connection.config);
        return connection;
    }

    // Registra el nuevo MS en la base de configuración
    async inicializarConfigBase(): Promise<sch_configbase | null> {
        console.log("Iniciar ConfigBase ");
        let oCon: Connection = await this.conexionBase();
        if (oCon) {
            //console.log("Insert ConfigBase ");
            let sql = `INSERT INTO configbase.config (mscode, instancia, msdb) VALUES ('${this.mscode}', '${this.instancia}', '${this.database}')`;
            return new Promise((resolve, reject) => {
                //console.log("ConfigBase Promise");
                oCon.query(sql, async (err: any, result: sch_configbase[]) => {
                    //console.log("ConfigBase Query");
                    oCon.end();
                    if (err) reject(null);
                    //console.log("ConfigBase Resolve");
                    resolve(await this.controlarConfigBase());
                });
            });
        } else {
            return Promise.reject('No se pudo establecer la conexión a la base de datos'); // Rechazamos la promesa;
        }
    }

    //Obtiene la DB del MS
    async controlarConfigBase(): Promise<sch_configbase | null> {
        //console.log("controlarConfigBase");
        let oCon: Connection = await this.conexionBase();
        if (oCon) {
            let sql = `SELECT * FROM configbase.config WHERE mscode='${this.mscode}' AND instancia='${this.instancia}'`;
            return new Promise((resolve, reject) => {
                //console.log("controlarConfigBase Promise");
                oCon.query(sql, async (err: any, result: sch_configbase[]) => {
                    //console.log("controlarConfigBase Query");
                    oCon.end();
                    if (err) {
                        console.error("Error al consultar configBase", err);
                        return reject(null);
                    }

                    if (result.length == 0) {
                        try {
                            //console.log("Pre Inicializar");
                            const res = await this.inicializarConfigBase();  // Espera que se resuelva la promesa
                            return resolve(res);
                        } catch (err) {
                            return reject(err);
                        }
                    }
                    this.database = result[0].msdb;
                    resolve(result[0]);
                });
            });
        } else {
            return null;

        }

    }
    async conexionBase(): Promise<Connection> {
        //console.log("ConexionBase");        
        let oCon = this.obtenerConfigBase();
        return new Promise((resolve, reject) => {
            //console.log("conexionBase Connect");
            oCon.connect((err) => {
                if (err) {
                    console.error("conexionBase Error al conectar", err);
                    return reject(err);
                }
                //console.log("conexionBase Conectada a la base de datos " + oCon.config.host);
                return resolve(oCon);
            });
        });
    }

}

export class mod_dataaccess_generico extends mod_dataaccess {
    // #region Funciones de inicialización  
    connection?: Connection | undefined;
    constructor(mscode = undefined, instancia = undefined, database = undefined) {
        super(mscode, instancia, database);

    }

    obtenerConexion(multiple?: boolean): Connection {
        return super.obtenerConexion(multiple);
    }
    obtenerConexionado(multiple: boolean): Connection {
        if (!this.connection) {
            this.connection = this.obtenerConexion(multiple);
        }
        return this.connection;
    }
    // #endregion
// #region Función de manejo de datos genéricos
async recuperarDatos(tabla: string, condiciones: any = {}): Promise<RowDataPacket[]> {
    const keys = Object.keys(condiciones);
    const whereClause = keys.length > 0 ? `WHERE ${keys.map(key => `${key} = ?`).join(' AND ')}` : '';
    const params = keys.map(key => condiciones[key]);
    const query = `SELECT * FROM ${tabla} ${whereClause};`;

    const oCon: Connection = this.obtenerConexionado(false);
    return new Promise((resolve, reject) => {
        oCon.query(query, params, (error, results) => {
            if (error) {
                console.error(`Error al recuperar datos de ${tabla}:`, error);
                return reject(error);
            }
            resolve(results as RowDataPacket[]);
        });
    });
}

// Función para crear datos
async crearDatos(tabla: string, data: any): Promise<any> {
    const keys = Object.keys(data);
    const values = keys.map(() => '?').join(', ');
    const query = `
    INSERT INTO ${tabla} (${keys.join(', ')})
    VALUES (${values});
`;

    const params = Object.values(data);
    const oCon: Connection = this.obtenerConexionado(true);
    return new Promise((resolve, reject) => {
        oCon.query(query, params, (error, result) => {
            if (error) {
                //console.error(`Error al insertar datos en ${tabla}:`, error);
                return reject(error);
            }
            resolve(result);
        });
    });
}

// Función para actualizar datos
async actualizarDatos(tabla: string, data: any, condiciones: any): Promise<any> {
    const keys = Object.keys(data);
    const setClause = keys.map(key => `${key} = ?`).join(', ');

    const conditionKeys = Object.keys(condiciones);
    const whereClause = conditionKeys.map(key => `${key} = ?`).join(' AND ');

    const query = `
    UPDATE ${tabla}
    SET ${setClause}
    WHERE ${whereClause};
`;

    const params = [...Object.values(data), ...Object.values(condiciones)];
    const oCon: Connection = this.obtenerConexionado(true);
    return new Promise((resolve, reject) => {
        oCon.query(query, params, (error, result) => {
            if (error) {
                //console.error(`Error al actualizar datos en ${tabla}:`, error);
                return reject(error);
            }
            resolve(result);
        });
    });
}
//#endregion
}