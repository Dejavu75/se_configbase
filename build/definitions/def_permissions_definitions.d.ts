import { cnt_Permission, cnt_SessionHolder } from "se_contractholder";
import { PermissionsSet } from "../controllers/con_permissions";
export declare enum CH09_EnumP {
    productsCreate = "productsCreate",
    productsDelete = "productsDelete",
    productsUpdate = "productsUpdate",
    palletsInfo = "palletsInfo",
    palletsCreate = "palletsCreate",
    palletsDelete = "palletsDelete",
    palletsUpdate = "palletsUpdate",
    warehousesInfo = "warehousesInfo"
}
export declare class CH09_AEM_Permissions extends PermissionsSet {
    constructor();
    createlocalPermission(domainId: CH09_EnumP, name: string, description?: string, domain?: string): cnt_Permission;
    checklocalPermission(domainId: CH09_EnumP, session: cnt_SessionHolder): boolean;
    loadPermissions(): void;
}
