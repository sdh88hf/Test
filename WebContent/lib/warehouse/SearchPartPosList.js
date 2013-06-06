Ext.define("Pcbms.warehouse.SearchPartPosList", {
	extend : "Ext.grid.Panel",
	alias : "widget.ppgrid",
	initComponent : function() {
		var me = this;

		var storeid = me.storeid ? me.storeid : "ppListStore";
		me.store = Ext.create("Ext.data.Store", {
			model : "PartPos",
			storeId : storeid,
			proxy : Pcbms.ajaxProxy("/wareHouseManagementAction!searchPositions.action")
		});

		Ext.applyIf(me, {
			columns : [{
						header : "仓位编号",
						flex : 1,
						dataIndex : "cwbh"
					}, {
						header : "仓位容量",
						flex : 1,
						dataIndex : "capacity"
					}, {
						header : "空余容量",
						flex : 1,
						dataIndex : "kycapacity"
					}, {
						header : "默认仓位",
						flex : 1,
						dataIndex : "defaultkw",
						renderer : function(v){
							if(v=="0"){
								return "否";
							}else{
								return "是";
							}
						}
					}, {
						header : "备注",
						flex : 1,
						dataIndex : "desc"
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
					text : '修改',
					iconCls:"Modify",
					handler : function(b) {
						var s = checkGridSelect(b.up("gridpanel"), 1);
						if (s) {
							deferLoading(me);
							if (!me.updWindow) {
								me.updForm = Ext.create(
										"Pcbms.warehouse.UpdPartPosForm", {
											width : "100%",
											height : "100%"
										});
								me.updWindow = Ext.create("Ext.window.Window",
										{
											width : 400,
											height : 300,
											modal : true,
											layout : "fit",
											title : '仓位修改',
											closeAction : "hide",
											onClose : function() {
												me.store.load();
											},
											items : me.updForm
										});
							}
							
							
							me.updWindow.show();
							me.updForm.loadData(s[0].data['cwbh']);
						}

					}
				}, {
					text : '删除',
					iconCls:"delete",
					handler : function(b) {
						var s = checkGridSelect(b.up("gridpanel"), 1);
						if (s) {
							Ext.Msg.confirm("提示", "确定要删除选中项吗?", function(v) {
								if (v == "yes") {
									Ext.Ajax.request({
										url : "/wareHouseManagementAction!deletePosition.action?position.cwbh="
												+ s[0].get("cwbh"),
										success : new Pcbms.ajaxHandler({
											success : function(str) {
												Ext.Msg.alert("提示", str.msg);
												Ext.data.StoreManager
														.lookup(storeid).load();
											},
											error : function(r) {
												Ext.Msg.alert('出现错误', '原因 <'
																+ r.msg + ">");
											}
										})
									});

								}
							});

						}
					}
				}]
			}, "->", {
				xtype : "buttongroup",
				title : "查询",
				itemId : 'sbg',
				columns : 3,
				defaults : {
					scale : "larger"
				},
				items : [{
							xtype : "textfield",
							fieldLabel : "仓位编号",
							labelAlign : "right",
							labelWidth : 60,
							name : "position.cwbh"
						}, {
							xtype : 'textfield',
							fieldLabel : '仓位描述',
							labelAlign : "right",
							labelWidth : 60,
							flex : 1,
							name : "position.desc"
						}, Pcbms.searchbtn("查询", storeid, 'small')]
			}],
			bbar : Ext.create("Ext.PagingToolbar", {
						store : this.store,
						itemId : 'pagebar',
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