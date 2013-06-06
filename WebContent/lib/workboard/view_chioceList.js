Ext.require("app.workboard.view_searchList");

Ext.define("Pcbms.view.chioceWorkBoard", {
	extend : "Pcbms.view.searchWorkBoard",
	alias : "widget.wbchioce",
	listeners : {
		"itemClick" : function(v, r) {
			var me = this;

			var s = me.getSelectionModel().getSelection();

			if (s.length > 0) {
				me.up("window").close();
				// 展现工作板编号和工作板尺寸
				me.target.setValue(r.get("wbid"));
				me.target.ownerCt.down("#x").setValue(r.get("gzbccx"));
				me.target.ownerCt.down("#y").setValue(r.get("gzbccy"));
				me.target.ownerCt.down("#wklnum").setValue(r.get("wklnum"));
				// 加载A板的信息
				me.target.up("form").loadData(r);

			} else {
				me.up("window").close();
				// 展现工作板编号和工作板尺寸
				me.target.setValue("");
				me.target.ownerCt.down("#x").setValue("");
				me.target.ownerCt.down("#y").setValue("");
				me.target.ownerCt.down("#num").setValue("");
				me.target.ownerCt.down("#wklnum").setValue("");

				// 加载A板的信息
				// me.target.up("form").loadData(r);

			}

		}
	},
	setSearch : function(params) {
		var me = this;

		for (var k in params) {
			me.down("#" + k).setValue(params[k]);
		}
	},
	initComponent : function() {
		var me = this;

		var storeid = me.storeid || 'cbwgridStoreId';

		me.store = Ext.create("Ext.data.Store", {
			model : "WorkBoard",
			storeId : storeid,
			proxy : Pcbms.ajaxProxy("/workBoardManagementAction!searchWorkBoards.action")
		});

		me.tbar = ["->", {
					xtype : "searchbg",
					items : [{
								xtype : "textfield",
								hidden : true,
								itemId : 'bccl',
								name : "workBoardInfo.bccl"
							}, {
								xtype : "textfield",
								hidden : true,
								itemId : 'bh',
								name : "workBoardInfo.bh"
							}, {
								xtype : "textfield",
								hidden : true,
								itemId : 'bcgys',
								name : "workBoardInfo.bcgys"
							}, {
								xtype : "textfield",
								fieldLabel : "工程编号",
								labelAlign : "right",
								labelWidth : 60,
								name : "workBoardInfo.bcbh"
							}, {
								xtype : 'textfield',
								fieldLabel : '工作板编号',
								labelAlign : "right",
								labelWidth : 70,
								flex : 1,
								name : 'workBoardInfo.wbid'
							}, Pcbms.searchbtn("查询", storeid, 'small'), {
								xtype : "datefield",
								fieldLabel : "交货日期",
								labelAlign : "right",
								labelWidth : 60,
								name : "workBoardInfo.jhrq"
							}, {
								xtype : "combobox",
								store : this.statusData,
								fieldLabel : "状态",
								itemId : 'status',
								labelAlign : "right",
								hidden : true,
								labelWidth : 60,
								value : 1,
								name : "workBoardInfo.status"
							}, {
								xtype : 'empcombo',
								fieldLabel : '创建人',
								labelAlign : "right",
								// hideTrigger : true,
								name : 'workBoardInfo.creator',
								cn : 'lockedperson',
								labelWidth : 60,
								flex : 1
							}, {
								xtype : "combobox",
								store : [[-1, '全部'], [1, '是'], [0, '否']],
								fieldLabel : "是否锁定",
								value : 0,
								hidden : true,
								itemId : 'isLocked',
								labelAlign : "right",
								labelWidth : 60,
								name : "workBoardInfo.isLocked"
							}, {
								xtype : 'empcombo',
								fieldLabel : '锁定人',
								labelAlign : "right",
								// hideTrigger : true,
								hidden : true,
								name : 'workBoardInfo.lockedPerson',
								cn : 'lockedperson',
								itemId : 'lockedPerson',
								labelWidth : 60,
								flex : 1
							}]
				}];

		this.callParent();

	}
});