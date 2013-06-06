Ext
		.define(
				"Pcbms.view.choiceMaterTicket",
				{
					extend : "Ext.grid.Panel",
					alias : "widget.cmtgrid",
					initComponent : function() {
						var me = this;

						var storeid = me.storeid ? me.storeid : "cmtListStore";

						me.store = Ext.create("Ext.data.Store", {
							model : "MaterTicket",
							storeId : storeid,
							autoLoad : true,
							proxy : Pcbms.ajaxProxy(
									"/produceProcessManagementAction!searchProduceProcessList.action?stepid="
											+ me.stepid)
						});
						Ext
								.applyIf(
										me,
										{
											columns : [
													{
														header : "开料单编号",
														width : 70,
														dataIndex : "mid"
													},
													{
														header : "A板信息",
														flex : 1,
														renderer : function(v,
																m, r) {
															return r.data["awbid"]
																	+ "/"
																	+ r.data["anum"];
														}
													},
													{
														header : "B板信息",
														flex : 1,
														renderer : function(v,
																m, r) {
															return r.data["bwbid"]
																	+ "/"
																	+ r.data["bnum"];
														}
													},
													{
														header : "C板信息",
														flex : 1,
														renderer : function(v,
																m, r) {
															return r.data["cwbid"]
																	+ "/"
																	+ r.data["cnum"];
														}
													},{
														header : "板材",
														width : 60,
														dataIndex : "bccl"
													},
													{
														header : "板厚",
														width : 60,
														dataIndex : "bh"
													},
													{
														header : "板材型号",
														width : 70,
														dataIndex : "bcxh"
													},
													{
														header : "投料人",
														width : 70,
														dataIndex : "tlperson"
													},
													{
														header : "投料时间",
														flex : 1,
														dataIndex : "tltime",
														renderer : Ext.util.Format
																.dateRenderer("m-d H:i"),
													},
													{
														header : "总原料数量",
														width : 60,
														dataIndex : "tlnum"
													},
													{
														header : "总原料面积",
														flex : 1,
														dataIndex : "ztlmj"
													},
													{
														header : "总余料面积",
														flex : 1,
														dataIndex : "ylmj"
													},
													{
														header : "领料人",
														width : 70,
														dataIndex : "lyperson"
													},
													{
														header : "领料时间",
														flex : 1,
														dataIndex : "lytime",
														renderer : Ext.util.Format
																.dateRenderer("m-d H:i")
													}, {
														header : "状态",
														width : 60,
														dataIndex : 'stepname'
													} ],

											tbar : [ {
												xtype : "buttongroup",
												itemId : 'opbg',
												title : "操作",
												columns : 4,
												defaults : {
													scale : "small"
												},
												items : [ {
													text : '转一下道工序',
													iconCls : "next",
													handler : function(b) {
														var s = checkGridSelect(
																b
																		.up("gridpanel"),
																1);
														if (s) {

															Ext.Msg
																	.confirm(
																			"提示",
																			"确定要转下一道工序吗?",
																			function(
																					v) {
																				if (v == 'no')
																					return;
																				Ext.Ajax
																						.trequest({
																							url : "/produceProcessManagementAction!toNextStep.action?mid="
																									+ s[0]
																											.get("mid")
																									+ "&stepid="
																									+ me.stepid,
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
																									}
																						});

																			});
														}
													}
												} ]
											} ],
											bbar : Ext
													.create(
															"Ext.PagingToolbar",
															{
																store : this.store,
																itemId : 'pagebar',
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

Ext
		.define(
				"Pcbms.product.PrintPack",
				{
					extend : "Ext.window.Window",
					alias : "widget.ppwindow",
					width : 300,
					height : 200,
					modal : true,
					bodyPadding : 10,
					load : function() {
						var me = this;

						Ext.Ajax
								.trequest({
									url : "/produceProcessManagementAction!searchBCBHInStep.action?lotid="
											+ me.lotid + "&stepid=" + me.stepid,
									async : false,
									success : function(str) {
										for ( var i = 0; i < str.bcbhs.length; i++) {
											me.items[0].store.push([
													str.bcbhs[i].num,
													str.bcbhs[i].bcbh ]);
										}
									}
								});

					},
					initComponent : function() {
						var me = this;
						Ext.applyIf(me, {
							items : [ {
								xtype : 'combobox',
								fieldLabel : '工程编号',
								displayField : 'name',
								valueField : 'value',
								editable : false,
								allowBlank : false,
								itemId : 'bcbh',
								onChange : function(e, n, o) {
									me.down("#num").setValue(e);
								},
								store : []
							}, {
								xtype : 'numberfield',
								fieldLabel : '产品总数量',
								itemId : 'num'
							}, {
								xtype : 'numberfield',
								allowBlank : false,
								itemId : 'bznum',
								fieldLabel : '包装数量'
							}, {
								xtype : 'numberfield',
								allowBlank : false,
								itemId : 'dynum',
								fieldLabel : '打印数量'
							} ],
							buttons : [ {
								text : '确定',
								handler : function() {
									if (me.down("#bcbh").isValid()
											&& me.down("#bznum").isValid()
											&& me.down("#dynum").isValid()) {

										var bznum = me.down("#bznum")
												.getValue();
										var copies = [];

										for ( var i = 0; i < me.down("#dynum")
												.getValue(); i++) {
											copies.push(bznum);
										}

										tpmsprinter.print("certification", {
											bcbh : me.down("#bcbh").rawValue,
											copies : copies
										});

									}

								}
							} ]
						});

						me.title = "管制卡" + me.lotid + "打印包装标签";

						me.load();

						this.callParent();
					}
				});

Ext.define("Pcbms.view.createCompletet", {
	extend : "Ext.grid.Panel",
	alias : "widget.ccpttgrid",
	initComponent : function() {
		var me = this;
		var storeid = me.storeid ? me.storeid : "ccpttListStore";
		me.store = Ext.create("Ext.data.Store", {
			fields : [ 'bcbh', 'num' ],
			storeId : storeid,
			store : []
		});
		me.cellEditing = Ext.create('Ext.grid.plugin.CellEditing', {
			clicksToEdit : 2
		});
		me.plugins = [ me.cellEditing ];
		Ext.applyIf(me, {
			columns : [ {
				header : "工程编号",
				flex : 1,
				dataIndex : "bcbh",
				editor : {
					xtype : "idcombo",
					type : 5,
					allowBlank : false
				}
			}, {
				header : "数量",
				flex : 1,
				editor : {
					xtype : 'numberfield',
					allowBlank : false,
					minValue : 1,
					maxValue : 100000
				},
				dataIndex : 'num'
			} ],

			tbar : [ {
				xtype : "buttongroup",
				itemId : 'opbg',
				title : "操作",
				// height : 80,
				columns : 10,
				defaults : {
					scale : "small"
				},
				items : [ {
					text : '新增',
					iconCls : "add",
					handler : function() {
						me.store.insert(0, {
							bcbh : '',
							num : ''
						})
						me.cellEditing.startEditByPosition({
							row : 0,
							column : 1
						});
					}
				}, {
					text : '删除',
					iconCls : "delete",
					handler : function() {
						var s = me.getSelectionModel().getSelection();
						if (s.length > 0) {
							me.store.remove(s[0]);
						}
					}
				} ]
			} ],
			selModel : Ext.create("Ext.selection.CheckboxModel")

		});

		this.callParent();
	}
});

Ext.define("Pcbms.product.SearchStepLotcard", {
	extend : "Ext.grid.Panel",
	alias : "widget.slgrid",
	initComponent : function() {
		var me = this;
		var storeid = me.storeid ? me.storeid : "slListStore";
		me.store = Ext.create("Ext.data.Store", {
					fields : ['lotid', 'wbid', 'gzktype', 'gzkyxj', 'note','lotnum',
							'scrapnum', 'num','overpersonname','qaname','ipqcname','operatername','recipientname'],
					storeId : storeid,
					autoLoad : true,
					proxy : Pcbms.ajaxProxy({
							url:"/produceProcessManagementAction!searchProduceProcessList.action?stepid="
									+ me.stepid, reader:{
								type : 'json',
								root : 'paginationlist',
								totalProperty : 'count',
								idProperty : 'lotid'
							}})
				});

		Ext.applyIf(me, {
			columns : [{
						header : "LOT卡号",
						dataIndex : "lotid",
						width : 80,
						renderer : function(val, meta, record) {
							var gx = record.get("gzkyxj");

							if (gx == "24H" || gx == "36H") {
								meta.style = "background-color:#ff6c6c;";
							} else if (gx == "48H") {
								meta.style = "background-color:#6bc6ff;";
							} else if (gx == "72H") {
								meta.style = "background-color:#fcffca;";
							}

							return val;
						}
					}, {
						header : "工作板编号",
						width : 120,
						dataIndex : 'wbid',
						renderer : function(val, meta, record) {
							var gx = record.get("gzkyxj");

							if (gx == "24H" || gx == "36H") {
								meta.style = "background-color:#ff6c6c;";
							} else if (gx == "48H") {
								meta.style = "background-color:#6bc6ff;";
							} else if (gx == "72H") {
								meta.style = "background-color:#fcffca;";
							}

							return val;
						}
					},{
						header : "PANEL数",
						width : 60,
						dataIndex : 'lotnum',
						renderer : function(val, meta, record) {
							return val;
						}
					}, {
						header : "数据",
						width : 40,
						xtype : 'actioncolumn',
						renderer : function(val, meta, record) {
							var gx = record.get("gzkyxj");

							if (gx == "24H" || gx == "36H") {
								meta.style = "background-color:#ff6c6c;";
							} else if (gx == "48H") {
								meta.style = "background-color:#6bc6ff;";
							} else if (gx == "72H") {
								meta.style = "background-color:#fcffca;";
							}

							return val;
						},
						items : [{
							icon : 'icons/application_put.png',
							handler : function(grid, rowIndex, colIndex) {
								var rec = grid.getStore().getAt(rowIndex);
								downFile("/downloadStepDataFileAction!downloadDataFile.action?stepid="
										+ me.stepid
										+ "&lotid="
										+ rec.get('lotid'));
							}
						}]

					}, {
						header : "品质",
						width : 40,
						xtype : 'actioncolumn',
						renderer : function(val, meta, record) {
							var gx = record.get("gzkyxj");

							if (gx == "24H" || gx == "36H") {
								meta.style = "background-color:#ff6c6c;";
							} else if (gx == "48H") {
								meta.style = "background-color:#6bc6ff;";
							} else if (gx == "72H") {
								meta.style = "background-color:#fcffca;";
							}

							return val;
						},
						items : [{
							icon : 'icons/application_put.png',
							handler : function(grid, rowIndex, colIndex) {
								var rec = grid.getStore().getAt(rowIndex);
								downFile("/downloadStepDataFileAction!downloadTestFile.action?stepid="
										+ me.stepid
										+ "&lotid="
										+ rec.get('lotid'));
							}
						}]

					}, {
						header : "其他",
						width : 40,
						xtype : 'actioncolumn',
						renderer : function(val, meta, record) {
							var gx = record.get("gzkyxj");

							if (gx == "24H" || gx == "36H") {
								meta.style = "background-color:#ff6c6c;";
							} else if (gx == "48H") {
								meta.style = "background-color:#6bc6ff;";
							} else if (gx == "72H") {
								meta.style = "background-color:#fcffca;";
							}

							return val;
						},
						items : [{
							icon : 'icons/application_put.png',
							handler : function(grid, rowIndex, colIndex) {
								var rec = grid.getStore().getAt(rowIndex);
								downFile("/downloadStepDataFileAction!downloadOtherFile.action?stepid="
										+ me.stepid
										+ "&lotid="
										+ rec.get('lotid'));
							}
						}]

					}, {
						header : "优先级",
						width : 45,
						dataIndex : 'gzkyxj',
						renderer : function(val, meta, record) {
							var gx = record.get("gzkyxj");

							if (gx == "24H" || gx == "36H") {
								meta.style = "background-color:#ff6c6c;";
							} else if (gx == "48H") {
								meta.style = "background-color:#6bc6ff;";
							} else if (gx == "72H") {
								meta.style = "background-color:#fcffca;";
							}

							return val;
						}
					}, {
						header : "过数数量",
						width : 60,
						dataIndex : 'num',
						renderer : function(val, meta, record) {
							var gx = record.get("gzkyxj");

							if (gx == "24H" || gx == "36H") {
								meta.style = "background-color:#ff6c6c;";
							} else if (gx == "48H") {
								meta.style = "background-color:#6bc6ff;";
							} else if (gx == "72H") {
								meta.style = "background-color:#fcffca;";
							}

							return val;
						}
					}, {
						header : "报废数量",
						width : 60,
						dataIndex : 'scrapnum',
						renderer : function(val, meta, record) {
							var gx = record.get("gzkyxj");

							if (gx == "24H" || gx == "36H") {
								meta.style = "background-color:#ff6c6c;";
							} else if (gx == "48H") {
								meta.style = "background-color:#6bc6ff;";
							} else if (gx == "72H") {
								meta.style = "background-color:#fcffca;";
							}

							return val;
						}
					},{
						header : '接收人',
						width : 60,
						dataIndex : 'recipientname',
						renderer : function(val, meta, record) {
							var gx = record.get("gzkyxj");

							if (gx == "24H" || gx == "36H") {
								meta.style = "background-color:#ff6c6c;";
							} else if (gx == "48H") {
								meta.style = "background-color:#6bc6ff;";
							} else if (gx == "72H") {
								meta.style = "background-color:#fcffca;";
							}

							return val;
						}
					},{
						header : '操作人',
						width : 60,
						dataIndex : 'operatername',
						renderer : function(val, meta, record) {
							var gx = record.get("gzkyxj");

							if (gx == "24H" || gx == "36H") {
								meta.style = "background-color:#ff6c6c;";
							} else if (gx == "48H") {
								meta.style = "background-color:#6bc6ff;";
							} else if (gx == "72H") {
								meta.style = "background-color:#fcffca;";
							}

							return val;
						}
					},{
						header : 'QA签名',
						width : 60,
						dataIndex : 'qaname',
						renderer : function(val, meta, record) {
							var gx = record.get("gzkyxj");

							if (gx == "24H" || gx == "36H") {
								meta.style = "background-color:#ff6c6c;";
							} else if (gx == "48H") {
								meta.style = "background-color:#6bc6ff;";
							} else if (gx == "72H") {
								meta.style = "background-color:#fcffca;";
							}

							return val;
						}
					},{
						header : 'IPQC签名',
						width : 60,
						dataIndex : 'ipqcname',
						renderer : function(val, meta, record) {
							var gx = record.get("gzkyxj");

							if (gx == "24H" || gx == "36H") {
								meta.style = "background-color:#ff6c6c;";
							} else if (gx == "48H") {
								meta.style = "background-color:#6bc6ff;";
							} else if (gx == "72H") {
								meta.style = "background-color:#fcffca;";
							}

							return val;
						}
					},{
						header : '转出者',
						width : 60,
						dataIndex : 'overpersonname',
						renderer : function(val, meta, record) {
							var gx = record.get("gzkyxj");

							if (gx == "24H" || gx == "36H") {
								meta.style = "background-color:#ff6c6c;";
							} else if (gx == "48H") {
								meta.style = "background-color:#6bc6ff;";
							} else if (gx == "72H") {
								meta.style = "background-color:#fcffca;";
							}

							return val;
						}
					}, {
						header : "备注",
						flex : 1,
						dataIndex : 'note',
						renderer : function(val, meta, record) {
							var gx = record.get("gzkyxj");

							if (gx == "24H" || gx == "36H") {
								meta.style = "background-color:#ff6c6c;";
							} else if (gx == "48H") {
								meta.style = "background-color:#6bc6ff;";
							} else if (gx == "72H") {
								meta.style = "background-color:#fcffca;";
							}

							return val;
						}
					}],

			tbar : [{
				xtype : "buttongroup",
				itemId : 'opbg',
				title : "操作",
				// height : 80,
				columns : 10,
				defaults : {
					scale : "small"
				},
				items : [{
					text : '接收',
					iconCls : "receive",
					handler : function(b) {

						var s = checkGridSelect(b.up("gridpanel"), 1);
						if (s) {

							Ext.Msg.confirm("提示", "确定要接收吗?", function(v) {

								if (v == 'no')
									return;

								Ext.Ajax.trequest({
									url : "/produceProcessManagementAction!acceptLotCard.action?lotid="
											+ s[0].get("lotid")
											+ "&stepid="
											+ me.stepid,
											success : function(str) {
												Ext.Msg
														.alert("提示",
																str.msg);
												Ext.data.StoreManager
														.lookup(storeid)
														.load();
											}
								});

							});

						}

					}
				}, {
					text : '填写Lot',
					iconCls : "TotEdit",
					handler : function(b) {

						var s = checkGridSelect(b.up("gridpanel"), 1);
						if (s) {

							if (true) {
								me.againForm = Ext.create("Ext.form.Panel", {
									bodyPadding : 10,
									layout : 'anchor',
									items : [{
												xtype : 'numberfield',
												fieldLabel : '数量',
												allowBlank : false,
												anchor : '95%',
												value : s[0].data["num"],
												name : 'countingDetail.num'
											}, {
												xtype : 'numberfield',
												fieldLabel : '报废数量',
												allowBlank : false,
												value : s[0].data["scrapnum"],
												anchor : '95%',
												validator : function(v) {
													if (v != "") {

														if (v < 0) {
															return "不能小于0";
														}
													}

													return true;
												},
												name : 'countingDetail.scrapnum'
											}, {
												xtype : 'textarea',
												fieldLabel : '备注',
												value : s[0].data["note"],
												anchor : '95%',
												name : 'countingDetail.note'
											}]
								});

								me.againWindow = Ext.create(
										"Ext.window.Window", {
											title : "填写Lot信息",
											items : me.againForm,
											layout : "fit",
											closeAction : 'hide',
											modal : true,
											width : 400,
											height : 250,
											buttons : [{
												text : '确定',
												iconCls : "accept",
												handler : function() {
													me.againForm.getForm()
															.submit({
																params : {
																	stepid : me.stepid,
																	"countingDetail.lotid" : s[0]
																			.get("lotid")
																},
																waitMsg : '正在提交,请稍等...',
																url : '/produceProcessManagementAction!updateLotCard.action',
																success : function(
																		form,
																		action) {
																	Ext.Msg
																			.alert(
																					"提示",
																					action.result.msg);
																	me.againWindow
																			.close();
																},
																failure : Pcbms.formHandler

															});
												}
											}]
										});

							}

							me.againWindow.show();

						}

					}

				}, {
					text : 'QA签名',
					iconCls : "QAsignature",
					handler : function(b) {

						var s = checkGridSelect(b.up("gridpanel"), 1);
						if (s) {

							Ext.Msg.confirm("提示", "确定要QA签名吗?", function(v) {
								if (v == 'no')
									return;
								Ext.Ajax.trequest({
									url : "/produceProcessManagementAction!qaSignature.action?lotid="
											+ s[0].get("lotid")
											+ "&stepid="
											+ me.stepid,
											success : function(str) {
												Ext.Msg
														.alert("提示",
																str.msg);
												Ext.data.StoreManager
														.lookup(storeid)
														.load();
											},
											failure : function(r) {
												Ext.Msg.alert('出现错误',
														'原因 <' + r.msg
																+ ">");
											}
								});

							});

						}

					}
				}, {
					text : 'IPQC',
					iconCls : "IPQC",
					handler : function(b) {

						var s = checkGridSelect(b.up("gridpanel"), 1);
						if (s) {

							Ext.Msg.confirm("提示", "确定要IPQC签名吗?", function(v) {
								if (v == 'no')
									return;
								Ext.Ajax.trequest({
									url : "/produceProcessManagementAction!ipqcSignature.action?lotid="
											+ s[0].get("lotid")
											+ "&stepid="
											+ me.stepid,
									success : new Pcbms.ajaxHandler({
												success : function(str) {
													Ext.Msg
															.alert("提示",
																	str.msg);
													Ext.data.StoreManager
															.lookup(storeid)
															.load();
												},
												failure : function(r) {
													Ext.Msg.alert('出现错误',
															'原因 <' + r.msg
																	+ ">");
												}
											})
								});

							});

						}

					}
				}, {
					text : '转下一道工序',
					iconCls : "next",
					handler : function(b) {
						var s = checkGridSelect(b.up("gridpanel"), 1);
						if (s) {

							Ext.Msg.confirm("提示", "确定要转下一道工序吗?", function(v) {
								if (v == 'no')
									return;
								Ext.Ajax.trequest({
									url : "/produceProcessManagementAction!toNextStep.action?mid="
											+ s[0].get("mid")
											+ "&stepid="
											+ me.stepid
											+ "&lotid="
											+ s[0].get("lotid"),
											success : function(str) {
												Ext.Msg
														.alert("提示",
																str.msg);
												Ext.data.StoreManager
														.lookup(storeid)
														.load();
											}
								});

							});
						}
					}
				}, {
					text : '主动接收',
					hidden : true,
					handler : function() {

						Ext.Msg.prompt("提示", "请输入管制卡号", function(a, b, c) {
							if (a == "ok") {
								if (Ext.String.trim(b) == "") {

									Ext.Msg.alert("提示", "请填写管制卡号");
								} else {

									Ext.Ajax.trequest({
										url : "/produceProcessManagementAction!skipStep.action?lotid="
												+ b + "&stepid=" + me.stepid,
												success : function(str) {
													Ext.data.StoreManager
															.lookup(storeid).load();
												}
									});

								}
							}
						});
					}
				}]
			}, "->", {
				xtype : "buttongroup",
				title : "主动接收",
				columns : 3,
				defaults : {
					scale : "larger"
				},
				items : [{
					xtype : "textfield",
					fieldLabel : "编号输入",
					labelAlign : "right",
					labelWidth : 60,
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
														"wbid")
												.indexOf(
														value) != -1
												|| r
														.get(
																"lotid")
														.indexOf(
																value) != -1;
									});
						}
					}
				},{
							xtype : "idcombo",
							type : 8,
							fieldLabel : 'Lot卡号',
							name : 'lotid',
							itemId : 'pch',
							allowBlank : false,
							labelAlign : 'right',
							labelWidth : 60,
							flex : 1
						}, {
							text : '接收',
							scale : 'small',
							iconCls : "receive",
							handler : function() {

								if (me.down("#pch").isValid()) {
									deferLoading(me);
									Ext.Ajax.trequest({
										url : "/produceProcessManagementAction!skipStep.action?lotid="
												+ me.down("#pch").getValue()
												+ "&stepid=" + me.stepid,
												success : function(str) {
													Ext.data.StoreManager
															.lookup(storeid).load();
												}
									});

								}
							}
						}]
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
		if (me.et) {
			if (me.et == "et") {

				me.tbar[0].items.push({
							text : '填写报废数',
							handler : function() {

							}
						});
			} else if (me.et = "bzrk") {

				//Ext.Array.splice(me.tbar[0].items, 2, 1);
				Ext.Array.splice(me.tbar[0].items, 3, 1);

				me.tbar[0].items.push({
							text : '打印包装标签',
							iconCls : "print",
							handler : function(b) {

								var s = checkGridSelect(b.up("gridpanel"), 1);
								if (s) {

									Ext.create("Pcbms.view.printPack", {
												lotid : s[0].get("lotid"),
												stepid : me.stepid

											}).show();
								}
							}
						});

				me.tbar[0].items.push({
					text : '创建成品入库单',
					iconCls : "Finishedstoragelists",
					handler : function(b) {

						var cct = Ext.create("Pcbms.view.createCompletet", {});

						Ext.create("Ext.window.Window", {
							title : '创建成品入库单',
							width : 500,
							height : 400,
							modal : true,
							layout : 'fit',
							items : [cct],
							buttons : [{
								text : '确定',
								iconCls : "accept",
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

										params["bcbhs[" + i + "].bcbh"] = bcbh;
										params["bcbhs[" + i + "].num"] = num;
									}

									if (insertFlag) {
										b.up("window").setLoading("正在加载中...");
										Ext.Ajax.trequest({
											url : "/produceProcessManagementAction!createWHVoucher.action?stepid="
													+ me.stepid,
											params : params,
											success : function(str) {
												b.up("window").close();
												Ext.Msg
														.confirm(
																"成功提示",
																str.msg
																		+ ",是否需要打印?",
																function(v) {
																	if (v == 'yes') {
																		tpmsprinter
																				.print(
																						"stockein",
																						{
																							ids : [str.rkid]
																						});
																	}

																});
											},
											failure : function(r) {
												b.up("window")
														.setLoading(false);
												Ext.Msg.alert('出现错误',
														'原因 <' + r.msg
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
				});
			}
		}
		this.callParent();
	}
});