Ext.namespace("Pcbms");
Ext.define('NameValue', {
			extend : 'Ext.data.Model',
			fields : [{
						name : 'name',
						type : 'string',
						convert : function(value, record) {
							return record.raw;
						}
					}, {
						name : 'value',
						type : 'string',
						convert : function(value, record) {
							return record.raw;
						}
					}]
		});
Ext.define('Account', {
			extend : 'Ext.data.Model',
			fields : [{
						name : 'userid',
						type : 'string'
					}, {
						name : 'type',
						type : 'int'
					}, {
						name : 'status',
						type : 'int'
					}, {
						name : 'email',
						type : 'string'
					}, {
						name : "departid",
						type : "string"
					}, {
						name : "mobile",
						type : "string"
					}, {
						name : "telephone",
						type : "string"
					}, {
						name : "qq",
						type : "string"
					}, {
						name : "msn",
						type : "string"
					}, {
						name : "email",
						type : "string"
					}, {
						name : "enroll",
						type : "date",
						dateFormat : "time"
					}, {
						name : "dimission",
						type : "date",
						dateFormat : "time"
					}, {
						name : "title",
						type : "string"
					}, {
						name : "position",
						type : "string"
					}, {
						name : "hidden",
						type : "bool"
					}, {
						name : "name",
						type : "string"
					}, {
						name : "birthday",
						type : "date",
						dateFormat : "time"
					}, {
						name : "employeename",
						type : "string"
					}, {
						name : "employeeid",
						type : "string"
					}, {
						name : "company",
						type : "string"
					}, {
						name : "contact",
						type : "string"
					}, {
						name : "clientlevel",
						type : "string"
					}, {
						name : "faxno",
						type : "string"
					}, {
						name : "invoicecompany",
						type : "string"
					}, {
						name : "invoiceaddress",
						type : "string"
					}, {
						name : "accountno",
						type : "string"
					}, {
						name : "region",
						type : "string"
					}, {
						name : "invoicebank",
						type : "string"
					}, {
						name : "invoicename",
						type : "string"
					}, {
						name : "invoicetaxid",
						type : "string"
					}, {
						name : "sendemailtime",
						type : "date",
						dateFormat : "time"
					}, {
						name : "deletetime",
						type : "date",
						dateFormat : "time"
					}, {
						name : "tocken",
						type : "string"
					}, {
						name : 'category',
						type : 'int'
					}, {
						name : 'mfrid',
						type : 'string'
					}, {
						name : 'serverurl',
						type : 'string'
					}, {
						name : 'servertype',
						type : 'string'
					}, {
						name : 'syncdeskey',
						type : 'string'
					}, {
						name : 'syncDate',
						type : 'date',
						dateFormat : "Y-m-d H:i:s"
					}, {
						name : 'createDate',
						type : 'date',
						dateFormat : "Y-m-d H:i:s"
					}, {
						name : 'synctype',
						type : 'int'
					}, {
						name : 'syncsequence',
						type : 'int'
					}, {
						name : 'bsmode',
						type : 'int'
					}]
		});
Ext.define('Department', {
			extend : 'Ext.data.Model',
			fields : [{
						name : 'departid',
						type : 'string'
					}, {
						name : 'name',
						type : 'string'
					}, {
						name : 'telephone',
						type : 'string'
					}, {
						name : 'faxno',
						type : 'string'
					}, {
						name : 'parentid',
						type : 'string'
					}, {
						name : 'departlevel',
						type : 'int'
					}, {
						name : 'managerid',
						type : 'string'
					}, {
						name : 'note',
						type : 'string'
					}, {
						name : 'text',
						type : 'string'
					}]
		});
Ext.define('ClientGroup', {
			extend : 'Ext.data.Model',
			fields : [{
						name : 'cgid',
						type : 'int'
					}, {
						name : 'name',
						type : 'string'
					}]
		});
Ext.define('UserGroup', {
			extend : 'Ext.data.Model',
			fields : [{
						name : "ugid",
						type : "int"
					}, {
						name : "name",
						type : "string"
					}, {
						name : "moduleid",
						type : "int"
					}, {
						name : "description",
						type : "string"
					}, {
						name : "userid",
						type : "string"
					}, {
						name : "employeeName",
						type : "string"
					}, {
						name : "createtime",
						type : "date",
						dateFormat : "time"
					}, {
						name : "authed",
						type : 'boolean'
					}]
		});
Ext.define('ShipmentAddress', {
			extend : 'Ext.data.Model',
			fields : [{
						name : "shipid",
						type : "int"
					}, {
						name : "name",
						type : "string"
					}, {
						name : "company",
						type : "string"
					}, {
						name : "region",
						type : "string"
					}, {
						name : "zipcode",
						type : "string"
					}, {
						name : "address",
						type : "string"
					}, {
						name : "phone",
						type : "string"
					}, {
						name : "phone",
						type : "date",
						dateFormat : "time"
					}, {
						name : "uid",
						type : "string"
					}]
		});
