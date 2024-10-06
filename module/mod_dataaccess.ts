import mysql, { Connection } from "mysql2";

export class mod_dataaccess{
    Connection = this.obtenerConexion();
    mscode = "";
    instancia="";
    database="";
    constructor(mscode: string, instancia: string, database: string=""){
        this.mscode = mscode;
        this.instancia = instancia;
        this.database = database;
    }
    obtenerConexion(): Connection{
        return mysql.createConnection("");
    }
    obtenerConfigBase(): Connection{
        return mysql.createConnection("");
    }
    async controlarConfigBase(): Promise<sch_configbase>{
        let oCon: Connection=await this.conexionBase();
        if (oCon) {
            let sql = `SELECT * FROM configbase.config WHERE mscode='${this.mscode}' AND instancia='${this.instancia}'`;
            return new Promise((resolve, reject) => {
                oCon.query(sql, (err, result) => {
                    if (err) reject(null);
                    resolve(result);
                });
            });
        }
    }
    async conexionBase(): Promise<Connection>{
        let oCon= this.obtenerConfigBase();
        oCon.config.database = "configbase";
        return new Promise((resolve, reject) => {
            this.Connection.connect((err) => {
                if (err) reject(null);
                resolve(this.Connection);
            });
        });
    }

}