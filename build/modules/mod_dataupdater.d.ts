import { Connection } from "mysql2";
export declare class mod_dataupdater {
    mscode: string;
    instancia: string;
    actual_version: number;
    updates: mod_update[];
    constructor(mscode: string, instancia: string, actual_version?: number, updates?: mod_update[]);
    crearUpdates(): void;
    avanzarVersion(oCon: Connection | undefined): Promise<boolean>;
    iniciarUpdates(oCon: Connection | undefined): Promise<boolean>;
    procesarUpdates(oCon: Connection | undefined, version?: number): Promise<boolean>;
    procesarUpdate(update: mod_update, oCon: Connection | undefined): Promise<boolean>;
}
export declare class mod_update {
    version: number;
    sql: string;
    constructor(version?: number, sql?: string);
    procesarUpdate(oCon: Connection | undefined): Promise<boolean>;
}
