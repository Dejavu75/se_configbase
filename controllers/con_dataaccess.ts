import mysql, { Connection } from "mysql2";

export class con_dataaccess{
    Connection = this.obtenerConexion();
    constructor(){
    }
// VALIDACION INICIAL DE LA CONEXION
    

    async conectar(conexion: Connection=this.Connection): Promise<Connection>{
        return new Promise((resolve, reject) => {
            conexion.connect((err) => {
                if (err) reject(null);
                resolve(conexion);
            });
        });
    }
    obtenerConexion(): Connection{
        return mysql.createConnection("");
    }
    async iniciar(){
        return this.validarConfiguracion();
    }
    async validarConfiguracion(conexion: Connection=this.Connection){
        let oCon = this.conectar(conexion);
        if (oCon == null) { 
            console.log("Error al conectar a la base de datos");
            return false;
        }

        conexion.query("SELECT 1", (err, results, fields) => {
            if (err) {
                console.error(err);
                return false;
            }
        }
    )
        
    }
    async inicializar(){

    }
}