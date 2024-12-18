import { Connection } from "mysql2";

export class mod_dataupdater {
    mscode: string = "";
    instancia: string = "";
    actual_version: number = 0;
    actual_preversion: number = 0;
    updates: mod_update[] = [];
    preupdates: mod_update[] = [];
    constructor(mscode: string, instancia: string, actual_version: number = 0, updates: mod_update[] = []) {
        this.mscode = mscode;
        this.instancia = instancia;
        this.actual_version = actual_version;
        this.updates = updates;
        this.crearPreUpdates();
        this.crearUpdates();
    }
    preUpdatesProcess(oCon: Connection | undefined): Promise<boolean> {
        return Promise.resolve(true);
    }
    crearPreUpdates() {
    }
    crearUpdates() {
    }
    async avanzarVersion(oCon: Connection | undefined): Promise<boolean> {
        console.log(`Intentando avanzar a ${this.actual_version}`);
        return new Promise((resolve, reject) => {
            if (oCon) {
                let sql = `UPDATE config SET version = ${this.actual_version} WHERE mscode = '${this.mscode}' AND instancia = '${this.instancia}'`;
                oCon.query(sql, async (err: any, result: any) => {
                    if (err) {
                        console.error(`Error al avanzar version a ${this.actual_version}`, err);
                        return reject(false);
                    }
                    console.log(`Avanzado ${this.mscode}-${this.instancia} a ${this.actual_version}`);
                    return resolve(true);
                });
            } else {
                return resolve(true);
            }
        });
    }
    async iniciarUpdates(oCon: Connection | undefined): Promise<boolean> {
        return new Promise((resolve, reject) => {
            let sql = `SELECT version FROM config WHERE mscode = '${this.mscode}' AND instancia = '${this.instancia}'`;
            oCon?.query(sql, async (err: any, result: any) => {
                if (err) {
                    console.error(`Error al obtener version`, err);
                    return reject(false);
                }
                if (result.length > 0) {
                    this.actual_version = parseFloat(result[0].version);
                } else {
                    this.actual_version = 0;
                }
                console.log(`Iniciando updates para ${this.mscode}-${this.instancia} en version ${this.actual_version}`);
                if (await this.procesarPreUpdates(oCon, this.actual_preversion)) {
                    resolve (await this.procesarUpdates(oCon, this.actual_version));
                } else {
                    resolve(false);
                }
                

            })
        });
    }
    async procesarPreUpdates(oCon: Connection | undefined, version: number = this.actual_preversion): Promise<boolean> {
        if (version >= this.preupdates.length) return true;
        const result = await this.procesarPreUpdate(this.preupdates[version], oCon);
        if (result) {
            this.actual_preversion = version + 1;
            return this.procesarPreUpdates(oCon, this.actual_preversion);
        } else {
            return false;
        }
    }
    async procesarPreUpdate(update: mod_update, oCon: Connection | undefined): Promise<boolean> {
        return await update.procesarUpdate(oCon);
    }
    async procesarUpdates(oCon: Connection | undefined, version: number = this.actual_version): Promise<boolean> {
        if (version >= this.updates.length) return true;
        const result = await this.procesarUpdate(this.updates[version], oCon);
        if (result) {
            this.actual_version = version + 1;
            await this.avanzarVersion(oCon);
            return this.procesarUpdates(oCon, this.actual_version);
        } else {
            return false;
        }
    }
    async procesarUpdate(update: mod_update, oCon: Connection | undefined): Promise<boolean> {
        return await update.procesarUpdate(oCon);
    }

}

export class mod_update {
    version: number = 0;
    sql: string = "";
    constructor(version: number = 0, sql: string = "") {
        this.version = version;
        this.sql = sql;
    }
    async procesarUpdate(oCon: Connection | undefined): Promise<boolean> {

        console.log("Update procesado ", this.version, this.sql);
        return new Promise((resolve, reject) => {
            if (oCon) {
                oCon.query(this.sql, async (err: any, result: any) => {
                    if (err) {
                        console.error(`Error al procesar update ${this.version}`, err);
                        return reject(false);
                    }
                    console.log(`Procesado update ${this.version}`);
                    console.log(`SQL: ${this.sql}`);
                    return resolve(true);
                });
            } else {
                console.error(`No hay conexión para procesar update ${this.version}`);
                return resolve(false);
            }
        })
    }
}