Ext.define('FunctionScope', {
			extend : 'Ext.data.Model',
			fields : [{
						name : "funcid",
						type : "string"
					}, {
						name : "name",
						type : "string"
					}, {
						name : "description",
						type : "string"
					}, {
						name : "scope",
						type : "int"
					}, {
						name : "moduleid",
						type : "int"
					}, {
						name : "funcscope",
						type : "string",
						convert : function(value, record) {
							return record.get('funcid') + ","
									+ record.get('scope');
						}
					}]
		});
Ext.define('Module', {
			extend : 'Ext.data.Model',
			fields : [{
						name : "moduleid",
						type : "int"
					}, {
						name : "name",
						type : "string"
					}, {
						name : "description",
						type : "string"
					}, {
						name : "status",
						type : "int"
					}, {
						name : "innerurl",
						type : "string"
					}, {
						name : "outurl",
						type : "string"
					}],
			idProperty : "moduleid"
		});
Ext.define('Role', {
			extend : 'Ext.data.Model',
			fields : [{
						name : "roleid",
						type : "int"
					}, {
						name : "name",
						type : "string"
					}, {
						name : "description",
						type : "string"
					}, {
						name : "userid",
						type : "string"
					}, {
						name : "createtime",
						type : "date",
						dateFormat : "time"
					}, {
						name : "moduleid",
						type : "int"
					}],
			idProperty : "roleid"
		});
Ext.define('Authorization', {
			extend : 'Ext.data.Model',
			fields : [{
						name : "userid",
						type : "string"
					}, {
						name : "name",
						type : "string"
					}, {
						name : "type",
						type : "int"
					}, {
						name : "departid",
						type : "string"
					}, {
						name : "departname",
						type : "string"
					}],
			idProperty : "userid"
		});
/**
 * 客户文件,已检查
 */
Ext.define('ProjectFile', {
			extend : 'Ext.data.Model',
			idProperty : 'bcbh',
			fields : [{
						name : 'clientId',
						type : 'string'
					}, {
						name : 'clientName',
						type : 'string'
					}, {
						name : 'bcbh',
						type : 'string'
					}, {
						name : 'projectName',
						type : 'string'
					}, {
						name : 'status',
						type : 'int'
					}, {
						name : "pcsX",
						type : "float"
					}, {
						name : "pcsY",
						type : "float"
					}, {
						name : "setX",
						type : "float"
					}, {
						name : "setY",
						type : "float"
					}, {
						name : "setPs",
						type : "int"
					}, {
						name : "gkcl",
						type : "string"
					}, {
						name : "minlw",
						type : "float"
					}, {
						name : "minld",
						type : "float"
					}, {
						name : "minhole",
						type : "float"
					}, {
						name : "pfNote",
						type : "string"
					}, {
						name : "bspId",
						type : "string"
					}, {
						name : "zhcss",
						type : "string"
					}, {
						name : "zhcolor",
						type : "string"
					}, {
						name : "gkcl",
						type : "string"
					}, {
						name : "ddxq",
						type : "string"
					}, {
						name : "bccl",
						type : "string"
					}, {
						name : "bcgys",
						type : "string"
					}, {
						name : "cs",
						type : "string"
					}, {
						name : "bh",
						type : "string"
					}, {
						name : "gy",
						type : "string"
					}, {
						name : "wcth",
						type : "string"
					}, {
						name : "ncth",
						type : "string"
					}, {
						name : "zfPerson",
						type : "string"
					}, {
						name : "zfDate",
						type : "date"
					}, {
						name : 'createDate',
						type : 'date'
					}]
		});

/**
 * 产品
 */
Ext.define('Product', {
			extend : 'Ext.data.Model',
			idProperty : 'prodId',
			fields : [{
						name : "prodId",
						type : "string"
					}, {
						name : 'bcbh',
						type : 'string'
					}, {
						name : 'khxh',
						type : 'string'
					}, {
						name : 'ybbh',
						type : 'string'
					}, {
						name : "fontCss",
						type : "string"
					}, {
						name : "fontColor",
						type : "string"
					}, {
						name : "zhCss",
						type : "string"
					}, {
						name : "zhColor",
						type : "string"
					}, {
						name : "bccl",
						type : "string"
					}, {
						name : 'bcxh',
						type : 'string'
					}, {
						name : 'bh',
						type : 'int'
					}, {
						name : "wcth",
						type : "string"
					}, {
						name : "ncth",
						type : "string"
					}, {
						name : "gy",
						type : "string"
					}, {
						name : "psfileId",
						type : "string"
					}, {
						name : "productNote",
						type : "string"
					}, {
						name : "status",
						type : "int"
					}, {
						name : "stockQty",
						type : "int"
					}, {
						name : 'clientId',
						type : 'string'
					}, {
						name : 'clientName',
						type : 'string'
					}, {
						name : 'bcbh',
						type : 'string'
					}, {
						name : 'projectName',
						type : 'string'
					}, {
						name : 'status',
						type : 'int'
					}, {
						name : "pcsX",
						type : "float"
					}, {
						name : "pcsY",
						type : "float"
					}, {
						name : "setX",
						type : "float"
					}, {
						name : "setY",
						type : "float"
					}, {
						name : "setPs",
						type : "int"
					}, {
						name : "gkcl",
						type : "string"
					}, {
						name : "minlw",
						type : "float"
					}, {
						name : "minld",
						type : "float"
					}, {
						name : "minhole",
						type : "float"
					}, {
						name : "pfNote",
						type : "string"
					}, {
						name : "bspId",
						type : "string"
					}, {
						name : "zhcss",
						type : "string"
					}, {
						name : "zhcolor",
						type : "string"
					}, {
						name : "gkcl",
						type : "string"
					}, {
						name : "ddxq",
						type : "string"
					}, {
						name : "bccl",
						type : "string"
					}, {
						name : "bcgys",
						type : "string"
					}, {
						name : "cs",
						type : "string"
					}, {
						name : "bh",
						type : "string"
					}, {
						name : "gy",
						type : "string"
					}, {
						name : "wcth",
						type : "string"
					}, {
						name : "ncth",
						type : "string"
					}, {
						name : "zfPerson",
						type : "string"
					}, {
						name : "zfDate",
						type : "date"
					}, {
						name : 'createDate',
						type : 'date'
					}]
		});
