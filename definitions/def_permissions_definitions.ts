import { PermissionsSet } from "../controllers/con_permissions"

export class CH09_AEM extends PermissionsSet {
    constructor() {
      super()
      this.loadPermissions()
    }
    loadPermissions() {
      this.createPermission('productsCreate', 'Create', 'Create a new product', 'foreign')
      this.createPermission('productsDelete', 'Delete', 'Delete products', 'foreign')
      this.createPermission('productsUpdate', 'Update', 'Update products', 'foreign')
    }
  }