Ext.define('Pcbms.product.UpdProduct', {
	extend : 'Ext.form.Panel',
	alias : "widget.produpd",
	tbar : [{
		xtype : "button",
		text : "客户文件下载",
		handler : function(b) {
			var bcbh = b.up("form").getForm().findField("product.bcbh")
					.getValue();
			// 下载客户文件
			downFile("/downloadAction!downloadClientDataFile.action?bcbh="
					+ bcbh);
		}
	}, {
		xtype : "button",
		disabled : true,
		text : "工程文件下载",
		itemId : "bcbhdatabutton",
		handler : function(b) {
			var bcbh = b.up("form").getForm().findField("product.bcbh")
					.getValue();
			// 下载客户文件
			downFile("/downloadAction!downloadBCBHDataFile.action?bcbh=" + bcbh);
		}
	}, {
		xtype : "button",
		disabled : true,
		text : "ECN原工程文件下载",
		handler : function(b) {
			var bcbh = b.up("form").getForm().findField("product.ybcbh")
					.getValue();
			// 下载客户文件
			downFile("/downloadAction!downloadBCBHDataFile.action?bcbh=" + bcbh);
		}
	}, {
		xtype : "button",
		disabled : true,
		itemId : "redobutton",
		text : "申请重新处理",
		handler : function(b) {
			var fp = b.up("form");
			var form = Ext.create('Ext.form.Panel', {
						border : false,
						frame : true,
						defaults : {
							anchor : "99%",
							labelWidth : 70,
							allowBlank : false,
							labelAlign : "left"
						},
						items : [{
							xtype : 'textfield',
							fieldLabel : '工程编号',
							name : 'productproblem.bcbh',
							value : fp.getForm().findField("product.bcbh")
									.getValue(),
							readOnly : true
						}, {
							xtype : 'hidden',
							name : 'fileName',
							value : fp.getForm().findField("product.bcbh")
									.getValue()
						}, {
							xtype : 'filefield',
							fieldLabel : '文件',
							name : 'attachement'
						}, {
							xtype : 'numberfield',
							fieldLabel : '最小线距',
							name : 'productproblem.minld',
							value : fp.getForm().findField("product.minld")
									.getValue()
						}, {
							xtype : 'numberfield',
							fieldLabel : '最小线宽',
							name : 'productproblem.minlw',
							value : fp.getForm().findField("product.minlw")
									.getValue()
						}, {
							xtype : 'numberfield',
							fieldLabel : '最小孔径',
							name : 'productproblem.minhole',
							value : fp.getForm().findField("product.minhole")
									.getValue()
						}, {
							xtype : "textarea",
							name : "productproblem.description",
							anchor : '99% -150',
							fieldLabel : '申请原因'
						}]
					});
			var win = Ext.create('Ext.window.Window', {
				title : "文件覆盖申请",
				width : 450,
				height : 300,
				minWidth : 300,
				minHeight : 200,
				layout : 'fit',
				bodyPadding : 10,
				border : false,
				modal : true,
				items : form,
				buttons : [{
					text : '确认提交申请',
					handler : function(b) {
						form.getForm().submit({
									url : '/uploadAction!uploadNEWBCBHDataFile.action',
									waitMsg : "提交中....",
									success : function(form, action) {
										Ext.Msg.alert("提示", action.result.msg);
										form.reset();
										win.close();
									},
									failure : Pcbms.formHandler
								});
					}
				}, {
					text : '取消申请',
					handler : function() {
						win.close();
					}
				}]
			});
			b.up("window").close();
			win.show();
		}
	}, '->', {
		xtype : "button",
		text : "历史记录",
		handler : function(b) {
			if (b.getText() == "历史记录") {
				b.setText("基本详情");
				var form = b.up("form").getForm();
				var store = Ext.data.StoreManager.lookup('ptpStore');
				store.getProxy().extraParams = {
					'projectfileproblem.bcbh' : form.findField("product.bcbh")
							.getValue()
				};
				store.load();
				b.up("form").getLayout().setActiveItem(1);
			} else {
				b.setText("历史记录");
				b.up("form").getLayout().setActiveItem(0);
			}
		}
	}],
	buttons : [{
				text : "确认工程处理",
				disabled : true,
				itemId : "prodSubmitButton",
				handler : function(b) {
					var uploadForm = b.up("form");
					var basicForm = uploadForm.getForm();
					var params = {
						fileName : basicForm.findField("product.bcbh")
								.getValue()
					};
					basicForm.submit({
								url : "/uploadAction!uploadBCBHDataFile.action",
								waitMsg : "提交中....",
								params : params,
								success : function(form, action) {
									Ext.Msg.alert("提示", action.result.msg);
									basicForm.reset();
									uploadForm.up("window").close();
								},
								failure : Pcbms.formHandler
							});
				}
			}],
	layout : "card",
	activeItem : 0,
	border : false,
	bcbh : "",
	/**
	 * 
	 * @param data
	 *            需要载入的数据
	 * @param type
	 *            查看的模式(可选) 1.工程处理
	 */
	loadData : function(data, type) {
		var me = this;
		Ext.each(me.getForm().getFields().items, function(i) {
			if (i.getName()) {
				if (i.getXType() == "radiofield") {
					if (data[i.getName().replace("product.", "")] == i.inputValue) {
						i.setValue(true);
					} else {
						i.setValue(false);
					}
				} else if (i.getName().indexOf("product.") >= 0) {
					var property = i.getName().replace("product.", "");
					var value = data[property];
					if (property == 'jhrq') {
						if (value > 0) {
							value = new Date(data[property]);
						} else {
							value = null;
						}
					}
					i.setValue(value);
				}
			}
		});
		me.down("propertygrid").setSource(data);
		if (data.isoperate > 0) {
			me.down("#bcbhdatabutton").setDisabled(false);
			me.down("#redobutton").setDisabled(false);
		}

		// 如果产品还没被处理过 需要显示输入
		if (typeof type == "number" && type == 1 && data.isoperate == 0) {
			me.down("#prodSubmitButton").setDisabled(false);
		}
	},
	initComponent : function() {
		var me = this;
		me.store = Ext.create('Ext.data.Store', {
					model : 'ProjectFileProblem',
					storeId : 'ptpStore',
					proxy : {
						type : 'ajax',
						url : '/ptProblemAction!searchProductProblemByBCBH.action',
						reader : {
							type : 'json',
							root : 'projectfilelist'
						}
					},
					autoLoad : false
				});
		Ext.applyIf(me, {
			items : [{
				xtype : "container",
				padding : 5,
				layout : "border",
				items : [{
					xtype : "container",
					region : "center",
					layout : "anchor",
					items : [{
						xtype : 'fieldset',
						anchor : "99%",
						title : '文件信息',
						layout : "column",
						items : [{
							xtype : 'fieldcontainer',
							columnWidth : 0.49,
							layout : {
								type : 'anchor'
							},
							defaults : {
								labelWidth : 60,
								allowBlank : false,
								submitValue : false,
								anchor : "99%"
							},
							items : [{
										xtype : 'fieldcontainer',
										layout : {
											type : 'column'
										},
										fieldLabel : 'PCS尺寸',
										items : [{
													xtype : 'numberfield',
													fieldLabel : 'PCS尺寸宽',
													hideLabel : true,
													submitValue : false,
													minValue : 0.01,
													name : 'product.pcsx',
													columnWidth : 0.5
												}, {
													xtype : 'displayfield',
													style : 'text-align:center;',
													value : 'X'
												}, {
													xtype : 'numberfield',

													hideLabel : true,
													minValue : 0.01,
													submitValue : false,
													name : 'product.pcsy',
													fieldLabel : 'PCS尺寸高',
													columnWidth : 0.5
												}]
									}, {
										xtype : 'fieldcontainer',
										layout : {
											type : 'column'
										},
										fieldLabel : 'SET尺寸',
										items : [{
													xtype : 'numberfield',
													name : 'product.setx',
													minValue : 0.01,
													submitValue : false,
													fieldLabel : 'SET尺寸宽',
													hideLabel : true,
													columnWidth : 0.5
												}, {
													xtype : 'displayfield',
													value : 'X'
												}, {
													xtype : 'numberfield',
													minValue : 0.01,
													hideLabel : true,
													submitValue : false,
													name : 'product.sety',
													fieldLabel : 'SET尺寸高',
													columnWidth : 0.5
												}]
									}, {
										xtype : 'numberfield',
										fieldLabel : 'SET拼数',
										name : 'product.setps',
										minValue : 1
									}]
						}, {
							xtype : 'fieldcontainer',
							columnWidth : 0.49,
							layout : {
								type : 'anchor'
							},
							defaults : {
								labelWidth : 60,
								allowBlank : false,
								submitValue : false,
								anchor : "99%"
							},
							items : [{
										xtype : 'textfield',
										fieldLabel : '客户型号',
										name : 'product.projectName'
									}, {
										xtype : 'hiddenfield',
										name : 'product.isoperate'
									}, {
										xtype : 'pubcombo',
										fieldLabel : '层数',
										name : 'product.cs',
										type : 4
									}, {
										xtype : 'textfield',
										fieldLabel : '工程编号',
										submitValue : true,
										name : 'product.bcbh'
									}]
						}, {
							xtype : "textarea",
							columnWidth : 1,
							name : 'product.ptnote',
							labelWidth : 60,
							height : 40,
							fieldLabel : '型号备注',
							maxLength : 500
						}]
					}, {
						xtype : 'fieldset',
						title : '生产需求',
						anchor : "99%",
						layout : {
							type : 'column'
						},
						defaults : {
							columnWidth : 0.49
						},
						items : [{
									xtype : 'fieldcontainer',
									layout : {
										type : 'anchor'
									},
									defaults : {
										labelWidth : 70,
										allowBlank : false,
										submitValue : false,
										anchor : "99%"
									},
									items : [{
												xtype : 'radiogroup',
												fieldLabel : '类型',
												items : [{
															boxLabel : '量产版',
															name : 'product.bcbhtype',
															inputValue : '0',
															checked : true
														}, {
															boxLabel : '样板',
															name : 'product.bcbhtype',
															inputValue : '1'
														}, {
															boxLabel : '报价板',
															name : 'product.bcbhtype',
															inputValue : '2'
														}]
											}, {
												xtype : 'pubcombo',
												fieldLabel : '板材材料',
												name : 'product.bccl',
												type : 5
											}, {
												xtype : 'pubcombo',
												fieldLabel : '板材供应商',
												name : 'product.bcgys',
												type : 3
											}, {
												xtype : 'pubcombo',
												fieldLabel : '板厚',
												name : 'product.bh',
												type : 6
											}, {
												xtype : 'textfield',
												fieldLabel : '文字样式',
												name : 'product.fontcss'
											}, {
												xtype : 'textfield',
												fieldLabel : '阻焊样式',
												name : 'product.zhcss'
											}, {
												xtype : 'pubcombo',
												fieldLabel : '工艺',
												name : 'product.gy',
												type : 2
											}, {
												xtype : 'textfield',
												fieldLabel : '过孔处理',
												name : 'product.gkcl'
											}, {
												xtype : 'datefield',
												fieldLabel : '交货日期',
												format : 'Y-m-d',
												allowBlank : false,
												name : 'product.jhrq'
											}]
								}, {
									xtype : 'fieldcontainer',
									layout : {
										type : 'anchor'
									},
									defaults : {
										labelWidth : 70,
										allowBlank : false,
										submitValue : true,
										anchor : "99%"
									},
									items : [{
												xtype : 'textfield',
												fieldLabel : '样板编号',
												name : 'product.ybbh',
												allowBlank : true
											}, {
												xtype : 'textfield',
												fieldLabel : '产品编号',
												itemId : 'prodId',
												submitValue : true,
												name : 'product.prodId',
												readOnly : true
											}, {
												xtype : 'pubcombo',
												fieldLabel : '外层铜厚',
												name : 'product.wcth',
												type : 7
											}, {
												xtype : 'pubcombo',
												fieldLabel : '内层铜厚',
												name : 'product.ncth',
												type : 8
											}, {
												xtype : 'textfield',
												fieldLabel : '文字颜色',
												name : 'product.fontcolor'
											}, {
												xtype : 'textfield',
												fieldLabel : '阻焊颜色',
												name : 'product.zhcolor'
											}, {
												xtype : 'pubcombo',
												fieldLabel : '成型方式',
												name : 'product.cxfs',
												type : 9
											}, {
												xtype : 'pubcombo',
												fieldLabel : '测试方式',
												name : 'product.csfs',
												type : 10
											}, {
												xtype : 'textfield',
												fieldLabel : '加急类型',
												name : 'product.jjType'
											}]
								}]
					}, {
						xtype : 'textareafield',
						fieldLabel : '需求备注',
						name : 'product.ddxq',
						anchor : "99% -440",
						labelWidth : 60
					}]
				}, {
					xtype : 'fieldcontainer',
					region : "east",
					width : 320,
					layout : "border",
					items : [{
								xtype : "fieldset",
								title : "工程确认处理",
								region : "south",
								defaults : {
									anchor : "99%",
									labelWidth : 70,
									allowBlank : false,
									labelAlign : "left"
								},
								items : [{
											xtype : 'filefield',
											fieldLabel : '文件',
											name : 'attachement'
										}, {
											xtype : 'numberfield',
											fieldLabel : '最小线距',
											name : 'product.minld'
										}, {
											xtype : 'numberfield',
											fieldLabel : '最小线宽',
											name : 'product.minlw'
										}, {
											xtype : 'numberfield',
											fieldLabel : '最小孔径',
											name : 'product.minhole'
										}]
							}, {
								xtype : "propertygrid",
								title : "其它信息",
								region : "center",
								setSource : function(source) {
									var ns = {};
									for (var i in source) {
										if (this.propertyNames
												.hasOwnProperty(i)) {
											if (this.propertyConverter
													.hasOwnProperty(i)) {
												ns[i] = this.propertyConverter[i](source[i]);
											} else {
												ns[i] = source[i];
											}
										}
									}
									this.source = ns;
									this.propStore.setSource(ns);
								},
								propertyConverter : {
									createtime : function(v) {
										if (v > 0) {
											return new Date(v);
										}
										return null;
									},
									isfd : function(v) {
										if (v == 0) {
											return "新单";
										}
										return "返单";
									},
									status : function(v) {
										switch (v) {
											case 0 :
												return "初始化";
											case 1 :
												return "有效";
											case -1 :
												return "作废";
										}
									},
									zftime : function(v) {
										if (v > 0) {
											return new Date(v);
										}
										return null;
									}
									,

								},
								propertyNames : {
									createtime : '创建日期',
									creatorname : '数据录入',
									isfd : '类型',
									num : '需求数量',
									wzgzbnum : "未组工作板数量",
									operatorname : "PCS处理",
									ytl : "预投率",
									status : "订单状态",
									zfperson : "作废人",
									zftime : "作废时间"
									,
								},
								source : {}
							}]
				}]
			}, {
				xtype : "container",
				padding : 5,
				layout : 'border',
				items : [{
							xtype : "fieldset",
							region : "north",
							title : "ECN信息",
							columnWidth : 0.5,
							margin : 2,
							height : 200,
							defaults : {
								anchor : "99%",
								labelWidth : 70,
								labelAlign : "left"
							},
							items : [{
										xtype : "textfield",
										fieldLabel : '原工程编号',
										name : "product.ybcbh"
									}, {
										xtype : "textarea",
										name : "product.ggnr",
										height : 60,
										fieldLabel : '变更内容'
									}, {
										xtype : "textarea",
										name : "product.note",
										anchor : '99% -120',
										fieldLabel : 'ECN备注'
									}]
						}, {
							xtype : 'grid',
							title : "历史修改记录",
							region : 'center',
							store : me.store,
							columns : [{
										header : '问题内容',
										dataIndex : 'description',
										flex : 1
									}, {
										header : '创建时间',
										dataIndex : 'createtime',
										width : 110,
										renderer : Ext.util.Format
												.dateRenderer('Y-m-d H:i')
									}, {
										header : '创建人',
										dataIndex : 'creatorname',
										width : 80
									}, {
										header : '审核时间',
										dataIndex : 'validatetime',
										width : 110,
										renderer : Ext.util.Format
												.dateRenderer('Y-m-d H:i')
									}, {
										header : '审核人',
										dataIndex : 'validatorname',
										width : 80
									}, {
										header : '问题状态',
										dataIndex : 'status',
										width : 80,
										renderer : function(v) {
											switch (v) {
												case 1 :
													return "待审核";
												case 2 :
													return "已审核";
												case 3 :
													return "已作废";
											}
										}
									}]
						}]
			}]
		});
		me.callParent(arguments);
	}

});