import { cnt_SessionHolder } from "se_contractholder";
import { sch_HAEndpoints } from "../schemas/sch_config";
import { getHAEndpoint } from "./conf_default_config";

class DoormanControllerBase {
    protected static instance: DoormanControllerBase;
    static getInstance<T extends typeof DoormanControllerBase>(
        this: T
    ): InstanceType<T> {
        if (!this.instance) {
            this.instance = new this();
        }
        return this.instance as InstanceType<T>;
    }
}
export class DoormanController extends DoormanControllerBase {
    haconfig:sch_HAEndpoints= getHAEndpoint();
    activeSessions: Map<string, cnt_SessionHolder> = new Map();
    protected constructor() {
        super();
        // Private constructor to prevent direct instances
    }

    getSession(req: any, res: any, next: any) {   
        let session = this.obtener_token_header(req);
        this.sessionActive(session).then((session2) => {;
        req.session = session2;
        next();})
    }
    async checkSession(req: any, res: any, next: any) {
        try {
            let session = this.obtener_token_header(req);
            const session2 = await this.sessionActive(session);
            if (session2.status === 'active') {
                return next();
            } else {
                res.send({ message: "Session is not active" });
            }
        } catch (error) {
            next(error);
        }
    }
    obtener_token_header(req: any):cnt_SessionHolder {
        let session = cnt_SessionHolder.fromRequest(req);
        return session
    }

    async req_sessionActive(req: any, res: any)  {
        let session = this.obtener_token_header(req);
        session = await this.sessionActive(session)
        res.send(session)
    }

    async sessionActive(session: cnt_SessionHolder) {
        
        if (this.activeSessions.has(session.token)) {
            session = this.activeSessions.get(session.token)!;
        } else {
            session = await this.obtenerSesionToken(session.token);
            this.activeSessions.set(session.token, session);
        }
        return session
    }
    protected async obtenerSesionToken(token: string) {

        try {
            let url = new URL(this.haconfig.credentials+"/doorman/session/"+token);

            const response = await fetch(url.toString(), {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json', // Opcional, según el endpoint
                },
            });

            
            if (!response.ok) {
                console.log(`Error HTTP: ${response.status} - ${response.statusText}`);
                return cnt_SessionHolder.defaultSession();
            }

            
            const sessionData = await response.json();

            
            return cnt_SessionHolder.fromBody(sessionData);
        } catch (error) {
            console.error('Error al obtener la sesión desde el endpoint:', error);
           return cnt_SessionHolder.defaultSession();
        }
    }    

}

export class PermissionsCheck {
    permissions: string[] = [];
    doorman: DoormanController;
    constructor(permissions: string[], doorman: DoormanController) {
        this.permissions = permissions;
        this.doorman = doorman;
    }
    

}