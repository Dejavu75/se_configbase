import { mod_dataaccess } from './modules/mod_dataaccess';

export * from './schemas/sch_config';
export * from './controllers/conf_default_config';

let oDA:mod_dataaccess = new mod_dataaccess('mt08','mt08');
let oConfig =  oDA.controlarConfigBase().then(async (oConfig) => {
    await oDA.controlarMSDB();
    return oConfig;
});
