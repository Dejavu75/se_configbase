import { cnt_Permission, cnt_SessionHolder, PermissionStatus, PermissionType } from "se_contractholder";
export declare class PermissionsSet {
    permissions: Map<string, cnt_Permission>;
    domain: string;
    loadPermissions(): void;
    createPermission(domainId: string, name: string, description?: string, domain?: string, status?: PermissionStatus, type?: PermissionType): cnt_Permission;
    checkPermission(domainId: string, session: cnt_SessionHolder): boolean;
}
