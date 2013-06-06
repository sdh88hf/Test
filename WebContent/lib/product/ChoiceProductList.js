Ext
		.define(
				"Pcbms.product.ChoiceProductList",
				{
					extend : "Ext.grid.Panel",
					alias : "widget.ccpgrid",
					productData : [ [ 0, "作废" ], [ 1, "生效" ], [ 2, "支付完成" ] ],
					wbData : [ [ 0, "作废" ], [ 1, "生效" ] ],
					lotData : [ [ -1, "全部" ], [ 0, "初始化" ], [ 1, "工序" ] ],
					mtData : [ [ 0, "作废" ], [ 1, "生效" ] ],
					mttData : [ [ 0, "作废" ], [ 1, "生效" ] ],
					cp : function(grid, rowIndex) {
						var rec = grid.getStore().getAt(rowIndex);

						Ext.Msg
								.confirm(
										"提示",
										"确定要作废该产品吗?",
										function(v) {
											if (v == "yes") {
												Ext.Ajax
														.request({
															url : "/cancelAction!cancelProduct.action?prodId="
																	+ rec
																			.get("prodId"),
															success : new Pcbms.ajaxHandler(
																	{
																		success : function(
																				str) {
																			grid
																					.getStore()
																					.removeAt(
																							rowIndex);
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
										});

					},
					cl : function(grid, rowIndex) {
						var rec = grid.getStore().getAt(rowIndex);

						Ext.Msg
								.confirm(
										"提示",
										"确定要作废该管制卡吗?",
										function(v) {
											if (v == "yes") {
												Ext.Ajax
														.request({
															url : "/cancelAction!cancelLotcard.action?lotids="
																	+ rec
																			.get("lotid"),
															success : new Pcbms.ajaxHandler(
																	{
																		success : function(
																				str) {
																			grid
																					.getStore()
																					.removeAt(
																							rowIndex);
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
										});

					},
					cm : function(grid, rowIndex) {
						var rec = grid.getStore().getAt(rowIndex);

						Ext.Msg
								.confirm(
										"提示",
										"确定要作废该开料单吗?",
										function(v) {
											if (v == "yes") {
												Ext.Ajax
														.request({
															url : "/cancelAction!cancelMaterialTicket.action?mid="
																	+ rec
																			.get("mid"),
															success : new Pcbms.ajaxHandler(
																	{
																		success : function(
																				str) {
																			grid
																					.getStore()
																					.removeAt(
																							rowIndex);
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
										});

					},
					ct : function(grid, rowIndex) {
						var rec = grid.getStore().getAt(rowIndex);

						Ext.Msg
								.confirm(
										"提示",
										"确定要作废该开料单吗?",
										function(v) {
											if (v == "yes") {
												Ext.Ajax
														.request({
															url : "/cancelAction!cancelMTTicket.action?mtid="
																	+ rec
																			.get("mtid"),
															success : new Pcbms.ajaxHandler(
																	{
																		success : function(
																				str) {
																			grid
																					.getStore()
																					.removeAt(
																							rowIndex);
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
										});

					},
					cw : function(grid, rowIndex) {
						var rec = grid.getStore().getAt(rowIndex);

						Ext.Msg
								.confirm(
										"提示",
										"确定要作废该工作板吗?",
										function(v) {
											if (v == "yes") {
												Ext.Ajax
														.request({
															url : "/cancelAction!cancelWorkBorad.action?wbid="
																	+ rec
																			.get("wbid"),
															success : new Pcbms.ajaxHandler(
																	{
																		success : function(
																				str) {
																			grid
																					.getStore()
																					.removeAt(
																							rowIndex);
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
										});

					},
					initComponent : function() {
						var storeid = "cancelListStore";
						var me = this;

						me.store = Ext
								.create(
										"Ext.data.Store",
										{
											model : "Product",
											storeId : storeid,
											proxy : Pcbms
													.ajaxProxy({
														url : "/cancelAction!searchProductListByBcbh.action",
														reader : {
															type : 'json',
															root : 'productList',
															totalProperty : 'count'
														}
													})
										});

						Ext
								.applyIf(
										me,
										{
											columns : [
													{
														header : "工程编号",
														renderer : showDetial('pt').renderer,
														flex : 1,
														dataIndex : "bcbh"
													},
													{
														header : "状态",
														flex : 1,
														dataIndex : "status",
														renderer : function(v) {
															for ( var i = 0; i < me.productData.length; i++) {
																if (v == me.productData[i][0]) {
																	return me.productData[i][1];
																}
															}
															return "异常状态";
														}
													},
													{
														header : "客户编号",
														flex : 1,
														dataIndex : "clientid"
													},
													{
														header : "合同编号",
														flex : 1,
														renderer : showDetial('ct').renderer,
														dataIndex : "contractid"
													},
													{
														header : "交货日期",
														flex : 1,
														renderer : Ext.util.Format
																.dateRenderer("Y-m-d"),
														dataIndex : "jhrq"
													},
													{
														header : "数量",
														dataIndex : "num",
														flex : 1
													},
													{
														header : "锁定人",
														dataIndex : "lockedPersonname",
														flex : 1
													} ],

											tbar : [
													{
														xtype : "buttongroup",
														itemId : 'opbg',
														title : "操作",
														// height : 80,
														columns : 3,
														defaults : {
															scale : "small"
														},
														items : [ {
															text : '作废管理',
															iconCls : "delete",
															handler : function(
																	b) {
																var s = checkGridSelect(
																		b
																				.up("gridpanel"),
																		1);
																if (s) {

																	Ext.Ajax
																			.trequest({
																				url : "/cancelAction!searchCancelMapByProductid.action?prodId="
																						+ s[0]
																								.get("prodId"),
																				success : function(
																						str) {

																					var productStore = Ext
																							.create(
																									"Ext.data.Store",
																									{
																										fields : [
																												'prodId',
																												'bcbh',
																												{
																													name : 'status',
																													type : 'int'
																												},
																												{
																													name : 'wzgzbnum',
																													type : 'int'
																												},
																												{
																													name : 'wcnum',
																													type : 'int'
																												} ]

																									});

																					var lotStore = Ext
																							.create(
																									"Ext.data.Store",
																									{
																										fields : [
																												'lotid',
																												'stepname',
																												{
																													name : 'percentage',
																													type : 'float'
																												},
																												{
																													name : 'totalarea',
																													type : 'float'
																												} ]

																									});

																					var mtStore = Ext
																							.create(
																									"Ext.data.Store",
																									{
																										fields : [
																												'mid',
																												'stepname',
																												{
																													name : 'percentage',
																													type : 'float'
																												},
																												{
																													name : 'totalarea',
																													type : 'float'
																												} ]

																									});

																					var ttStore = Ext
																							.create(
																									"Ext.data.Store",
																									{
																										fields : [
																												'mtid',
																												'stepname',
																												{
																													name : 'percentage',
																													type : 'float'
																												},
																												{
																													name : 'wklarea',
																													type : 'float'
																												},
																												{
																													name : 'yklarea',
																													type : 'float'
																												} ]

																									});

																					var wbStore = Ext
																							.create(
																									"Ext.data.Store",
																									{
																										fields : [
																												'mtid',
																												{
																													name : 'status',
																													type : 'int'
																												},
																												{
																													name : 'percentage',
																													type : 'float'
																												},
																												{
																													name : 'wklarea',
																													type : 'float'
																												},
																												{
																													name : 'yklarea',
																													type : 'float'
																												} ]

																									});

																					productStore
																							.insert(
																									0,
																									str.cancelMap["产品信息"]);

																					lotStore
																							.insert(
																									0,
																									str.cancelMap["管制卡信息"]);

																					mtStore
																							.insert(
																									0,
																									str.cancelMap["开料单信息"]);
																					ttStore
																							.insert(
																									0,
																									str.cancelMap["开料模板单信息"]);
																					wbStore
																							.insert(
																									0,
																									str.cancelMap["工作板信息"]);

																					me.cancelWindow = Ext
																							.create(
																									"Ext.window.Window",
																									{
																										width : 900,
																										height : 500,
																										autoScroll : true,
																										title : '产品作废管理',
																										autoScroll : true,
																										modal : true,
																										layout : 'auto',
																										items : [ {
																											xtype : 'tabpanel',
																											items : [
																													{
																														xtype : 'grid',
																														title : '该产品',
																														store : productStore,
																														columns : [
																																{
																																	header : "工程编号",
																																	flex : 1,
																																	dataIndex : "bcbh"
																																},
																																{
																																	header : "状态",
																																	flex : 1,
																																	dataIndex : "status",
																																	renderer : function(
																																			v) {
																																		for ( var i = 0; i < me.productData.length; i++) {

																																			if (v == me.productData[i][0]) {
																																				return me.productData[i][1];
																																			}
																																		}

																																		return "异常状态";
																																	}
																																},
																																{
																																	header : "未组工作板数量",
																																	flex : 1,
																																	dataIndex : "wzgzbnum"
																																},
																																{
																																	header : "完成数量",
																																	flex : 1,
																																	dataIndex : "wcnum"
																																},
																																{
																																	xtype : 'actioncolumn',
																																	header : "作废",
																																	flex : 1,
																																	items : [ {
																																		icon : "icons/cancel.png",
																																		handler : me.cp
																																	} ]
																																} ]
																													},
																													{
																														xtype : 'grid',
																														title : '该产品关联的管制卡',
																														store : lotStore,
																														columns : [
																																{
																																	header : "管制卡编号",
																																	flex : 1,
																																	dataIndex : "lotid"
																																},
																																{
																																	header : "当前工序",
																																	flex : 1,
																																	dataIndex : "stepname"
																																},
																																{
																																	header : "产品占总面积%",
																																	flex : 1,
																																	dataIndex : "percentage"
																																},
																																{
																																	header : "总面积",
																																	flex : 1,
																																	dataIndex : "totalarea"
																																},
																																{
																																	header : "状态",
																																	flex : 1,
																																	dataIndex : "status",
																																	renderer : function(
																																			v) {
																																		for ( var i = 0; i < me.lotData.length; i++) {

																																			if (v == me.lotData[i][0]) {
																																				return me.lotData[i][1];
																																			}
																																		}

																																		return "异常状态";
																																	}
																																},
																																{
																																	xtype : 'actioncolumn',
																																	header : "作废",
																																	flex : 1,
																																	items : [ {
																																		icon : "icons/cancel.png",
																																		handler : me.cl
																																	} ]
																																} ]
																													},
																													{
																														xtype : 'grid',
																														title : '该产品关联的开料单',
																														store : mtStore,
																														columns : [
																																{
																																	header : "开料单编号",
																																	flex : 1,
																																	dataIndex : "mid"
																																},
																																{
																																	header : "当前工序",
																																	flex : 1,
																																	dataIndex : "stepname"
																																},
																																{
																																	header : "产品占总面积%",
																																	flex : 1,
																																	dataIndex : "percentage"
																																},
																																{
																																	header : "总面积",
																																	flex : 1,
																																	dataIndex : "totalarea"
																																},
																																{
																																	header : "状态",
																																	flex : 1,
																																	dataIndex : "status",
																																	renderer : function(
																																			v) {
																																		for ( var i = 0; i < me.mtData.length; i++) {

																																			if (v == me.mtData[i][0]) {
																																				return me.mtData[i][1];
																																			}
																																		}

																																		return "异常状态";
																																	}
																																},
																																{
																																	xtype : 'actioncolumn',
																																	header : "作废",
																																	flex : 1,
																																	items : [ {
																																		icon : "icons/cancel.png",
																																		handler : me.cm
																																	} ]
																																} ]
																													},
																													{
																														xtype : 'grid',
																														title : '该产品关联的开料模板单',
																														store : ttStore,
																														columns : [
																																{
																																	header : "开料模板单编号",
																																	flex : 1,
																																	dataIndex : "mtid"
																																},
																																{
																																	header : "当前进度",
																																	flex : 1,
																																	dataIndex : "stepname"
																																},
																																{
																																	header : "产品占总面积%",
																																	flex : 1,
																																	dataIndex : "percentage"
																																},
																																{
																																	header : "未开料面",
																																	flex : 1,
																																	dataIndex : "wklarea"
																																},
																																{
																																	header : "已开料面",
																																	flex : 1,
																																	dataIndex : "yklarea"
																																},
																																{
																																	header : "状态",
																																	flex : 1,
																																	dataIndex : "status",
																																	renderer : function(
																																			v) {
																																		for ( var i = 0; i < me.mttData.length; i++) {

																																			if (v == me.mttData[i][0]) {
																																				return me.mttData[i][1];
																																			}
																																		}

																																		return "异常状态";
																																	}
																																},
																																{
																																	xtype : 'actioncolumn',
																																	header : "作废",
																																	flex : 1,
																																	items : [ {
																																		icon : "icons/cancel.png",
																																		handler : me.ct
																																	} ]
																																} ]
																													},
																													{
																														xtype : 'grid',
																														title : '该产品关联的工作板',
																														store : wbStore,
																														columns : [
																																{
																																	header : "工作板编号",
																																	flex : 1,
																																	dataIndex : "wbid"
																																},
																																{
																																	header : "状态",
																																	flex : 1,
																																	dataIndex : "status",
																																	renderer : function(
																																			v) {
																																		for ( var i in me.wbData) {
																																			if (v == me.wbData[i][0]) {
																																				return me.wbData[i][1];
																																			}
																																		}
																																	}
																																},
																																{
																																	header : "产品占总面积%",
																																	flex : 1,
																																	dataIndex : "percentage"
																																},
																																{
																																	header : "未开料面",
																																	flex : 1,
																																	dataIndex : "wklarea"
																																},
																																{
																																	header : "已开料面",
																																	flex : 1,
																																	dataIndex : "yklarea"
																																},
																																{
																																	xtype : 'actioncolumn',
																																	header : "作废",
																																	flex : 1,
																																	items : [ {
																																		icon : "icons/cancel.png",
																																		handler : me.cw
																																	} ]
																																} ]
																													}

																											]
																										}

																										]
																									})
																							.show();

																				}
																			});

																}
															}
														} ]
													},
													"->",
													{
														xtype : "buttongroup",
														title : "查询",
														columns : 5,
														defaults : {
															scale : "larger"
														},
														items : [
																{
																	xtype : "textfield",
																	fieldLabel : "工程编号",
																	labelAlign : "right",
																	labelWidth : 60,
																	name : "bcbh"
																},
																Pcbms
																		.searchbtn(
																				"查询",
																				storeid,
																				'small') ]
													} ],
											bbar : Ext
													.create(
															"Ext.PagingToolbar",
															{
																store : this.store,
																displayInfo : true,
																beforePageText : "当前页",
																afterPageText : "总 {0} 页",
																displayMsg : "当前显示 {0} - {1} 条 一共 {2}条",
																emptyMsg : " 暂无信息"
															}),
											selModel : Ext
													.create("Ext.selection.CheckboxModel")

										});

						this.callParent();
					}
				});