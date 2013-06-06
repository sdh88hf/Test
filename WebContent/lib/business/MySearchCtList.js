/**
 * 历史合同列表
 */
Ext
		.define(
				"Pcbms.business.MySearchContractList",
				{
					extend : "Ext.panel.Panel",
					alias : "widget.msctgrid",
					storeId : 'msctstore',
					layout : "border",
					bodyStyle: 'background:white; padding:12px; overflow:hidden !important;',
					statusData : [ [ 0, "取消" ], [ 1, "生效" ], [ 2, "交付成功" ] ],
					// 显示查询条件
					initComponent : function() {
						var me = this;
						me.store = Ext
								.create(
										"Ext.data.Store",
										{
											model : "ContractBean",
											storeId : me.storeId,
											autoLoad : false,
											proxy : Pcbms
													.ajaxProxy("business/contractAction!searchContractList.action")
										});
						me.form = Ext
								.create(
										"Ext.form.Panel",
										{
											border : false,
											region : 'north',
											items : [
													{
														xtype : 'displayfield',
														anchor : '100%',
														labelSeparator : '',
														value : '<b>历史合同查询</b>'
													},
													{
														xtype : 'container',
														layout : {
															type : 'hbox',
															defaultMargins : {
																top : 0,
																right : 15,
																bottom : 0,
																left : 0
															}
														},
														items : [
																{
																	xtype : 'empcombo',
																	labelWidth : 100,
																	fieldLabel : '所属业务员',
																	name : 'contract.salesman',
																	cn : 'ywy',
																	width : 250
																},
																Pcbms
																		.formbtn(
																				"查询",
																				me.storeId,
																				"small"),
																{
																	xtype : "checkbox",
																	boxLabel : '更多的查询条件',
																	listeners : {
																		change : function(
																				field) {
																			var as = field
																					.up(
																							"form")
																					.down(
																							"#addtionsearch");
																			if (as
																					.isHidden()) {
																				as
																						.show();
																			} else {
																				as
																						.hide();
																			}
																		}
																	},
																	inputValue : '1'
																} ]
													},
													{
														xtype : 'container',
														hidden : true,
														width : '750',
														style : 'margin-top:5px',
														layout : 'hbox',
														defaults : {
															labelWidth : 65,
															style : 'margin-right:10px',
															forceSelection : true,
															layout : {
																type : 'hbox',
																defaultMargins : {
																	top : 0,
																	right : 5,
																	bottom : 0,
																	left : 0
																}
															}
														},
														itemId : 'addtionsearch',
														items : [
																{
																	xtype : 'fieldcontainer',
																	fieldLabel : '创建时间',
																	width : 350,
																	combineErrors : true,
																	defaults : {
																		hideLabel : true
																	},
																	items : [
																			{
																				xtype : 'displayfield',
																				value : '从'
																			},
																			{
																				xtype : 'datefield',
																				name : 'contract.start',
																				itemId : 'startdatefield',
																				endDateField : 'enddatefield',
																				vtype : 'daterange',
																				width : 110,
																				submitFormat : 'U000'
																			},
																			{
																				xtype : 'displayfield',
																				value : '到'
																			},
																			{
																				xtype : 'datefield',
																				vtype : 'daterange',
																				itemId : 'enddatefield',
																				width : 110,
																				startDateField : 'startdatefield',
																				name : 'contract.end',
																				getSubmitValue : function() {
																					if (this
																							.getValue() != null) {
																						return this
																								.getValue()
																								.getTime() + 86400000;
																					}
																					return null;
																				}
																			} ]
																},
																{
																	xtype : 'clientcombo',
																	fieldLabel : '所属客户',
																	name : 'contract.clientId',
																	width : 300
																},
																{
																	xtype : 'combobox',
																	store : this.statusData,
																	width : 220,
																	fieldLabel : '状态',
																	name : 'contract.status',
																	value : 2
																} ]
													},
													{
														xtype : 'displayfield',
														width : 220,
														style : 'margin-top: 10px;',
														anchor : '100%',
														labelSeparator : '',
														value : '<b>订单列表</b>'
													} ]
										});
						var deleteAction = Ext
								.create(
										'Ext.Action',
										{
											disabled : true,
											text : '作废合同',
											iconCls : 'book_open',
											handler : function() {
												var rs = me.grid
														.getSelectionModel()
														.getSelection();
												if (rs.length == 0) {
													Ext.Msg.alert("操作错误",
															"请选择一条记录后操作!");
												}
												Ext.Msg
														.confirm(
																"确认操作",
																"确认将选中的合同作废",
																function(b) {
																	if (b != 'yes') {
																		return;
																	}
																	Ext.Ajax
																			.trequest({
																				url : 'business/contractAction!cancelContracts.action',
																				params : {
																					'contract.contractId' : rs[0]
																							.get("contractId")
																				},
																				success : function(
																						data) {
																					Ext.msg
																							.alert(
																									"温馨提示",
																									"合同作废成功!",
																									function() {
																										rs[0]
																												.set(
																														"status",
																														0);
																										rs[0]
																												.commit();
																									});
																				}
																			});
																});
											}
										});
						var moveAction = Ext.create('Ext.Action', {
							disabled : true,
							text : '合同迁移',
							iconCls : 'book_open',
							handler : function() {
								var rs = me.grid.getSelectionModel()
										.getSelection();
								if (rs.length == 0) {
									Ext.Msg.alert("操作错误", "请选择一条记录后操作!");
								}
								var contractId = rs[0].get("contractId");
							}
						});

						var updateAction = Ext.create('Ext.Action', {
							disabled : true,
							text : '修改合同',
							iconCls : 'book_open',
							handler : function() {
								var rs = me.grid.getSelectionModel()
										.getSelection();
								if (rs.length == 0) {
									Ext.Msg.alert("操作错误", "请选择一条记录后操作!");
								}
								Ext.getCmp("mainpanel").loadControl({
									xtype : "contracteditform",
									record : rs[0],
									id : "contracteditform"
								});
							}
						});

						var printAction = Ext.create('Ext.Action', {
							disabled : true,
							text : '打印合同',
							iconCls : 'book_open',
							handler : function() {
								var rs = me.grid.getSelectionModel()
										.getSelection();
								if (rs.length == 0) {
									Ext.Msg.alert("操作错误", "请选择一条记录后操作!");
								}
							}
						});

						var contextMenu = Ext.create('Ext.menu.Menu', {
							items : [ deleteAction, moveAction, updateAction,
									printAction ]
						});
						var selModel = Ext
								.create(
										"Ext.selection.CheckboxModel",
										{
											listeners : {
												selectionchange : function(sm,
														selections) {
													deleteAction
															.setDisabled(selections.length == 0);
												}
											}
										});
						me.grid = Ext
								.create(
										'Ext.grid.Panel',
										{
											region : 'center',
											store : me.store,
											selModel : selModel,
											tbar : [ deleteAction, moveAction,
													updateAction, printAction ],
											viewConfig : {
												stripeRows : true,
												listeners : {
													itemcontextmenu : function(
															view, rec, node,
															index, e) {
														e.stopEvent();
														contextMenu.showAt(e
																.getXY());
														return false;
													}
												}
											},
											columns : [
													{
														header : "合同编号",
														width : 90,
														dataIndex : "contractId"
													},
													{
														header : "创建时间",
														width : 80,
														dataIndex : "createDate",
														renderer : Ext.util.Format
																.dateRenderer("m-d H:i")
													},
													{
														header : "所属业务员",
														width : 80,
														dataIndex : "salesmanName"
													},
													{
														header : "所属客户",
														width : 80,
														dataIndex : "clientName"
													},
													{
														header : "订单数量",
														width : 80,
														dataIndex : "orderNum"
													},
													{
														header : "合同总金额",
														width : 80,
														dataIndex : "actualAmount",
														renderer : function(v) {
															return Ext.util.Format
																	.currency(v);
														}
													},
													{
														header : "折扣或优惠",
														width : 80,
														dataIndex : "concessionsType"
													},
													{
														header : "付款信息",
														flex : 1,
														dataIndex : "payMethod"
													},
													{
														header : "锁定人",
														width : 80,
														dataIndex : "auditorName",
														renderer : function(v,
																m, r) {
															if (Ext.isEmpty(v)) {
																return "<span style='color:red'>未锁定</span>";
															}
															if (r
																	.get("auditor") == myself.employeeId) {
																return "<span style='color:blue'>"
																		+ v
																		+ "*</span>";
															}
															return v;
														}
													}, {
														header : "状态",
														width : 80,
														dataIndex : "status",
														renderer : function(v) {
															if (v == 0) {
																return "作废";
															} else if (v == 1) {
																return "草稿";
															} else if (v == 2) {
																return "待审核";
															} else if (v == 3) {
																return "审核通过";
															} else if (v == 4) {
																return "审核不通过";
															} else if (v == 5) {
																return "已完成";
															} else {
																return "未知";
															}
														}
													} ],
											bbar : Ext
													.create(
															"Ext.PagingToolbar",
															{
																store : me.store,
																displayInfo : true,
																beforePageText : "当前页",
																afterPageText : "总 {0} 页",
																displayMsg : "当前显示 {0} - {1} 条 一共 {2}条",
																emptyMsg : " 暂无信息"
															})
										});
						Ext.applyIf(me, {
							items : [ me.form, me.grid ]
						});
						me.callParent();
					}
				});

// 合同修改
Ext.define("Pcbms.business.ContractEditForm", {
	extend : "Ext.form.Panel",
	alias : "widget.contracteditform",
	tabConfig : {
		title : "编辑合同信息",
		tooltip : "编辑合同信息"
	},
	layout : "auto",
	initialization : function(data) {
		// 数据的初始化
		this.removeAll();
		this.record = data.record;
	}
});