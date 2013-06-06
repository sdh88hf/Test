/**
 * 生产型号问题
 */
Ext
		.define(
				"Pcbms.product.PtProblemList",
				{
					extend : "Ext.grid.Panel",
					alias : "widget.ptproblemgrid",
					statusData : [ [ -1, "全部" ], [ 1, "待审核" ], [ 2, "已审核" ],
							[ 3, "已作废" ] ],
					initComponent : function() {
						var me = this;
						var storeid = me.storeId || "ptpListStore";
						me.store = Ext
								.create(
										"Ext.data.Store",
										{
											model : "ProjectFileProblem",
											storeId : storeid,
											proxy : Pcbms.ajaxProxy(
													"/ptProblemAction!searchProductProblemList.action")
										});
						Ext
								.applyIf(
										me,
										{
											columns : [
													{
														header : "工程编号",
														renderer : showDetial('pt').renderer,
														width : 80,
														dataIndex : "bcbh"
													},
													{
														header : "问题描述",
														flex : 1,
														dataIndex : "description"
													},
													{
														header : "状态",
														width : 50,
														dataIndex : "status",
														renderer : function(v) {
															for ( var i = 0; i < this.statusData.length; i++) {

																if (v == this.statusData[i][0]) {
																	return this.statusData[i][1];
																}
															}

															return "异常状态";
														}
													},
													{
														header : "创建日期",
														dataIndex : "createtime",
														width : 90,
														renderer : Ext.util.Format
																.dateRenderer("m-d H:i")
													},
													{
														header : "创建人",
														width : 80,
														dataIndex : "creatorname",
														renderer : function(v,
																m, r) {
															if (v != null
																	&& v != "") {
																return "<a href='javascript:downFile(\"/downloadAction!downloadBCBHDataFile.action?bcbh="
																		+ r.data["bcbh"]
																		+ "\");' title='工程文件下载!'>"
																		+ v
																		+ "</a>";
															}
															return "<span style=\"color:red\">暂未处理</span>"
														}
													},
													{
														header : "审核人",
														width : 80,
														dataIndex : "validatorname"
													},
													{
														header : "审核时间",
														width : 90,
														renderer : Ext.util.Format
																.dateRenderer("m-d H:i"),
														dataIndex : "validatetime"
													} ],
											tbar : [
													{
														xtype : "buttongroup",
														itemId : 'opbg',
														title : "操作",
														columns : 4,
														defaults : {
															scale : "small"
														},
														items : [
																{
																	text : '审批',
																	iconCls : "accept",
																	itemId : 'unlockbtn',
																	handler : function(
																			b,
																			can) {
																		var s = checkGridSelect(
																				b
																						.up("gridpanel"),
																				1);
																		if (s) {
																			Ext.Msg
																					.confirm(
																							"提示",
																							"确定要允许本次的覆盖?",
																							function(
																									v) {
																								if (v == "yes") {
																									var params = {
																										'projectfileproblem.bcbh' : s[0]
																												.get("bcbh"),
																										'projectfileproblem.status' : 2
																									};
																									Ext.Ajax
																											.request({
																												url : "/ptProblemAction!copyfile.action",
																												params : params,
																												success : new Pcbms.ajaxHandler(
																														{
																															success : function(
																																	str) {
																																Ext.Msg
																																		.alert(
																																				"提示",
																																				str.msg);
																																Ext.data.StoreManager
																																		.lookup(
																																				storeid)
																																		.load();
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

																		}
																	}
																},
																{
																	text : '作废',
																	iconCls : "invalid",
																	handler : function(
																			b) {
																		var s = checkGridSelect(
																				b
																						.up("gridpanel"),
																				1);
																		if (s) {
																			Ext.Msg
																					.confirm(
																							"提示",
																							"确定要作废本次的覆盖?",
																							function(
																									v) {
																								if (v == "yes") {
																									var params = {
																										'projectfileproblem.bcbh' : s[0]
																												.get("bcbh"),
																										'projectfileproblem.status' : 3
																									};
																									Ext.Ajax
																											.request({
																												url : "/ptProblemAction!copyfile.action",
																												params : params,
																												success : new Pcbms.ajaxHandler(
																														{
																															success : function(
																																	str) {
																																Ext.Msg
																																		.alert(
																																				"提示",
																																				str.msg);
																																Ext.data.StoreManager
																																		.lookup(
																																				storeid)
																																		.load();
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
																		}
																	}
																},
																{
																	text : '原客户文件',
																	iconCls : "projectfile",
																	handler : function(
																			b) {
																		var s = checkGridSelect(
																				b
																						.up("gridpanel"),
																				1);
																		if (s) {
																			downFile("downloadAction!downloadClientDataFile.action?bcbh="
																					+ s[0]
																							.get("bcbh"));
																		}
																	}
																},
																{
																	text : '新工程文件',
																	iconCls : "projectfile",
																	handler : function(
																			b) {
																		var s = checkGridSelect(
																				b
																						.up("gridpanel"),
																				1);
																		if (s) {
																			downFile("downloadAction!downloadNEWBCBHDataFile.action?bcbh="
																					+ s[0]
																							.get("bcbh"));
																		}
																	}
																} ]
													},
													"->",
													{
														xtype : "searchbg",
														items : [
																{
																	xtype : "combobox",
																	store : this.statusData,
																	fieldLabel : "问题状态",
																	value : -1,
																	labelAlign : "right",
																	labelWidth : 60,
																	name : "projectfileproblem.status"
																},
																{
																	xtype : "idcombo",
																	fieldLabel : "工程编号",
																	labelAlign : "right",
																	labelWidth : 60,
																	type : 5,
																	name : "projectfileproblem.bcbh"
																},
																Pcbms
																		.searchbtn(
																				"查询",
																				storeid,
																				'small'),
																{
																	xtype : "datefield",
																	fieldLabel : "起始时间",
																	labelAlign : "right",
																	labelWidth : 60,
																	name : "start"
																},
																{
																	xtype : "datefield",
																	store : this.statusData,
																	fieldLabel : "截至时间",
																	labelAlign : "right",
																	labelWidth : 60,
																	name : "end"
																} ]
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