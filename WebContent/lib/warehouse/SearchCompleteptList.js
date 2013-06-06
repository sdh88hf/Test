Ext
		.define(
				"Pcbms.warehouse.SearchCompleteptList",
				{
					extend : "Ext.grid.Panel",
					alias : "widget.cptgrid",
					statusData : [ [ 0, "初始化" ], [ 1, "完成" ] ],
					initComponent : function() {
						var storeid = "cptListStore";
						var me = this;
						me.listeners = {
							'itemdblclick' : function(e, r) {
								if (!me.infoWindow) {
									me.infoWindow = Ext.create(
											"Pcbms.view.productInPart", {
												target : this
											});
								}
								me.infoWindow.dataLoad(r);
								me.infoWindow.show();
							}
						};
						 me.features = [Ext.create('Ext.grid.feature.Grouping',{
							 hideGroupedHeader : true,
							 groupHeaderTpl:"{name}"
						})];
						me.store = Ext.create("Ext.data.Store", {
							model : "Completept",
							storeId : storeid,
							autoLoad : true,
							groupField: 'whvid',
							proxy : Pcbms.ajaxProxy({
									url : "/stockAction!searchEPVouchers.action",
									reader : {
										type : 'json',
										root : 'endBeanList',
										totalProperty : 'count'
									}})
						});
						me.selectionchange = function(r) {
							var s = r.getSelection();
							if (s.length == 0) {
								return;
							}
							var rid = s[0].get("whvid");
							this.removeListener("selectionchange",
									me.selectionchange);
							var ss = [];
							var us = [];
							r.store.each(function(r) {
								if (r.get("whvid") == rid) {
									ss.push(r);
								} else {
									us.push(r);
								}
							});
							this.select(ss);
							this.deselect(us);
							this.addListener("selectionchange",
									me.selectionchange);
						};
						Ext
								.applyIf(
										me,
										
										{
											selModel : Ext
													.create(
															"Ext.selection.CheckboxModel",
															{
																allowDeselect : false,
																listeners : {
																	selectionchange : me.selectionchange
																}
															}),
											columns : [
													{
														header : "入库单号",
														dataIndex : "whvid",
														width : 120
													},
													{
														header : "工程编号",
														dataIndex : "bcbh",
														width : 120
													},
													{
														header : "文件名称",
														dataIndex : "projectName",
														width : 120
													},

													{
														header : "SET尺寸",
														flex : 1,
														renderer : function(v,
																m, r) {
															return r.data["setx"]
																	+ "*"
																	+ r.data["sety"]
																	+ " mm";
														}
													},
													{
														header : "SET拼",
														width : 70,
														dataIndex : "setps"
													},
													{
														header : "入库数量",
														width : 70,
														dataIndex : "rknum"
													},
													{
														header : "确认数量",
														width : 70,
														dataIndex : "sjnum"
													},
													{
														header : "存放库位",
														width : 170,
														renderer : function(v,
																m, r) {
															if (r.data["cwinfo"]
																	&& r.data["cwinfo"].length > 0) {
																var str = "";
																for ( var i = 0; i < r.data["cwinfo"].length; i++) {
																	var item = r.data["cwinfo"][i];
																	str += item['cwname']
																			+ "("
																			+ item['num']
																			+ ")";
																	if (i != r.data["cwinfo"].length - 1) {
																		str += ",";
																	}
																}
																return str;
															} else {
																return "默认仓位";
															}
														}
													}, {
														header : "备注信息",
														flex : 1,
														dataIndex : "note"
													} ],
											tbar : [
													{
														xtype : "buttongroup",
														title : "操作",
														columns : 3,
														defaults : {
															scale : "small"
														},
														items : [
																{
																	text : '删除',
																	iconCls : "delete",
																	handler : function(
																			b) {
																		var me = this;
																		var s = checkGridSelect(
																				b
																						.up("gridpanel"),
																				2);
																		if (s) {
																			var epIds = new Array();
																			for ( var i = 0; i < s.length; i += 1) {
																				epIds
																						.push(s[i]
																								.get("whvid"));
																			}
																			Ext.Msg
																					.confirm(
																							"提示",
																							"确定要删除选中项吗?",
																							function(
																									v) {
																								if (v == "yes") {
																									Ext.Ajax
																											.request({
																												url : "/wareHouseManagementAction!deleteEPVoucher.action?",
																												params : {
																													epIds : epIds
																												},
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
																} ]
													},
													"->",
													{
														xtype : "buttongroup",
														title : "查询",
														itemId : 'sbg',
														columns : 3,
														defaults : {
															scale : "larger"
														},
														items : [
																{
																	xtype : "textfield",
																	fieldLabel : "编号输入",
																	labelAlign : "right",
																	labelWidth : 75,
																	enableKeyEvents : true,
																	listeners : {
																		keyup : function(
																				b) {
																			var value = b
																					.getValue();
																			if (value == "") {
																				return b
																						.up("grid").store
																						.clearFilter();
																			}
																			b
																					.up("grid").store
																					.filterBy(function(
																							r) {
																						
																						return r
																								.get(
																										"bcbh")
																								.indexOf(
																										value) != -1
																								|| r
																										.get(
																												"projectName")
																										.indexOf(
																												value) != -1;
																					});
																		}
																	}
																},
																{
																	xtype : "button",
																	text : "刷新",
																	scale : "small",
																	iconCls : "searchsmall",
																	handler : function(
																			b) {
																		var proxy = b.up("grid").store.getProxy();
																		proxy.extraParams = {};
																		proxy.url = '/stockAction!searchEPVouchers.action';
																		b.up("grid").store.load();
																	}
																} ]
													} ],
											buttons : [ {
												xtype : "button",
												scale : "small",
												text : "确认入库",
												iconCls : "IntoWarehouse",
												handler : function(bu) {
													var grid = bu.up("grid");
													var s = grid.getSelectionModel().getSelection();
													if(s.length == 0){
														Ext.Msg.alert("选择错误!","请选择需要入库的内容!");
														return;
													}
													var rid = s[0].get("whvid");
													var ss = [];
													grid.store.each(function(r) {
														if (r.get("whvid") == rid) {
															console.log(r.get("inputed"));
																if(!r.get("inputed")){
																	ss.error = true;
																	return;
																}
															ss.push(r);
														}
													});
													if(ss.error){
														Ext.Msg.alert("入库出错!","请检查你的入库数量!");
														return;
													}
													
													//按什么发送然后显示成功
													Ext.Msg.confirm("提示", "确定要入库吗?", function(v) {
														if (v == 'no')
															return;
														var params = {"endbean.whvid":rid};
														for (var i = 0; i < ss.length; i++) {
															var item = ss[i].data;
															params["endBeanList[" + i + "].bcbh"] = item["bcbh"];
															params["endBeanList[" + i + "].num"] = item["sjnum"];
															params["endBeanList[" + i + "].note"] = item["note"];
															params["endBeanList[" + i + "].pid"] = item["pid"];
															var ci = item["cwinfo"];
															if (ci && ci.length > 0) {
																for (var j = 0; j < ci.length; j++) {
																	params["endBeanList[" + i + "].whpList[" + j
																			+ "].cwbh"] = ci[j]["cwname"];
																	params["endBeanList[" + i + "].whpList[" + j
																			+ "].sycapacity"] = ci[j]["num"];
																}
															}
														}
														var proxy = bu.up("grid").store.getProxy();
														proxy.extraParams = params;
														proxy.url = '/stockAction!storeEndProducts.action';
														bu.up("grid").store.load();
													});
												}
											} ]
										});
						this.callParent();
					}
				});