import mysql, { Connection } from "mysql2";
import { mod_dataaccess } from "../modules/mod_dataaccess";
import { cnt_heartbeat } from "se_contractholder";

export class con_dataaccess{
    modData:mod_dataaccess|undefined;
    async crearModulo(){
        this.modData = new mod_dataaccess('mt08','mt08','mt08');
    }
    async controlarDatos(){
        await this.modData!.controlarConfigBase().then(async (oConfig) => {
            await this.modData!.controlarMSDB();
            return oConfig;
        });
    }
}