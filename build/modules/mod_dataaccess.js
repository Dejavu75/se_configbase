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
exports.mod_dataaccess = void 0;
const mysql2_1 = __importDefault(require("mysql2"));
const conf_default_config_1 = require("../controllers/conf_default_config");
const mod_dataupdater_1 = require("./mod_dataupdater");
class mod_dataaccess {
    constructor(mscode = "", instancia = "", database = "") {
        this.Connection = undefined;
        this.mscode = "";
        this.instancia = "";
        this.database = "";
        let oConfig = (0, conf_default_config_1.getMSCofnig)();
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
        return connection;
    }
    controlarMSDATA() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.controlarConfigBase().then((oConfig) => __awaiter(this, void 0, void 0, function* () {
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
            this.Connection = this.obtenerConexion();
            let sql = this.obtenerCreateString();
            if (this.Connection) {
                return new Promise((resolve, reject) => {
                    this.Connection.query(sql, (err, result) => __awaiter(this, void 0, void 0, function* () {
                        if (err) {
                            this.Connection.end();
                            console.log("Error al crear base de datos", err);
                            return reject(false);
                        }
                        sql = `INSERT INTO config (mscode, instancia, msdb) VALUES ('${this.mscode}', '${this.instancia}', '${this.database}')`;
                        this.Connection.query(sql, (err, result) => __awaiter(this, void 0, void 0, function* () {
                            if (err) {
                                this.Connection.end();
                                console.log("Error al registro de configuración", err);
                                return reject(false);
                            }
                            resolve(true);
                        }));
                    }));
                });
            }
            else {
                return Promise.reject('No se pudo establecer la conexión a la base de datos'); // Rechazamos la promesa
            }
        });
    }
    crearMSDB() {
        return __awaiter(this, void 0, void 0, function* () {
            let oCon = this.obtenerConfigBase();
            if (oCon) {
                let sql = `CREATE DATABASE ${this.database}`;
                return new Promise((resolve, reject) => {
                    oCon.query(sql, (err, result) => __awaiter(this, void 0, void 0, function* () {
                        oCon.end();
                        if (err) {
                            console.log("Error al crear base de datos", err);
                            return reject(false);
                        }
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
            this.Connection = this.obtenerConexion();
            return new Promise((resolve, reject) => {
                this.Connection.connect((err) => __awaiter(this, void 0, void 0, function* () {
                    if (err) {
                        if (err.code === 'ER_BAD_DB_ERROR') {
                            if (yield this.crearMSDB()) {
                                return resolve(this.Connection);
                            }
                            else {
                                console.log("Error al conectar a la base MS", this.Connection.config.database, err);
                                return reject(null);
                            }
                        }
                    }
                    console.log("Conectada a la base de datos " + this.Connection.config.database);
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
        return connection;
    }
    // Registra el nuevo MS en la base de configuración
    inicializarConfigBase() {
        return __awaiter(this, void 0, void 0, function* () {
            let oCon = yield this.conexionBase();
            if (oCon) {
                let sql = `INSERT INTO configbase.config (mscode, instancia, msdb) VALUES ('${this.mscode}', '${this.instancia}', '${this.database}')`;
                return new Promise((resolve, reject) => {
                    oCon.query(sql, (err, result) => __awaiter(this, void 0, void 0, function* () {
                        oCon.end();
                        if (err)
                            reject(null);
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
            let oCon = yield this.conexionBase();
            if (oCon) {
                let sql = `SELECT * FROM configbase.config WHERE mscode='${this.mscode}' AND instancia='${this.instancia}'`;
                return new Promise((resolve, reject) => {
                    oCon.query(sql, (err, result) => __awaiter(this, void 0, void 0, function* () {
                        oCon.end();
                        if (err) {
                            console.log("Error al consultar configBase", err);
                            return reject(null);
                        }
                        if (result.length == 0) {
                            try {
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
        });
    }
}
exports.mod_dataaccess = mod_dataaccess;
