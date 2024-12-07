import { registerService } from './controllers/conf_default_config';
import { mod_dataaccess } from './modules/mod_dataaccess';

export * from './schemas/sch_config';
export * from './controllers/conf_default_config';

export * from './modules/mod_dataaccess';
export * from './modules/mod_dataupdater';
export * from './controllers/con_dataaccess';

export * from './controllers/con_log';
export * from './controllers/con_permissions';
export * from './controllers/con_doorman';

// let oCon = new mod_dataaccess();
// oCon.controlarMSDATA().then((bResult) => {
//     console.log("ControlarMSDATA", oCon.database);
// }).catch((err) => {
//     console.log("Error en controlarMSDATA", err);
// });

// let mod3: mod2 = new mod2();
// mod3.iniciarUpdates(mod3.obtenerConexion(true)).then((result) => {console.log(result)});
//registerService();



const parametro = process.argv[2]

if (parametro=="--test") {
    import('./tests/mail.test').then((respuesta) => {}
    ).catch((err) => {
        console.log("Error en test", err);
    });
}