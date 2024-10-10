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
exports.con_dataaccess = void 0;
const mysql2_1 = __importDefault(require("mysql2"));
class con_dataaccess {
    constructor() {
        this.Connection = this.obtenerConexion();
    }
    // VALIDACION INICIAL DE LA CONEXION
    conectar() {
        return __awaiter(this, arguments, void 0, function* (conexion = this.Connection) {
            return new Promise((resolve, reject) => {
                conexion.connect((err) => {
                    if (err)
                        reject(null);
                    resolve(conexion);
                });
            });
        });
    }
    obtenerConexion() {
        return mysql2_1.default.createConnection("");
    }
    iniciar() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.validarConfiguracion();
        });
    }
    validarConfiguracion() {
        return __awaiter(this, arguments, void 0, function* (conexion = this.Connection) {
            let oCon = this.conectar(conexion);
            if (oCon == null) {
                console.log("Error al conectar a la base de datos");
                return false;
            }
            conexion.query("SELECT 1", (err, results, fields) => {
                if (err) {
                    console.error(err);
                    return false;
                }
            });
        });
    }
    inicializar() {
        return __awaiter(this, void 0, void 0, function* () {
        });
    }
}
exports.con_dataaccess = con_dataaccess;
