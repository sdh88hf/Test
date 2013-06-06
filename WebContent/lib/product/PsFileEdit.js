// 显示订单详细信息

Ext.define("Pcbms.product.PsFileEdit", {
	extend : "Ext.panel.Panel",
	alias : "widget.psfileedit",
	requires : ["Pcbms.product.Commons"],
	border : false,
	width : 1000,
	initComponent : function() {
		var me = this;
		// 这里我们分三个
		var planData = me.jsonData.result.productPlan;
		var productData = planData.productBean;
		var productOrderData = planData.productOrderBean;
		me.items = [{
			xtype : 'container',
			layout : 'column',
			defaults : {
				margin : '0 10 0 5'
			},
			items : [{
						xtype : 'container',
						columnWidth : 0.34,
						items : [{
									title : '订单需求信息',
									xtype : 'productorderfield',
									jsonData : productOrderData
								}, {
									title : '生产安排信息',
									xtype : 'productplanfield',
									jsonData : planData
								}]
					}, {
						xtype : 'container',
						columnWidth : 0.66,
						items : [{
							xtype : 'tabpanel',
							items : [{
								xtype : 'container',
								title : "产品基本信息",
								layout : "column",
								defaults : {
									columnWidth : 0.5,
									margin : '0 10 0 5'
								},
								items : [{
											title : '客户文件详细',
											xtype : 'projectfilefield',
											jsonData : productData.projectFileBean
										}, {
											title : '产品详细信息',
											xtype : 'productfield',
											jsonData : productData
										}]
							}, {
								xtype : 'container',
								title : "操作历史记录",
								listeners : {
									activate : function(c) {
										c.down("auditProcessField").loadData();
										c.down("lockProcessField").loadData();
									}
								},
								items : [{
											xtype : 'displayfield',
											margin : '0 0 0 12',
											value : '<b>历史审核记录信息</b>'
										}, {
											xtype : 'auditProcessField',
											uniqKey : planData.uniqKey,
											height : 200
										}, {
											xtype : 'displayfield',
											margin : '0 0 0 12',
											value : '<b>历史锁定记录信息</b>'
										}, {
											xtype : 'lockProcessField',
											uniqKey : planData.uniqKey,
											height : 300
										}]
							}]
						}, {
							xtype : 'panel',
							itemId : 'cardpanel',
							title : '工程文件信息确认',
							margin : '12 0 0 0',
							bodyPadding : 5,
							layout : "card",
							items : [{
								xtype : "form",
								border : false,
								layout : 'anchor',
								labelWidth : 95,
								defaults : {
									anchor : '95%'
								},
								items : [{
											xtype : 'fileuploadfield',
											fieldLabel : "待上传文件",
											buttonText : "选择文件...",
											emptyText : "请用将需要上传的文件打包成zip文件",
											vtype : 'zip',
											allowBlank : false,
											name : "ps"
										}, {
											xtype : "fieldcontainer",
											layout : {
												type : "hbox",
												padding : "5",
												pack : "end",
												align : "middle"
											},
											items : [{
														xtype : 'button',
														text : '自动处理上传文件',
														disabled : true,
														handler : function() {

														}
													}, {
														xtype : 'button',
														text : '保存已处理文件',
														handler : function(b) {
															var layout = this
																	.up("#cardpanel")
																	.getLayout();
															var formpanel = this
																	.up("form");
															var form = formpanel
																	.getForm();
															if (form.isValid()) {
																formpanel
																		.getEl()
																		.mask("正在处理上传内容,请稍后...");
																form.submit({
																	url : 'psFileAction!uploadprocessed.action',
																	success : function(
																			fp,
																			o) {
																		formpanel
																				.getEl()
																				.unmask();
																		// 文件上传成功返回结果信息
																		var cp = layout
																				.next();
																		var form = cp
																				.getForm();
																		var result = o.result.result;
																		for (var i in result) {
																			var f = form
																					.findField("psFileBean."
																							+ i);
																			if (f != null) {
																				f
																						.setValue(result[i]);
																			}
																		}
																		form
																				.findField("psFileBean.fileName")
																				.setValue(o.result.psFileName);
																	},
																	failure : function(
																			fp,
																			o) {
																		// 上传失败
																		formpanel
																				.getEl()
																				.unmask();
																		Ext.Msg
																				.alert(
																						o.result.msg,
																						o.result.result
																								.join(","));
																	}
																});
															}
														}
													}]
										}]
							}, {
								xtype : "form",
								border : false,
								layout : 'anchor',
								defaults : {
									anchor : '95%',
									labelWidth : 95,
									allowBlank : false
								},
								items : [{
											xtype : 'hidden',
											name : 'ppId',
											value : planData.ppId
										}, {
											xtype : 'hidden',
											name : "psFileBean.psfileId"
										}, {
											xtype : 'hidden',
											name : "psFileBean.layers"
										}, {
											xtype : 'hidden',
											name : "psFileBean.fileName"
										}, {
											xtype : 'fieldcontainer',
											layout : 'column',
											defaultType : "numberfield",
											defaults : {
												columnWidth : 0.5,
												margin : "4 5 3 5",
												labelWidth : 95
											},
											items : [{
														fieldLabel : '层数',
														xtype : 'dictcombo',
														dictype : '层数',
														name : 'psFileBean.cs'
													}, {
														fieldLabel : '过孔处理信息',
														xtype : 'dictcombo',
														dictype : '过孔处理',
														name : 'psFileBean.gkcl'
													}, {
														fieldLabel : 'PCS尺寸x',
														name : 'psFileBean.pcsX'
													}, {
														fieldLabel : 'PCS尺寸y',
														name : 'psFileBean.pcsY'
													}, {
														fieldLabel : 'SET尺寸X',
														name : 'psFileBean.setX'
													}, {
														fieldLabel : 'SET尺寸Y',
														name : 'psFileBean.setY'
													}, {
														fieldLabel : 'SET拼数',
														name : 'psFileBean.setPs'
													}, {
														fieldLabel : '最小线宽',
														name : 'psFileBean.minlw'
													}, {
														fieldLabel : '最小线距',
														name : 'psFileBean.minld'
													}, {
														fieldLabel : '最小的孔径',
														name : 'psFileBean.minhole'
													}, {
														fieldLabel : '外层铜厚',
														xtype : 'dictcombo',
														dictype : '外层铜厚',
														name : 'psFileBean.wcth'
													}, {
														fieldLabel : '内层铜厚',
														xtype : 'dictcombo',
														dictype : '内层铜厚',
														name : 'psFileBean.ncth'
													}]
										}, {
											fieldLabel : '文件备注',
											xtype : 'textarea',
											allowBlank : true,
											name : 'psFileBean.note'
										}, {
											xtype : "fieldcontainer",
											layout : {
												type : "hbox",
												padding : "5",
												pack : "end",
												align : "middle"
											},
											items : [{
												xtype : 'button',
												text : '查看已上传文件',
												handler : function() {
													var form = this.up("form")
															.getForm();
													Ext.widget("gerberview", {
														psfileId : form
																.findField("psFileBean.psfileId")
																.getValue(),
														layers : form
																.findField("psFileBean.layers")
																.getValue()
													}).show();
												}
											}, {
												xtype : 'button',
												text : '返回修改',
												handler : function() {
													var layout = this
															.up("#cardpanel")
															.getLayout();
													layout.prev();
												}
											}, {
												xtype : 'button',
												text : '确认保存',
												handler : function() {
													var formpanel = this
															.up("form");
													var form = formpanel
															.getForm();
													if (form.isValid()) {
														formpanel
																.getEl()
																.mask("正在保存,请稍后...");
														form.submit({
															url : 'psFileAction!save.action',
															success : function(
																	fp, o) {
																formpanel
																		.getEl()
																		.unmask();
																// 文件上传成功返回结果信息
																var result = o.result.result;
																if (Ext
																		.isArray(result)
																		&& result.length > 0) {
																	Ext.Msg
																			.confirm(
																					"温馨提示,保存成功!",
																					"你还有 "
																							+ result.length
																							+ "条的已锁定的数据未处理,是否处理下一个?",
																					function(
																							b) {
																						if (b == "ok") {
																							window.location
																									.replace(Ext.String
																											.format(
																													"psFileAction!psfileinput.action?&title={0}_工程处理&widget=Pcbms.product.PsFileEdit&ppId={0}",
																													result[0]));
																						} else {
																							// 刷新页面
																							window.location
																									.replace(Ext.String
																											.format(
																													"productPlanAction!view.action?ppId={0}&title={0}_生产安排详细&widget=Pcbms.product.ProductPlanView",
																													planData.ppId));
																						}
																					});
																} else {
																	Ext.Msg
																			.alert(
																					"温馨提示,保存成功!",
																					"你所有锁定的数据都已操作成功!请锁定后处理!",
																					function() {
																						window.location
																								.replace(Ext.String
																										.format(
																												"productPlanAction!view.action?ppId={0}&title={0}_生产安排详细&widget=Pcbms.product.ProductPlanView",
																												planData.ppId));
																					});

																}
															},
															failure : function(
																	fp, o) {
																// 上传失败
																formpanel
																		.getEl()
																		.unmask();
																Ext.Msg
																		.alert(
																				'出现错误',
																				o.result.msg);
															}
														});
													}
												}
											}]
										}]
							}]
						}]
					}]
		}];
		me.callParent(arguments);
	}
});