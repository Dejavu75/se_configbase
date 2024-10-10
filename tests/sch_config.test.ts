
import { mod_dataaccess } from "../modules/mod_dataaccess"
import { describe, it } from "node:test"
jest.useFakeTimers()


describe('Conexión inicial', () => {
    let oDA:mod_dataaccess
    oDA = new mod_dataaccess('mt08','mt08','mt08')
    test('Creando configuración de la conexión', async () => {
            expect(oDA.database).toBe("mt08")
            }
        )
    

    test('Controlar ConfigBase', async () => {      
        let oConfig = await oDA.controlarConfigBase();
        expect(oConfig).not.toBeNull();
        expect(oConfig?.mscode).toBe('mt08');
        expect(oConfig?.instancia).toBe('mt08');
        expect(oConfig?.msdb).toBe('mt08');
        },
        100000
    )
}
)

