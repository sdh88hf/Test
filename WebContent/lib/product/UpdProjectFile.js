Ext
		.define(
				'Pcbms.product.UpdProjectFile',
				{
					extend : 'Ext.form.Panel',
					alias : "widget.ptupd",
					bodyPadding : 5,
					bcbh : "",
					layout:'border',
					border:false,
					formsubmit : function() {// 表单提交
						var me = this;
						if (this.bcbh != "") {
							var str = me.getForm().findField("version1")
									.getValue()
									+ me.getForm().findField("version2")
											.getValue()
									+ me.getForm().findField("version3")
											.getValue();
							this.getForm().findField("projectFile.bcbh")
									.setValue(me.bcbh + str);
						}
						this
								.getForm()
								.submit(
										{
											url : '/projectFileAction!updateProjectFile.action',
											success : function(form, action) {
												Ext.Msg.alert("提示",
														action.result.msg);
												me.getForm().reset();
												me.up("window").close();
											},
											failure : Pcbms.formHandler
										});
					},
					loadData : function(data) {
						var me = this;
						Ext
								.each(
										me.getForm().getFields().items,
										function(i) {
											if (i.getName()) {
												if (i.getXType() == "radiofield") {
													if (data[i
															.getName()
															.replace(
																	"projectFile.",
																	"")] == i.boxLabel
															|| data[i
																	.getName()
																	.replace(
																			"projectFile.",
																			"")] == i.inputValue) {
														i.setValue(true);
													} else {
														i.setValue(false);
													}
												}
												if (i.getName().indexOf(
														"projectFile.") >= 0) {
													i
															.setValue(data[i
																	.getName()
																	.replace(
																			"projectFile.",
																			"")]);
												}
											}
										});
					},
					initComponent : function() {
						var me = this;
						Ext
								.applyIf(
										me,
										{
											tbar : [
													{
														text : '客户文件',
														handler : function(b) {
															downFile("/downloadAction!downloadClientDataFile.action?bcbh="
																	+ me
																			.down(
																					"#bcbh")
																			.getValue());
														}
													},
													{
														text : '工程文件下载',
														disabled : true,
														handler : function(b) {
															downFile("/downloadAction!downloadBCBHDataFile.action?bcbh="
																	+ me
																			.down(
																					"#bcbh")
																			.getValue());
														}
													},
													{
														text : 'ECN原工程文件下载',
														disabled : true,
														handler : function() {
															downFile("/downloadAction!downloadBCBHDataFile.action?bcbh="
																	+ me
																			.down(
																					"#bcbh")
																			.getValue());
														}
													} ],
											items: [{
												xtype:"propertygrid",
												title:"其它信息",
												region:"east",
												width : 220,
												margin:'0 0 0 5',
												setSource: function(source) {
													var ns = {};
											        for(var i in source){
											        	if(this.propertyNames.hasOwnProperty(i)){
											        		if(this.propertyConverter.hasOwnProperty(i)){
											        			ns[i] = this.propertyConverter[i](source[i]);
											        		}else{
											        			ns[i] = source[i];
											        		}
											        	}
											        }
											        this.source = ns;
											        this.propStore.setSource(ns);
											    },
											    propertyConverter: {
													createtime: function(v){
														if(v > 0){
										            		return new Date(v);
										            	}
										            	return null;
													},
										            status:function(v){
										            	switch(v){
										            	case 0:
										            		return "初始化";
										            	case 1:
										            		return "有效";
										            	case -1:
										            		return "作废";
										            	}
										            },
										            zftime:function(v){
										            	if(v > 0){
										            		return new Date(v);
										            	}
										            	return null;
													},
													
										        },
												propertyNames: {
														createtime: '创建日期',
														creatorname: '数据录入',
											            operatorname:"PCS处理",
											            ytl:"预投率",
											            status:"文件状态",
											            zfperson:"作废人",
											            zftime:"作废时间",
											        },
											        source: {}
											},{
												xtype:"fieldcontainer",
												region:"center",
												layout:'anchor',
												items : [
															{
																xtype : "fieldset",
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
																			xtype:"fieldcontainer",
																			border : false,
																			layout : "anchor",
																			items : [

																					{
																						fieldLabel : '工程编号',
																						name : 'projectFile.bcbh',
																						allowBlank : true
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
																			xtype:"fieldcontainer",
																			layout : "anchor",
																			border : false,
																			items : [ {
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
																		}, ]
															},
															{
																xtype : "fieldset",
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
																			xtype:"fieldcontainer",
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
																			xtype:"fieldcontainer",
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
																						minValue : 1,
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
																xtype : "fieldset",
																layout : 'column',
																title : "工程处理信息",
																items : [
																		{
																			columnWidth : .5,
																			defaults : {
																				xtype : "textfield",
																				labelWidth : 60,
																				anchor : "95%",
																				allowBlank : false
																			},
																			xtype:"fieldcontainer",
																			layout : "anchor",
																			border : false,
																			items : [
																					{
																						xtype : 'textfield',
																						fieldLabel : '最小线宽',
																						readOnly : true,
																						name : 'projectFile.minlw'
																					},
																					{
																						xtype : 'textfield',
																						fieldLabel : '最小线距',
																						readOnly : true,
																						name : 'projectFile.minld'
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
																			xtype:"fieldcontainer",
																			layout : "anchor",
																			border : false,
																			items : [ {
																				xtype : 'textfield',
																				fieldLabel : '最小孔径',
																				name : 'projectFile.minhole'
																			} ]
																		} ]
															},
															{
																xtype : 'textareafield',
																fieldLabel : '型号备注',
																name : 'projectFile.ptnote',
																anchor:"99% -340",
																labelAlign : "top",
																labelWidth : 60
															} ]
											}],
											
										});

						me.callParent(arguments);

						if (me.detail) {
							// me.down("#submitBtn").destroy();
							// me.down("#clientfile").destroy();
						}
					}

				});