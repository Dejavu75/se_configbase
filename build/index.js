"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
__exportStar(require("./definitions/def_permissions_definitions"), exports);
__exportStar(require("./schemas/sch_config"), exports);
__exportStar(require("./controllers/conf_default_config"), exports);
__exportStar(require("./modules/mod_dataaccess"), exports);
__exportStar(require("./modules/mod_dataupdater"), exports);
__exportStar(require("./controllers/con_dataaccess"), exports);
__exportStar(require("./controllers/con_log"), exports);
__exportStar(require("./controllers/con_permissions"), exports);
__exportStar(require("./controllers/con_doorman"), exports);
// let oCon = new mod_dataaccess();
// oCon.controlarMSDATA().then((bResult) => {
//     console.log("ControlarMSDATA", oCon.database);
// }).catch((err) => {
//     console.log("Error en controlarMSDATA", err);
// });
// let mod3: mod2 = new mod2();
// mod3.iniciarUpdates(mod3.obtenerConexion(true)).then((result) => {console.log(result)});
//registerService();
const parametro = process.argv[2];
if (parametro == "--test") {
    Promise.resolve().then(() => __importStar(require('./tests/mail.test'))).then((respuesta) => { }).catch((err) => {
        console.log("Error en test", err);
    });
}
