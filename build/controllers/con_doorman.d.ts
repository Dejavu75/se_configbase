import { cnt_SessionHolder } from "se_contractholder";
declare class DoormanControllerBase {
}
export declare class DoormanController extends DoormanControllerBase {
    activeSessions: Map<string, cnt_SessionHolder>;
    private static instance;
    private constructor();
    static getInstance(): DoormanController;
    getSession(req: any, res: any, next: any): void;
    checkSession(req: any, res: any, next: any): Promise<any>;
    obtener_token_header(req: any): cnt_SessionHolder;
    req_sessionActive(req: any, res: any): Promise<void>;
    sessionActive(session: cnt_SessionHolder): Promise<cnt_SessionHolder>;
    obtenerSesionToken(token: string): Promise<cnt_SessionHolder>;
}
export declare class PermissionsCheck {
    permissions: string[];
    doorman: DoormanController;
    constructor(permissions: string[], doorman: DoormanController);
}
export {};
