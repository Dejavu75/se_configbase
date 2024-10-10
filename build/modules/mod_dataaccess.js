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
class mod_dataaccess {
    constructor(mscode, instancia, database = "") {
        this.Connection = this.obtenerConexion();
        this.mscode = "";
        this.instancia = "";
        this.database = "";
        this.mscode = mscode;
        this.instancia = instancia;
        this.database = database;
        this.Connection = this.obtenerConexion();
    }
    obtenerConexion() {
        let oConfig = (0, conf_default_config_1.getMySQLConfig)();
        let connection = mysql2_1.default.createConnection({
            host: oConfig.host || 'localhost',
            user: oConfig.user || 'user',
            password: oConfig.password || 'password',
            database: this.database
        });
        return connection;
    }
    obtenerConfigBase() {
        let oConfig = (0, conf_default_config_1.getMySQLConfig)();
        let connection = mysql2_1.default.createConnection({
            host: oConfig.host || 'localhost',
            user: oConfig.user || 'user',
            password: oConfig.password || 'password',
            database: 'configbase'
        });
        return connection;
    }
    inicializarConfigBase() {
        return __awaiter(this, void 0, void 0, function* () {
            let oCon = yield this.conexionBase();
            if (oCon) {
                let sql = `INSERT INTO configbase.config (mscode, instancia, database) VALUES ('${this.mscode}', '${this.instancia}', '${this.database}')`;
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
    controlarConfigBase() {
        return __awaiter(this, void 0, void 0, function* () {
            let oCon = yield this.conexionBase();
            if (oCon) {
                let sql = `SELECT * FROM configbase.config WHERE mscode='${this.mscode}' AND instancia='${this.instancia}'`;
                return new Promise((resolve, reject) => {
                    oCon.query(sql, (err, result) => __awaiter(this, void 0, void 0, function* () {
                        oCon.end();
                        if (err)
                            return reject(null);
                        if (result.length == 0) {
                            try {
                                const res = yield this.inicializarConfigBase(); // Espera que se resuelva la promesa
                                return resolve(res);
                            }
                            catch (err) {
                                return reject(err);
                            }
                        }
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
            oCon.config.database = "configbase";
            return new Promise((resolve, reject) => {
                this.Connection.connect((err) => {
                    if (err)
                        reject(null);
                    resolve(this.Connection);
                });
            });
        });
    }
}
exports.mod_dataaccess = mod_dataaccess;
