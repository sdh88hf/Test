/**
 * 根据原有的工作板处理返单
 */
function ugtime2Hour(ugtime) {
	var index = ugtime.indexOf('H');
	if (index == (ugtime.length - 1)) {
		return Number(ugtime.substring(0, index));
	}
	index = ugtime.indexOf('天');
	if (index == (ugtime.length - 1)) {
		return Number(ugtime.substring(0, index)) * 24;
	}
	return 0;
}
function hour2Ugtime(hour) {
	if (hour <= 72) {
		return hour + "H";
	}
	return hour / 24 + "天";
}
Ext
		.define(
				'Pcbms.product.RemakeWorkBoard',
				{
					extend : 'Ext.form.Panel',
					alias : "widget.wbremake",
					layout : "border",
					border : false,
					bodyPadding : 5,
					loadNumGrid : function(s, wbid, sp) {
						// 加载填写拼板数的列表 和 工作板信息
						var me = this;
						var numgrid = me.down("#numgrid");
						numgrid.store.removeAll();
						var hour = 99999;
						for ( var i = 0; i < s.length; i++) {
							s[i].raw.num = 0;
							numgrid.store.insert(i, s[i].raw);
							var tp = ugtime2Hour(s[i].raw.jjType);
							if (tp < hour) {
								hour = tp;
							}
						}
						var form = me.getForm();
						var formvalues = {};
						for ( var i in sp) {
							formvalues["workBoardInfo." + i] = sp[i];
						}
						formvalues["workBoardInfo.gzkyxj"] = hour2Ugtime(hour);
						formvalues["workBoardInfo.jhrq"] = new Date(new Date()
								.getTime()
								+ hour * 60 * 60 * 1000);
						formvalues["workBoardInfo.wbid"] = wbid;
						formvalues["workBoardInfo.num"] = "";
						formvalues["workBoardInfo.note"] = "";
						form.setValues(formvalues);
					},
					showParamWindow : function(n) {// 弹出填写参数列表的窗口
						var me = this;
						var numgrid = me.down("#stepgrid");
						var params = numgrid.store.getAt(n).data["stepParams"];
						me.wpForm = Ext
								.create(
										"Ext.form.Panel",
										{
											bodyPadding : 10,
											autoScroll : true,
											layout : {
												align : 'stretch',
												type : 'vbox'
											},
											buttons : [ {
												text : '确定',
												handler : function() {
													if (me.wpForm.getForm()
															.isValid()) {
														Ext
																.each(
																		me.wpForm
																				.getForm()
																				.getFields().items,
																		function(
																				v) {
																			if (v
																					.getXType() == "raidofield") { // 如果是单选框
																				for ( var i = 0; i < params.length; i++) {
																					if (v.name == ("stepparam_" + params[i].id)) {
																						params[i]["paramvalue"] = v
																								.getValue() == true ? 1
																								: 0;
																						break;
																					}
																				}
																			} else if (v
																					.getXType() == "checkboxfield") { // 如果是复选框
																				for ( var i = 0; i < params.length; i++) {
																					if (v.name == ("stepparam_" + params[i].id)) {
																						params[i]["paramvalue"] = v
																								.getValue() == true ? 1
																								: 0;
																						break;
																					}
																				}
																			} else {
																				for ( var i = 0; i < params.length; i++) {
																					if (v.name == ("stepparam_" + params[i].id)) {
																						params[i]["paramvalue"] = v
																								.getValue();
																						break;
																					}
																				}
																			}
																		});
														me.wpWindow.close();
														numgrid.getView()
																.refresh();
													}
												}
											} ]

										});

						me.wpWindow = Ext.create("Ext.window.Window", {
							layout : 'fit',
							width : 400,
							height : 400,
							title : '填写工序参数',
							modal : true,
							items : me.wpForm
						});
						me.wpForm.removeAll();
						me.wpWindow.show();
						var formitems = [];
						for ( var i = 0; i < params.length; i++) {
							switch (params[i].paramtype) {
							case 1:
								var find = false;
								for ( var j = 0; j < formitems.length; j += 1) {
									if (formitems[j].fieldLabel == params[i].innerstep) {
										// 找到
										find = true;
										formitems[j].items.push({
											xtype : 'checkbox',
											name : 'stepparam_' + params[i].id,
											boxLabel : params[i].footdesc,
											checked : params[i].paramvalue
										});
										break;
									}
								}
								if (!find) {
									formitems.push({
										xtype : 'checkboxgroup',
										fieldLabel : params[i].innerstep,
										items : [ {
											xtype : 'checkbox',
											name : 'stepparam_' + params[i].id,
											boxLabel : params[i].footdesc,
											checked : params[i].paramvalue
										} ]
									});
								}
								break;
							case 2:
								var find = false;
								for ( var j = 0; j < formitems.length; j += 1) {
									if (formitems[j].title == params[i].innerstep) {
										find = true;
										formitems[j].items.push({
											xtype : 'textfield',
											name : 'stepparam_' + params[i].id,
											fieldLabel : params[i].headdesc
													+ "(" + params[i].footdesc
													+ ")",
											value : params[i].paramvalue
										});
										break;
									}
								}
								if (!find) {
									formitems.push({
										xtype : 'fieldset',
										title : params[i].innerstep,
										collapsible : true,
										defaultType : 'textfield',

										defaults : {
											anchor : '100%'
										},
										layout : 'anchor',
										items : [ {
											fieldLabel : params[i].headdesc
													+ "(" + params[i].footdesc
													+ ")",
											name : 'stepparam_' + params[i].id,
											value : params[i].paramvalue
										} ]
									});
								}
								break;
							case 3:
								formitems.push({
									xtype : 'combobox',
									displayField : 'dicname',
									valueField : 'dicvalue',
									name : 'stepparam_' + params[i].id,
									queryMode : 'local',
									store : Ext.create('Ext.data.Store', {
										fields : [ 'dicname', 'dicvalue' ],
										data : params[i].comboList
									}),
									fieldLabel : params[i].headdesc + "("
											+ params[i].footdesc + ")",
									value : params[i].paramvalue
								});
								break;
							}
						}
						me.wpForm.add(formitems);
					},
					submitForm : function() {
						// 表单提交
						var me = this;
						if (me.getForm().isValid()) {
							// 参数集合
							var params = {};
							// 首先获取产品拼板数量
							var numgrid = me.down("#numgrid");
							for ( var i = 0; i < numgrid.store.data.items.length; i++) {
								var line = numgrid.store.data.items[i];
								if (line.data["num"] == 0) {
									Ext.Msg.alert("提示", "请填写产品拼板数");
									return false;
								}
								params["workBoardInfo.productList[" + i
										+ "].prodId"] = line.data["prodId"];
								params["workBoardInfo.productList[" + i
										+ "].pbnum"] = line.data["num"];
							}
							// 获取工序参数列表
							var stepgrid = me.down("#stepgrid");
							for ( var i = 0; i < stepgrid.store.data.items.length; i++) {
								var line = stepgrid.store.data.items[i];

								for ( var j = 0; j < line.data.stepParams.length; j++) {
									var lin = line.data.stepParams[j];
									params["workBoardInfo.stepList[" + i
											+ "].stepParams[" + j + "].id"] = lin["id"];
									params["workBoardInfo.stepList[" + i
											+ "].stepParams[" + j
											+ "].paramvalue"] = lin["paramvalue"];
								}
							}
							// 层压结构数据
							params["workBoardInfo.stratification"] = me.down(
									"#cengyagrid").getValue();
							me
									.getForm()
									.submit(
											{
												url : '/workBoardManagementAction!addWorkBoard.action',
												waitMsg : '正在提交..',
												params : params,
												success : function(form, action) {
													Ext.Msg.alert("提示",
															action.result.msg);
													me.getForm().reset();
													me.up("window").close();
													me.target.destroy();
													Ext
															.getCmp("mainpanel")
															.loadControl(
																	Ext
																			.getCmp(
																					"menulist")
																			.getSelectionModel()
																			.getSelection()[0].raw);
												},
												failure : Pcbms.formHandler
											});
						}
					},
					initComponent : function() {
						var me = this;
						me.cellEditing = Ext.create(
								'Ext.grid.plugin.CellEditing', {
									clicksToEdit : 1
								});
						me.stepStore = Ext
								.create(
										"Ext.data.Store",
										{
											model : "Step",
											proxy : Pcbms.ajaxProxy({
													url:"/stepManagementAction!searchProcessSteps.action",
													reader : {
														type : 'json',
														root : 'stepList'
													}})
										});
						Ext
								.applyIf(
										me,
										{
											items : [
													{
														xtype : 'fieldset',
														title : '工作板基本信息',
														plain : true,
														region : 'west',
														width : 230,
														border : false,
														layout : 'anchor',
														defaults : {
															allowBlank : false,
															labelWidth : 70,
															xtype : "textfield",
															anchor : "99%"
														},
														items : [
																{
																	fieldLabel : '工作板编号',
																	name : 'workBoardInfo.wbid'
																},
																{
																	fieldLabel : '板材材料',
																	name : 'workBoardInfo.bccl'
																},
																{
																	fieldLabel : '层数',
																	name : 'workBoardInfo.cs',
																	readOnly : true
																},
																{
																	fieldLabel : '板厚',
																	name : 'workBoardInfo.bh'
																},
																{
																	fieldLabel : '文字颜色',
																	name : 'workBoardInfo.fontcolor'
																},
																{
																	fieldLabel : '阻焊颜色',
																	name : 'workBoardInfo.zhcolor'
																},
																{
																	fieldLabel : '工作板尺寸x',
																	xtype : 'numberfield',
																	name : 'workBoardInfo.gzbccx'
																},
																{
																	fieldLabel : '工作板尺寸y',
																	xtype : 'numberfield',
																	name : 'workBoardInfo.gzbccy'
																},

																{
																	fieldLabel : '内层铜厚',
																	name : 'workBoardInfo.ncth'
																},
																{
																	fieldLabel : '外层铜厚',
																	name : 'workBoardInfo.wcth'
																},
																{
																	xtype : 'pubcombo',
																	fieldLabel : '供应商',
																	name : 'workBoardInfo.bcgys',
																	type : 3
																},
																{
																	xtype : 'pubcombo',
																	fieldLabel : '加急类型',
																	flex : 1,
																	name : 'workBoardInfo.gzkyxj',
																	type : 11
																},
																{
																	xtype : 'datefield',
																	fieldLabel : '交货日期',
																	name : 'workBoardInfo.jhrq',
																	submitFormat : "U000",
																},
																{
																	xtype : 'numberfield',
																	fieldLabel : '开料数量',
																	name : 'workBoardInfo.num'
																},
																{
																	xtype : 'filefield',
																	fieldLabel : '附件',
																	name : 'workBoardInfo.attachment'
																},
																{
																	xtype : 'textarea',
																	labelAlign : "top",
																	blankText : "请输入备注信息",
																	anchor : '99% -430',
																	allowBlank : true,
																	fieldLabel : "请输入备注信息",
																	name : 'workBoardInfo.note'
																} ]
													},
													{
														xtype : 'panel',
														layout : 'border',
														margin : '0 0 0 5',
														border : false,
														region : 'center',
														items : [
																{
																	region : 'south',
																	collapsible : true,
																	split : true,
																	margin : '5 0 5 0',
																	autoScroll : true,
																	height : 150,
																	xtype : 'gridpanel',
																	itemId : 'numgrid',
																	title : '填写拼板数信息',
																	listeners : {
																		'itemclick' : function(
																				v,
																				r,
																				i,
																				n) {
																			me.cellEditing
																					.startEditByPosition({
																						row : n,
																						column : 3
																					});
																		}
																	},
																	plugins : [ me.cellEditing ],
																	columns : [
																			{
																				xtype : 'gridcolumn',
																				dataIndex : 'prodId',
																				flex : 1,
																				text : '订单编号',
																				renderer : showDetial('prod').renderer
																			},
																			{
																				xtype : 'gridcolumn',
																				dataIndex : 'projectName',
																				flex : 1,
																				text : '客户型号'
																			},
																			{
																				text : 'set尺寸',
																				flex : 1,
																				renderer : function(
																						v,
																						m,
																						r) {
																					return r.data["setx"]
																							+ "X"
																							+ r.data["sety"]
																							+ " ("
																							+ r.data["setps"]
																							+ "拼)";
																				}
																			},
																			{
																				text : 'pcs尺寸',
																				flex : 1,
																				renderer : function(
																						v,
																						m,
																						r) {
																					return r.data["pcsx"]
																							+ "X"
																							+ r.data["pcsy"];
																				}
																			},
																			{
																				header : "处理人",
																				width : 90,
																				dataIndex : "operatorname"
																			},
																			{
																				xtype : 'numbercolumn',
																				dataIndex : 'ytl',
																				format : '0.00',
																				width : 70,
																				text : '预投率'
																			},
																			{
																				xtype : 'numbercolumn',
																				dataIndex : 'minlw',
																				format : '0.00',
																				width : 70,
																				text : '最小线宽'
																			},
																			{
																				xtype : 'numbercolumn',
																				dataIndex : 'minld',
																				format : '0.00',
																				width : 70,
																				text : '最小线距'
																			},
																			{
																				xtype : 'numbercolumn',
																				dataIndex : 'minhole',
																				format : '0.00',
																				width : 70,
																				text : '最小孔径'
																			},
																			{
																				text : '未组数量',
																				dataIndex : 'wzgzbnum',
																				width : 70
																			},
																			{
																				dataIndex : 'jjType',
																				width : 60,
																				text : '加急类型'
																			},
																			{
																				dataIndex : 'jhrq',
																				width : 100,
																				text : '交货日期',
																				renderer : function(
																						v) {
																					return Ext.util.Format
																							.dateRenderer(
																									'Y-m-d')
																							(
																									new Date(
																											v));
																				}
																			},
																			{
																				xtype : 'numbercolumn',
																				width : 120,
																				dataIndex : 'num',
																				format : '0',
																				editor : {
																					xtype : 'numberfield',
																					allowBlank : false,
																					minValue : 1,
																					maxValue : 100000
																				},
																				text : '拼板数'
																			} ],
																	store : Ext
																			.create(
																					"Ext.data.ArrayStore",
																					{
																						fields : [
																								'bcbh',
																								{
																									name : 'num',
																									type : 'int'
																								} ]
																					})
																},
																{
																	xtype : 'gridpanel',
																	itemId : 'stepgrid',
																	region : 'center',
																	tbar : [
																			{
																				xtype : 'pubcombo',
																				labelWidth : 70,
																				fieldLabel : '工艺',
																				name : 'workBoardInfo.gy',
																				width : 180,
																				type : 2
																			},
																			{
																				xtype : 'combobox',
																				fieldLabel : '工序流程',
																				allowBlank : false,
																				labelWidth : 70,
																				width : 220,
																				displayField : 'processname',
																				valueField : 'processid',
																				name : 'workBoardInfo.processid',
																				listeners : {
																					change : function(
																							e,
																							v) {
																						if (v) {
																							me.stepStore
																									.load({
																										params : {
																											'processid' : v
																										}
																									});
																						}
																					}
																				},
																				store : Ext
																						.create(
																								"Ext.data.Store",
																								{
																									model : "Process",
																									proxy : Pcbms.ajaxProxy({
																										url:"/stepManagementAction!searchStepProcess.action",
																										reader : {
																											type : 'json',
																											root : 'processList'
																										}})

																								})
																			},
																			'->',
																			'双击行填写内容!' ],
																	autoScroll : true,
																	store : me.stepStore,
																	listeners : {
																		itemdblclick : function(
																				view,
																				r,
																				item,
																				index) {
																			me
																					.showParamWindow(index);
																		}
																	},
																	columns : [
																			{
																				xtype : 'numbercolumn',
																				dataIndex : 'steporder',
																				text : '顺序',
																				width : 50,
																				format : '0'
																			},
																			{
																				xtype : 'gridcolumn',
																				dataIndex : 'stepname',
																				text : '工序流程',
																				width : 110
																			},
																			{
																				xtype : 'gridcolumn',
																				dataIndex : 'stepParams',
																				text : '制作参数',
																				renderer : function(
																						v,
																						s,
																						r,
																						n) {
																					var str = "";
																					for ( var i = 0; i < v.length; i++) {
																						var pi = getSptstring(v[i]);
																						if (pi != "") {
																							str += pi  + "<br/>";
																						}
																					}
																					return str;
																				},
																				flex : 1
																			} ]
																},
																{
																	xtype : 'gridpanel',
																	itemId : 'cengyagrid',
																	title : '层压结构',
																	region : 'east',
																	margin : '0 0 0 5',
																	width : 350,
																	autoScroll : true,
																	store : Ext
																			.create(
																					"Ext.data.ArrayStore",
																					{
																						fields : [
																								'name',
																								'copper',
																								'note' ]
																					}),
																	plugins : [ Ext
																			.create(
																					'Ext.grid.plugin.CellEditing',
																					{
																						pluginId : 'editing',
																						clicksToEdit : 1
																					}) ],
																	getValue : function() {
																		// 将当前的store
																		// 中的数据转换为string
																		// 对象
																		var value = [];
																		this.store
																				.each(function(
																						r) {
																					value
																							.push(r.data);
																				});
																		return Ext
																				.encode(value);
																	},
																	tbar : [
																			{
																				text : '添加层',
																				iconCls : 'tableadd',
																				handler : function(
																						b) {
																					var grid = b
																							.up("grid");
																					var editing = grid
																							.getPlugin('editing');
																					var index = grid.store
																							.getCount();
																					grid.store
																							.insert(
																									index,
																									{
																										"name" : "",
																										note : "",
																										copper : ""
																									});
																					editing
																							.startEditByPosition({
																								row : index,
																								column : 0
																							});
																				}
																			},
																			{
																				text : "插入层",
																				iconCls : 'rowinsert',
																				handler : function(
																						b) {
																					var grid = b
																							.up("grid");
																					var editing = grid
																							.getPlugin('editing');
																					editing
																							.cancelEdit();
																					var index = grid
																							.getSelectionModel()
																							.getLastSelected();
																					if (index == null) {
																						index = 0;
																					} else {
																						index = grid.store
																								.indexOf(index) - 1;
																					}
																					if (index < 0) {
																						index = 0;
																					}
																					grid.store
																							.insert(
																									index,
																									{
																										"name" : "",
																										note : "",
																										copper : ""
																									});
																					editing
																							.startEditByPosition({
																								row : index,
																								column : 0
																							});
																				},
																				scope : this
																			},
																			{
																				text : "删除层",
																				iconCls : 'rowdelete',
																				handler : function(
																						b) {
																					var grid = b
																							.up("grid");
																					var selection = grid
																							.getView()
																							.getSelectionModel()
																							.getSelection()[0];
																					if (selection) {
																						grid.store
																								.remove(selection);
																					}
																					;
																				}
																			} ],
																	columns : [
																			{
																				xtype : 'rownumberer'
																			},
																			{
																				sortable : false,
																				header : '基材类型',
																				width : 100,
																				dataIndex : 'name',
																				editor : {
																					xtype : 'pubcombo',
																					allowBlank : false,
																					type : 120,
																					listeners : {
																						beforeselect : function(
																								c) {
																							// TODO
																							// 设置显示的数据内容
																						}
																					}
																				}
																			},
																			{
																				header : '铜厚',
																				sortable : false,
																				width : 70,
																				dataIndex : 'copper',
																				editor : {
																					xtype : 'pubcombo',
																					allowBlank : false,
																					type : 122
																				}
																			},
																			{
																				header : '备注',
																				sortable : false,
																				flex : 1,
																				dataIndex : 'note',
																				editor : {
																					xtype : "textfield",
																					maxLength : 100
																				}
																			} ]
																} ]
													} ]
										});
						me.callParent(arguments);
						me.getForm().isValid();
					}
				});