/**
 * 工程部已处理好的文件信息
 */
Ext.define('PSFileBean', {
			extend : 'Ext.data.Model',
			idProperty : 'psfileId',
			fields : [{
						name : 'psfileId',
						type : 'string'
					}, {
						name : 'createDate',
						type : "date"
					}, {
						name : 'creator',
						type : 'string'
					}, {
						name : 'status',
						type : "int"
					}, {
						name : 'cs',
						type : 'string'
					},{
						name : 'layers',
						type : 'string'
					} ,{
						name : 'pcsX',
						type : 'float'
					},{
						name : 'pcsY',
						type : 'float'
					},{
						name : 'setX',
						type : 'float'
					},{
						name : 'setY',
						type : 'float'
					},{
						name : 'setPs',
						type : 'float'
					},{
						name : 'gkcl',
						type : 'string'
					}, {
						name : 'wcth',
						type : 'float'
					}, {
						name : 'ncth',
						type : "float"
					}, {
						name : 'bcbh',
						type : "string"
					}, {
						name : 'psBatch',
						type : "int"
					}, {
						name : 'note',
						type : "string"
					},{
						name : 'psfileId',
						type : "string"
					},{
						name : 'minlw',
						type : 'float'
					},{
						name : 'minld',
						type : 'float'
					},{
						name : 'minhole',
						type : 'float'
					}]
		});
/**
 * 生产订单
 */
Ext.define('ProductOrderBean', {
			extend : 'Ext.data.Model',
			idProperty : 'orderId',
			fields : [{
						name : 'orderId',
						type : 'string'
					}, {
						name : 'orderType',
						type : 'int'
					}, {
						name : 'createDate',
						type : "date"
					}, {
						name : 'unitprice',
						type : 'float'
					}, {
						name : 'subtotal',
						type : 'float'
					}, {
						name : 'num',
						type : 'float'
					}, {
						name : 'tlnum',
						type : 'int'
					}, {
						name : 'jhnum',
						type : 'int'
					}, {
						name : 'jjType',
						type : 'string'
					}, {
						name : 'startDate',
						type : "date"
					}, {
						name : 'jhDate',
						type : 'date'
					}, {
						name : 'isfd',
						type : 'int'
					}, {
						name : 'isontime',
						type : 'int'
					}, {
						name : 'sentDate',
						type : 'date'
					}, {
						name : 'isoutsourcing',
						type : 'int'
					}, {
						name : 'zmj',
						type : 'float'
					}, {
						name : 'contractId',
						type : 'string'
					}, {
						name : 'cxfs',
						type : 'string'
					}, {
						name : 'csfs',
						type : 'string'
					}, {
						name : 'ddxq',
						type : 'string'
					}, {
						name : 'zfDate',
						type : 'date'
					}, {
						name : 'zfPerson',
						type : 'string'
					}, {
						name : 'auditContent',
						type : 'string'
					}, {
						name : 'auditDate',
						type : 'date'
					}, {
						name : 'auditPerson',
						type : 'string'
					}, {
						name : 'auditPersonName',
						type : 'string'
					}, {
						name : 'fileId',
						type : 'string'
					}, {
						name : "prodId",
						type : "string"
					}, {
						name : 'bcbh',
						type : 'string'
					}, {
						name : 'khxh',
						type : 'string'
					}, {
						name : 'ybbh',
						type : 'string'
					}, {
						name : "fontCss",
						type : "string"
					}, {
						name : "fontColor",
						type : "string"
					}, {
						name : "zhCss",
						type : "string"
					}, {
						name : "zhColor",
						type : "string"
					}, {
						name : "bccl",
						type : "string"
					}, {
						name : 'bcxh',
						type : 'string'
					}, {
						name : 'bh',
						type : 'int'
					}, {
						name : "wcth",
						type : "string"
					}, {
						name : "ncth",
						type : "string"
					}, {
						name : "gy",
						type : "string"
					}, {
						name : "psfileId",
						type : "string"
					}, {
						name : "productNote",
						type : "string"
					}, {
						name : "status",
						type : "int"
					}, {
						name : "stockQty",
						type : "int"
					}, {
						name : 'clientId',
						type : 'string'
					}, {
						name : 'clientName',
						type : 'string'
					}, {
						name : 'bcbh',
						type : 'string'
					}, {
						name : 'projectName',
						type : 'string'
					}, {
						name : 'status',
						type : 'int'
					}, {
						name : "pcsX",
						type : "float"
					}, {
						name : "pcsY",
						type : "float"
					}, {
						name : "setX",
						type : "float"
					}, {
						name : "setY",
						type : "float"
					}, {
						name : "setPs",
						type : "int"
					}, {
						name : "gkcl",
						type : "string"
					}, {
						name : "minlw",
						type : "float"
					}, {
						name : "minld",
						type : "float"
					}, {
						name : "minhole",
						type : "float"
					}, {
						name : "pfNote",
						type : "string"
					}, {
						name : "bspId",
						type : "string"
					}, {
						name : "zhcss",
						type : "string"
					}, {
						name : "zhcolor",
						type : "string"
					}, {
						name : "gkcl",
						type : "string"
					}, {
						name : "ddxq",
						type : "string"
					}, {
						name : "bccl",
						type : "string"
					}, {
						name : "bcgys",
						type : "string"
					}, {
						name : "cs",
						type : "string"
					}, {
						name : "bh",
						type : "string"
					}, {
						name : "gy",
						type : "string"
					}, {
						name : "wcth",
						type : "string"
					}, {
						name : "ncth",
						type : "string"
					}, {
						name : 'createDate',
						type : 'date'
					}]
		});
