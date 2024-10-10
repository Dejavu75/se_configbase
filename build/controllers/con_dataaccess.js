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
exports.con_dataaccess = void 0;
const mod_dataaccess_1 = require("../modules/mod_dataaccess");
class con_dataaccess {
    crearModulo() {
        return __awaiter(this, void 0, void 0, function* () {
            this.modData = new mod_dataaccess_1.mod_dataaccess('mt08', 'mt08', 'mt08');
        });
    }
    controlarDatos() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.modData.controlarConfigBase().then((oConfig) => __awaiter(this, void 0, void 0, function* () {
                yield this.modData.controlarMSDB();
                return oConfig;
            }));
        });
    }
}
exports.con_dataaccess = con_dataaccess;
