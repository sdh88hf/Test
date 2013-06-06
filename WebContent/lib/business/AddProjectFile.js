Ext
		.define(
				'Pcbms.business.AddProjectFile',
				{
					extend : 'Ext.form.Panel',
					alias : "widget.ptadd",
					bodyPadding : 10,
					bcbh : "",
					createBcbh : function() {// 生成工程编号
						var params = {};
						Ext
								.each(
										this.getForm().getFields().items,
										function(item) {
											if (!item.getName()) {
												return;
											}
											if (item.getName().indexOf(
													"projectFile.") < 0) {
												return;
											}
											if (item.getXType() == "filefield") {
												return;
											}
											if (item.getXType() == "radiofield") {
												if (item.getValue()
														&& item.getName() == "projectFile.bcbhtype") {
													params[item.getName()] = item.inputValue;
												} else if (item.getValue()) {
													params[item.getName()] = item.boxLabel;
												}
											} else if (item.getXType() == "displayfield") {

											} else if (item.getValue() != null
													&& item.getValue() != "") {
												params[item.getName()] = item
														.getValue();
											}
										});

						var me = this;
						Ext.Ajax.request({
							url : "/projectFileAction!generateBcbh.action",
							params : params,
							success : new Pcbms.ajaxHandler(
									{
										success : function(str) {
											me.bcbh = str.bcbh;
											me.getForm().findField(
													"projectFile.bcbh")
													.setValue(me.bcbh);
										},
										error : function(r) {
											Ext.Msg.alert('出现错误', '原因 <'
													+ r.msg + ">");
										}
									})
						});

					},
					formsubmit : function() {// 表单提交
						var me = this;
						if (me.bcbh != "") {
							var str = me.getForm().findField("version")
									.getValue();
							this.getForm().findField("projectFile.bcbh")
									.setValue(me.bcbh + str);
						}

						this.getForm().submit({
							url : '/projectFileAction!addProjectFile.action',
							success : function(form, action) {
								Ext.Msg.alert("提示", action.result.msg);
								me.getForm().reset();
								me.bcbh = "";
							},
							failure : Pcbms.formHandler

						});
					},
					initComponent : function() {
						var me = this;
						Ext
								.applyIf(
										me,
										{
											items : [
													{
														xtype : "fieldset",
														width : 650,
														layout : 'column',
														title : "产品型号基本信息",
														items : [
																{
																	columnWidth : .5,
																	defaults : {
																		xtype : "textfield",
																		labelWidth : 60,
																		anchor : "95%",
																		allowBlank : false
																	},
																	border : false,
																	layout : "anchor",
																	items : [

																			{
																				fieldLabel : '工程编号',
																				name : 'projectFile.bcbh',
																				allowBlank : true
																			},
																			{
																				xtype : 'textfield',
																				fieldLabel : '所属客户',
																				name : 'projectFile.clientid',
																				readOnly : true,
																				listeners : {
																					focus : function() {
																						if (!this.clientWindow) {
																							this.clientWindow = Ext
																									.create(
																											"Ext.window.Window",
																											{
																												width : 750,
																												closeAction : 'hide',
																												height : 300,
																												modal : true,
																												title : '客户选择',
																												layout : 'fit',
																												items : [ {
																													xtype : "clientgrid",
																													target : this
																												} ]
																											});

																						}

																						this.clientWindow
																								.show();
																					}
																				}
																			} ]
																},
																{
																	columnWidth : .5,
																	defaults : {
																		xtype : "textfield",
																		labelWidth : 60,
																		anchor : "95%",
																		allowBlank : false
																	},
																	layout : "anchor",
																	border : false,
																	items : [ {
																		xtype : 'fieldcontainer',
																		layout : {
																			type : 'column'
																		},
																		fieldLabel : '版本号',
																		items : [
																				{
																					xtype : 'textfield',
																					value : 'A01',
																					minLength : 3,
																					maxLength : 3,
																					name : 'version',
																					allowBlank : false,
																					columnWidth : 0.6
																				},
																				{
																					xtype : 'button',
																					columnWidth : 0.4,
																					text : '生成工程编号',
																					handler : function() {
																						me
																								.createBcbh();
																					}
																				} ]
																	} ]
																} ]
													},
													{
														xtype : "fieldset",
														width : 650,
														layout : 'column',
														title : "产品型号详细信息",
														items : [
																{
																	columnWidth : .5,
																	defaults : {
																		xtype : "textfield",
																		labelWidth : 60,
																		anchor : "95%",
																		allowBlank : false
																	},
																	layout : "anchor",
																	border : false,
																	items : [
																			{
																				xtype : 'textfield',
																				fieldLabel : '客户型号',
																				name : 'projectFile.projectName'
																			},
																			{
																				xtype : 'pubcombo',
																				fieldLabel : '层数',
																				name : 'projectFile.cs',
																				labelWidth : 60,
																				type : 4
																			},
																			{
																				xtype : 'radiogroup',
																				fieldLabel : '过孔处理',
																				items : [
																						{
																							xtype : 'radiofield',
																							checked : true,
																							name : 'projectFile.gkcl',
																							boxLabel : '常规',
																							inputValue : '常规'
																						},
																						{
																							xtype : 'radiofield',
																							name : 'projectFile.gkcl',
																							boxLabel : '盖孔',
																							inputValue : '盖孔'
																						},
																						{
																							xtype : 'radiofield',
																							name : 'projectFile.gkcl',
																							boxLabel : '开窗',
																							inputValue : '开窗'
																						},
																						{
																							xtype : 'radiofield',
																							name : 'projectFile.gkcl',
																							boxLabel : '塞油',
																							inputValue : '塞油'
																						} ]
																			},
																			{
																				xtype : 'pubcombo',
																				fieldLabel : '外层铜厚',
																				name : 'projectFile.wcth',
																				type : 7
																			},
																			{
																			xtype : 'pubcombo',
																				fieldLabel : '内层铜厚',
																				allowBlank : true,
																				name : 'projectFile.ncth',
																				type : 8
																			} ]
																},
																{
																	columnWidth : .5,
																	defaults : {
																		xtype : "textfield",
																		labelWidth : 60,
																		anchor : "95%",
																		allowBlank : false
																	},
																	layout : "anchor",
																	border : false,
																	items : [
																			{
																				xtype : 'filefield',
																				fieldLabel : '客户文件',
																				name : 'projectFile.customerFile',

																				buttonText : '选择文件',
																				flex : 1
																			},
																			{
																				xtype : 'fieldcontainer',
																				layout : {
																					type : 'column'
																				},
																				fieldLabel : 'PCS尺寸',
																				items : [
																						{
																							xtype : 'numberfield',
																							allowBlank : false,
																							minValue : 0.01,
																							name : 'projectFile.pcsx',
																							columnWidth : 0.5
																						},
																						{
																							xtype : 'displayfield',
																							style : 'text-align:center;',
																							value : 'X'
																						},
																						{
																							xtype : 'numberfield',
																							allowBlank : false,
																							minValue : 0.01,
																							name : 'projectFile.pcsy',
																							columnWidth : 0.5
																						} ]
																			},
																			{
																				xtype : 'numberfield',
																				fieldLabel : 'SET拼数',
																				name : 'projectFile.setps',
																				allowBlank : false,
																				value : 1,
																				minValue : 1
																			},
																			{
																				xtype : 'fieldcontainer',
																				layout : {
																					type : 'column'
																				},
																				fieldLabel : 'SET尺寸',
																				flex : 1,
																				items : [
																						{
																							xtype : 'numberfield',
																							allowBlank : false,
																							minValue : 0.01,
																							name : 'projectFile.setx',
																							columnWidth : 0.5
																						},
																						{
																							xtype : 'displayfield',
																							value : 'X'
																						},
																						{
																							xtype : 'numberfield',
																							allowBlank : false,
																							minValue : 0.01,
																							name : 'projectFile.sety',
																							columnWidth : 0.5
																						} ]
																			} ]
																} ]
													},
													{
														xtype : 'textareafield',
														fieldLabel : '型号备注',
														name : 'projectFile.ptnote',
														width : 650,
														height : 150,
														maxLength : 500,
														labelAlign : "top",
														labelWidth : 60
													},
													{
														xtype : 'container',
														width : 650,
														layout : {
															pack : 'center',
															type : 'hbox'
														},
														items : [ {
															xtype : 'button',
															iconCls : "ProductModelAdd",
															text : '创建产品型号',
															flex : 1,
															handler : function() {
																me.formsubmit();
															}
														} ]
													} ]
										});

						me.callParent(arguments);

						me.getForm().isValid();
					}

				});