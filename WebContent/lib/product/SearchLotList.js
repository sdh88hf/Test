Ext.define("Pcbms.product.SearchLotList", {
	extend : "Ext.grid.Panel",
	alias : "widget.lotgrid",
	initComponent : function() {
		var me = this;

		var storeid = me.storeid ? me.storeid : "lotListStore";

		me.store = Ext.create("Ext.data.Store", {
					fields : ['lotid', 'wbid', 'stepname'],
					storeId : storeid,
					proxy : Pcbms.ajaxProxy({url:"/outSourcingAction!searchLotcard.action", reader:{
								type : 'json',
								root : 'listLotcard',
								totalProperty : 'count'
							}})
				});

		Ext.applyIf(me, {
			columns : [{
						header : "管制卡编号",
						flex : 1,
						dataIndex : "lotid"
					}, {
						header : "工作板编号",
						flex : 1,
						dataIndex : "wbid"
					}, {
						header : "当前工序",
						dataIndex : "stepname",
						flex : 1
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
					text : '选择工序',
					iconCls:"Selectprocesses",
					handler : function(b) {
						var s = checkGridSelect(b.up("gridpanel"), 2);
						if (s) {

							if (!me.againWindow) {
								me.againForm = Ext.create("Ext.form.Panel", {
											items : [{
														"xtype" : "checkboxgroup",
														"fieldLabel" : "工序选择",
														"columns" : 3,
														itemId : 'step',
														"items" : []
													}]
										});

								me.againWindow = Ext.create(
										"Ext.window.Window", {
											title : "选择工序",
											items : me.againForm,
											layout : "fit",
											closeAction : 'hide',
											modal : true,
											width : 400,
											height : 200,
											buttons : [{
												text : '确定',
												handler : function() {

													var lotids = [];

													var stepids = [];

													for (var k in me.againForm
															.down("#step")
															.getValue()) {

														stepids
																.push(me.againForm
																		.down("#step")
																		.getValue()[k]);
													}

													for (var i = 0; i < s.length; i++) {

														lotids
																.push(s[i].data["lotid"]);
													}

													Ext.Ajax.request({
														url : "/outSourcingAction!updateLotcardOutsouring.action",
														params : {
															lotids : lotids,
															stepids : stepids
														},
														success : new Pcbms.ajaxHandler(
																{
																	success : function(
																			str) {
																		Ext.Msg
																				.alert(
																						"提示",
																						str.msg);
																		me.againWindow
																				.close();
																	},
																	error : function(
																			r) {
																		Ext.Msg
																				.alert(
																						'出现错误',
																						'原因 <'
																								+ r.msg
																								+ ">");
																	}
																})
													});

												}
											}]
										});

							}

							me.againWindow.show();

							Ext.Ajax.trequest({
								url : "/stepManagementAction!searchAllDisplayStepList.action",
								success : new Pcbms.ajaxHandler({
									success : function(str) {
										for (var i = 0; i < str.stepList.length; i++) {
											var step = str.stepList[i];

											me.againForm.down("#step").add({
														boxLabel : step["stepname"],
														inputValue : step["stepid"]
													});

										}
									},
									failure : function(r) {
										Ext.Msg.alert('出现错误', '原因 <' + r.msg
														+ ">");
									}
								})
							});

						}
					}
				}]
			}, "->", {
				xtype : "buttongroup",
				title : "查询",
				columns : 2,
				defaults : {
					scale : "larger"
				},
				items : [{
							xtype : "textfield",
							fieldLabel : "管制卡编号",
							labelAlign : "right",
							labelWidth : 70,
							name : "lotid"
						}, Pcbms.searchbtn("查询", storeid, 'small')]
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