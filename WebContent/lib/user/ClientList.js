
/**
 * 客户信息管理
 */
 Ext.apply(Ext.form.field.VTypes, {
    deskey: function(val, field) {
        return val.length % 8 ==0;
    },
    deskeyText: '同步密钥长度必须为8的整数倍.'
});
 Ext.define("Pcbms.user.ClientGroupBar", {
	extend : 'Ext.tab.Bar',
	dock : "bottom",
	plain : false,
	maxTabWidth : 60,
	addgroup : function() {
		Ext.Msg.prompt('客户组名称', '请输入需要添加的客户组名称:', function(btn, text) {
			if (btn == 'ok') {
				var proxy = this.cgstore.getProxy();
				proxy.extraParams = {
					"clientGroup.name" : text
				};
				proxy.url = '/clientGroupManagementAction!addClientGroup.action';
				this.reloadbar();
			}
		}, this);
	},
	reloadbar : function() {
		var me = this;
		var cgid = arguments[0];
		if (arguments.length == 0) {
			if (me.items.items.length == 0 || !me.activeTab) {
				cgid = -1;
			} else {
				cgid = me.activeTab.cgid;
			}
		}
		if (!me.cgstore) {
			me.cgstore = Ext.create("Ext.data.Store", {
				storeId : "clientgroupStore",
				model : "ClientGroup",
				proxy : Pcbms.ajaxProxy({
					url : "/clientManagementAction!searchClientGroupList.action",
					extraParams : {
						pagesize : 999
					},
					reader : {
						type : 'json',
						root : 'clientGroupList',
						totalProperty : 'count'
					}
				})
			});
		}
		me.cgstore.load({
			callback : function(records) {
				me.removeAll();
				me.add([{
							text : '全部客户',
							cgid : "-1",
							closable : false
						}]);
				for (var i = 0; i < records.length; i += 1) {
					me.add({
						cgid : records[i].get("cgid"),
						text : records[i].get("name"),
						listeners : {
							beforeclose : function(tab, opts) {
								Ext.Msg.confirm("确认删除", "是否确认删除客户组[" + tab.text
												+ "]", function(b) {
											if (b == "yes") {
												var tab = this;
												var tabbar = Ext
														.getCmp("tabbar");
												tabbar.el.mask("客户组删除中..");
												Ext.Ajax.trequest({
													url : "/clientGroupManagementAction!deleteClientGroup.action",
													params : {
														"clientGroup.cgid" : tab.cgid
													},
													success : function(result) {
														tabbar.el.unmask();
														tabbar.remove(tab);
													},
													error : function(result) {
														tabbar.el.unmask();
														Ext.Msg
																.alert(
																		'出现错误',
																		'原因 <'
																				+ result.msg
																				+ ">");

													}

												});

											}
										}, tab);
							}
						}
					});
				}
				var tab = me.down("[cgid=" + cgid + "]");
				if (tab && me.rendered) {
					me.setActiveTab(tab);
				}
			}
		});
	},
	listeners : {
		change : function(node, tab) {
			var store = Ext.data.StoreManager.lookup('clientStore');
			if (store) {
				store.getProxy().extraParams = {
					"clientInfo.cgid" : tab.cgid
				};
				store.load();
			}
		},
		afterrender : function(node) {
			node.reloadbar('-1');
		}
	}
});
Ext.define("Pcbms.user.ClientList", {
	extend : "Ext.panel.Panel",
	alias : "widget.clientlist",
	text : "客户信息查询",
	tabConfig : {
		title : "客户信息查询",
		tooltip : "客户信息查询"
	},
	iconCls : "clientlist",
	layout : "fit",
	initComponent : function() {
		var me = this, dockedItems = me.dockedItems || [];
		me.tabBar = Ext.create('Pcbms.user.ClientGroupBar', {
					id : "tabbar"
				});
		if (dockedItems && !Ext.isArray(dockedItems)) {
			dockedItems = [dockedItems];
		}
		dockedItems.push(me.tabBar);
		me.dockedItems = dockedItems;
		this.callParent(arguments);
		me.down("grid").getView().on('render', function(view) {
			view.tip = Ext.create('Ext.tip.ToolTip', {
						target : view.el,
						delegate : view.itemSelector,
						autoHide : false,
						trackMouse : true,
						renderTo : Ext.getBody(),
						listeners : {
							beforeshow : function updateTipBody(tip) {
								tip.update(tpl_client.apply(view
										.getRecord(tip.triggerElement).data));
							}
						}
					});
		});

	},
	items : {
		border : false,
		frame : false,
		layout : "fit",
		xtype : "gridpanel",
		tbar : [{
			xtype : "buttongroup",
			title : "客户信息管理",
			columns : 4,
			defaults : {
				scale : "small"
			},
			items : [{
						text : "添加客户组",
						xtype : 'button',
						iconCls : "groupadd",
						handler : function(b) {
							Ext.getCmp("tabbar").addgroup();
						}
					}, {
						text : "放入客户组",
						xtype : 'button',
						iconCls : "clientin",
						handler : function(b) {
							var s = checkGridSelect(b.up("gridpanel"), 1);
							if (!s) {
								return;
							}

							Ext.create('Ext.window.Window', {
								title : '需要放入的客户组',
								height : 200,
								width : 400,
								modal : true,
								layout : 'fit',
								items : {
									xtype : "form",
									border : false,
									plain : true,
									border : 0,
									bodyPadding : 5,
									fieldDefaults : {
										labelWidth : 75,
										anchor : '100%'
									},
									items : [{
										xtype : 'combo',
										fieldLabel : '选择客户组',
										queryMode : 'local',
										name : "cgid",
										displayField : 'name',
										valueField : 'cgid',
										allowBlank : false,
										store : Ext.data.StoreManager
												.lookup("clientgroupStore")
									}],
									buttons : [{
										text : "确认加入组",
										handler : function(b) {
											var userids = [];
											for (var i = 0; i < s.length; i += 1) {
												userids
														.push(s[i]
																.get("userid"));
											}
											var form = this.up("form")
													.getForm();
											form.submit({
												clientValidation : true,
												includeEmptyText : false,
												params : {
													userids : userids
												},
												url : "/clientManagementAction!joinClientGroup.action",
												success : function(form, action) {
													b.up(	"window").close();
													Ext.Msg.alert("成功",
															"添加到客户组成功!");
												},
												failure : Pcbms.formHandler
											});

										}
									}, {
										text : "取消操作",
										handler : function(b) {
											b.up(	"window").close();
										}
									}],
									buttonAlign : "center"
								}
							}).show();
						}
					}, {
						text : "移出客户组",
						xtype : 'button',
						iconCls : "clientout",
						handler : function(b) {
							if (Ext.getCmp("tabbar").activeTab.cgid == -1) {
								Ext.MessageBox.alert("操作错误", "默认组成员不能移除!");
								return;
							}
							var grid = b.up("gridpanel");
							var s = checkGridSelect(b.up("gridpanel"), 1);
							if (!s) {
								return;
							}

							var userids = [];
							for (var i = 0; i < s.length; i += 1) {
								userids.push(s[i].get("userid"));
							}
							grid.el.mask("系统处理中 请稍后.....");
							Ext.Ajax.trequest({
								url : "/clientManagementAction!exitClientGroup.action",
								params : {
									"userids" : userids,
									cgid : Ext.getCmp("tabbar").activeTab.cgid
								},
								success : function(result) {
									grid.el.unmask();
									Ext.data.StoreManager.lookup("clientStore")
											.remove(s);
								},
								error : function(result) {
									grid.el.unmask();
									Ext.Msg.alert('出现错误', '原因 <' + result.msg
													+ ">");

								}
							});
						}
					}, {
						text : "修改",
						xtype : 'button',
						iconCls : "clientedit",
						handler : function(b) {
							var s = checkGridSelect(b.up("gridpanel"), 1);
							if (!s) {
								return;
							}

							Ext.getCmp("mainpanel").loadControl({
										xtype : "clienteditform",
										record : s[0],
										id : "clienteditform"
									});
						}
					}, {
						xtype : 'button',
						text : "重置业务员",
						iconCls : "staffrefresh",
						handler : function(b) {
							var grid = b.up("gridpanel");
							var s = checkGridSelect(b.up("gridpanel"), 1);
							if (!s) {
								return;
							}

							// 显示业务员菜单 关于按钮的显示信息
							Ext.create('Ext.window.Window', {
								title : '需要调整到的业务员',
								height : 200,
								width : 400,
								modal : true,
								layout : 'fit',
								items : {
									xtype : "form",
									border : false,
									plain : true,
									border : 0,
									bodyPadding : 5,
									fieldDefaults : {
										labelWidth : 100,
										anchor : '100%'
									},
									items : [{
										xtype : 'combo',
										fieldLabel : '调整到的业务员',
										allowBlank : false,
										displayField : 'name',
										valueField : 'userid',
										store : Ext.create("Ext.data.Store", {
											model : "Account",
											proxy : Pcbms.ajaxProxy({
												url : "/clientManagementAction!searchEmployeeList.action",
												extraParams : {
													pagesize : 99999
												},
												reader : {
													root : "employeeList"
												}
											})
										}),
										name : "userid",
										emptyText : "请选择需要调整到的所属业务员"
									}],
									buttons : [{
										text : "确认调整",
										handler : function(b) {
											var userids = [];
											for (var i = 0; i < s.length; i += 1) {
												userids
														.push(s[i]
																.get("userid"));
											}
											var form = this.up("form")
													.getForm();
											form.submit({
												clientValidation : true,
												includeEmptyText : false,
												params : {
													userids : userids
												},
												url : "/clientManagementAction!changeEmployeeClientRelationship.action",
												success : function(form, action) {
													b.up(	"window").close();
													for (var i = 0; i < s.length; i += 1) {
														s[i]
																.set(
																		"employeeid",
																		form
																				.findField("userid")
																				.getValue());
														s[i]
																.set(
																		"employeename",
																		form
																				.findField("userid")
																				.getRawValue());
														s[i].commit();
													}
													Ext.Msg.alert("成功",
															"调整业务员信息成功!");
												},
												failure : Pcbms.formHandler
											});

										}
									}, {
										text : "取消操作",
										handler : function(b) {
											b.up(	"window").close();
										}
									}],
									buttonAlign : "center"
								}
							}).show();

						}
					}, {
						xtype : 'button',
						text : "修改客户级别",
						iconCls : "changeclientLV",
						handler : function(b) {
							var grid = b.up("gridpanel");
							var s = checkGridSelect(b.up("gridpanel"), 1);
							if (!s) {
								return;
							}

							Ext.create('Ext.window.Window', {
								title : '客户级别调整',
								height : 200,
								width : 400,
								modal : true,
								layout : 'fit',
								items : {
									xtype : "form",
									border : false,
									plain : true,
									border : 0,
									bodyPadding : 5,
									fieldDefaults : {
										labelWidth : 100,
										anchor : '100%'
									},
									items : [{
												xtype : "combobox",
												fieldLabel : '调整到的级别',
												allowBlank : false,
												displayField : 'dicname',
												valueField : 'dicname',
												store : Ext.create(
														"DictionaryStore", {
															type : "2"
														}),
												name : "clientlevel",
												emptyText : "请选择需要调整到的客户级别"
											}],
									buttons : [{
										text : "确认调整",
										handler : function(b) {
											var userids = [];
											for (var i = 0; i < s.length; i += 1) {
												userids
														.push(s[i]
																.get("userid"));
											}
											var form = this.up("form")
													.getForm();
											form.submit({
												clientValidation : true,
												includeEmptyText : false,
												params : {
													userids : userids
												},
												url : "/clientManagementAction!changeClientLevel.action",
												success : function(form, action) {
													b.up(	"window").close();
													for (var i = 0; i < s.length; i += 1) {
														s[i]
																.set(
																		"clientlevel",
																		form
																				.findField("clientlevel")
																				.getValue());
														s[i].commit();
													}
													Ext.Msg.alert("成功",
															"修改客户级别成功!");
												},
												failure : Pcbms.formHandler
											});
										}
									}, {
										text : "取消操作",
										handler : function(b) {
											b.up(	"window").close();
										}
									}],
									buttonAlign : "center"
								}
							}).show();
						}
					}, {
						text : "删除",
						xtype : 'button',
						iconCls : "delete",
						handler : function(b) {
							var grid = b.up("gridpanel");
							var s = checkGridSelect(b.up("gridpanel"), 1);
							if (!s) {
								return;
							}
							Ext.MessageBox.confirm("确认删除", "是否确认删除客户的信息?",
									function(b) {
										if (b == "yes") {
											grid.el.mask("系统处理中 请稍后.....");
											var userids = [];
											for (var i = 0; i < s.length; i += 1) {
												userids
														.push(s[i]
																.get("userid"));
											}
											Ext.Ajax.trequest({
												url : "/clientManagementAction!deleteClient.action",
												params : {
													"userids" : userids
												},
												success : function(result) {
													grid.el.unmask();
													Ext.data.StoreManager
															.lookup("clientStore")
															.remove(s);
												},
												error : function(result) {
													grid.el.unmask();
													Ext.Msg.alert('出现错误',
															'原因 <' + result.msg
																	+ ">");

												}
											});
										}
									});

						}
					}]
		}, "->", {
			xtype : "searchbg",
			title : "客户信息查询",
			columns : 3,
			defaults : {
				labelWidth : 60,
				scale : "small"
			},
			items : [{
						xtype : "textfield",
						fieldLabel : "客户ID",
						labelAlign : "right",
						name : "clientInfo.userid",
						emptyText : "根据客户ID查询"
					}, {
						fieldLabel : "业务员",
						xtype : "empcombo",
						labelAlign : "right",
						cn : "ywy",
						name : "clientInfo.employeeid",
						emptyText : "请选择需要查询的所属业务员"
					},
					Pcbms.searchbtn("客户查询", "clientStore", "small", function() {
								var tabbar = Ext.getCmp("tabbar");
								return {
									"clientInfo.cgid" : tabbar.activeTab.cgid,
									validquery : true
								};
							}, this), {
						xtype : "textfield",
						fieldLabel : "公司名称",
						labelAlign : "right",
						labelWidth : 60,
						name : "clientInfo.company",
						emptyText : "请输入需要查询的客户公司名称"
					}, {
						fieldLabel : "联系人",
						xtype : "textfield",
						labelAlign : "right",
						labelWidth : 60,
						name : "clientInfo.contact",
						emptyText : "请输入需要查询的联系人"
					}, {
						fieldLabel : "客户级别",
						xtype : "combobox",
						labelAlign : "right",
						labelWidth : 60,
						store : Ext.create("DictionaryStore", {
									type : "2"
								}),
						displayField : 'dicname',
						valueField : 'dicname',
						name : "clientInfo.clientlevel",
						emptyText : "请选择客户的级别"
					}, {
						fieldLabel : "所在区域",
						xtype : "combobox",
						labelAlign : "right",
						labelWidth : 60,
						store : Ext.create("DictionaryStore", {
									type : "3"
								}),
						displayField : 'dicname',
						valueField : 'dicname',
						name : "clientInfo.region",
						emptyText : "请选择客户所在区域"
					}]
		}],
		columns : [{
					header : "客户编号",
					width : 80,
					dataIndex : "userid"
				}, {
					header : "注册日期",
					width : 80,
					dataIndex : 'createDate',
					renderer : Ext.util.Format.dateRenderer("Y-m-d")
				}, {
					header : "公司名称",
					flex : 1,
					dataIndex : "company"
				}, {
					header : "客户级别",
					width : 80,
					dataIndex : "clientlevel"
				}, {
					header : "联系人",
					width : 100,
					dataIndex : "contact"
				}, {
					header : "联系电话",
					width : 120,
					dataIndex : "telephone"
				}, {
					header : "所在区域",
					width : 80,
					dataIndex : "region"
				}, {
					header : "同步类型",
					width : 100,
					dataIndex : 'synctype',
					renderer : Pcbms.synctypeRenderer
				}, {
					header : '同步记录',
					width : 150,
					dataIndex : 'syncDate',
					renderer : function(v, m, r) {
						if (v == null) {
							return "未有同步记录";
						}
						return Ext.util.Format.dateRenderer("m-d H:i")(v)
								+ " <span style='color:red'>"
								+ r.get("syncsequence") + "</span>次";
					}
				}],
		store : Ext.create("Ext.data.Store", {
			storeId : "clientStore",
			model : "Account",
			proxy : Pcbms
					.ajaxProxy("/clientManagementAction!searchClients.action?clientInfo.status=1")
		}),
		selModel : Ext.create("Ext.selection.CheckboxModel"),
		bbar : Ext.create("Ext.PagingToolbar", {
					store : Ext.data.StoreManager.lookup('clientStore'),
					displayInfo : true,
					beforePageText : "\u5f53\u524d\u9875",
					afterPageText : "\u603b {0} \u9875",
					displayMsg : "\u663e\u793a\u6761\u76ee\u6570 {0} - {1} \u5230 {2}",
					emptyMsg : "未查询到符合的客户信息"
				})

	}
});
Ext.define("Pcbms.user.ClientAddForm", {
	extend : "Ext.form.Panel",
	alias : "widget.clientaddform",
	tabConfig : {
		title : "客户信息添加",
		tooltip : "客户信息添加"
	},
	layout : "auto",
	bodyPadding : 10,
	defaults : {
		width : 600,
		layout : 'column'
	},
	items : [{
				xtype : 'fieldset',
				title : '基本信息',
				defaultType : 'textfield',
				defaults : {
					margin : '0 10 10',
					columnWidth : 0.5
				},
				items : [{
							fieldLabel : '客户公司名称',
							name : 'clientInfo.company',
							allowBlank : false
						}, {
							fieldLabel : "客户级别",
							xtype : "combobox",
							store : Ext.create("DictionaryStore", {
										type : "2"
									}),
							displayField : 'dicname',
							valueField : 'dicname',
							name : "clientInfo.clientlevel",
							emptyText : "请选择客户的级别",
							allowBlank : false
						}]
			}, {
				xtype : 'fieldset',
				title : '数据同步信息',
				defaultType : 'textfield',
				layout : 'column',
				defaults : {
					margin : '0 10 10',
					columnWidth : 0.5,
					labelAlign : 'top'
				},
				items : [{
							xtype : "checkboxgroup",
							labelAlign : 'left',
							fieldLabel : "同步选项",
							columns : 4,
							vertical : true,
							listeners : {
								change : function(f, v) {
									var synctype = 0;
									for (var i = 0; i < v["synctypes"].length; i++) {
										synctype = synctype | v["synctypes"][i];
									}
									f.nextSibling().setValue(synctype);
								}
							},
							columnWidth : 1,
							items : [{
										boxLabel : "接受订单数据",
										name : "synctypes",
										inputValue : "1"
									}, {
										boxLabel : "发送生产数据",
										name : "synctypes",
										inputValue : "2"
									}, {
										boxLabel : "发送发货数据",
										name : "synctypes",
										inputValue : "4"
									}]
						}, {
							xtype : 'hiddenfield',
							hidden : true,
							name : 'clientInfo.synctype'
						}, {
							name : 'clientInfo.mfrid',
							fieldLabel : '下单系统制造商编号'
						}, {
							xtype : 'combobox',
							name : 'clientInfo.servertype',
							fieldLabel : '下单系统版本类型',
							value : "TPBS V1.00",
							store : ["TPBS V1.00"]
						}, {
							name : 'clientInfo.serverurl',
							fieldLabel : '下单系统访问路径'
						}, {
							name : 'clientInfo.syncdeskey',
							fieldLabel : '系统同步密钥',
							vtype : 'deskey'
						}]
			}, {
				xtype : 'fieldset',
				title : '联系信息',
				defaultType : 'textfield',
				defaults : {
					margin : '0 10 10',
					columnWidth : 0.5
				},
				items : [{
							fieldLabel : '客户联系人姓名',
							name : 'clientInfo.contact',
							allowBlank : false
						}, {
							fieldLabel : "客户邮箱",
							allowBlank : false,
							vtype : 'email',
							name : 'clientInfo.email'
						}, {
							fieldLabel : "客户手机号",
							name : 'clientInfo.mobile'
						}, {
							fieldLabel : "客户座机号",
							name : 'clientInfo.telephone'
						}, {
							fieldLabel : "传真号码",
							name : 'clientInfo.faxno'
						}, {
							fieldLabel : "QQ号码",
							name : 'clientInfo.qq'
						}, {
							fieldLabel : "MSN号码",
							name : 'clientInfo.msn'
						}, {
							fieldLabel : "所在区域",
							xtype : "combobox",
							store : Ext.create("DictionaryStore", {
										type : "3"
									}),
							displayField : 'dicname',
							valueField : 'dicname',
							name : "clientInfo.region",
							emptyText : "请选择客户所在区域",
							allowBlank : false
						}]
			}, {
				xtype : 'fieldset',
				title : '开票信息',
				defaultType : 'textfield',
				defaults : {
					margin : '0 10 10',
					columnWidth : 0.5
				},
				items : [{
							fieldLabel : '客户发票名称',
							name : 'clientInfo.invoicename'
						}, {
							fieldLabel : "客户税号",
							name : 'clientInfo.invoicetaxid'
						}, {
							fieldLabel : "开户行",
							name : 'clientInfo.invoicebank'
						}, {
							fieldLabel : "开票公司名",
							name : 'clientInfo.invoicecompany'
						}, {
							fieldLabel : "银行账号",
							name : 'clientInfo.accountno'
						}, {
							fieldLabel : "开户地址",
							columnWidth : 1,
							name : 'clientInfo.invoiceaddress'
						}]
			}, {
				xtype : 'container',
				width : 600,
				layout : {
					pack : 'center',
					type : 'hbox'
				},
				items : [{
							xtype : 'button',
							text : "\u91cd\u7f6e",
							iconCls : "tablerefresh",
							margin : '0 10',
							handler : function() {
								this.up("form").getForm().reset();
							}
						}, {
							xtype : 'button',

							text : "\u786e\u8ba4\u6dfb\u52a0",
							iconCls : "accept",
							handler : function() {
								var form = this.up("form").getForm();
								form.submit({
									clientValidation : true,
									includeEmptyText : false,
									url : "/clientManagementAction!addClient.action",
									success : function(form, action) {
										Ext.Msg.alert("\u6210\u529f",
												"添加客户信息成功!");
										form.reset();
									},
									failure : Pcbms.formHandler
								});
							}
						}]
			}],
	buttonAlign : "center"
});
Ext.define("Pcbms.user.ClientEditForm", {
	extend : "Ext.form.Panel",
	alias : "widget.clienteditform",
	tabConfig : {
		title : "编辑客户信息",
		tooltip : "编辑客户信息"
	},
	layout : "auto",
	bodyPadding : 10,
	defaults : {
		width : 600,
		layout : 'column'
	},
	initialization : function(data) {
		// 数据的初始化 信息的编辑
		var me = this;
		me.setTitle(this.record.data.userid + ",客户信息编辑");
		this.removeAll();
		this.record = data.record;
		this.add([{
			xtype : 'fieldset',
			title : '基本信息',
			defaultType : 'textfield',
			defaults : {
				margin : '0 10 10',
				columnWidth : 0.5
			},
			items : [{
						fieldLabel : '客户编号',
						name : 'clientInfo.userid',
						value : this.record.data.userid,
						readOnly : true
					}, {
						fieldLabel : '注册日期',
						xtype : 'displayfield',
						value : Ext.util.Format.dateRenderer("Y-m-d")(this.record.data.createDate)
					}, {
						fieldLabel : '客户公司名称',
						name : 'clientInfo.company',
						value : this.record.data.company,
						columnWidth : 1,
						allowBlank : false
					}, {
						fieldLabel : "客户级别",
						xtype : "combobox",
						store : Ext.create("DictionaryStore", {
									type : "2"
								}),
						displayField : 'dicname',
						valueField : 'dicname',
						value : this.record.data.clientlevel,
						name : "clientInfo.clientlevel",
						emptyText : "请选择客户的级别",
						allowBlank : false
					}]
		}, {
			xtype : 'fieldset',
			title : '数据同步信息',
			defaultType : 'textfield',
			layout : 'column',
			defaults : {
				margin : '0 10 10',
				columnWidth : 0.5,
				labelAlign : 'top',
				allowBlank : false
			},
			items : [{
				xtype : "checkboxgroup",
				labelAlign : 'left',
				allowBlank : true,
				fieldLabel : "同步选项",
				columns : 3,
				vertical : true,
				listeners : {
					change : function(f, v) {
						var synctype = 0;
						if (v["synctypes"] != null) {
							for (var i = 0; i < v["synctypes"].length; i++) {
								synctype = synctype | v["synctypes"][i];
							}
						}
						f.nextSibling().setValue(synctype);
						var form = f.up("form").getForm();
						f.nextSibling().nextSibling()
								.setDisabled(synctype == 0);
						form.findField("clientInfo.mfrid")
								.setDisabled(synctype == 0);
						form.findField("clientInfo.servertype")
								.setDisabled(synctype == 0);
						form.findField("clientInfo.serverurl")
								.setDisabled(synctype == 0);
						form.findField("clientInfo.syncdeskey")
								.setDisabled(synctype == 0);
						form.findField("clientInfo.syncsequence")
								.setDisabled(synctype == 0);
						form.findField("clientInfo.bsmode")
								.setDisabled(synctype == 0);
					}
				},
				columnWidth : 0.8,
				items : [{
							boxLabel : "接受订单数据",
							name : "synctypes",
							inputValue : "1",
							checked : this.record.data.synctype & 1 == 1
						}, {
							boxLabel : "发送生产数据",
							name : "synctypes",
							inputValue : "2",
							checked : this.record.data.synctype & 2 == 2
						}, {
							boxLabel : "发送发货数据",
							name : "synctypes",
							inputValue : "4",
							checked : this.record.data.synctype & 4 == 4
						}]
			}, {
				xtype : 'hiddenfield',
				hidden : true,
				name : 'clientInfo.synctype',
				value : this.record.data.synctype
			}, {
				xtype : 'button',
				text : '测试同步',
				disabled : this.record.data.synctype == 0,
				columnWidth : 0.2,
				handler : function(b) {
					var form = b.up("form").getForm();
					if (!form.findField("clientInfo.mfrid").getValue()
							|| !form.findField("clientInfo.servertype")
									.isValid()
							|| !form.findField("clientInfo.serverurl")
									.isValid()
							|| !form.findField("clientInfo.syncdeskey")
									.isValid()) {
						Ext.Msg
								.alert("参数错误",
										"请先检查你的同步参数! 需要同步的时候,同步信息都是必填项! <br/>详细同步参数请联系下单系统的客服人员!");
						return;
					};
					form.submit({
								url : 'clientManagementAction!testSync.action',
								success : function(form, action) {
									var rs = action.result.syncResult;
									if (Ext.isEmpty(rs.error)) {
										Ext.Msg.alert('同步错误', rs.error
														+ ",错误代码:"
														+ rs.errorType);
									} else {
										Ext.Msg.alert('同步测试成功',
												"恭喜你同步登陆成功,同步响应时间:" + rs.ttl
														+ "毫秒");
										form
												.findField("clientInfo.syncsequence")
												.setValue(rs.syncsequence);
										form.findField("clientInfo.bsmode")
												.setValue(rs.bsmode);
									}
								},
								failure : Pcbms.formHandler
							});
				}
			}, {
				name : 'clientInfo.mfrid',
				fieldLabel : '下单系统制造商编号',
				disabled : this.record.data.synctype == 0,
				value : this.record.data.mfrid
			}, {
				xtype : 'combobox',
				name : 'clientInfo.servertype',
				fieldLabel : '下单系统版本类型',
				disabled : this.record.data.synctype == 0,
				value : this.record.data.servertype,
				store : ["TPBS V1.00"]
			}, {
				name : 'clientInfo.serverurl',
				fieldLabel : '下单系统访问路径',
				disabled : this.record.data.synctype == 0,
				value : this.record.data.serverurl
			}, {
				name : 'clientInfo.syncdeskey',
				fieldLabel : '系统同步密钥',
				disabled : this.record.data.synctype == 0,
				value : this.record.data.syncdeskey,
				vtype : 'deskey'
			}, {
				name : 'clientInfo.syncsequence',
				fieldLabel : '同步批次',
				disabled : this.record.data.synctype == 0,
				value : this.record.data.syncsequence
			}, {
				name : 'clientInfo.bsmode',
				fieldLabel : '同步模式',
				value : this.record.data.bsmode,
				disabled : this.record.data.synctype == 0,
				readOnly : true
			}]
		}, {
			xtype : 'fieldset',
			title : '联系信息',
			defaultType : 'textfield',
			defaults : {
				margin : '0 10 10',
				columnWidth : 0.5
			},
			items : [{
						fieldLabel : '客户联系人姓名',
						name : 'clientInfo.contact',
						value : this.record.data.contact,
						allowBlank : false
					}, {
						fieldLabel : '客户联系人Email',
						name : 'clientInfo.email',
						value : this.record.data.email,
						allowBlank : false
					}, {
						fieldLabel : "客户手机号",
						value : this.record.data.mobile,
						name : 'clientInfo.mobile'
					}, {
						fieldLabel : "客户座机号",
						value : this.record.data.telephone,
						name : 'clientInfo.telephone'
					}, {
						fieldLabel : "传真号码",
						value : this.record.data.faxno,
						name : 'clientInfo.faxno'
					}, {
						fieldLabel : "QQ号码",
						value : this.record.data.qq,
						name : 'clientInfo.qq'
					}, {
						fieldLabel : "MSN号码",
						value : this.record.data.msn,
						name : 'clientInfo.msn'
					}, {
						fieldLabel : "所在区域",
						xtype : "combobox",
						store : Ext.create("DictionaryStore", {
									type : "3"
								}),
						displayField : 'dicname',
						valueField : 'dicname',
						value : this.record.data.region,
						name : "clientInfo.region",
						emptyText : "请选择客户所在区域",
						allowBlank : false
					}]
		}, {
			xtype : 'fieldset',
			title : '开票信息',
			defaultType : 'textfield',
			defaults : {
				margin : '0 10 10',
				columnWidth : 0.5
			},
			items : [{
						fieldLabel : '客户发票名称',
						value : this.record.data.invoicename,
						name : 'clientInfo.invoicename'
					}, {
						fieldLabel : "客户税号",
						value : this.record.data.invoicetaxid,
						name : 'clientInfo.invoicetaxid'
					}, {
						fieldLabel : "开户行",
						value : this.record.data.invoicebank,
						name : 'clientInfo.invoicebank'
					}, {
						fieldLabel : "开票公司名",
						value : this.record.data.invoicecompany,
						name : 'clientInfo.invoicecompany'
					}, {
						fieldLabel : "银行账号",
						value : this.record.data.accountno,
						name : 'clientInfo.accountno'
					}, {
						fieldLabel : "开户地址",
						value : this.record.data.invoiceaddress,
						columnWidth : 1,
						name : 'clientInfo.invoiceaddress'
					}]
		}, {
			xtype : 'container',
			width : 600,
			layout : {
				pack : 'center',
				type : 'hbox'
			},
			items : [{
						xtype : 'button',
						text : "\u91cd\u7f6e",
						iconCls : "tablerefresh",
						margin : '0 10',
						handler : function() {
							this.up("form").getForm().reset();
						}
					}, {
						xtype : 'button',
						text : "确认修改",
						handler : function() {
							var form = this.up("form").getForm();
							form.submit({
								clientValidation : true,
								includeEmptyText : false,
								url : "/clientManagementAction!updateClient.action",
								success : function(form, action) {
									Ext.Msg.alert("\u6210\u529f", "客户信息修改成功!");
								},
								failure : Pcbms.formHandler
							});
						}
					}]
		}]);

	}
});
Ext.define("Pcbms.user.UnRegClientList", {
	extend : "Ext.grid.Panel",
	alias : "widget.unregclientlist",
	text : "未注册客户信息管理",
	tabConfig : {
		title : "未注册客户信息的管理",
		tooltip : "未注册客户的查询和发送密码"
	},
	layout : "fit",
	columns : [{
				header : "客户编号",
				width : 80,
				dataIndex : "userid"
			}, {
				header : "公司名称",
				flex : 1,
				dataIndex : "company"
			}, {
				header : "客户级别",
				width : 80,
				dataIndex : "clientlevel"
			}, {
				header : "联系人",
				width : 100,
				dataIndex : "contact"
			}, {
				header : "联系电话",
				width : 120,
				dataIndex : "telephone"
			}, {
				header : "所在区域",
				width : 80,
				dataIndex : "region"
			}, {
				header : "上次密码发送",
				width : 120,
				dataIndex : "sendemailtime",
				renderer : Ext.util.Format.dateRenderer("Y-m-d")
			}],
	tbar : [{
		xtype : "buttongroup",
		title : "客户管理",
		columns : 2,
		defaults : {
			scale : "small"
		},
		items : [{
			text : "发送邀请",
			handler : function(b) {
				var gridpanel = b.up("gridpanel");
				var s = gridpanel.getSelectionModel().getSelection();
				if (s == null || s.length == 0) {
					Ext.MessageBox.alert("操作错误", "请先选择需要发送邀请的客户");
					return;
				}
				Ext.Msg.confirm("确认发送", "是否确认发送邀请给选中的客户", function(b) {
					if (b == "yes") {
						// 确认邀请
						var userids = [];
						for (var i = 0; i < s.length; i += 1) {
							userids.push(s[i].get("userid"));
						}
						gridpanel.el.mask("注册邀请发送中....");
						Ext.Ajax.request({
							url : 'clientManagementAction!sendEmailForUnregistClient.action',
							params : {
								userids : userids
							},
							success : Pcbms.ajaxHandler({
										success : function(result) {
											gridpanel.el.unmask();
											for (var i = 0; i < s.length; i += 1) {
												s[i].set("sendemailtime",
														new Date());
												s[i].commit();
											}
											Ext.Msg.alert('操作成功', "注册邀请发送成功!");
										},
										error : function(result) {
											gridpanel.el.unmask();
											Ext.Msg.alert('出现错误', '原因 <'
															+ result.msg + ">");
										}
									})
						});
					}
				});
			}
		}]
	}, '->', {
		xtype : "buttongroup",
		title : "客户查询",
		columns : 2,
		defaults : {
			scale : "small"
		},
		items : Pcbms.searchbtn("查询未注册顾客", "unregclientStore", "small")
	}],
	initComponent : function() {
		this.store = Ext.create("Ext.data.Store", {
			storeId : "unregclientStore",
			model : "Account",
			autoLoad : false,
			proxy : Pcbms
					.ajaxProxy("/clientManagementAction!searchUnregistClients.action")
		});
		this.bbar = Ext.create("Ext.PagingToolbar", {
					store : this.store,
					displayInfo : true,
					beforePageText : "\u5f53\u524d\u9875",
					afterPageText : "\u603b {0} \u9875",
					displayMsg : "\u663e\u793a\u6761\u76ee\u6570 {0} - {1} \u5230 {2}",
					emptyMsg : "暂无未注册客户信息"
				});
		this.selModel = Ext.create("Ext.selection.CheckboxModel");
		this.callParent();
	}
});
// 已删除客户管理
Ext.define("Pcbms.user.RemovedClientList", {
	extend : "Ext.grid.Panel",
	alias : "widget.removedclientlist",
	text : "已删除客户信息的查询",
	tabConfig : {
		title : "已删除客户信息的查询",
		tooltip : "已删除客户信息的查询"
	},
	tbar : ['->', {
		xtype : "searchbg",
		title : "已删除客户信息查询",
		columns : 3,
		defaults : {
			labelWidth : 60,
			scale : "small"
		},
		items : [{
					xtype : "textfield",
					fieldLabel : "客户ID",
					labelAlign : "right",

					name : "clientInfo.userid",
					emptyText : "根据客户ID查询"
				}, {
					fieldLabel : "业务员",
					xtype : "combobox",
					labelAlign : "right",
					displayField : 'name',
					valueField : 'userid',
					store : Ext.create("Ext.data.Store", {
						model : "Account",
						proxy : Pcbms.ajaxProxy({
							url : "/clientManagementAction!searchEmployeeList.action",
							extraParams : {
								pagesize : 99999
							},
							reader : {
								root : "employeeList"
							}
						})
					}),

					name : "clientInfo.employeeid",
					emptyText : "请选择需要查询的所属业务员"
				}, Pcbms.searchbtn("客户查询", "removedclientStore", "small"), {
					xtype : "textfield",
					fieldLabel : "公司名称",
					labelAlign : "right",
					labelWidth : 60,
					name : "clientInfo.company",
					emptyText : "请输入需要查询的客户公司名称"
				}, {
					fieldLabel : "联系人",
					xtype : "textfield",
					labelAlign : "right",
					labelWidth : 60,
					name : "clientInfo.contact",
					emptyText : "请输入需要查询的客户的联系人信息"
				}, {
					fieldLabel : "客户级别",
					labelWidth : 60,
					xtype : "combobox",
					labelAlign : "right",
					store : Ext.create("DictionaryStore", {
								type : "2"
							}),
					displayField : 'dicname',
					valueField : 'dicname',
					name : "clientInfo.clientlevel",
					emptyText : "请选择客户的级别"
				}, {
					fieldLabel : "所在区域",
					labelWidth : 60,
					xtype : "combobox",
					labelAlign : "right",
					store : Ext.create("DictionaryStore", {
								type : "3"
							}),
					displayField : 'dicname',
					valueField : 'dicname',
					name : "clientInfo.region",
					emptyText : "请选择客户所在区域"
				}]
	}],
	columns : [{
				header : "客户编号",
				width : 80,
				dataIndex : "userid"
			}, {
				header : "公司名称",
				flex : 1,
				dataIndex : "company"
			}, {
				header : "客户级别",
				width : 80,
				dataIndex : "clientlevel"
			}, {
				header : "联系人",
				width : 100,
				dataIndex : "contact"
			}, {
				header : "联系电话",
				width : 120,
				dataIndex : "telephone"
			}, {
				header : "所在区域",
				width : 80,
				dataIndex : "region"
			}, {
				header : "删除时间",
				width : 120,
				dataIndex : "deletetime"
			}],
	initComponent : function() {
		this.store = Ext.create("Ext.data.Store", {
			storeId : "removedclientStore",
			model : "Account",
			proxy : Pcbms
					.ajaxProxy("/clientManagementAction!searchClients.action?clientInfo.status=0")
		});
		this.bbar = Ext.create("Ext.PagingToolbar", {
					store : this.store,
					displayInfo : true,
					beforePageText : "\u5f53\u524d\u9875",
					afterPageText : "\u603b {0} \u9875",
					displayMsg : "\u663e\u793a\u6761\u76ee\u6570 {0} - {1} \u5230 {2}",
					emptyMsg : " 暂无已删除客户信息"
				});
		this.callParent();
	}
});