/**
 * 生产计划
 */
Ext.define('ProductPlanBean', {
			extend : 'Ext.data.Model',
			idProperty : 'ppId',
			fields : [{
						name : 'ppId',
						type : 'string'
					}, {
						name : 'wbpId',
						type : 'string'
					}, {
						name : 'productType',
						type : 'int'
					}, {
						name : 'wcnum',
						type : 'int'
					}, {
						name : 'wzgzbnum',
						type : 'int'
					}, {
						name : 'yzgzbnum',
						type : 'int'
					}, {
						name : 'scrapnum',
						type : 'int'
					}, {
						name : 'orderId',
						type : 'string'
					}, {
						name : 'orderType',
						type : 'int'
					}, {
						name : 'createDate',
						type : "date"
					}, {
						name : 'unitprice',
						type : 'float'
					}, {
						name : 'subtotal',
						type : 'float'
					}, {
						name : 'num',
						type : 'float'
					}, {
						name : 'tlnum',
						type : 'int'
					}, {
						name : 'jhnum',
						type : 'int'
					}, {
						name : 'jjType',
						type : 'string'
					}, {
						name : 'startDate',
						type : "date"
					}, {
						name : 'jhDate',
						type : 'date'
					}, {
						name : 'isfd',
						type : 'int'
					}, {
						name : 'isontime',
						type : 'int'
					}, {
						name : 'sentDate',
						type : 'date'
					}, {
						name : 'isoutsourcing',
						type : 'int'
					}, {
						name : 'zmj',
						type : 'float'
					}, {
						name : 'contractId',
						type : 'string'
					}, {
						name : 'cxfs',
						type : 'string'
					}, {
						name : 'csfs',
						type : 'string'
					}, {
						name : 'ddxq',
						type : 'string'
					}, {
						name : 'zfDate',
						type : 'date'
					}, {
						name : 'zfPerson',
						type : 'string'
					}, {
						name : 'auditContent',
						type : 'string'
					}, {
						name : 'auditDate',
						type : 'date'
					}, {
						name : 'auditPerson',
						type : 'string'
					}, {
						name : 'auditPersonName',
						type : 'string'
					}, {
						name : 'fileId',
						type : 'string'
					}, {
						name : "prodId",
						type : "string"
					}, {
						name : 'bcbh',
						type : 'string'
					}, {
						name : 'khxh',
						type : 'string'
					}, {
						name : 'ybbh',
						type : 'string'
					}, {
						name : "fontCss",
						type : "string"
					}, {
						name : "fontColor",
						type : "string"
					}, {
						name : "zhCss",
						type : "string"
					}, {
						name : "zhColor",
						type : "string"
					}, {
						name : "bccl",
						type : "string"
					}, {
						name : 'bcxh',
						type : 'string'
					}, {
						name : 'bh',
						type : 'int'
					}, {
						name : "wcth",
						type : "string"
					}, {
						name : "ncth",
						type : "string"
					}, {
						name : "gy",
						type : "string"
					}, {
						name : "psfileId",
						type : "string"
					}, {
						name : "productNote",
						type : "string"
					}, {
						name : "status",
						type : "int"
					}, {
						name : "stockQty",
						type : "int"
					}, {
						name : 'clientId',
						type : 'string'
					}, {
						name : 'clientName',
						type : 'string'
					}, {
						name : 'bcbh',
						type : 'string'
					}, {
						name : 'projectName',
						type : 'string'
					}, {
						name : 'status',
						type : 'int'
					}, {
						name : "pcsX",
						type : "float"
					}, {
						name : "pcsY",
						type : "float"
					}, {
						name : "setX",
						type : "float"
					}, {
						name : "setY",
						type : "float"
					}, {
						name : "setPs",
						type : "int"
					}, {
						name : "gkcl",
						type : "string"
					}, {
						name : "minlw",
						type : "float"
					}, {
						name : "minld",
						type : "float"
					}, {
						name : "minhole",
						type : "float"
					}, {
						name : "pfNote",
						type : "string"
					}, {
						name : "bspId",
						type : "string"
					}, {
						name : "zhcss",
						type : "string"
					}, {
						name : "zhcolor",
						type : "string"
					}, {
						name : "gkcl",
						type : "string"
					}, {
						name : "ddxq",
						type : "string"
					}, {
						name : "bccl",
						type : "string"
					}, {
						name : "bcgys",
						type : "string"
					}, {
						name : "cs",
						type : "string"
					}, {
						name : "bh",
						type : "string"
					}, {
						name : "gy",
						type : "string"
					}, {
						name : "wcth",
						type : "string"
					}, {
						name : "ncth",
						type : "string"
					}, {
						name : 'createDate',
						type : 'date'
					},{
						name : 'lockedPerson',
						type : 'string'
					},{
						name : 'lockedDate',
						type : 'date'
					},{
						name : 'isLocked',
						type : 'int'
					}]
		});
