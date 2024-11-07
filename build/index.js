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
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
const conf_default_config_1 = require("./controllers/conf_default_config");
__exportStar(require("./schemas/sch_config"), exports);
__exportStar(require("./controllers/conf_default_config"), exports);
__exportStar(require("./modules/mod_dataaccess"), exports);
__exportStar(require("./modules/mod_dataupdater"), exports);
__exportStar(require("./controllers/con_dataaccess"), exports);
__exportStar(require("./controllers/con_log"), exports);
// let oCon = new mod_dataaccess();
// oCon.controlarMSDATA().then((bResult) => {
//     console.log("ControlarMSDATA", oCon.database);
// }).catch((err) => {
//     console.log("Error en controlarMSDATA", err);
// });
// let mod3: mod2 = new mod2();
// mod3.iniciarUpdates(mod3.obtenerConexion(true)).then((result) => {console.log(result)});
(0, conf_default_config_1.registerService)();
