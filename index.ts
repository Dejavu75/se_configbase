import { mod_dataaccess } from './modules/mod_dataaccess';

export * from './schemas/sch_config';
export * from './controllers/conf_default_config';
export * from './modules/mod_dataaccess';
export * from './modules/mod_dataupdater';
export * from './controllers/con_dataaccess';
export * from './controllers/con_log';


// let oCon = new mod_dataaccess();
// oCon.controlarMSDATA().then((bResult) => {
//     console.log("ControlarMSDATA", oCon.database);
// }).catch((err) => {
//     console.log("Error en controlarMSDATA", err);
// });