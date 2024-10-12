
import { mod_dataaccess } from "../modules/mod_dataaccess"
import { describe, it } from "node:test"
import { mod_dataupdater, mod_update } from "../modules/mod_dataupdater"
import { Connection } from "mysql2";

let oCon = new mod_dataaccess();

export class mod2 extends mod_dataupdater {
    constructor() {
        super(oCon.mscode, oCon.instancia);
    }
    crearPreUpdates() {
        this.preupdates.push(new mod_update(1, "Update config set version=0;"));
        this.preupdates.push(new mod_update(2, "DROP TABLE IF EXISTS prueba1, prueba2, prueba3, prueba4;"));        
        
    }
    crearUpdates() {
        this.updates.push(new mod_update(1, "CREATE TABLE `prueba1` (`tabla1` INT NOT NULL ) ENGINE = InnoDB;"));
        this.updates.push(new mod_update(2, "CREATE TABLE `prueba2` (`tabla2` INT NOT NULL ) ENGINE = InnoDB;"));        
        this.updates.push(new mod_update(3, "CREATE TABLE `prueba3` (`tabla3` INT NOT NULL ) ENGINE = InnoDB;" ));                
        this.updates.push(new mod_update(3, "CREATE TABLE `prueba3` (`tabla3` INT NOT NULL ) ENGINE = InnoDB; select * from prueba3" ));                
    }
    obtenerConexion(multipleStatements:boolean=false): Connection {
        let oCon = new mod_dataaccess();
        return oCon.obtenerConexion(multipleStatements = true);
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
        await mod3.iniciarUpdates(mod3.obtenerConexion(true)).then((result) => {
            expect(result).toBe(true);
            expect(mod3.actual_version).toBe(mod3.updates.length);
        })
    });
    test('Controlar UPDATE Result', async () => {
        expect(mod3.actual_version).toBe(mod3.updates.length);
    });
});