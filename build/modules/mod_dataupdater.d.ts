import { Connection } from "mysql2";
export declare class mod_dataupdater {
    mscode: string;
    instancia: string;
    actual_version: number;
    actual_preversion: number;
    updates: mod_update[];
    preupdates: mod_update[];
    constructor(mscode: string, instancia: string, actual_version?: number, updates?: mod_update[]);
    preUpdatesProcess(oCon: Connection | undefined): Promise<boolean>;
    crearPreUpdates(): void;
    crearUpdates(): void;
    avanzarVersion(oCon: Connection | undefined): Promise<boolean>;
    iniciarUpdates(oCon: Connection | undefined): Promise<boolean>;
    procesarPreUpdates(oCon: Connection | undefined, version?: number): Promise<boolean>;
    procesarPreUpdate(update: mod_update, oCon: Connection | undefined): Promise<boolean>;
    procesarUpdates(oCon: Connection | undefined, version?: number): Promise<boolean>;
    procesarUpdate(update: mod_update, oCon: Connection | undefined): Promise<boolean>;
}
export declare class mod_update {
    version: number;
    sql: string;
    constructor(version?: number, sql?: string);
    procesarUpdate(oCon: Connection | undefined): Promise<boolean>;
}
