import { cnt_Permission, cnt_SessionHolder, PermissionType } from "se_contractholder"
import { PermissionsSet } from "../controllers/con_permissions"
export enum CH09_EnumP {
  productsCreate = 'productsCreate',
  productsDelete = 'productsDelete',
  productsUpdate = 'productsUpdate',
  palletsInfo = 'palletsInfo',
  palletsCreate = 'palletsCreate',
  palletsDelete = 'palletsDelete',
  palletsUpdate = 'palletsUpdate',
  palletsTransfer = 'palletsTransfer',
  warehousesInfo = 'warehousesInfo',
}
export class CH09_AEM_Permissions extends PermissionsSet {
  constructor() {
    super()
    this.loadPermissions()
  }

  createlocalPermission(domainId: CH09_EnumP, name: string, description?: string, domain?: string): cnt_Permission {
    return this.createPermission(domainId.toString(), name, description, domain)
  }
  checklocalPermission(domainId: CH09_EnumP, session: cnt_SessionHolder): boolean {
    return this.checkPermission(domainId.toString(), session);
  }
  loadPermissions() {
    this.createlocalPermission(CH09_EnumP.productsCreate, 'Create', 'Create a new product', 'foreign')
    this.createlocalPermission(CH09_EnumP.productsDelete, 'Delete', 'Delete products', 'foreign')
    this.createlocalPermission(CH09_EnumP.productsUpdate, 'Update', 'Update products', 'foreign')

    this.createlocalPermission(CH09_EnumP.palletsInfo, 'Info', 'Get info about a pallet', 'foreign')
    this.createlocalPermission(CH09_EnumP.palletsCreate, 'Create', 'Create a new pallet', 'foreign')
    this.createlocalPermission(CH09_EnumP.palletsDelete, 'Delete', 'Delete pallet', 'foreign')
    this.createlocalPermission(CH09_EnumP.palletsUpdate, 'Update', 'Update pallet', 'foreign')
    this.createlocalPermission(CH09_EnumP.palletsTransfer, 'Transfer', 'Transfer pallet', 'foreign')

    this.createlocalPermission(CH09_EnumP.warehousesInfo, 'Info', 'Get info about a warehouse', 'foreign')

  }
}