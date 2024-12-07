"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PermissionsCheck = exports.DoormanController = void 0;
const se_contractholder_1 = require("se_contractholder");
class DoormanControllerBase {
}
class DoormanController extends DoormanControllerBase {
    constructor() {
        super();
        this.activeSessions = new Map();
        // Private constructor to prevent direct instances
    }
    static getInstance() {
        if (!DoormanController.instance) {
            DoormanController.instance = new DoormanController();
        }
        return DoormanController.instance;
    }
    getSession(req, res, next) {
        let session = this.obtener_token_header(req);
        this.sessionActive(session).then((session2) => {
            ;
            req.session = session2;
            next();
        });
    }
    checkSession(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let session = this.obtener_token_header(req);
                const session2 = yield this.sessionActive(session);
                if (session2.status === 'active') {
                    return next();
                }
                else {
                    res.send({ message: "Session is not active" });
                }
            }
            catch (error) {
                next(error);
            }
        });
    }
    obtener_token_header(req) {
        let session = se_contractholder_1.cnt_SessionHolder.fromRequest(req);
        return session;
    }
    req_sessionActive(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let session = this.obtener_token_header(req);
            session = yield this.sessionActive(session);
            res.send(session);
        });
    }
    sessionActive(session) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.activeSessions.has(session.token)) {
                session = this.activeSessions.get(session.token);
            }
            else {
                session = yield this.obtenerSesionToken(session.token);
                this.activeSessions.set(session.token, session);
            }
            return session;
        });
    }
    obtenerSesionToken(token) {
        return __awaiter(this, void 0, void 0, function* () {
            return se_contractholder_1.cnt_SessionHolder.defaultSession();
        });
    }
}
exports.DoormanController = DoormanController;
class PermissionsCheck {
    constructor(permissions, doorman) {
        this.permissions = [];
        this.permissions = permissions;
        this.doorman = doorman;
    }
}
exports.PermissionsCheck = PermissionsCheck;
