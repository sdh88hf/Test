Ext.define('Client', {
	extend : 'Ext.data.Model',
	fields : [ {
		name : 'userid',//客户编号
		type : 'string'
	}, {
		name : 'company',//公司名称
		type : 'string'
	}, {
		name : 'employeename',//业务员名称
		type : 'string'
	} ]
});
Ext.define("Pcbms.product.SearchClientList", {
	extend : "Ext.grid.Panel",
	alias : "widget.clientgrid",
	initComponent : function() {
		var storeid = "clientListStore";
		var me = this;
		Ext.applyIf(me, {
			columns : [ {
				header : "客户编号",
				flex : 1,
				dataIndex : "userid"
			}, {
				header : "公司名称",
				flex : 1,
				dataIndex : "company"
			}, {
				header : "业务员",
				flex : 1,
				dataIndex : "employeename"
			} ],
			store : Ext.create("Ext.data.Store", {
				model : "Client",
				storeId : storeid,
				proxy : Pcbms.ajaxProxy({
						url:"/searchAccountAction!searchClientList.action", reader: {
							type : 'json',
							root : 'clientList',
							totalProperty : 'count'
						}})
			}),
			tbar : [ {
				xtype : "buttongroup",
				title : "查询",
				columns : 5,
				flex : 1,
				defaults : {
					scale : "larger"
				},
				items : [ {
					xtype : "textfield",
					fieldLabel : "客户编号",
					labelAlign : "right",
					labelWidth : 60,
					name : "clientInfo.userid"
				}, {
					xtype : "textfield",
					fieldLabel : "公司名称",
					labelAlign : "right",
					labelWidth : 60,
					name : "clientInfo.company"
				}, {
					xtype : "textfield",
					fieldLabel : "业务员",
					labelAlign : "right",
					// value : "业务员",
					labelWidth : 50,
					name : "clientInfo.employeename"
				}, Pcbms.searchbtn("查询", storeid, 'small') ]
			} ]
		});
		me.addListener("itemclick", function(v, r) {
			me.target.setValue(r.get("userid"));
			me.target.clientWindow.close();
		});
		this.callParent();
	}
});