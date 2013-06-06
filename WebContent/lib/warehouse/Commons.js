Ext.require("Pcbms.product.Commons");

Ext.define('OutPart', {
	extend : 'Ext.data.Model',
	fields : [
			{
				name : 'saleSendId',
				type : 'string'
			},
			{
				name : 'bcbh',
				type : 'string'
			},
			{
				name : 'qty',
				type : 'int'
			},
			{
				name : 'num',
				type : 'int'
			},
			{
				name : 'address',
				type : 'string'
			},
			{
				name : 'deliveryDate',
				type : "date",
				dateFormat : "time"
			},
			{
				name : 'contractid',
				type : 'string'
			},
			{
				name : 'company',
				type : 'string'
			},
			{
				name : 'customerName',
				type : 'string'
			},
			{
				name : 'customerId',
				type : 'string'
			},
			{
				name : 'zipcode',
				type : 'string'
			},
			{
				name : 'chid',
				type : 'string'
			},
			{
				name : 'psList',
				type : 'array'
			},
			{
				name : 'price',
				type : 'double'
			},
			{
				name : 'je',
				type : 'double'
			},
			{
				name : 'checker',
				type : 'string'
			},
			{
				name : 'checkDate',
				type : "date",
				dateFormat : "time"
			},
			{
				name : "createtime",
				type : "date",
				dateFormat : "time"
			},
			{
				name : 'projectName',
				type : "string"
			},
			{
				name : 'remarks',
				type : 'string'
			},
			{
				name : 'phone',
				type : 'string'
			},
			{
				name : 'region',
				type : 'string'
			},
			{
				name : 'receiver',
				type : 'string'
			},
			{
				name : 'ckperson',
				type : 'string'
			},
			{
				name : 'note',
				type : 'string'
			},
			{
				name : 'logistics',
				type : 'string'
			},
			{
				name : 'status',
				type : 'int'
			},
			{
				name : 'customerid',
				type : 'string'
			},
			{
				name : 'apc',
				convert : function(value, record) {
					return record.data["address"] + " "
							+ record.data["receiver"] + " "
							+ record.data["phone"];
				}
			} ]
});

Ext.define('Completept', {
	extend : 'Ext.data.Model',
	fields : [ {
		name : 'whvid',
		type : 'string'
	}, {
		name : 'bcbh',
		type : 'string'
	}, {
		name : 'rknum',
		type : 'int'
	}, {
		name : 'num',
		type : 'int'
	}, {
		name : 'note',
		type : 'string'
	}, {
		name : 'status',
		type : 'int'
	}, {
		name : 'creator',
		type : 'string'
	}, {
		name : 'cttime',
		type : "date",
		dateFormat : "time"
	}, {
		name : 'sjnum',
		type : 'int'
	}, {
		name : 'creatorname',
		type : 'string'
	}, {
		name : 'projectName',
		type : 'string'
	}, {
		name : 'setps',
		type : 'string'
	}, {
		name : 'setx',
		type : 'float'
	}, {
		name : 'sety',
		type : 'float'
	}, {
		name : 'inputed',
		type : 'bool'
	} ]
});
Ext.define('PartPos', {
	extend : 'Ext.data.Model',
	fields : [ {
		name : 'cwbh',
		type : 'string'
	}, {
		name : "desc",
		type : "string"
	}, {
		name : "capacity",
		type : "int"
	}, {
		name : "kycapacity",
		type : "int"
	}, {
		name : "num",
		type : "int"
	}, {
		name : "defaultkw",
		type : "int"
	}, {
		name : "kwinfor",
		type : "string",
		convert : function(value, record) {
			if (typeof record.data['num'] == 'number') {
				return record.data['cwbh'] + " [" + record.data['num'] + "]";
			}
			return record.data['cwbh'];
		}
	} ]
});
Ext.define("Pcbms.warehouse.PartPosComboBox", {
	extend : "Ext.form.ComboBox",
	alias : "widget.partposcombo",
	displayField : 'kwinfor',
	valueField : 'cwbh',
	// minChars : 2,
	params : {},
	// queryParam : 'employeeInfo.name',
	initComponent : function() {
		var me = this;
		var url = "wareHouseManagementAction!searchPositionList.action";
		if (me.bcbh) {
			url = "wareHouseManagementAction!searchProductAddr.action?bcbh="
					+ me.bcbh;
		}
		this.store = Ext.create("Ext.data.Store", {
			model : "PartPos",
			proxy : Pcbms.ajaxProxy(url)
		});
		this.callParent();
	}
});
