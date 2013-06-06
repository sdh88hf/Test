// 填写制作参数
function uwp(i) {
	Ext.getCmp("updwbid").showParamWindow(i);
}

Ext.define("Pcbms.product.WorkBoardPlanAuditGrid", {
	extend : "Ext.grid.Panel",
	alias : "widget.wbpagrid",
	statusData : [[-1,"全部数据"],[0, "作废"], [1, "待工程审核"],[2,"待计划审核"],[6,"计划状态"],[8,"退回状态"]],
	initComponent : function() {
		var me = this;
		
		var storeid = me.storeid?me.storeid:"wbpaStore";
		
		if(!me.store)
		me.store = Ext.create("Ext.data.Store", {
			model : "WorkBoard",
			storeId : storeid,
			proxy : Pcbms.ajaxProxy("/workBoardManagementAction!searchWorkBoards.action")
		});

		Ext.applyIf(me, {
			columns : [{
						header : "工作板编号",
						flex : 1,
						renderer : showDetial('wb').renderer,
						dataIndex : "wbid"
					},{
						header : "优先级",
						width : 60,
						dataIndex : "gzkyxj"
					}, {
						header : "创建时间",
						width : 80,
						renderer : Ext.util.Format.dateRenderer("Y-m-d"),
						dataIndex : "createtime"
					}, {
						header : "工作板尺寸(mm)",
						flex : 1,
						renderer : function(v, m, r) {
							return r.data["gzbccx"] + "X" + r.data["gzbccy"];
						}
					},{
						header : "外层铜厚",
						width : 70,
						dataIndex : 'wcth'
					},{
						header : "层数",
						width : 60,
						dataIndex : 'cs'
					},{
						header :"工艺",
						width : 70,
						dataIndex : 'gy'
					},{
						header :"阻焊",
						width : 50,
						dataIndex : 'zhcolor'
					},{
						header :"文字",
						width : 50,
						dataIndex : 'fontcolor'
					},{
						header : "板厚",
						width : 50,
						dataIndex : 'bh'
					}, {
						header : "数量",
						flex : 1,
						dataIndex : 'num'
					}, {
						header : "未开料数量",
						flex : 1,
						dataIndex : 'wklnum'
					}, {
						header : "锁定人",
						width : 70,
						dataIndex : 'lockedPersonname'
					}, {
						header : "交货日期",
						renderer : Ext.util.Format.dateRenderer("Y-m-d"),
						flex : 1,
						dataIndex : 'jhrq'
					}, {
						header : "创建人",
						width : 70,
						dataIndex : 'creatorname'
					}, {
						header : "状态",
						width : 100,
						dataIndex : 'status',
						renderer : function(v) {
							for (var i in me.statusData) {
								if (v == me.statusData[i][0]) {
									return me.statusData[i][1];
								}
							}
						}
					}],

			tbar : [{
				xtype : "buttongroup",
				itemId : 'opbg',
				title : "操作",
				// height : 80,
				columns : 3,
				defaults : {
					scale : "small"
				},
				items : [{
					text : '审核',
					iconCls:"modify",
					handler : function(b) {
						var s = checkGridSelect(b.up("gridpanel"), 1);
						if (s) {
							//打开显示
							showDetial("wb").wb(s[0].get("wbid"));
						}
					}
				}]
			}, "->", {
				xtype : "searchbg",
				items : [{
					xtype : "combobox",
					store : this.statusData,
					fieldLabel : "状态",
					labelAlign : "right",
					labelWidth : 60,
					value : 2,
					name : "workBoardInfo.status"
				}, {
							xtype : 'idcombo',
							fieldLabel : '工作板编号',
							labelAlign : "right",
							labelWidth : 70,
							type : 3,
							flex : 1,
							name : 'workBoardInfo.wbid'
						},Pcbms.searchbtn("查询", storeid, 'small'), {
							xtype : "datefield",
							fieldLabel : "交货日期",
							labelAlign : "right",
							labelWidth : 60,
							name : "workBoardInfo.jhrq"
						}, {
							xtype : "idcombo",
							fieldLabel : "工程编号",
							labelAlign : "right",
							labelWidth : 60,
							type : 5,
							name : "workBoardInfo.bcbh"
						}]
			}],
			bbar : Ext.create("Ext.PagingToolbar", {
						store : this.store,
						displayInfo : true,
						beforePageText : "当前页",
						afterPageText : "总 {0} 页",
						displayMsg : "当前显示 {0} - {1} 条 一共 {2}条",
						emptyMsg : " 暂无信息"
					}),
			selModel : Ext.create("Ext.selection.CheckboxModel")

		});

		this.callParent();
	}
});