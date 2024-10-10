import { mod_dataaccess } from "../modules/mod_dataaccess";
export declare class con_dataaccess {
    modData: mod_dataaccess | undefined;
    crearModulo(): Promise<void>;
    controlarDatos(): Promise<void>;
}
