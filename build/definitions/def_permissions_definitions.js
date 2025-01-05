"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CH09_AEM = void 0;
const con_permissions_1 = require("../controllers/con_permissions");
class CH09_AEM extends con_permissions_1.PermissionsSet {
    constructor() {
        super();
        this.loadPermissions();
    }
    loadPermissions() {
        this.createPermission('productsCreate', 'Create', 'Create a new product', 'foreign');
        this.createPermission('productsDelete', 'Delete', 'Delete products', 'foreign');
        this.createPermission('productsUpdate', 'Update', 'Update products', 'foreign');
    }
}
exports.CH09_AEM = CH09_AEM;