/**
 * 已处理好的工程文件包含的错误信息
 */
Ext.define('PSFileProblemBean', {
			extend : 'Ext.data.Model',
			fields : [{
						name : 'pfpId',
						type : 'int'
					}, {
						name : 'description',
						type : 'string'
					}, {
						name : 'createDate',
						type : "date"
					}, {
						name : 'updateDate',
						type : "date"
					}, {
						name : 'creator',
						type : 'string'
					}, {
						name : 'creatorName',
						type : 'string'
					}, {
						name : 'status',
						type : 'string'
					}, {
						name : 'minlw',
						type : 'double'
					}, {
						name : 'minhole',
						type : 'double'
					}, {
						name : 'minld',
						type : 'double'
					}, {
						name : 'validateDate',
						type : "date",
						dateFormat : "time"
					}, {
						name : 'validator',
						type : "string"
					}, {
						name : 'validatorName',
						type : "string"
					}]
		});

Ext.define('PTUndoRequest', {
			extend : 'Ext.data.Model',
			fields : [{
						name : 'ptrrid',
						type : 'int'
					}, {
						name : 'createtime',
						type : 'date',
						dateFormat : "time"
					}, {
						name : 'bcbh',
						type : 'string'
					}, {
						name : 'prodId',
						type : 'string'
					}, {
						name : 'problem',
						type : 'string'
					}, {
						name : 'receiver',
						type : 'string'
					}, {
						name : "receivername",
						type : "string"
					}, {
						name : "creator",
						type : "string"
					}, {
						name : "creatorname",
						type : "string"
					}, {
						name : "resolvetime",
						type : 'date',
						dateFormat : "time"
					}, {
						name : "resolver",
						type : "string"
					}, {
						name : "resolvername",
						type : "string"
					}, {
						name : "status",
						type : "int"
					}]
		});

/**
 * 工作板
 */
Ext.define('WorkBoard', {
			extend : 'Ext.data.Model',
			idProperty : 'wbId',
			fields : [{
						name : 'wbId',
						type : 'string'
					}, {
						name : 'creator',
						type : "string"
					}, {
						name : 'createDate',
						type : "date"
					}, {
						name : 'gzbccx',
						type : 'int'
					}, {
						name : 'gzbccy',
						type : 'int'
					}, {
						name : "gzkyxj",
						type : "string"
					}, {
						name : "lockedPerson",
						type : "string"
					}, {
						name : "lockedPersonname",
						type : "string"
					}, {
						name : "bccl",
						type : "string"
					}, {
						name : "wcth",
						type : "string"
					}, {
						name : "ncth",
						type : "string"
					}, {
						name : "cs",
						type : "string"
					}, {
						name : "bh",
						type : "string"
					}, {
						name : "gy",
						type : "string"
					}, {
						name : "status",
						type : "int"
					}, {
						name : 'bcgys',
						type : 'string'
					}]
		});
/**
 * 工作板审核记录
 */
Ext.define('WorkBoardAudit', {
			extend : 'Ext.data.Model',
			fields : [{
						name : 'wbaid',
						type : 'int'
					}, {
						name : 'createtime',
						type : "date",
						dateFormat : 'time'
					}, {
						name : 'wbid',
						type : 'string'
					}, {
						name : 'verifier',
						type : 'string'
					}, {
						name : "verifiername",
						type : "string"
					}, {
						name : "num",
						type : "int"
					}, {
						name : "wklnum",
						type : "int"
					}, {
						name : "auditresult",
						type : "int"
					}, {
						name : "reason",
						type : "string"
					}, {
						name : "audittype",
						type : "int"
					}]
		});

