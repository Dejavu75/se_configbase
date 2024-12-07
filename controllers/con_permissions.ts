import { cnt_AccountHolder, cnt_Permission, cnt_SessionHolder, PermissionStatus, PermissionType } from "se_contractholder";

export class PermissionsSet {
    permissions: Map<string, cnt_Permission> = new Map()
    domain: string = "global";
    loadPermissions() {

    }
    createPermission(domainId: string, name: string, description: string = "", domain: string = "global", status: PermissionStatus = PermissionStatus.enabled, type: PermissionType = PermissionType.permissive) {
        let permiso: cnt_Permission = new cnt_Permission(0, domainId, name, description, status, type, domain);
        this.permissions.set(permiso.domainId, permiso);
        return permiso;
    }
    checkPermission(domainId: string, session: cnt_SessionHolder): boolean {
        let permiso: cnt_Permission | undefined = this.permissions.get(domainId);
        if (permiso) {
            let found = false;

            session.accountHolder.permissions.forEach((p: cnt_Permission) => {
                if (
                    (p.status == PermissionStatus.enabled || (p.status==PermissionStatus.default && permiso.status==PermissionStatus.enabled))  &&
                    p.domainId === permiso.domainId &&
                    (p.domain == session.domain || p.domain == "global" || session.domain == "global")
                ) {
                    found = true;
                    
                } else {
                    found = found || false;
                }
            });
            return found;
        } else {
            return false;
        }

    }
}