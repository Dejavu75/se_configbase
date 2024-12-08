"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mod_dataaccess_generico = exports.mod_dataaccess = void 0;
const mysql2_1 = __importDefault(require("mysql2"));
const conf_default_config_1 = require("../controllers/conf_default_config");
const mod_dataupdater_1 = require("./mod_dataupdater");
class mod_dataaccess {
    constructor(mscode = "", instancia = "", database = "") {
        this.Connection = undefined;
        this.mscode = "";
        this.instancia = "";
        this.database = "";
        let oConfig = (0, conf_default_config_1.getMSConfig)();
        if (mscode === "")
            mscode = oConfig.mscode;
        if (instancia === "")
            instancia = oConfig.msinstance;
        if (database === "")
            database = oConfig.msdb;
        this.mscode = mscode;
        this.instancia = instancia;
        this.database = database;
    }
    obtenerConexion(multiple = false) {
        let oConfig = (0, conf_default_config_1.getMySQLConfig)();
        let connection = mysql2_1.default.createConnection({
            host: oConfig.host || 'localhost',
            user: oConfig.user || 'user',
            password: oConfig.password || 'password',
            database: this.database,
            multipleStatements: multiple
        });
        //console.log("Conexión a la base de datos", connection.config);
        return connection;
    }
    controlarMSDATA() {
        return __awaiter(this, void 0, void 0, function* () {
            //console.log("ControlarMSDATA");
            return this.controlarConfigBase().then((oConfig) => __awaiter(this, void 0, void 0, function* () {
                //console.log("controlarConfigBase then ", oConfig);
                yield this.controlarMSDB();
            }));
        });
    }
    crearMSDBData() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("Se debe definir crearMSDBData para", this.mscode, this.instancia, this.database);
            return false;
        });
    }
    obtenerCreateString() {
        let sql = "CREATE TABLE config (mscode varchar(30) NOT NULL,instancia varchar(30) NOT NULL,msdb varchar(30) DEFAULT NULL,version decimal(12,0) NOT NULL DEFAULT '0')";
        sql += 'ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;';
        return sql;
    }
    crearMSDBConfig() {
        return __awaiter(this, void 0, void 0, function* () {
            //console.log("crearMSDBConfig");
            this.Connection = this.obtenerConexion();
            let sql = this.obtenerCreateString();
            if (this.Connection) {
                return new Promise((resolve, reject) => {
                    //console.log("crearMSDBConfig promise");
                    this.Connection.query(sql, (err, result) => __awaiter(this, void 0, void 0, function* () {
                        //console.log("crearMSDBConfig query");
                        if (err) {
                            this.Connection.end();
                            console.error("Error al crear base de datos", err);
                            return reject(false);
                        }
                        //console.log("crearMSDBConfig insert");
                        sql = `INSERT INTO config (mscode, instancia, msdb) VALUES ('${this.mscode}', '${this.instancia}', '${this.database}')`;
                        this.Connection.query(sql, (err, result) => __awaiter(this, void 0, void 0, function* () {
                            //console.log("crearMSDBConfig insert dentro");
                            if (err) {
                                this.Connection.end();
                                console.error("Error al registro de configuración", err);
                                return reject(false);
                            }
                            //console.log("crearMSDBConfig insert resolve");
                            resolve(true);
                        }));
                    }));
                });
            }
            else {
                console.error("crearMSDBConfig No se pudo establecer la conexión a la base de datos");
                return Promise.reject('No se pudo establecer la conexión a la base de datos'); // Rechazamos la promesa
            }
        });
    }
    crearMSDB() {
        return __awaiter(this, void 0, void 0, function* () {
            //console.log("crearMSDB");
            let oCon = this.obtenerConfigBase();
            if (oCon) {
                //console.log("crearMSDB Conexión establecida");
                let sql = `CREATE DATABASE ${this.database}`;
                return new Promise((resolve, reject) => {
                    //console.log("crearMSDB query");
                    oCon.query(sql, (err, result) => __awaiter(this, void 0, void 0, function* () {
                        oCon.end();
                        if (err) {
                            console.error("Error al crear base de datos", err);
                            return reject(false);
                        }
                        //console.log("crearMSDB preawait ");
                        yield this.crearMSDBConfig();
                        resolve(true);
                    }));
                });
            }
            else {
                return Promise.reject('No se pudo establecer la conexión a la base de datos'); // Rechazamos la promesa
            }
        });
    }
    controlarMSDB() {
        return __awaiter(this, void 0, void 0, function* () {
            //console.log("controlarMSDB ");
            this.Connection = this.obtenerConexion();
            return new Promise((resolve, reject) => {
                //console.log("controlarMSDB promise");
                this.Connection.connect((err) => __awaiter(this, void 0, void 0, function* () {
                    if (err) {
                        if (err.code === 'ER_BAD_DB_ERROR') {
                            //console.log("precrearMSDB");
                            if (yield this.crearMSDB()) {
                                //console.log("if crearMSDB");
                                return resolve(this.Connection);
                            }
                            else {
                                console.error("Error al conectar a la base MS", this.Connection.config.database, err);
                                return reject(null);
                            }
                        }
                    }
                    //console.log("Conectada a la base de datos " + this.Connection!.config.database);
                    yield this.controlarUpdates().then((result) => {
                        return resolve(this.Connection);
                    });
                }));
            });
        });
    }
    obtenerUpdates() {
        return new mod_dataupdater_1.mod_dataupdater(this.mscode, this.instancia);
    }
    controlarUpdates() {
        return __awaiter(this, void 0, void 0, function* () {
            //console.log("Controlar updates")
            let oUpdater = this.obtenerUpdates();
            this.Connection.config.multipleStatements = true;
            return yield oUpdater.iniciarUpdates(this.Connection);
        });
    }
    obtenerMySQLConfig() {
        return (0, conf_default_config_1.getMySQLConfig)();
    }
    obtenerConfigBase(multiple = false) {
        let oConfig = this.obtenerMySQLConfig();
        let connection = mysql2_1.default.createConnection({
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
    inicializarConfigBase() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("Iniciar ConfigBase ");
            let oCon = yield this.conexionBase();
            if (oCon) {
                //console.log("Insert ConfigBase ");
                let sql = `INSERT INTO configbase.config (mscode, instancia, msdb) VALUES ('${this.mscode}', '${this.instancia}', '${this.database}')`;
                return new Promise((resolve, reject) => {
                    //console.log("ConfigBase Promise");
                    oCon.query(sql, (err, result) => __awaiter(this, void 0, void 0, function* () {
                        //console.log("ConfigBase Query");
                        oCon.end();
                        if (err)
                            reject(null);
                        //console.log("ConfigBase Resolve");
                        resolve(yield this.controlarConfigBase());
                    }));
                });
            }
            else {
                return Promise.reject('No se pudo establecer la conexión a la base de datos'); // Rechazamos la promesa;
            }
        });
    }
    //Obtiene la DB del MS
    controlarConfigBase() {
        return __awaiter(this, void 0, void 0, function* () {
            //console.log("controlarConfigBase");
            let oCon = yield this.conexionBase();
            if (oCon) {
                let sql = `SELECT * FROM configbase.config WHERE mscode='${this.mscode}' AND instancia='${this.instancia}'`;
                return new Promise((resolve, reject) => {
                    //console.log("controlarConfigBase Promise");
                    oCon.query(sql, (err, result) => __awaiter(this, void 0, void 0, function* () {
                        //console.log("controlarConfigBase Query");
                        oCon.end();
                        if (err) {
                            console.error("Error al consultar configBase", err);
                            return reject(null);
                        }
                        if (result.length == 0) {
                            try {
                                //console.log("Pre Inicializar");
                                const res = yield this.inicializarConfigBase(); // Espera que se resuelva la promesa
                                return resolve(res);
                            }
                            catch (err) {
                                return reject(err);
                            }
                        }
                        this.database = result[0].msdb;
                        resolve(result[0]);
                    }));
                });
            }
            else {
                return null;
            }
        });
    }
    conexionBase() {
        return __awaiter(this, void 0, void 0, function* () {
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
        });
    }
}
exports.mod_dataaccess = mod_dataaccess;
class mod_dataaccess_generico extends mod_dataaccess {
    constructor(mscode = undefined, instancia = undefined, database = undefined) {
        super(mscode, instancia, database);
    }
    obtenerConexion(multiple) {
        return super.obtenerConexion(multiple);
    }
    obtenerConexionado(multiple) {
        if (!this.connection) {
            this.connection = this.obtenerConexion(multiple);
        }
        return this.connection;
    }
    // #endregion
    // #region Función de manejo de datos genéricos
    recuperarDatos(tabla_1) {
        return __awaiter(this, arguments, void 0, function* (tabla, condiciones = {}) {
            const keys = Object.keys(condiciones);
            const whereClause = keys.length > 0 ? `WHERE ${keys.map(key => `${key} = ?`).join(' AND ')}` : '';
            const params = keys.map(key => condiciones[key]);
            const query = `SELECT * FROM ${tabla} ${whereClause};`;
            const oCon = this.obtenerConexionado(false);
            return new Promise((resolve, reject) => {
                oCon.query(query, params, (error, results) => {
                    if (error) {
                        console.error(`Error al recuperar datos de ${tabla}:`, error);
                        return reject(error);
                    }
                    resolve(results);
                });
            });
        });
    }
    // Función para crear datos
    crearDatos(tabla, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const keys = Object.keys(data);
            const values = keys.map(() => '?').join(', ');
            const query = `
    INSERT INTO ${tabla} (${keys.join(', ')})
    VALUES (${values});
`;
            const params = Object.values(data);
            const oCon = this.obtenerConexionado(true);
            return new Promise((resolve, reject) => {
                oCon.query(query, params, (error, result) => {
                    if (error) {
                        //console.error(`Error al insertar datos en ${tabla}:`, error);
                        return reject(error);
                    }
                    resolve(result);
                });
            });
        });
    }
    // Función para actualizar datos
    actualizarDatos(tabla, data, condiciones) {
        return __awaiter(this, void 0, void 0, function* () {
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
            const oCon = this.obtenerConexionado(true);
            return new Promise((resolve, reject) => {
                oCon.query(query, params, (error, result) => {
                    if (error) {
                        //console.error(`Error al actualizar datos en ${tabla}:`, error);
                        return reject(error);
                    }
                    resolve(result);
                });
            });
        });
    }
    eliminarDatos(tabla, data, condiciones) {
        return __awaiter(this, void 0, void 0, function* () {
            const keys = Object.keys(data);
            const conditionKeys = Object.keys(condiciones);
            const whereClause = conditionKeys.map(key => `${key} = ?`).join(' AND ');
            const query = `
    DELETE FROM ${tabla}
    WHERE ${whereClause};
`;
            const params = [...Object.values(data), ...Object.values(condiciones)];
            const oCon = this.obtenerConexionado(true);
            return new Promise((resolve, reject) => {
                oCon.query(query, params, (error, result) => {
                    if (error) {
                        //console.error(`Error al eliminar datos en ${tabla}:`, error);
                        return reject(error);
                    }
                    resolve(result);
                });
            });
        });
    }
}
exports.mod_dataaccess_generico = mod_dataaccess_generico;
