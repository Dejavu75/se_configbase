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
Object.defineProperty(exports, "__esModule", { value: true });
exports.mod_update = exports.mod_dataupdater = void 0;
class mod_dataupdater {
    constructor(mscode, instancia, actual_version = 0, updates = []) {
        this.mscode = "";
        this.instancia = "";
        this.actual_version = 0;
        this.actual_preversion = 0;
        this.updates = [];
        this.preupdates = [];
        this.mscode = mscode;
        this.instancia = instancia;
        this.actual_version = actual_version;
        this.updates = updates;
        this.crearPreUpdates();
        this.crearUpdates();
    }
    preUpdatesProcess(oCon) {
        return Promise.resolve(true);
    }
    crearPreUpdates() {
    }
    crearUpdates() {
    }
    avanzarVersion(oCon) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(`Intentando avanzar a ${this.actual_version}`);
            return new Promise((resolve, reject) => {
                if (oCon) {
                    let sql = `UPDATE config SET version = ${this.actual_version} WHERE mscode = '${this.mscode}' AND instancia = '${this.instancia}'`;
                    oCon.query(sql, (err, result) => __awaiter(this, void 0, void 0, function* () {
                        if (err) {
                            console.error(`Error al avanzar version a ${this.actual_version}`, err);
                            return reject(false);
                        }
                        console.log(`Avanzado ${this.mscode}-${this.instancia} a ${this.actual_version}`);
                        return resolve(true);
                    }));
                }
                else {
                    return resolve(true);
                }
            });
        });
    }
    iniciarUpdates(oCon) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                let sql = `SELECT version FROM config WHERE mscode = '${this.mscode}' AND instancia = '${this.instancia}'`;
                oCon === null || oCon === void 0 ? void 0 : oCon.query(sql, (err, result) => __awaiter(this, void 0, void 0, function* () {
                    if (err) {
                        console.error(`Error al obtener version`, err);
                        return reject(false);
                    }
                    if (result.length > 0) {
                        this.actual_version = parseFloat(result[0].version);
                    }
                    else {
                        this.actual_version = 0;
                    }
                    console.log(`Iniciando updates para ${this.mscode}-${this.instancia} en version ${this.actual_version}`);
                    if (yield this.procesarPreUpdates(oCon, this.actual_preversion)) {
                        resolve(yield this.procesarUpdates(oCon, this.actual_version));
                    }
                    else {
                        resolve(false);
                    }
                }));
            });
        });
    }
    procesarPreUpdates(oCon_1) {
        return __awaiter(this, arguments, void 0, function* (oCon, version = this.actual_preversion) {
            if (version >= this.preupdates.length)
                return true;
            const result = yield this.procesarPreUpdate(this.preupdates[version], oCon);
            if (result) {
                this.actual_preversion = version + 1;
                return this.procesarPreUpdates(oCon, this.actual_preversion);
            }
            else {
                return false;
            }
        });
    }
    procesarPreUpdate(update, oCon) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield update.procesarUpdate(oCon);
        });
    }
    procesarUpdates(oCon_1) {
        return __awaiter(this, arguments, void 0, function* (oCon, version = this.actual_version) {
            if (version >= this.updates.length)
                return true;
            const result = yield this.procesarUpdate(this.updates[version], oCon);
            if (result) {
                this.actual_version = version + 1;
                yield this.avanzarVersion(oCon);
                return this.procesarUpdates(oCon, this.actual_version);
            }
            else {
                return false;
            }
        });
    }
    procesarUpdate(update, oCon) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield update.procesarUpdate(oCon);
        });
    }
}
exports.mod_dataupdater = mod_dataupdater;
class mod_update {
    constructor(version = 0, sql = "") {
        this.version = 0;
        this.sql = "";
        this.version = version;
        this.sql = sql;
    }
    procesarUpdate(oCon) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("Update procesado ", this.version, this.sql);
            return new Promise((resolve, reject) => {
                if (oCon) {
                    oCon.query(this.sql, (err, result) => __awaiter(this, void 0, void 0, function* () {
                        if (err) {
                            console.error(`Error al procesar update ${this.version}`, err);
                            return reject(false);
                        }
                        console.log(`Procesado update ${this.version}`);
                        console.log(`SQL: ${this.sql}`);
                        return resolve(true);
                    }));
                }
                else {
                    console.error(`No hay conexión para procesar update ${this.version}`);
                    return resolve(false);
                }
            });
        });
    }
}
exports.mod_update = mod_update;
