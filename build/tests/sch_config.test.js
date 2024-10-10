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
jest.useFakeTimers();
(0, node_test_1.describe)('Conexión inicial', () => {
    let oDA;
    oDA = new mod_dataaccess_1.mod_dataaccess('mt08', 'mt08', 'mt08');
    test('Creando configuración de la conexión', () => __awaiter(void 0, void 0, void 0, function* () {
        expect(oDA.database).toBe("mt08");
    }));
    test('Controlar ConfigBase', () => __awaiter(void 0, void 0, void 0, function* () {
        let oConfig = yield oDA.controlarConfigBase();
        expect(oConfig).not.toBeNull();
        expect(oConfig === null || oConfig === void 0 ? void 0 : oConfig.mscode).toBe('mt08');
        expect(oConfig === null || oConfig === void 0 ? void 0 : oConfig.instancia).toBe('mt08');
        expect(oConfig === null || oConfig === void 0 ? void 0 : oConfig.msdb).toBe('mt08');
    }), 100000);
});
