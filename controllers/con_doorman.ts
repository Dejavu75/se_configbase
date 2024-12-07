import { cnt_SessionHolder } from "se_contractholder";

class DoormanControllerBase {
}
export class DoormanController extends DoormanControllerBase {
    activeSessions: Map<string, cnt_SessionHolder> = new Map();
    private static instance: DoormanController;
    private constructor() {
        super();
        // Private constructor to prevent direct instances
    }
    static getInstance(): DoormanController {
        if (!DoormanController.instance) {
            DoormanController.instance = new DoormanController();
        }
        return DoormanController.instance;
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
    async obtenerSesionToken(token: string) {
        return cnt_SessionHolder.defaultSession()
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