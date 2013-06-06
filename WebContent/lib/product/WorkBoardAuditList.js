
Ext.define("Pcbms.product.WorkBoardAuditList", {
	extend : "Ext.grid.Panel",
	alias : "widget.wbagrid",
	initComponent : function() {
		var me = this;
		var storeid = me.storeid || 'wbauditId';
		me.store = Ext.create("Ext.data.Store", {
			model : "WorkBoardAudit",
			storeId : storeid,
			proxy : Pcbms.ajaxProxy(
					"/workBoardAuditAction!searchWorkBoardAuditList.action"),
			autoLoad:false
		});
		me.tbar = [ "->", {
			xtype : "searchbg",
			defaults : {
				labelWidth : 70,
				labelAlign : "right"
			},
			items : [ {
				xtype : "textfield",
				fieldLabel : '工作板编号',
				name : "workBoardInfo.wbid"
			}, {
				xtype : "combobox",
				store : [ [ -1, '全部' ], [ 0, '工程部审核' ], [ 1, '计划部审核' ] ],
				fieldLabel : "审核类型",
				value : -1,
				name : "workBoardInfo.audittype"
			}, Pcbms.searchbtn("查询", storeid, 'small'), {
				xtype : "datefield",
				fieldLabel : "日期起始",
				labelAlign : "right",
				name : "start"
			}, {
				xtype : "datefield",
				fieldLabel : "日期结束",
				labelAlign : "right",
				name : "end"
			}, {
				xtype : 'combobox',
				fieldLabel : '审核结果',
				labelAlign : "right",
				value : -1,
				name : 'workBoardInfo.auditresult',
				store : [ [ -1, '全部' ], [ 1, '审核通过' ], [ 0, '审核被拒' ] ],
			} ]
		} ];
		me.columns = [{xtype: 'rownumberer'},{
			header : '工作板编号',
			dataIndex : 'wbid',
			width : 110,
			renderer: showDetial('wb').renderer
		}, {
			header : '审核类型',
			dataIndex : 'audittype',
			width : 80,
			renderer : function(v) {
				switch (v) {
				case 0:
					return "工程审核";
				case 1:
					return "计划审核";
				}
			}
		}, {
			header : '审批时间',
			dataIndex : 'createtime',
			width : 120,
			renderer : Ext.util.Format.dateRenderer("Y-m-d H:i")
		}, {
			header : '审批内容',
			dataIndex : 'reason',
			flex : 1
		}, {
			header : '审批结果',
			dataIndex : 'auditresult',
			width : 80,
			renderer : function(v) {
				switch (v) {
				case 0:
					return "<span style='color:red'>审批被拒</span>";
				case 1:
					return "<span style='color:green'>审核通过</span>";
				}
			}
		}, {
			header : '审核人姓名',
			dataIndex : 'verifiername',
			width : 90
		} ];
		me.bbar = Ext.create("Ext.PagingToolbar", {
			store : me.store,
			itemId : 'pagebar',
			displayInfo : true,
			beforePageText : "当前页",
			afterPageText : "总 {0} 页",
			displayMsg : "当前显示 {0} - {1} 条 一共 {2}条",
			emptyMsg : " 暂无信息"
		});
		this.callParent();
	}
});