Ext.define('Step', {
			extend : 'Ext.data.Model',
			fields : [{
						name : 'stepid',// 工序编号
						type : 'int'
					}, {
						name : 'stepname',// 工序名称
						type : 'string'
					}, {
						name : "stepParams",// 参数列表
						type : "Ext.data.Model"
					}, {
						name : "num",// 总数
						type : "int"
					}, {
						name : 'isoutsourcing',// 是否外协
						type : 'int'
					}, {
						name : "expectdate",// 预期时间
						type : "date",
						dateFormat : 'time'
					}, {
						name : "recipient",// 接收者签名
						type : "string"
					}, {
						name : "accepttime",// 接收时间
						type : 'date',
						dateFormat : "time"
					}, {
						name : "handovertime",// 转出时间
						type : "date",
						dateFormat : 'time'
					}, {
						name : "ipqc",// ipqc签名
						type : "string"
					}, {
						name : "scrapnum",// 报废数量
						type : "int"
					}, {
						name : "note",// 备注
						type : "string"
					}, {
						name : "steporder",
						type : "int"
					}, {
						name : "countingDetail",
						type : "object"
					}]
		});

Ext.define('Process', {
			extend : 'Ext.data.Model',
			fields : [{
						name : 'processdesc',
						type : 'string'
					}, {
						name : 'processname',
						type : 'string'
					}, {
						name : 'processid',
						type : 'int'
					}]
		});

Ext.define('InStock', {
			extend : 'Ext.data.Model',
			fields : [{
						name : 'bcbh',
						type : 'string'
					}, {
						name : 'num',
						type : 'int'
					}, {
						name : "rkid",
						type : "string"
					}, {
						name : 'rktime',
						type : "date",
						dateFormat : "time"
					}, {
						name : 'rkperson',
						type : 'string'
					}, {
						name : 'rktype',
						type : 'string'
					}, {
						name : 'cwbh',
						type : 'string'
					}]
		});

/**
 * 产品型号
 */
Ext.define('Ecn', {
			extend : 'Ext.data.Model',
			fields : [{
						name : 'ecnid',
						type : 'string'
					}, {
						name : 'status',
						type : 'int'
					}, {
						name : 'xbcbh',
						type : 'string'
					}, {
						name : 'ybcbh',
						type : 'string'
					}, {
						name : "createtime",
						type : "date",
						dateFormat : "time"
					}, {
						name : "ggnr",
						type : "string"
					}, {
						name : "note",
						type : "string"
					}, {
						name : 'operatorname',
						type : 'string'
					}]
		});

Ext.define('MaterTicket', {
			extend : 'Ext.data.Model',
			fields : [{
						name : 'mid',
						type : 'string'
					}, {
						name : 'awbid',
						type : 'string'
					}, {
						name : 'bwbid',
						type : 'string'
					}, {
						name : 'cwbid',
						type : 'string'
					}, {
						name : "anum",
						type : "int"
					}, {
						name : "bnum",
						type : "int"
					}, {
						name : "cnum",
						type : "int"
					}, {
						name : "ztlmj",
						type : "float"
					}, {
						name : "ylmj",
						type : "float"
					}, {
						name : 'tlnum',
						type : 'int'
					}, {
						name : "bccl",
						type : "string"
					}, {
						name : "bh",
						type : "string"
					}, {
						name : "bcxh",
						type : "string"
					}, {
						name : "stepname",
						type : "string"
					}, {
						name : 'createtime',
						type : "date",
						dateFormat : "time"
					}, {
						name : 'tltime',
						type : "date",
						dateFormat : "time"
					}, {
						name : 'tlperson',
						type : "string"
					}, {
						name : 'creatorname',
						type : "string"
					}, {
						name : 'lyperson',
						type : "string"
					}, {
						name : 'lytime',
						type : "date",
						dateFormat : "time"
					}, {
						name : 'note',
						type : "string"
					}]
		});

Ext.define('TempTicket', {
			extend : 'Ext.data.Model',
			fields : [{
						name : 'awbid',
						type : 'string'
					}, {
						name : 'bwbid',
						type : 'string'
					}, {
						name : 'cwbid',
						type : 'string'
					}, {
						name : "anum",
						type : "int"
					}, {
						name : "bnum",
						type : "int"
					}, {
						name : "cnum",
						type : "int"
					}, {
						name : "ylccx",
						type : "int"
					}, {
						name : "ylccy",
						type : "int"
					}, {
						name : 'tlnum',
						type : 'int'
					}, {
						name : 'kllyl',
						type : 'float'
					}, {
						name : 'jhlyl',
						type : 'float'
					}]
		});

Ext.define('LotCard', {
			extend : 'Ext.data.Model',
			fields : [{
						name : 'wbid',
						type : 'string'
					}, {
						name : 'lotid',
						type : 'string'
					}, {
						name : 'gzkyxj',
						type : 'string'
					}, {
						name : 'num',
						type : 'int'
					}, {
						name : 'tltime',
						type : "date",
						dateFormat : "time"
					}, {
						name : 'status',
						type : "int"
					}, {
						name : 'createtime',
						type : "date",
						dateFormat : "time"
					}, {
						name : 'jhrq',
						type : "date",
						dateFormat : "time"
					}, {
						name : 'stepname',
						type : 'string'
					}, {
						name : 'mid',
						type : 'string'
					}]
		});

