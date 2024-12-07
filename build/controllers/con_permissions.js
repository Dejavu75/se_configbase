"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PermissionsSet = void 0;
const se_contractholder_1 = require("se_contractholder");
class PermissionsSet {
    constructor() {
        this.permissions = new Map();
        this.domain = "global";
    }
    loadPermissions() {
    }
    createPermission(domainId, name, description = "", domain = "global", status = se_contractholder_1.PermissionStatus.enabled, type = se_contractholder_1.PermissionType.permissive) {
        let permiso = new se_contractholder_1.cnt_Permission(0, domainId, name, description, status, type, domain);
        this.permissions.set(permiso.domainId, permiso);
        return permiso;
    }
    checkPermission(domainId, session) {
        let permiso = this.permissions.get(domainId);
        if (permiso) {
            let found = false;
            session.accountHolder.permissions.forEach((p) => {
                if ((p.status == se_contractholder_1.PermissionStatus.enabled || (p.status == se_contractholder_1.PermissionStatus.default && permiso.status == se_contractholder_1.PermissionStatus.enabled)) &&
                    p.domainId === permiso.domainId &&
                    (p.domain == session.domain || p.domain == "global" || session.domain == "global")) {
                    found = true;
                }
                else {
                    found = found || false;
                }
            });
            return found;
        }
        else {
            return false;
        }
    }
}
exports.PermissionsSet = PermissionsSet;
