import mysql, { Connection } from "mysql2";
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
        return connection;
    }
    async controlarMSDATA() {
        return this.controlarConfigBase().then(async (oConfig) => {
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
        this.Connection = this.obtenerConexion();
        let sql = this.obtenerCreateString();
        if (this.Connection) {
            return new Promise((resolve, reject) => {
                this.Connection!.query(sql, async (err: any, result: any) => {
                    if (err) {
                        this.Connection!.end();
                        console.log("Error al crear base de datos", err);
                        return reject(false);
                    }
                    sql = `INSERT INTO config (mscode, instancia, msdb) VALUES ('${this.mscode}', '${this.instancia}', '${this.database}')`;
                    this.Connection!.query(sql, async (err: any, result: any) => {
                        if (err) {
                            this.Connection!.end();
                            console.log("Error al registro de configuración", err);
                            return reject(false);
                        }
                        resolve(true);
                    });
                });
            });
        } else {
            return Promise.reject('No se pudo establecer la conexión a la base de datos'); // Rechazamos la promesa
        }
    }
    async crearMSDB(): Promise<boolean> {
        let oCon: Connection = this.obtenerConfigBase();
        if (oCon) {
            let sql = `CREATE DATABASE ${this.database}`;
            return new Promise((resolve, reject) => {
                oCon.query(sql, async (err: any, result: any) => {
                    oCon.end();
                    if (err) {
                        console.log("Error al crear base de datos", err);
                        return reject(false);
                    }
                    await this.crearMSDBConfig()
                    resolve(true);
                });
            });
        } else {
            return Promise.reject('No se pudo establecer la conexión a la base de datos'); // Rechazamos la promesa
        }
    }
    async controlarMSDB(): Promise<Connection | null> {
        this.Connection = this.obtenerConexion();
        return new Promise((resolve, reject) => {
            this.Connection!.connect(async (err) => {
                if (err) {
                    if (err.code === 'ER_BAD_DB_ERROR') {
                        if (await this.crearMSDB()) {
                            return resolve(this.Connection!);
                        } else {
                            console.log("Error al conectar a la base MS", this.Connection!.config.database, err);
                            return reject(null);
                        }
                    }
                }

                console.log("Conectada a la base de datos " + this.Connection!.config.database);
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
        return connection;
    }

    // Registra el nuevo MS en la base de configuración
    async inicializarConfigBase(): Promise<sch_configbase | null> {

        let oCon: Connection = await this.conexionBase();
        if (oCon) {
            let sql = `INSERT INTO configbase.config (mscode, instancia, msdb) VALUES ('${this.mscode}', '${this.instancia}', '${this.database}')`;
            return new Promise((resolve, reject) => {
                oCon.query(sql, async (err: any, result: sch_configbase[]) => {
                    oCon.end();
                    if (err) reject(null);
                    resolve(await this.controlarConfigBase());
                });
            });
        } else {
            return Promise.reject('No se pudo establecer la conexión a la base de datos'); // Rechazamos la promesa;
        }
    }

    //Obtiene la DB del MS
    async controlarConfigBase(): Promise<sch_configbase | null> {
        let oCon: Connection = await this.conexionBase();
        if (oCon) {
            let sql = `SELECT * FROM configbase.config WHERE mscode='${this.mscode}' AND instancia='${this.instancia}'`;
            return new Promise((resolve, reject) => {
                oCon.query(sql, async (err: any, result: sch_configbase[]) => {
                    oCon.end();
                    if (err) {
                        console.log("Error al consultar configBase", err);
                        return reject(null);
                    }

                    if (result.length == 0) {
                        try {
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
        let oCon = this.obtenerConfigBase();
        return new Promise((resolve, reject) => {
            oCon.connect((err) => {
                if (err) {
                    console.log("Error al conectar", err);
                    return reject(err);
                }
                console.log("Conectada a la base de datos " + oCon.config.host);
                return resolve(oCon);
            });
        });
    }

}