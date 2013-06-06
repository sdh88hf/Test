/**
 * 历史工程文件列表
 */
Ext.define("Pcbms.product.PSFileList", {
	extend : "Pcbms.CommonGridPanel",
	alias : "widget.psfilegrid",
	model : "PSFileBean",
	url : "/projectAction!listPsFile.action",
	statusData : [[-1, "全部文件"], [0, "存档文件"], [1, "未审核"], [2, "已审核"]],
	initComponent : function() {
		var me = this;
		var columns = [{
					header : "文件编号",
					width : 100,
					dataIndex : "psfileId"
				}, {
					header : "文件名称",
					width : 120,
					dataIndex : "projectName"
				}, {
					header : "状态",
					width : 70,
					dataIndex : "status",
					renderer : function(v) {
						for (var i = 0; i < me.statusData.length; i++) {

							if (v == me.statusData[i][0]) {
								return me.statusData[i][1];
							}
						}
						return "异常状态";
					}
				}, {
					header : "创建日期",
					dataIndex : "createDate",
					width : 120,
					renderer : Ext.util.Format.dateRenderer("Y-m-d H:i")
				}, {
					header : "处理人",
					width : 80,
					dataIndex : "creator"
				},{
					header : "层数",
					width : 80,
					dataIndex : "cs"
				}, {
					header : "尺寸信息",
					width : 120,
					renderer : Pcbms.ProjectSizeRenderer
				}, {
					header : "铜厚",
					dataIndex : "wcth",
					renderer : function(v, m, r) {
						if (isNaN(v)) {
							return "";
						} else {
							return v;
						}
					},
					width : 65
				},{
					header : '备注信息',
					dataIndex : 'note',
					flex : 1
				}];
		var downloadAction = Ext.create('Ext.Action', {
					disabled : true,
					text : '原文件下载',
					iconCls : 'projectfile',
					handler : function() {
						var r = me.sel.getSelection()[0];
						Pcbms.downFile("projectfile", r.get("bcbh"));
					},
					sf : function(selections) {
						return selections.length != 1;
					}
				});
		var psdownloadAction = Ext.create('Ext.Action', {
					disabled : true,
					text : '工程文件下载',
					iconCls : 'projectfile',
					handler : function() {
						var r = me.sel.getSelection()[0];
						//
					},
					sf : function(selections) {
						return selections.length != 1;
					}
				});
		var searchs = [{
					fieldLabel : "请输入关键词",
					xtype : 'textfield',
					labelWidth : 95,
					width : 300,
					name : "psfile.psfileId"
				}, {
					xtype : "combobox",
					store : me.statusData,
					fieldLabel : "状态",
					labelWidth : 60,
					value : -1,
					name : "psfile.status"
				}, 'n', {
					xtype : 'daterangefield',
					fieldLabel : '处理日期',
					labelWidth : 60,
					width : 370,
					tshow : true,
					startname : 'start',
					endname : 'end'
				}, {
					xtype : "empcombo",
					cn : "lockedperson",
					fieldLabel : "处理人",
					labelWidth : 60,
					tshow : true,
					name : "psfile.creator"
				}];
		me.items = me.genItems(columns, searchs, [downloadAction,
						psdownloadAction]);
		this.callParent(arguments);
	}
});

