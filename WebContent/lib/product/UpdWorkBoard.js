Ext
		.define(
				'Pcbms.product.UpdWorkBoard',
				{
					extend : 'Ext.form.Panel',
					alias : "widget.wbupd",
					autoScroll : true,
					layout : "card",
					activeItem : 0,
					border : false,
					showParamWindow : function(n) {// 弹出填写参数列表的窗口
						var me = this;
						var numgrid = me.down("#stepgrid");
						var params = numgrid.store.getAt(n).data["stepParams"];
						me.wpForm = Ext.create("Ext.form.Panel", {
							bodyPadding : 10,
							autoScroll : true,
							layout: {
							    align: 'stretch',
							    type: 'vbox'
							},
							buttons : [{
								text : '确定',
								handler : function() {
									if (me.wpForm.getForm().isValid()) {
										Ext.each(me.wpForm.getForm().getFields().items,
												function(v) {
													if (v.getXType() == "raidofield") { // 如果是单选框
														for (var i = 0; i < params.length; i++) {
															if (v.name == ("stepparam_" + params[i].id)) {
																params[i]["paramvalue"] = v
																		.getValue() == true
																		? 1
																		: 0;
																break;
															}
														}
													} else if (v.getXType() == "checkboxfield") { // 如果是复选框
														for (var i = 0; i < params.length; i++) {
															if (v.name == ("stepparam_" + params[i].id)) {
																params[i]["paramvalue"] = v
																		.getValue() == true
																		? 1
																		: 0;
																break;
															}
														}
													}else{
														for (var i = 0; i < params.length; i++) {
															if (v.name == ("stepparam_" + params[i].id)) {
																params[i]["paramvalue"] = v
																		.getValue();
																break;
															}
														}
													}
												});
										me.wpWindow.close();
										numgrid.getView().refresh();
									}
								}
							}]

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
						for (var i = 0; i < params.length; i++) {
							switch(params[i].paramtype){
							case 1:
								var find = false;
								for(var j=0;j<formitems.length;j+=1){
									if(formitems[j].fieldLabel == params[i].innerstep){
										//找到
										find = true;
										formitems[j].items.push({xtype : 'checkbox',
											name: 'stepparam_' + params[i].id,
											boxLabel : params[i].footdesc,
											checked : params[i].paramvalue});
										break;
									}
								}
								if(!find){
									formitems.push({xtype : 'checkboxgroup',
										fieldLabel : params[i].innerstep,
										items : [{
													xtype : 'checkbox',
													name: 'stepparam_' + params[i].id,
													boxLabel : params[i].footdesc,
													checked : params[i].paramvalue
												}]});
								}
								break;
							case 2:
								var find = false;
								for(var j=0;j<formitems.length;j+=1){
									if(formitems[j].title == params[i].innerstep){
										find = true;
										formitems[j].items.push({xtype : 'textfield',
											name: 'stepparam_' + params[i].id,
											fieldLabel : params[i].headdesc + "("
											+ params[i].footdesc + ")",
									value : params[i].paramvalue});
										break;
									}
								}
								if(!find){
									formitems.push({xtype:'fieldset',
								        title: params[i].innerstep,
								        collapsible: true,
								        defaultType: 'textfield',
								       
								        defaults: {anchor: '100%'},
								        layout: 'anchor',
								        items:[
								               {
								            	   fieldLabel : params[i].headdesc + "("
													+ params[i].footdesc + ")",
													 name: 'stepparam_' + params[i].id,
											value : params[i].paramvalue
								               }
								               ]
								    });
								}
								break;
							case 3:
								formitems.push({
									xtype : 'combobox',
									displayField : 'dicname',
									valueField : 'dicvalue',
									name: 'stepparam_' + params[i].id,
									queryMode: 'local',
									store : Ext.create('Ext.data.Store', {
									    fields: ['dicname', 'dicvalue'],
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
					tbar : [
							{
								text : "审批通过",
								iconCls : "modify",
								handler : function(b) {
									// 弹出窗口
									var fp = b.up("form");
									var form = fp.getForm();
									var url = null;
									switch (form.findField(
											"workBoardInfo.status").getValue()) {
									case 1:
										url = "/workBoardAuditAction!projectAudit.action";
										break;
									case 8:
										url = "/workBoardAuditAction!projectAudit.action";
										break;
									case 2:
										url = "/workBoardAuditAction!planAudit.action";
										break;
									default:
										Ext.Msg.alert("提示", "状态错误,不能审核");
										return;
									}
									Ext.MessageBox
											.confirm(
													"确认审核",
													"确认审批通过",
													function(b) {
														if (b == 'yes') {
															var params = {
																"workBoardInfo.auditresult" : 1
															};
															form
																	.submit({
																		clientValidation : true,
																		includeEmptyText : false,
																		params : params,
																		waitMsg : "正在提交..",
																		url : url,
																		success : function(
																				form,
																				action) {
																			fp
																					.up(
																							"window")
																					.close();
																			Ext.Msg
																					.alert(
																							"提示",
																							"审批成功!");
																		},
																		failure : Pcbms.formHandler
																	});
														}
													});
								}
							},
							{
								text : "审批拒绝",
								iconCls : "modify",
								handler : function(b) {
									//
									var fp = b.up("form");
									var form = fp.getForm();
									var url = null;
									switch (form.findField(
											"workBoardInfo.status").getValue()) {
									case 1:
										url = "/workBoardAuditAction!projectAudit.action";
										break;
									case 2:
										url = "/workBoardAuditAction!planAudit.action";
										break;
									default:
										Ext.Msg.alert("提示", "状态错误,不能审核");
										return;
									}
									Ext.MessageBox
											.prompt(
													"确认审核",
													"请输入理由",
													function(b, t) {
														if (b == 'ok') {
															var params = {
																"workBoardInfo.auditresult" : 0,
																"workBoardInfo.reason" : t
															};
															form
																	.submit({
																		clientValidation : true,
																		includeEmptyText : false,
																		params : params,
																		waitMsg : "正在提交..",
																		url : url,
																		success : function(
																				form,
																				action) {
																			fp
																					.up(
																							"window")
																					.close();
																			Ext.Msg
																					.alert(
																							"提示",
																							"审批成功!");
																		},
																		failure : Pcbms.formHandler
																	});
														}
													});
								}
							},
							{
								xtype : 'button',
								text : "数据文件",
								handler : function(b) {
									var wbid = this.up('form').getForm()
											.findField("workBoardInfo.wbid")
											.getValue();
									downFile("/downloadAction!downloadWorkBoardDataFile.action?bcbh="
											+ wbid);
								}
							},
							'->',
							{
								xtype : "button",
								text : "历史记录",
								handler : function(b) {
									if (b.getText() == "历史记录") {
										b.setText("基本详情");
										b.up("form").getLayout().setActiveItem(
												1);
									} else {
										b.setText("历史记录");
										b.up("form").getLayout().setActiveItem(
												0);
									}
								}
							} ],
					loadData : function(data) {
						var me = this;
						Ext.each(me.getForm().getFields().items, function(i) {
							if (i.getName()) {
								if (i.getXType() == "combobox") {
									i.store.load();
								}
								if (i.getXType() == "datefield") {
									var d = new Date();
									d.setTime(data[i.getName().replace(
											"workBoardInfo.", "")]);
									i.setValue(d);
								} else if (i.getName()
										.indexOf("workBoardInfo.") >= 0) {
									i.setValue(data[i.getName().replace(
											"workBoardInfo.", "")]);
								}
							}
						});
						me.stepStore.loadData(data["stepList"]);
						me.down("#numgrid").store.loadData(data["productList"]);

						me.down("#zhuan1").store.removeAll();
						if (data["drillfirst"]) {
							drills = Ext.decode(data["drillfirst"]);
							me.down("#zhuan1").store.insert(0, drills);
							var sum = 0;
							for ( var i = 0; i < drills.length; i++) {
								var obj = drills[i];
								sum += obj.count;
							}
							me.down("#zhuan1").store.add({
								count : sum
							});
						}
						me.down("#zhuan2").store.removeAll();
						if (data["drillsecond"]) {
							drills = Ext.decode(data["drillsecond"]);
							me.down("#zhuan2").store.insert(0, drills);
							var sum = 0;
							for ( var i = 0; i < drills.length; i++) {
								var obj = drills[i];
								sum += obj.count;
							}
							me.down("#zhuan2").store.add({
								count : sum
							});
						}
						me.down("#cengya").store.removeAll();
						if(data.hasOwnProperty("stratification")){
							var sdata = Ext.decode(data['stratification']);
							me.down("#cengya").store.loadData(sdata);
						}
					},
					loadNumGrid : function(s) { // 加载填写拼板数的列表
						var me = this;
						var numgrid = me.down("#numgrid");
						numgrid.store.loadData(s);
					},

					submitForm : function(g) { // 表单提交
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
							me
									.getForm()
									.submit(
											{
												waitMsg : '正在提交..',
												url : '/workBoardManagementAction!updateWorkBoard.action',
												params : params,
												success : function(form, action) {
													Ext.Msg.alert("提示",
															action.result.msg);
													me.getForm().reset();
													me.up("window").close();
													g.store.load();
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
											defaults : {
												padding : 5
											},
											items : [
													{
														xtype : "container",
														layout : "border",
														items : [
																{
																	region : 'north',
																	xtype : 'fieldset',
																	title : '工作板基本信息',
																	layout : 'column',
																	height : 190,
																	plain : true,
																	border : false,
																	items : [
																			{
																				xtype : "fieldcontainer",
																				columnWidth : .33,
																				border : false,
																				layout : 'anchor',
																				defaults : {
																					allowBlank : false,
																					xtype : "textfield",
																					anchor : "80%"
																				},
																				items : [
																						{
																							fieldLabel : '工作板编号',
																							name : 'workBoardInfo.wbid',
																							readOnly : true
																						},
																						{
																							fieldLabel : '板材材料',
																							name : 'workBoardInfo.bccl'
																						},
																						{
																							fieldLabel : '内层铜厚',
																							name : 'workBoardInfo.ncth'
																						},
																						{
																							fieldLabel : '工作板尺寸x',
																							xtype : 'numberfield',
																							name : 'workBoardInfo.gzbccx'
																						},
																						{
																							xtype : 'datefield',
																							fieldLabel : '交货日期',
																							name : 'workBoardInfo.jhrq',
																							submitFormat : "U000",
																						},
																						{
																							xtype : 'pubcombo',
																							fieldLabel : '管制卡优先级',
																							flex : 1,
																							name : 'workBoardInfo.gzkyxj',
																							type : 11
																						} ]
																			},
																			{
																				xtype : "fieldcontainer",
																				columnWidth : .33,
																				border : false,
																				layout : 'anchor',
																				defaults : {
																					allowBlank : false,
																					xtype : "textfield",
																					anchor : "80%"
																				},
																				plain : true,
																				items : [
																						{
																							fieldLabel : '外层铜厚',
																							name : 'workBoardInfo.wcth'
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
																							fieldLabel : '工作板尺寸y',
																							xtype : 'numberfield',
																							name : 'workBoardInfo.gzbccy'
																						},
																						{
																							xtype : 'pubcombo',
																							fieldLabel : '供应商',
																							name : 'workBoardInfo.bcgys',
																							type : 3
																						},
																						{
																							xtype : 'combobox',
																							fieldLabel : '工序流程',
																							allowBlank : false,
																							displayField : 'processname',
																							valueField : 'processid',
																							name : 'workBoardInfo.processid',
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
																						} ]
																			},
																			{
																				xtype : "fieldcontainer",
																				columnWidth : .33,
																				border : false,
																				plain : true,
																				layout : 'anchor',
																				defaults : {
																					allowBlank : false,
																					xtype : "textfield",
																					anchor : "99%"
																				},
																				items : [
																						{
																							fieldLabel : '文字颜色',
																							name : 'workBoardInfo.fontcolor'
																						},
																						{
																							fieldLabel : '阻焊颜色',
																							name : 'workBoardInfo.zhcolor'
																						},
																						{
																							xtype : 'numberfield',
																							fieldLabel : '开料数量',
																							name : 'workBoardInfo.num'
																						},
																						{
																							xtype : 'numberfield',
																							fieldLabel : '未开料数量',
																							name : 'workBoardInfo.wklnum',
																							minValue : -1
																						},
																						{
																							xtype : 'pubcombo',
																							fieldLabel : '工艺',
																							name : 'workBoardInfo.gy',
																							type : 2
																						},
																						{
																							xtype : 'combobox',
																							fieldLabel : '工作板状态',
																							name : 'workBoardInfo.status',
																							readOnly : true,
																							store : [
																									[
																											-1,
																											"全部数据" ],
																									[
																											0,
																											"作废" ],
																									[
																											1,
																											"待工程审核" ],
																									[
																											2,
																											"待计划审核" ],
																									[
																											6,
																											"计划状态" ],
																									[
																											8,
																											"退回状态" ] ]
																						} ]
																			},
																			{
																				xtype : 'textarea',
																				labelAlign : "top",
																				margin : '0 0 0 5',
																				blankText : "请输入备注信息",
																				width : 250,
																				height : 160,
																				fieldLabel : "请输入备注信息",
																				name : 'workBoardInfo.note'
																			} ]
																},
																{
																	region : 'south',
																	collapsible: true,
																	resizable : true,
																	floatable : true,
																	autoScroll : true,
																	height : 200,
																	xtype : 'gridpanel',
																	itemId : 'numgrid',
																	title : '拼板内容',
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
																				renderer : showDetial('prod').renderer,
																				text : '订单编号'
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
																				dataIndex : 'num',
																				width : 70,
																				text : '需求数量'
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
																				dataIndex : 'pbnum',
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
																	autoScroll : true,
																	store : me.stepStore,
																	listeners:{
																		itemdblclick:function(view,r,item,index){
																			me.showParamWindow(index);
																		}
																	},
																	columns : [
																			{
																				xtype : 'numbercolumn',
																				dataIndex : 'steporder',
																				width : 50,
																				text : '顺序',
																				format : '0'
																			},
																			{
																				xtype : 'gridcolumn',
																				dataIndex : 'stepname',
																				text : '工序流程'
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
																							if (str == "") {
																								str += pi;
																							} else {
																								str += ("<br/>" + pi);
																							}
																						}
																					}
																					return str;
																				},
																				flex : 1
																			} ]
																},
																{
																	xtype : 'panel',
																	border : false,
																	layout : {
																		type : 'hbox',
																		align : 'stretch'
																	},
																	margin : '0 0 0 5',
																	width : 650,
																	region : 'east',
																	items : [
																			{
																				xtype : 'gridpanel',
																				itemId : 'zhuan1',
																				title : '钻咀一',
																				flex : 1,
																				forceFit : true,
																				store : Ext
																						.create(
																								"Ext.data.ArrayStore",
																								{
																									fields : [
																											'name',
																											'diameter',
																											'count' ]
																								}),
																				columns : [
																						{
																							header : '序号',
																							dataIndex : 'name'
																						},
																						{
																							header : '直径',
																							dataIndex : 'diameter'
																						},
																						{
																							header : '使用次数',
																							dataIndex : 'count'
																						} ]
																			},
																			{
																				xtype : 'gridpanel',
																				itemId : 'zhuan2',
																				title : '钻咀二',
																				flex : 1,
																				forceFit : true,
																				autoScroll : true,
																				columns : [
																						{
																							header : '序号',
																							dataIndex : 'name'
																						},
																						{
																							header : '直径',
																							dataIndex : 'diameter'
																						},
																						{
																							header : '使用次数',
																							dataIndex : 'count'
																						} ]
																			},
																			{
																				xtype : 'gridpanel',
																				itemId : 'cengya',
																				title : '层压结构',
																				flex : 1.2,
																				autoScroll : true,
																				store : Ext
																						.create(
																								"Ext.data.ArrayStore",
																								{
																									fields : [
																											'name',
																											'note','copper' ]
																								}),
																				columns : [
																						{
																							header : '基材类型',
																							width:100,
																							dataIndex : 'name'
																						},{
																							header : '铜厚',
																							width:70,
																							dataIndex : 'copper'
																						},
																						{
																							header : '备注',
																							flex:1,
																							dataIndex : 'note'
																						} ]
																			} ]
																} ]
													},
													{
														xtype : 'grid',
														columns : [
																{
																	header : '审核类型',
																	dataIndex : 'audittype',
																	width : 80,
																	renderer : function(
																			v) {
																		switch (v) {
																		case 0:
																			return "工程审核";
																		case 1:
																			return "计划审核";
																		}
																	}
																},
																{
																	header : '审批时间',
																	dataIndex : 'createtime',
																	width : 120,
																	renderer : Ext.util.Format
																			.dateRenderer("Y-m-d H:i")
																},
																{
																	header : '审批内容',
																	dataIndex : 'reason',
																	flex : 1
																},
																{
																	header : '审批结果',
																	dataIndex : 'auditresult',
																	width : 80,
																	renderer : function(
																			v) {
																		switch (v) {
																		case 0:
																			return "<span style='color:red'>审批被拒</span>";
																		case 1:
																			return "<span style='color:green'>审核通过</span>";
																		}
																	}
																},
																{
																	header : '修改数量',
																	dataIndex : 'num',
																	width : 90
																},
																{
																	header : '修改未开料数量',
																	dataIndex : 'wklnum',
																	width : 90
																},
																{
																	header : '审核人姓名',
																	dataIndex : 'verifiername',
																	width : 90
																} ],
														store : Ext
																.create(
																		'Ext.data.Store',
																		{
																			model : 'WorkBoardAudit',
																			proxy : {
																				type : 'ajax',
																				url : '/workBoardAuditAction!searchWorkBoardAuditByWBID.action',
																				reader : {
																					type : 'json',
																					root : 'wordboardlist'
																				}
																			},
																			autoLoad : false
																		}),
														listeners : {
															beforeshow : function(
																	g) {
																var form = g
																		.up(
																				"form")
																		.getForm();
																g.store
																		.getProxy().extraParams = {
																	wbid : form
																			.findField(
																					"workBoardInfo.wbid")
																			.getValue()
																};
																g.store.load();
															}
														}
													} ]
										});

						me.callParent(arguments);
						me.getForm().isValid();
					}
				});