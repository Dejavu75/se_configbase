import { cnt_Permission, PermissionType } from "se_contractholder"
import { PermissionsSet } from "../controllers/con_permissions"
export enum CH09_EnumP {
  productsCreate = 'productsCreate',
  productsDelete = 'productsDelete',
  productsUpdate = 'productsUpdate',
  palletsInfo = 'palletsInfo',
  palletsCreate = 'palletsCreate',
  palletsDelete = 'palletsDelete',
  palletsUpdate = 'palletsUpdate',
}
export class CH09_AEM_Permissions extends PermissionsSet {
  constructor() {
    super()
    this.loadPermissions()
  }

  createlocalPermission(domainId: CH09_EnumP, name: string, description?: string, domain?: string): cnt_Permission {
    return this.createPermission(domainId.toString(), name, description, domain)
  }

  loadPermissions() {
    this.createlocalPermission(CH09_EnumP.productsCreate, 'Create', 'Create a new product', 'foreign')
    this.createlocalPermission(CH09_EnumP.productsDelete, 'Delete', 'Delete products', 'foreign')
    this.createlocalPermission(CH09_EnumP.productsUpdate, 'Update', 'Update products', 'foreign')

    this.createlocalPermission(CH09_EnumP.palletsInfo, 'Info', 'Get info about a bult', 'foreign')
    this.createlocalPermission(CH09_EnumP.productsCreate, 'Create', 'Create a new bult', 'foreign')
    this.createlocalPermission(CH09_EnumP.productsDelete, 'Delete', 'Delete bult', 'foreign')
    this.createlocalPermission(CH09_EnumP.productsUpdate, 'Update', 'Update bult', 'foreign')

  }
}