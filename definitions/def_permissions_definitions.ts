import { PermissionsSet } from "../controllers/con_permissions"

export class CH09_AEM_Permissions extends PermissionsSet {
    constructor() {
      super()
      this.loadPermissions()
    }
    loadPermissions() {
      this.createPermission('productsCreate', 'Create', 'Create a new product', 'foreign')
      this.createPermission('productsDelete', 'Delete', 'Delete products', 'foreign')
      this.createPermission('productsUpdate', 'Update', 'Update products', 'foreign')

      this.createPermission('bultsInfo', 'Info', 'Get info about a bult', 'foreign')
      this.createPermission('bultsCreate', 'Create', 'Create a new bult', 'foreign')
      this.createPermission('bultsDelete', 'Delete', 'Delete bult', 'foreign')
      this.createPermission('bultsUpdate', 'Update', 'Update bult', 'foreign')
      
    }
  }