Ext.define("Pcbms.warehouse.SearchOutptList", {
	extend : "Ext.grid.Panel",
	alias : "widget.optgrid",
	statusData : [[0, "初始化"], [1, "完成"]],
	initComponent : function() {
		var storeid = "ostListStore";
		var me = this;
		me.store = Ext.create("Ext.data.Store", {
			fields : ['whvid', {
						name : 'num',
						type : 'int'
					}, {
						name : 'status',
						type : 'int'
					}, 'osInfo'],
			storeId : storeid,
			autoLoad : true,
			proxy : Pcbms.ajaxProxy("/wareHouseManagementAction!searchOSVouchers.action")
		});
		Ext.applyIf(me, {
			columns : [{
						header : "外包入库单编号",
						dataIndex : "whvid"
					}, {
						header : "状态",
						dataIndex : "status",
						renderer : function(v) {
							for (var i = 0; i < this.statusData.length; i++) {
								if (v == this.statusData[i][0]) {
									return this.statusData[i][1];
								}
							}
							return "异常状态";
						}
					}, {
						header : "备注",
						flex : 1,
						dataIndex : "osInfo"
					}],
			tbar : [{
				xtype : "buttongroup",
				title : "操作",
				columns : 3,
				defaults : {
					scale : "small"
				},
				items : [{
					text : '新增',
					iconCls:"add",
					handler : function(b) {
						var cct = Ext.create("Pcbms.view.createOutSourceing", {});
						Ext.create("Ext.window.Window", {
							title : '创建外包入库单',
							width : 500,
							height : 400,
							modal : true,
							layout : 'fit',
							items : [cct],
							buttons : [{
								text : '确定',
								handler : function(b) {
									var items = cct.store.data.items;
									var params = {};
									var insertFlag = false;
									for (var i = 0; i < items.length; i++) {
										insertFlag = true;
										var bcbh = items[i].data["bcbh"];
										var num = items[i].data["num"];
										if (Ext.String.trim(bcbh) == ""
												|| Ext.String.trim(num + "") == ""
												|| num < 0) {
											Ext.Msg.alert("提示", "第" + (i + 1)
															+ "行存在错误数据");
											return;
										}
										params["osc.osList[" + i + "].bcbh"] = bcbh;
										params["osc.osList[" + i + "].num"] = num;
									}
									params["osc.osInfo"] = cct.down("#note").getValue();
									if (insertFlag) {
										b.up("window").setLoading("正在加载中...");
										Ext.Ajax.trequest({
											url : "/wareHouseManagementAction!createOSVoucher.action",
											params : params,
											success : function(str) {
												Ext.Msg.alert(
														"成功提示",
														str.msg,function(){
															me.store.load();
														});
												b.up("window")
														.close();
											},
											error : function(r) {
												b
														.up("window")
														.setLoading(false);
												Ext.Msg
														.alert(
																'出现错误',
																'原因 <'
																		+ r.msg
																		+ ">");
											}
										});
									} else {
										Ext.Msg.alert("提示", "未添加任何数据");
									}
								}
							}]
						}).show();
					}
				}, {
					text : '入库',
					iconCls:"IntoWarehouse",
					handler : function(b) {
						var s = checkGridSelect(b.up("gridpanel"), 1);
						if (s) {
							Ext.createWidget("ostwindow", {
										whvid : s[0].data["whvid"]
									}).show();
						}
					}
				}, {
					text : '删除',
					iconCls:"delete",
					handler : function(b) {
						var me = this;
						var s = checkGridSelect(b.up("gridpanel"), 1);
						if (s) {
							Ext.Msg.confirm("提示", "确定要删除选中项吗?", function(v) {
								if (v == "yes") {
									Ext.Ajax.trequest({
										url : "/wareHouseManagementAction!deleteOSVouchers.action?ovIds="
												+ s[0].get("whvid"),
												success : function(str) {
													Ext.Msg.alert("提示", str.msg,function(){
														Ext.data.StoreManager
															.lookup(storeid).load();
														
													});
												}
									});

								}
							});

						}
					}
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