Ext.define('GetCount', {
			extend : 'Ext.data.Model',
			fields : [{
						name : 'id',
						type : 'int'
					}, {
						name : 'lotid',// lot卡号
						type : 'string'
					}, {
						name : 'bcbh',// 工程编号
						type : 'string'
					}, {
						name : "stepid",// 工序编号
						type : "int"
					}, {
						name : 'num',// 数量
						type : 'int'
					}, {
						name : "isoutsourcing",// 是否外协
						type : "int"
					}, {
						name : "expectdate",// 预期时间
						type : "int"
					}, {
						name : "recipientname",// 接收者
						type : "string"
					}, {
						name : "accepttime",// 接收时间
						type : "date",
						dateFormat : "time"
					}, {
						name : "overperson",// 转出人
						type : "string"
					}, {
						name : "handovertime",// 移交时间
						type : "date",
						dateFormat : "time"
					}, {
						name : "ipqc",// IPQC签名
						type : "string"
					}, {
						name : "operater",// 操作人
						type : "string"
					}, {
						name : "scrapnum",// 报废数
						type : "int"
					}, {
						name : "note",// 备注
						type : "string"
					}, {
						name : "intotime",//
						type : "date",
						dateFormat : "time"
					}, {
						name : "stepname",// 工序名称
						type : "string"
					}, {
						name : "beforestepname",
						type : "string"
					}, {
						name : "afterstepname",
						type : "string"
					}]
		});

/**
 * 合同信息
 */
Ext.define('ContractBean', {
			extend : 'Ext.data.Model',
			fields : [{
						name : 'contractId',
						type : 'string'
					}, {
						name : 'clientId',
						type : 'string'
					}, {
						name : 'clientName',
						type : 'string'
					}, {
						name : 'createDate',
						type : "date",
						dateFormat : "Y-m-d H:i:s"
					}, {
						name : 'status',
						type : 'int'
					}, {
						name : 'concessionsType',
						type : 'string'
					}, {
						name : 'actualAmount',
						type : 'float'
					}, {
						name : 'amount',
						type : 'float'
					}, {
						name : 'tax',
						type : 'bool'
					}, {
						name : 'payMethod',
						type : 'string'
					}, {
						name : 'payNote',
						type : 'string'
					}, {
						name : 'salesman',
						type : 'string'
					}, {
						name : 'salesmanName',
						type : 'string'
					}, {
						name : 'auditor',
						type : 'string'
					}, {
						name : 'auditorName',
						type : 'string'
					}, {
						name : 'auditNote',
						type : 'string'
					}, {
						name : 'note',
						type : 'string'
					}, {
						name : 'logistics',
						type : 'string'
					}, {
						name : 'receiver',
						type : 'string'
					}, {
						name : 'companyName',
						type : 'string'
					}, {
						name : 'region',
						type : 'string'
					}, {
						name : 'zipcode',
						type : 'string'
					}, {
						name : 'address',
						type : 'string'
					}, {
						name : 'phone',
						type : 'string'
					}]
		});
// 发货计划
Ext.define('DeliveryPlanBean', {
			extend : 'Ext.data.Model',
			fields : [{
						name : 'dpId',
						type : 'string'
					}, {
						name : 'orderId',
						type : 'string'
					}, {
						name : 'prodId',
						type : 'string'
					}, {
						name : 'createDate',
						type : "date",
						dateFormat : "Y-m-d H:i:s"
					}, {
						name : 'status',
						type : 'int'
					}, {
						name : 'contractId',
						type : 'string'
					}, {
						name : 'clientId',
						type : 'string'
					}, {
						name : 'clientName',
						type : 'string'
					}, {
						name : 'salesman',
						type : 'string'
					}, {
						name : 'salesmanName',
						type : 'string'
					}, {
						name : 'planDate',
						type : "date",
						dateFormat : "Y-m-d H:i:s"
					}, {
						name : 'qty',
						type : 'int'
					}, {
						name : 'unitprice',
						type : 'float'
					}, {
						name : 'subtotal',
						type : 'float'
					}, {
						name : 'auditor',
						type : 'string'
					}, {
						name : 'auditorName',
						type : 'string'
					}, {
						name : 'auditDate',
						type : "date",
						dateFormat : "Y-m-d H:i:s"
					}, {
						name : 'logistics',
						type : 'string'
					}, {
						name : 'receiver',
						type : 'string'
					}, {
						name : 'company',
						type : 'string'
					}, {
						name : 'region',
						type : 'string'
					}, {
						name : 'zipcode',
						type : 'string'
					}, {
						name : 'address',
						type : 'string'
					}, {
						name : 'phone',
						type : 'string'
					}, {
						name : 'stockqty',
						type : 'int'
					}, {
						name : 'note',
						type : 'string'
					}]
		});
// 审核记录信息
Ext.define('AuditProcessBean', {
			extend : 'Ext.data.Model',
			idProperty : "apId",
			fields : [{
						name : 'apId',
						type : 'int'
					}, {
						name : 'auditType',
						type : 'int'
					}, {
						name : 'auditResult',
						type : 'int'
					}, {
						name : 'auditDate',
						type : "date",
						dateFormat : "Y-m-d H:i:s"
					}, {
						name : 'referenceId',
						type : 'string'
					}, {
						name : 'auditPerson',
						type : 'string'
					}, {
						name : 'auditContent',
						type : 'string'
					}, {
						name : 'auditPersonName',
						type : 'string'
					}]
		});
