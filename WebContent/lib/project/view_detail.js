Ext.define('Pcbms.view.infoProjectFile', {
	extend : 'Ext.form.Panel',
	alias : "widget.ptinfo",
	bodyPadding : 10,
	bcbh : "",
	loadData : function(data) {
		var me = this;
		Ext.each(me.getForm().getFields().items, function(i) {
			if (i.getName()) {

				if (i.getXType() == "radiofield") {
					if (data[i.getName().replace("projectFile.", "")] == i.boxLabel || data[i.getName().replace("projectFile.", "")] == i.inputValue) {
						i.setValue(true);
					} else {
						i.setValue(false);
					}

				}

				if (i.getName().indexOf("projectFile.") >= 0) {
					i.setValue(data[i.getName().replace("projectFile.", "")]);
				}

			}

		});
	},
	initComponent : function() {
		var me = this;

		Ext.applyIf(me, {
			items : [{
						xtype : 'container',
						defaults : {
							margins : '0 10 0 0'
						},
						layout : {
							type : 'hbox'
						},
						items : [{
									xtype : 'radiogroup',
									fieldLabel : '类型',
									labelWidth : 60,
									width : 300,
									items : [{
												boxLabel : '量产版',
												name : 'projectFile.bcbhtype',
												inputValue : '0',
												checked : true
											}, {
												boxLabel : '样板',
												name : 'projectFile.bcbhtype',
												inputValue : '1'
											}, {
												boxLabel : '报价板',
												name : 'projectFile.bcbhtype',
												inputValue : '2'
											}]
								}]
					},{
						xtype : 'container',
						defaults : {
							margins : '0 10 0 0'
						},
						layout : {
							type : 'hbox'
						},
						items : [{
									xtype : 'textfield',
									fieldLabel : '工程编号',
									labelWidth : 60,
									name : 'projectFile.bcbh',
									allowBlank : false,
									readOnly : true
								}, {
									xtype : 'textfield',
									fieldLabel : '处理人',
									labelWidth : 60,
									name : 'projectFile.operatorname',
									readOnly : true
								}]
					}, {
						xtype : 'container',
						defaults : {
							margins : '0 10 0 0'
						},
						layout : {
							type : 'hbox'
						},
						items : [{
									xtype : 'textfield',
									fieldLabel : '样板编号',
									name : 'projectFile.ybbh',
									labelWidth : 60
								}, {
									xtype : 'textfield',
									fieldLabel : '客户编号',
									labelWidth : 60,
									allowBlank : false,
									name : 'projectFile.clientid',
									readOnly : true
								}]
					},{
				xtype : 'fieldset',
				width : 850,
				title : '文件信息',
				layout : "column",
				items : [{
							xtype : 'fieldcontainer',
							columnWidth : 0.51,
							layout : {
								type : 'column'
							},
							fieldLabel : 'PCS尺寸',
							labelWidth : 60,
							items : [{
										xtype : 'numberfield',
										allowBlank : false,
										fieldLabel : 'PCS尺寸宽',
										hideLabel : true,
										minValue : 0.01,
										name : 'projectFile.pcsx',
										columnWidth : 0.5
									}, {
										xtype : 'displayfield',
										style : 'text-align:center;',
										value : 'X'
									}, {
										xtype : 'numberfield',
										allowBlank : false,
										hideLabel : true,
										minValue : 0.01,
										name : 'projectFile.pcsy',
										fieldLabel : 'PCS尺寸高',
										columnWidth : 0.5
									}]
						}, {
							xtype : 'button',
							text : '客户文件下载'
						}, {
							xtype : 'fieldcontainer',
							layout : {
								type : 'column'
							},
							fieldLabel : 'SET尺寸',
							columnWidth : 0.51,
							labelWidth : 60,
							items : [{
										xtype : 'numberfield',
										allowBlank : false,
										name : 'projectFile.setx',
										minValue : 0.01,
										fieldLabel : 'SET尺寸宽',
										hideLabel : true,
										columnWidth : 0.5
									}, {
										xtype : 'displayfield',
										value : 'X'
									}, {
										xtype : 'numberfield',
										allowBlank : false,
										minValue : 0.01,
										hideLabel : true,
										name : 'projectFile.sety',
										fieldLabel : 'SET尺寸高',
										columnWidth : 0.5
									}]
						}, {
							xtype : 'numberfield',
							fieldLabel : 'SET拼数',
							name : 'projectFile.setps',
							margin : '0 0 0 10',
							minValue : 1,
							allowBlank : false,
							columnWidth : 0.3,
							labelWidth : 60
						}, {
							xtype : 'textfield',
							fieldLabel : '客户型号',
							labelWidth : 60,
							allowBlank : false,
							name : 'projectFile.projectName',
							columnWidth : 0.51
						}, {
							xtype : 'pubcombo',
							columnWidth : 0.3,
							margin : '0 0 0 10',
							fieldLabel : '层数',
							allowBlank : false,
							name : 'projectFile.cs',
							labelWidth : 60,
							type : 4
						}]
			},{
				xtype : 'fieldset',
				title : '生产需求',
				width : 850,
				defaults : {
					margin : '0 10 10 0'
				},
				layout : {
					type : 'column'
				},
				items : [{
							xtype : 'pubcombo',
							fieldLabel : '板材材料',
							allowBlank : false,
							name : 'projectFile.bccl',
							labelWidth : 60,
							type : 5,
							columnWidth : 0.4
						}, {
							xtype : 'pubcombo',
							fieldLabel : '板材供应商',
							allowBlank : false,
							name : 'projectFile.bcgys',
							labelWidth : 75,
							type : 3,
							columnWidth : 0.4
						}, {
							xtype : 'pubcombo',
							fieldLabel : '板厚',
							allowBlank : false,
							name : 'projectFile.bh',
							labelWidth : 60,
							type : 6,
							columnWidth : 0.4
						}, {
							xtype : 'pubcombo',
							fieldLabel : '工艺',
							name : 'projectFile.gy',
							allowBlank : false,
							labelWidth : 75,
							type : 2,
							columnWidth : 0.4
						}, {
							xtype : 'pubcombo',
							fieldLabel : '外层铜厚',
							allowBlank : false,
							labelWidth : 60,
							name : 'projectFile.wcth',
							type : 7,
							columnWidth : 0.4
						}, {
							xtype : 'pubcombo',
							fieldLabel : '内层铜厚',
							name : 'projectFile.ncth',
							type : 8,
							labelWidth : 75,
							columnWidth : 0.4
						}, {
							xtype : 'radiogroup',
							columnWidth : .4,
							fieldLabel : '文字样式',
							labelWidth : 60,
							listeners : {
								change : function(e, n, o) {
									if (n["projectFile.fontcss"]) {
										if (Ext
												.typeOf(n["projectFile.fontcss"]) == "string") {
											if (n["projectFile.fontcss"] == "无") {
												Ext.getCmp("updfc")
														.setDisabled(true);
											} else {
												Ext.getCmp("updfc")
														.setDisabled(false);
											}
										}
									}

								}
							},
							items : [{
										xtype : 'radiofield',
										boxLabel : '顶层',
										name : 'projectFile.fontcss',
										checked : true,
										inputValue : '顶层'
									}, {
										xtype : 'radiofield',
										name : 'projectFile.fontcss',
										boxLabel : '双面',
										inputValue : '双面'
									}, {
										xtype : 'radiofield',
										name : 'projectFile.fontcss',
										boxLabel : '底层',
										inputValue : '底层'
									}, {
										xtype : 'radiofield',
										name : 'projectFile.fontcss',
										boxLabel : '无',
										inputValue : '无'
									}]
						}, {
							xtype : 'fieldcontainer',
							columnWidth : .4,
							layout : {
								type : 'column'
							},
							items : [{
								xtype : 'radiogroup',
								fieldLabel : '文字颜色',
								labelWidth : 60,
								name : 'fontcolorrg',
								columnWidth : .9,
								listeners : {
									change : function(e, n, o) {
										if (n["fontcolor"]) {
											if (Ext.typeOf(n["fontcolor"]) == "string") {
												me
														.getForm()
														.findField("projectFile.fontcolor")
														.setValue(n["fontcolor"]);
											}
										}
									}
								},
								items : [{
											xtype : 'radiofield',
											name : 'fontcolor',
											checked : true,
											boxLabel : '白',
											inputValue : '白'
										}, {
											xtype : 'radiofield',
											name : 'fontcolor',
											boxLabel : '黑',
											inputValue : '黑'
										}, {
											xtype : 'radiofield',
											name : 'fontcolor',
											boxLabel : '绿',
											inputValue : '绿'
										}]
							}, {
								xtype : 'textfield',
								width : 105,
								name : 'projectFile.fontcolor',
								fieldLabel : '文字颜色',
								listeners : {},
								labelWidth : 60,
								size : 10
							}]
						}, {
							xtype : 'radiogroup',
							columnWidth : .4,
							fieldLabel : '阻焊样式',
							labelWidth : 60,
							listeners : {
								change : function(e, n, o) {
									if (n["projectFile.zhcss"]) {
										if (Ext.typeOf(n["projectFile.zhcss"]) == "string") {
											if (n["projectFile.zhcss"] == "无") {
												Ext.getCmp("updzc")
														.setDisabled(true);
											} else {
												Ext.getCmp("updzc")
														.setDisabled(false);
											}

										}
									}

								}
							},
							items : [{
										xtype : 'radiofield',
										name : 'projectFile.zhcss',
										checked : true,
										boxLabel : '顶层',
										inputValue : '顶层'
									}, {
										xtype : 'radiofield',
										name : 'projectFile.zhcss',
										boxLabel : '双面',
										inputValue : '双面'
									}, {
										xtype : 'radiofield',
										name : 'projectFile.zhcss',
										boxLabel : '底层',
										inputValue : '底层'
									}, {
										xtype : 'radiofield',
										name : 'projectFile.zhcss',
										boxLabel : '无',
										inputValue : '无'
									}]
						}, {
							xtype : 'fieldcontainer',
							columnWidth : .4,
							layout : {
								type : 'column'
							},
							fieldLabel : '',
							items : [{
								xtype : 'radiogroup',
								fieldLabel : '阻焊颜色',
								name : 'zhcolorrg',
								labelWidth : 60,
								width : 300,
								columnWidth : .9,
								listeners : {
									change : function(e, n, o) {
										if (n["zhcolor"]) {
											if (Ext.typeOf(n["zhcolor"]) == "string") {
												me
														.getForm()
														.findField("projectFile.zhcolor")
														.setValue(n["zhcolor"]);
											}
										}
									}
								},
								items : [{
											xtype : 'radiofield',
											name : 'zhcolor',
											checked : true,
											boxLabel : '白',
											inputValue : '白'
										}, {
											xtype : 'radiofield',
											name : 'zhcolor',
											boxLabel : '黑',
											inputValue : '黑'
										}, {
											xtype : 'radiofield',
											name : 'zhcolor',
											fieldLabel : '',
											boxLabel : '绿',
											inputValue : '绿'
										}]
							}, {
								xtype : 'textfield',
								width : 105,
								fieldLabel : '阻焊颜色',
								listeners : {},
								name : 'projectFile.zhcolor',
								labelWidth : 60,
								size : 10
							}]
						},{
							xtype : 'radiogroup',
							columnWidth : 0.61,
							fieldLabel : '过孔处理',
							labelWidth : 60,
							items : [{
										xtype : 'radiofield',
										checked : true,
										name : 'projectFile.gkcl',
										boxLabel : '常规',
										inputValue : '常规'
									}, {
										xtype : 'radiofield',
										name : 'projectFile.gkcl',
										boxLabel : '盖孔',
										inputValue : '盖孔'
									}, {
										xtype : 'radiofield',
										name : 'projectFile.gkcl',
										boxLabel : '开窗',
										inputValue : '开窗'
									}, {
										xtype : 'radiofield',
										name : 'projectFile.gkcl',
										boxLabel : '塞油',
										inputValue : '塞油'
									}]
						},{
							xtype : 'pubcombo',
							fieldLabel : '成型方式',
							allowBlank : false,
							name : 'projectFile.cxfs',
							type : 9,
							labelWidth : 60,
							columnWidth : 0.4
						}, {
							xtype : 'pubcombo',
							fieldLabel : '测试方式',
							allowBlank : false,
							name : 'projectFile.csfs',
							labelWidth : 60,
							type : 10,
							columnWidth : 0.4
						}

				]
			},  {
						xtype : 'textareafield',
						fieldLabel : '订单需求',
						name : 'projectFile.ddxq',
						labelWidth : 60,
						width : 850
					}, {
						xtype : 'container',
						itemId : 'submitBtn',
						layout : {
							pack : 'center',
							type : 'hbox'
						},
						items : [{
									xtype : 'button',
									text : '修改产品型号',
									handler : function() {
										me.formsubmit();
									}
								}]
					}]
		});
		
		me.callParent(arguments);
		
		if(me.detail){
			me.down("#submitBtn").destroy();
		}
	}

});