Ext.define('Pcbms.product.DetailProduct', {
	extend : 'Ext.form.Panel',
	alias : "widget.ptdetail",
	bodyPadding : 10,
	bcbh : "",
	formsubmit : function() {// 表单提交
		var me = this;
		if (this.bcbh != "") {
			var str = me.getForm().findField("version1").getValue()
					+ me.getForm().findField("version2").getValue()
					+ me.getForm().findField("version3").getValue();
			this.getForm().findField("projectFile.bcbh")
					.setValue(me.bcbh + str);
		}

		this.getForm().submit({
					url : '/projectFileAction!updateProjectFile.action',
					success : function(form, action) {
						Ext.Msg.alert("提示", action.result.msg);
						me.getForm().reset();
						me.up("window").close();
					},
					failure : Pcbms.formHandler

				});
	},
	loadData : function(data) {
		var me = this;
		me.data = data;
		Ext.each(me.getForm().getFields().items, function(i) {
			if (i.getName()) {

				if (i.getXType() == "radiofield") {

					if (data[i.getName().replace("projectFile.", "")] == i.boxLabel
							|| data[i.getName().replace("projectFile.", "")] == i.inputValue) {
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
									fieldLabel : '工程编号',
									labelWidth : 60,
									name : 'projectFile.bcbh',
									allowBlank : false,
									itemId : 'bcbhitem',
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
									readOnly : true,
									listeners : {
										focus : function() {
											if (!this.clientWindow) {
												this.clientWindow = Ext.create(
														"Ext.window.Window", {
															width : 750,
															closeAction : 'hide',
															height : 300,
															modal : true,
															title : '客户选择',
															layout : 'fit',
															items : [{
																xtype : "clientgrid",
																target : this
															}]
														});

											}

											this.clientWindow.show();

										}
									}
								}]
					}, {
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
									xtype : 'filefield',
									fieldLabel : '客户文件',
									name : 'projectFile.customerFile',
									labelWidth : 60,
									width : 200,
									margin : '0 0 0 10',
									columnWidth : 0.3,
									// allowBlank : false,
									buttonText : '选择文件'
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
					}, {
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
									allowBlank : false,
									name : 'projectFile.ncth',
									type : 8,
									labelWidth : 75,
									columnWidth : 0.4
								}, {
									xtype : 'radiogroup',
									columnWidth : .4,
									fieldLabel : '文字样式',
									labelWidth : 60,
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
													if (Ext
															.typeOf(n["fontcolor"]) == "string") {
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
													if (Ext
															.typeOf(n["zhcolor"]) == "string") {
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
								}, {
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
								}, {
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
								}, {

									xtype : 'numberfield',
									fieldLabel : '最小线距',
									name : 'projectFile.minld',
									itemId : 'minld',
									validator : function(v) {
										if (v != "") {

											if (v < 0) {
												return "不能小于0";
											}
										}

										return true;
									},
									labelWidth : 60,
									columnWidth : 0.4

								}, {

									xtype : 'numberfield',
									fieldLabel : '最小线宽',
									name : 'projectFile.minlw',
									itemId : 'minlw',
									validator : function(v) {
										if (v != "") {

											if (v < 0) {
												return "不能小于0";
											}
										}

										return true;
									},
									labelWidth : 60,
									columnWidth : 0.4

								}, {

									xtype : 'numberfield',
									fieldLabel : '最小孔径',
									name : 'projectFile.minhole',
									itemId : 'minhole',
									validator : function(v) {
										if (v != "") {

											if (v < 0) {
												return "不能小于0";
											}
										}

										return true;
									},
									labelWidth : 60,
									columnWidth : 0.4

								}

						]
					}, {
						xtype : 'textareafield',
						fieldLabel : '订单需求',
						name : 'projectFile.ddxq',
						labelWidth : 60,
						width : 850
					}, {
						xtype : 'container',
						layout : {
							type : 'column'
						},
						items : [{
									xtype : 'textfield',
									fieldLabel : 'Ecn编号',
									labelWidth : 60,
									columnWidth : 0.4
								}, {
									xtype : 'button',
									text : '原工程文件下载',
									flex : 1,
									handler : function() {
										downFile("/downloadAction!downloadBCBHDataFile.action?bcbh="
												+ me.down("#bcbhitem")
														.getValue());
									}
								}, {
									xtype : 'button',
									text : '客户文件下载',
									flex : 1,
									handler : function() {
										downFile("/downloadAction!downloadClientDataFile.action?bcbh="
												+ me.down("#bcbhitem")
														.getValue());
									}
								}, {
									xtype : 'button',
									text : '工程文件上传',
									flex : 1,
									handler : function() {
										if (!me.uploadWindow) {

											me.uploadForm = Ext.create(
													"Ext.form.Panel", {
														bodyPadding : 10,
														layout : 'anchor',
														items : [{
															xtype : 'filefield',
															fieldLabel : '文件',
															name : 'attachement',
															allowBlank : false,
															labelWidth : 60,
															flex : 1
														}, {
															xtype : 'numberfield',
															fieldLabel : '最小线距',
															value : me
																	.down("#minld")
																	.getValue(),
															name : 'pt.minld',
															allowBlank : false,
															labelWidth : 60,
															flex : 1
														}, {
															xtype : 'numberfield',
															fieldLabel : '最小线宽',
															value : me
																	.down("#minlw")
																	.getValue(),
															name : 'pt.minlw',
															allowBlank : false,
															labelWidth : 60,
															flex : 1
														}, {
															xtype : 'numberfield',
															fieldLabel : '最小孔径',
															value : me
																	.down("#minhole")
																	.getValue(),
															name : 'pt.minhole',
															allowBlank : false,
															labelWidth : 60,
															flex : 1
														}]

													});
											me.uploadWindow = Ext.create(
													"Ext.window.Window", {
														layout : 'fit',
														closeAction : 'hidden',
														width : 300,
														height : 250,
														title : '附件上传',
														items : me.uploadForm,
														buttons : [{
															text : '上传',
															handler : function() {
																me.uploadForm
																		.getForm()
																		.submit(
																				{
																					url : "/uploadAction!uploadBCBHDataFile.action",
																					params : {
																						fileName : me.bcbh,
																						'pt.cs' : me.data["cs"],
																						'pt.bcbh' : me.data["bcbh"],
																						'pt.wcth' : me.data["wcth"],
																						'pt.ncth' : me.data["ncth"],
																						'prodId' : me.data["prodId"]
																					},
																					success : function(
																							form,
																							action) {
																						Ext.Msg
																								.alert(
																										"提示",
																										action.result.msg);
																						me.uploadForm
																								.getForm()
																								.reset();
																						me.uploadForm
																								.up("window")
																								.close();
																						me.ownerCt
																								.close();
																					},
																					failure : Pcbms.formHandler
																				});
															}
														}]
													});

										}

										me.uploadWindow.show();
									}
								}]
					}, {
						xtype : 'textareafield',
						fieldLabel : '更改内容',
						name : 'projectFile.ggnr',
						labelWidth : 60,
						width : 850
					}, {
						xtype : 'textareafield',
						fieldLabel : '备注',
						name : 'projectFile.note',
						labelWidth : 60,
						width : 850
					}]
		});

		me.callParent(arguments);
	}

});