/**
 * sundonghui 添加
 */
// 客户列表类
Ext.define("Pcbms.user.SpClientGrid", {
	extend : "Ext.grid.Panel",
	alias : "widget.spclientgrid",
	height : "100%",
	columns : [{
				header : "客户编号",
				width : 80,
				dataIndex : "userid"
			}, {
				header : "公司名称",
				flex : 1,
				dataIndex : "company"
			}, {
				header : "客户级别",
				width : 80,
				dataIndex : "clientlevel"
			}, {
				header : "联系人",
				width : 100,
				dataIndex : "contact"
			}, {
				header : "联系电话",
				width : 120,
				dataIndex : "telephone"
			}, {
				header : "所在区域",
				width : 80,
				dataIndex : "region"
			}],
	initComponent : function() {
		this.store = Ext.create("Ext.data.Store", {
			model : "Account",
			proxy : Pcbms
					.ajaxProxy("/clientManagementAction!searchClients.action?clientInfo.status=1")
		});
		this.bbar = Ext.create("Ext.PagingToolbar", {
					store : this.store,
					displayInfo : true,
					beforePageText : "\u5f53\u524d\u9875",
					afterPageText : "\u603b {0} \u9875",
					displayMsg : "\u663e\u793a\u6761\u76ee\u6570 {0} - {1} \u5230 {2}",
					emptyMsg : "未查询到符合的客户信息"
				});
		this.store.load();
		this.callParent();
	}
});