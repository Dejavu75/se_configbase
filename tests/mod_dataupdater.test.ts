
import { mod_dataaccess } from "../modules/mod_dataaccess"
import { describe, it } from "node:test"
import { mod_dataupdater, mod_update } from "../modules/mod_dataupdater"
import mysql, { Connection } from "mysql2";
import { getMySQLConfig } from "../controllers/conf_default_config";

let oCon = new mod_dataaccess();

class mod2 extends mod_dataupdater {
    constructor() {
        super(oCon.mscode, oCon.instancia);
    }
    crearUpdates() {
        this.updates.push(new mod_update(1, "SQL1"));
        this.updates.push(new mod_update(2, "SQL32"));
        this.updates.push(new mod_update(3, "SQL3"));
        this.updates.push(new mod_update(4, "SQL4"));        
    }
    obtenerConexion(): Connection {
        let oCon = new mod_dataaccess();
        return oCon.obtenerConexion();
    }
}

describe('Procesar Updates', () => {
    let mod3: mod2 = new mod2();

    test('Controlar UPDATE Creation', async () => {
        expect(mod3.actual_version).toBe(0);
        expect(mod3.updates.length).toBe(4);
        expect(mod3.updates[0].version).toBe(1);
        expect(mod3.updates[1].version).toBe(2);
        expect(mod3.updates[2].version).toBe(3);
    });
    test('Controlar UPDATE Process', async () => {
        await mod3.iniciarUpdates(mod3.obtenerConexion()).then((result) => {
            expect(result).toBe(true);
            expect(mod3.actual_version).toBe(mod3.updates.length);
        })
    });
    test('Controlar UPDATE Result', async () => {
        expect(mod3.actual_version).toBe(mod3.updates.length);
    });
});