"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CH09_AEM_Permissions = exports.CH09_EnumP = void 0;
const con_permissions_1 = require("../controllers/con_permissions");
var CH09_EnumP;
(function (CH09_EnumP) {
    CH09_EnumP["productsCreate"] = "productsCreate";
    CH09_EnumP["productsDelete"] = "productsDelete";
    CH09_EnumP["productsUpdate"] = "productsUpdate";
    CH09_EnumP["productsInfo"] = "productsInfo";
    CH09_EnumP["palletsInfo"] = "palletsInfo";
    CH09_EnumP["palletsCreate"] = "palletsCreate";
    CH09_EnumP["palletsDelete"] = "palletsDelete";
    CH09_EnumP["palletsUpdate"] = "palletsUpdate";
    CH09_EnumP["palletsTransfer"] = "palletsTransfer";
    CH09_EnumP["warehousesInfo"] = "warehousesInfo";
})(CH09_EnumP || (exports.CH09_EnumP = CH09_EnumP = {}));
class CH09_AEM_Permissions extends con_permissions_1.PermissionsSet {
    constructor() {
        super();
        this.loadPermissions();
    }
    createlocalPermission(domainId, name, description, domain) {
        return this.createPermission(domainId.toString(), name, description, domain);
    }
    checklocalPermission(domainId, session) {
        return this.checkPermission(domainId.toString(), session);
    }
    loadPermissions() {
        this.createlocalPermission(CH09_EnumP.productsCreate, 'Create', 'Create a new product', 'foreign');
        this.createlocalPermission(CH09_EnumP.productsDelete, 'Delete', 'Delete products', 'foreign');
        this.createlocalPermission(CH09_EnumP.productsUpdate, 'Update', 'Update products', 'foreign');
        this.createlocalPermission(CH09_EnumP.productsInfo, 'Info', 'Get info about a product', 'foreign');
        this.createlocalPermission(CH09_EnumP.palletsInfo, 'Info', 'Get info about a pallet', 'foreign');
        this.createlocalPermission(CH09_EnumP.palletsCreate, 'Create', 'Create a new pallet', 'foreign');
        this.createlocalPermission(CH09_EnumP.palletsDelete, 'Delete', 'Delete pallet', 'foreign');
        this.createlocalPermission(CH09_EnumP.palletsUpdate, 'Update', 'Update pallet', 'foreign');
        this.createlocalPermission(CH09_EnumP.palletsTransfer, 'Transfer', 'Transfer pallet', 'foreign');
        this.createlocalPermission(CH09_EnumP.warehousesInfo, 'Info', 'Get info about a warehouse', 'foreign');
    }
}
exports.CH09_AEM_Permissions = CH09_AEM_Permissions;