// 审核记录信息
Ext.define('LockProcessBean', {
			extend : 'Ext.data.Model',
			idProperty : "lpId",
			fields : [{
						name : 'lpId',
						type : 'int'
					}, {
						name : 'isLocked',
						type : 'int'
					}, {
						name : 'lockDate',
						type : "date",
						dateFormat : "Y-m-d H:i:s"
					}, {
						name : 'referenceId',
						type : 'string'
					}, {
						name : 'lockPerson',
						type : 'string'
					}, {
						name : 'lockPersonName',
						type : 'string'
					}]
		});

// 常用的renderer
Pcbms.ProjectSizeRenderer = function(v, m, r) {
	var numf = Ext.util.Format.number;
	var data = null;
	if (arguments.length == 1 && typeof v == 'object') {
		data = v;
	} else {
		data = r.data;
	}
	if (data["setPs"] > 1) {
		return "<span style='color:green' title='宽'>"
				+ numf(data["pcsX"], '0.0')
				+ "</span> X <span style='color:green'>"
				+ numf(data["pcsY"], '0.0') + "</span>[" + data["setPs"] + "拼]";
	} else {
		return "<span style='color:green' title='宽'>"
				+ numf(data["pcsX"], '0.0')
				+ "</span> X <span style='color:green'>"
				+ numf(data["pcsY"], '0.0') + "</span>";
	}
};
Pcbms.SetSizeRenderer = function(v, m, r) {
	var numf = Ext.util.Format.number;
	var data = null;
	if (arguments.length == 1 && typeof v == 'object') {
		data = v;
	} else {
		data = r.data;
	}
	return "<span style='color:green' title='宽'>" + numf(data["setX"], '0.0')
			+ "</span> X <span style='color:green'>"
			+ numf(data["setY"], '0.0') + "</span>";
};
// 产品的编号的renderer 两个显示的内容不一样(订单系统和生产系统)
Ext.define('Pcbms.product.OrderIdColumn', {
	extend : 'Ext.grid.column.Column',
	alias : ['widget.orderIdcolumn'],
	dataIndex : 'orderId',
	header : "订单编号",
	width : 150,
	tp : "<a href=\"productOrderAction!view.action?ppId={0}\" target=\"_blank\">{0}</a>",
	defaultRenderer : function(value) {
		return Ext.String.format(this.tp, value);
	}
});
Ext.define('Pcbms.product.PPIdColumn', {
	extend : 'Ext.grid.column.Column',
	alias : ['widget.ppIdcolumn'],
	dataIndex : 'ppId',
	header : "生产编号",
	width : 150,
	tp : "<a href=\"productPlanAction!view.action?ppId={0}&title={0}_生产安排详细&widget=Pcbms.product.ProductPlanView\" target=\"_blank\">{0}</a>",
	defaultRenderer : function(value) {
		return Ext.String.format(this.tp, value);
	}
});
// 铜厚的
Pcbms.copperRenderer = function(d, m, r) {
	if (arguments.length == 1) {
		if (d.cs == '单面板' || d.cs == '双面板') {
			return d.wcth;
		}
		return "外:<span class='wcth'>" + d.wcth
				+ "<span> 内:<span class='ncth'>" + d.ncth + "</span>";
	}
	if (r.get("cs") == '单面板' || r.get("cs") == '双面板') {
		return r.get("wcth");
	}
	return "外:<span class='wcth'>" + r.get("wcth")
			+ "<span> 内:<span class='ncth'>" + r.get("ncth") + "</span>";
};
Ext.define('Pcbms.product.CopperColumn', {
			extend : 'Ext.grid.column.Column',
			alias : ['widget.coppercolumn'],
			header : "铜层厚度",
			dataIndex : 'wcth',
			width : 125,
			defaultRenderer : Pcbms.copperRenderer
		});
Pcbms.WorkBoardSizeRenderer = function(v, m, r) {
	var numf = Ext.util.Format.number;
	return "<span style='color:green' title='宽'>"
			+ numf(r.data["gzbccx"], '0.0')
			+ "</span> X <span style='color:green'>"
			+ numf(r.data["gzbccy"], '0.0') + "</span>";
};
// 2---量产板 1---样板 3---报价板
Pcbms.orderTypeRenderer = function(v, m, r) {
	switch (v) {
		case 1 :
			return "样板";
		case 2 :
			return "量产板";
		case 3 :
			return "报价板";

	}
	return v;
};
Pcbms.JJTypeRenderer = function(v, m, r) {
	return v;
};
Pcbms.FdRenderer = function(v, m, r) {
	switch (v) {
		case 1 :
			return "<span style='color:red'>返单</span>";
		case 2 :
			return "<span style='color:green'>新单</span>";
	}
	return v;
};
Pcbms.SizeRenderer = function(v, m, r) {
	return Ext.util.Format.number(v, "0.00 m<sup>2</sup>");
}