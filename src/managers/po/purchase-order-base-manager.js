'use strict'

var ObjectId = require("mongodb").ObjectId;
require('mongodb-toolkit');
var DLModels = require('dl-models');
var map = DLModels.map;
var PurchaseOrderGroup = DLModels.po.PurchaseOrderGroup;
var PurchaseOrder = DLModels.po.PurchaseOrder;

module.exports = class PurchaseOrderBaseManager {
    constructor(db, user) {
        this.db = db;
        this.user = user;
        
        this.poType = '';
        this.moduleId = '';
        this.year = (new Date()).getFullYear().toString().substring(2,4);
        
        var PurchaseOrderGroupManager = require('./purchase-order-group-manager');
        this.purchaseOrderGroupManager = new PurchaseOrderGroupManager(db, user);

        var PurchaseOrderManager = require("./purchase-order-manager");
        this.purchaseOrderManager = new PurchaseOrderManager(db, user);
        
        this.PurchaseOrderCollection = this.db.use(map.po.collection.PurchaseOrder);

        this.PurchaseOrderGroupCollection = this.db.use(map.po.collection.PurchaseOrderGroup);
    }

    _validate(purchaseOrder) {
        
    }
    
    _getQueryPurchaseOrder(_paging) {
        
    }
    
    _getQueryPurchaseOrderGroup(_paging) {
        
    }
    
    read(paging) {
        var _paging = Object.assign({
            page: 1,
            size: 20,
            order: '_id',
            asc: true
        }, paging);

        return new Promise((resolve, reject) => {
            
            var query = this._getQueryPurchaseOrder(_paging);

            this.PurchaseOrderCollection
                .where(query)
                .page(_paging.page, _paging.size)
                .orderBy(_paging.order, _paging.asc)
                .execute()
                .then(POGarmentAccessoriess => {
                    resolve(POGarmentAccessoriess);
                })
                .catch(e => {
                    reject(e);
                });
        });
    }
    
    update(purchaseOrder) {
        return new Promise((resolve, reject) => {
            console.log(purchaseOrder);
            this._validate(purchaseOrder)
                .then(validPurchaseOrder => {
                console.log(6);
                    this.purchaseOrderManager.update(validPurchaseOrder)
                        .then(id => {
                            console.log(7);
                            resolve(id);
                        })
                        .catch(e => {
                            reject(e);
                        })
                })
                .catch(e => {
                    reject(e);
                })
        })
    }

    delete(purchaseOrder) {
        return new Promise((resolve, reject) => {
            purchaseOrder._deleted = true;
            this.purchaseOrderManager.delete(purchaseOrder)
                .then(id => {
                    resolve(id);
                })
                .catch(e => {
                    reject(e);
                })
        })
    }

    getByPONo(poNo) {
        return new Promise((resolve, reject) => {
            if (poNo === '')
                resolve(null);
            var query = {
                PONo: poNo,
                _deleted: false
            };
            this.getSingleByQuery(query)
                .then(module => {
                    resolve(module);
                })
                .catch(e => {
                    reject(e);
                });
        });
    }
    
    getById(id) {
        return new Promise((resolve, reject) => {
            if (id === '')
                resolve(null);

            var query = {
                _id: new ObjectId(id),
                _deleted: false,
                _type: this.poType
            };
            this.getSingleByQuery(query)
                .then(module => {
                    resolve(module);
                })
                .catch(e => {
                    reject(e);
                });
        });
    }

    getSingleByQuery(query) {
        return new Promise((resolve, reject) => {
            this.PurchaseOrderCollection
                .single(query)
                .then(module => {
                    resolve(module);
                })
                .catch(e => {
                    reject(e);
                });
        })
    }

    getByIdOrDefault(id) {
        return new Promise((resolve, reject) => {
            if (id === '')
                resolve(null);
            var query = {
                _id: new ObjectId(id),
                _deleted: false,
                _type: this.poType
            };
            this.getSingleOrDefaultByQuery(query)
                .then(module => {
                    resolve(module);
                })
                .catch(e => {
                    reject(e);
                });
        });
    }

    getSingleOrDefaultByQuery(query) {
        return new Promise((resolve, reject) => {
            this.PurchaseOrderCollection
                .singleOrDefault(query)
                .then(purchaseOrders => {
                    resolve(purchaseOrders);
                })
                .catch(e => {
                    reject(e);
                });
        })
    }
    
    // PO DL

    readAllPurchaseOrderGroup(paging) {
        var _paging = Object.assign({
            page: 1,
            size: 20,
            order: '_id',
            asc: true
        }, paging);

        return new Promise((resolve, reject) => {
            var query = this._getQueryPurchaseOrderGroup(_paging);

            this.PurchaseOrderGroupCollection
                .where(query)
                .page(_paging.page, _paging.size)
                .orderBy(_paging.order, _paging.asc)
                .execute()
                .then(PurchaseOrderGroups => {
                    resolve(PurchaseOrderGroups);
                })
                .catch(e => {
                    reject(e);
                });
        });
    }
    
    getPurchaseOrderGroupById(id) {
        return new Promise((resolve, reject) => {
            if (id === '')
                resolve(null);
            var query = {
                _id: new ObjectId(id),
                _deleted: false
            };
            this.getSingleByQuery(query)
                .then(module => {
                    resolve(module);
                })
                .catch(e => {
                    reject(e);
                });
        });
    }

    getSinglePurchaseOrderGroupByQuery(query) {
        return new Promise((resolve, reject) => {
            this.PurchaseOrderGroupCollection
                .single(query)
                .then(module => {
                    resolve(module);
                })
                .catch(e => {
                    reject(e);
                });
        })
    }
}