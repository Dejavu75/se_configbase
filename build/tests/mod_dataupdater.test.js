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
const mod_dataaccess_1 = require("../modules/mod_dataaccess");
const node_test_1 = require("node:test");
const mod_dataupdater_1 = require("../modules/mod_dataupdater");
let oCon = new mod_dataaccess_1.mod_dataaccess();
class mod2 extends mod_dataupdater_1.mod_dataupdater {
    constructor() {
        super(oCon.mscode, oCon.instancia);
    }
    crearUpdates() {
        this.updates.push(new mod_dataupdater_1.mod_update(1, "SQL1"));
        this.updates.push(new mod_dataupdater_1.mod_update(2, "SQL32"));
        this.updates.push(new mod_dataupdater_1.mod_update(3, "SQL3"));
        this.updates.push(new mod_dataupdater_1.mod_update(4, "SQL4"));
    }
    obtenerConexion() {
        let oCon = new mod_dataaccess_1.mod_dataaccess();
        return oCon.obtenerConexion();
    }
}
(0, node_test_1.describe)('Procesar Updates', () => {
    let mod3 = new mod2();
    test('Controlar UPDATE Creation', () => __awaiter(void 0, void 0, void 0, function* () {
        expect(mod3.actual_version).toBe(0);
        expect(mod3.updates.length).toBe(4);
        expect(mod3.updates[0].version).toBe(1);
        expect(mod3.updates[1].version).toBe(2);
        expect(mod3.updates[2].version).toBe(3);
    }));
    test('Controlar UPDATE Process', () => __awaiter(void 0, void 0, void 0, function* () {
        yield mod3.iniciarUpdates(mod3.obtenerConexion()).then((result) => {
            expect(result).toBe(true);
            expect(mod3.actual_version).toBe(mod3.updates.length);
        });
    }));
    test('Controlar UPDATE Result', () => __awaiter(void 0, void 0, void 0, function* () {
        expect(mod3.actual_version).toBe(mod3.updates.length);
    }));
});
