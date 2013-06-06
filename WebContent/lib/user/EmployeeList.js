Ext.define("Pcbms.user.TockenField", {
	extend : 'Ext.form.field.Trigger',
	alias : ['widget.tockenfield'],
	buttonText : '随机生成',
	onTriggerClick : function() {
		var me = this;
		var ss = "0123456789QWERTYUIOPASDFGHJKLZXCVBNM";
		var tocken = "";
		for (var i = 0; i < 12; i += 1) {
			tocken += ss[Math.floor(ss.length * Math.random())];
		}
		me.setValue(tocken);
	}
});

Ext.define("Pcbms.user.EmployeeList", {
	extend : "Ext.grid.Panel",
	alias : "widget.employeelist",
	text : "\u5458\u5de5\u4fe1\u606f\u7ba1\u7406",
	tabConfig : {
		title : "\u5458\u5de5\u4fe1\u606f\u7ba1\u7406",
		tooltip : "\u5458\u5de5\u4fe1\u606f\u7ba1\u7406"
	},
	iconCls : "employee",
	layout : "fit",
	columns : [{
				header : "\u5458\u5de5\u5de5\u53f7",
				dataIndex : "userid"
			}, {
				header : "\u6240\u5728\u90e8\u95e8",
				dataIndex : "departid",
				renderer : function(value) {
					var node = datastore.getDepartmentNode(value);
					if (node) {
						return node.text;
					}
				}
			}, {
				header : "\u5458\u5de5\u59d3\u540d",
				dataIndex : "name"
			}, {
				header : "Email",
				dataIndex : "email",
				flex : 1
			}, {
				header : "手机号码",
				dataIndex : "mobile"
			}, {
				header : "\u5458\u5de5\u804c\u79f0",
				dataIndex : "title"
			}, {
				header : "员工类型",
				dataIndex : "category",
				renderer : function(v) {
					switch (v) {
						case 1 :
							return "<span style='color:blue'>业务人员</span>";
						case 0 :
							return "普通员工";
					}
				}
			}, {
				header : "\u7535\u8bdd\u53f7\u7801",
				dataIndex : "telephone"
			}, {
				header : "\u751f\u65e5",
				dataIndex : "birthday",
				renderer : Ext.util.Format.dateRenderer("Y-m-d")
			}, {
				header : "\u5165\u804c\u65e5\u671f",
				dataIndex : "enroll",
				renderer : Ext.util.Format.dateRenderer("Y-m-d")
			}],
	tbar : [{
		xtype : "buttongroup",
		title : "\u5458\u5de5\u7ba1\u7406",
		columns : 4,
		defaults : {
			scale : "small"
		},
		items : [{
			text : "\u5220\u9664\u5458\u5de5",
			iconCls : "delete",
			handler : function(b) {
				var s = checkGridSelect(b.up("gridpanel"), 1);
				if (!s) {
					return;
				}
				var params = {
					userids : []
				};
				for (var i = 0; i < s.length; i += 1) {
					var id = s[i].get("userid");
					if (id == myself.userid) {
						Ext.MessageBox
								.alert("\u64cd\u4f5c\u9519\u8bef",
										"\u4f60\u4e0d\u80fd\u628a\u81ea\u5df1\u7ed9\u5220\u9664");
						return;
					}
					params.userids.push(id);
				}
				Ext.MessageBox
						.confirm(
								"\u64cd\u4f5c\u786e\u8ba4",
								"\u786e\u8ba4\u5c06\u9009\u4e2d\u7684\u5458\u5de5\u5220\u9664?",
								function(b) {
									if (b == "yes") {
										var gridpanel = this.up("gridpanel");
										gridpanel.el
												.mask(
														"\u4fe1\u606f\u5220\u9664\u4e2d!\u8bf7\u7a0d\u540e....",
														Ext.baseCSSPrefix
																+ "mask-loading");
										Ext.Ajax.trequest({
											url : "/employeeManagementAction!deleteEmployee.action",
											params : params,
											success : function(result) {
												gridpanel.getStore().remove(s);
												gridpanel.el.unmask();
											}
										});
									}
								}, b);
			}
		}, {
			text : "\u53d8\u6362\u7ec4\u7ec7\u673a\u6784",
			iconCls : "change",
			handler : function(b) {
				var s = checkGridSelect(b.up("gridpanel"), 1);
				if (!s) {
					return;
				}
				var params = {
					userids : []
				};
				for (var i = 0; i < s.length; i += 1) {
					var id = s[i].get("userid");
					if (id == myself.userid) {
						Ext.MessageBox
								.alert(
										"\u64cd\u4f5c\u9519\u8bef",
										"\u4f60\u81ea\u5df1\u4e0d\u80fd\u7ed9\u81ea\u5df1\u53d8\u6362\u7ec4\u7ec7\u673a\u6784");
						return;
					}
					params.userids.push(id);
				}
				var treewin = Ext.getCmp("departmentTree");
				if (!treewin) {
					treewin = Ext.create("Pcbms.DepartmentTree");
				}
				treewin.callback = function(value) {
					var gridpanel = this.up("gridpanel");
					if (value.length > 0) {
						params.departid = value[0].id;
					} else {
						Ext.MessageBox
								.alert(
										"\u51fa\u73b0\u9519\u8bef",
										"\u8bf7\u9009\u62e9\u4f60\u9700\u8981\u79fb\u52a8\u5230\u7684\u7ec4\u7ec7\u673a\u6784!");
						return;
					}
					gridpanel.el
							.mask(
									"\u7ec4\u7ec7\u673a\u6784\u53d8\u6362\u4e2d!\u8bf7\u7a0d\u540e....",
									Ext.baseCSSPrefix + "mask-loading");
					Ext.Ajax.trequest({
						url : "/employeeManagementAction!changeEmployeeOrg.action",
						params : params,
						success : function(result) {
							for (var i = 0; i < s.length; i++) {
								s[i].set("departid", params.departid);
								s[i].commit();
							}
							gridpanel.el.unmask();
							Ext.MessageBox
									.alert("\u64cd\u4f5c\u6210\u529f",
											"\u5458\u5de5\u7ec4\u7ec7\u673a\u6784\u8c03\u6574\u6210\u529f!");
						}
					});
				};
				treewin.scope = b;
				treewin.show();
			}
		}, {
			text : "\u53d1\u9001\u5bc6\u7801",
			iconCls : "keygo",
			handler : function(b) {
				// 处理发送密码
				var s = b.up("gridpanel").getSelectionModel().getSelection();
				if (s == null || s.length == 0) {
					Ext.MessageBox
							.alert("\u64cd\u4f5c\u9519\u8bef",
									"\u8bf7\u5148\u9009\u62e9\u9700\u8981\u4fee\u6539\u7684\u7528\u6237");
					return;
				}

			}
		}, {
			text : "\u7f16\u8f91\u5458\u5de5\u4fe1\u606f",
			iconCls : "staffedit",
			handler : function(b) {
				var s = b.up("gridpanel").getSelectionModel().getSelection();
				if (s.length != 1) {
					Ext.MessageBox.alert("操作错误", "请选择一条数据!");
					return;
				}
				Ext.getCmp("mainpanel").loadControl({
							xtype : "employeeeditform",
							record : s[0],
							text : "\u5458\u5de5\u4fe1\u606f\u7f16\u8f91"
						});
			}
		}]
	}, "->", {
		xtype : "searchbg",
		title : "\u5458\u5de5\u4fe1\u606f\u67e5\u8be2",
		columns : 3,
		defaults : {
			scale : "small"
		},
		items : [
				{
					xtype : "textfield",
					fieldLabel : "\u59d3\u540d",
					labelAlign : "right",
					labelWidth : 60,
					name : "employeeInfo.name",
					emptyText : "\u9700\u8981\u67e5\u8be2\u5458\u5de5\u59d3\u540d"
				},
				{
					fieldLabel : "\u5de5\u53f7",
					xtype : "textfield",
					labelAlign : "right",
					labelWidth : 60,
					name : "employeeInfo.userid",
					emptyText : "\u9700\u8981\u67e5\u8be2\u5458\u5de5\u5de5\u53f7"
				},
				Pcbms.searchbtn("\u5458\u5de5\u67e5\u8be2", "employeeStore",
						'small'), {
					xtype : "textfield",
					fieldLabel : "\u624b\u673a",
					labelAlign : "right",
					labelWidth : 55,
					name : "employeeInfo.mobile",
					emptyText : "\u9700\u8981\u67e5\u8be2\u5458\u5de5\u624b\u673a"
				}, {
					fieldLabel : "\u5ea7\u673a",
					xtype : "textfield",
					labelAlign : "right",
					labelWidth : 55,
					name : "employeeInfo.telephone",
					emptyText : "\u9700\u8981\u67e5\u8be2\u5458\u5de5\u5ea7\u673a"
				}, {
					fieldLabel : "\u90e8\u95e8",
					xtype : "departselection",
					labelAlign : "right",
					labelWidth : 55,
					name : "employeeInfo.departid",
					emptyText : "\u9009\u62e9\u5458\u5de5\u6240\u5728\u7684\u90e8\u95e8"
				}, {
					fieldLabel : "\u804c\u4f4d",
					xtype : "textfield",
					labelAlign : "right",
					labelWidth : 55,
					name : "employeeInfo.position",
					emptyText : "\u67e5\u8be2\u7684\u804c\u4f4d\u4fe1\u606f"
				}]
	}],
	initComponent : function() {

		var me = this;

		this.store = Ext.create("Ext.data.Store", {
			storeId : "employeeStore",
			model : "Account",
			autoLoad : true,
			proxy : Pcbms
					.ajaxProxy("/employeeManagementAction!searchEmployee.action?employeeInfo.status=1")
		});
		this.bbar = Ext.create("Ext.PagingToolbar", {
					store : this.store,
					displayInfo : true,
					beforePageText : "\u5f53\u524d\u9875",
					afterPageText : "\u603b {0} \u9875",
					displayMsg : "\u663e\u793a\u6761\u76ee\u6570 {0} - {1} \u5230 {2}",
					emptyMsg : "\u6ca1\u6709\u5458\u5de5\u6570\u636e"
				});
		this.selModel = Ext.create("Ext.selection.CheckboxModel");

		this.callParent();

		me.getView().on('render', function(view) {
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
	}
});
Ext.define("Pcbms.user.EmployeeAddForm", {
	extend : "Ext.form.Panel",
	alias : "widget.employeeaddform",
	layout : "anchor",
	bodyPadding : 10,
	defaults : {
		width : 500
	},
	defaultType : "textfield",
	items : [{
				xtype : 'fieldset',
				defaults : {
					labelWidth : 60,
					margin : '0 10 10'
				},
				layout : {
					type : 'table',
					columns : 2
				},
				title : '基本信息',
				items : [{
							xtype : "textfield",
							fieldLabel : "\u5458\u5de5\u59d3\u540d",
							name : "employeeInfo.name",
							minLength : 2,
							maxLength : 8,
							allowBlank : false
						}, {
							xtype : "departselection",
							fieldLabel : "\u6240\u5c5e\u90e8\u95e8",
							name : "employeeInfo.departid",
							allowBlank : false
						}, {
							xtype : "datefield",
							fieldLabel : "\u5458\u5de5\u751f\u65e5",
							submitFormat : "U000",
							name : "employeeInfo.birthday",
							value : new Date()
						}, {
							xtype : "textfield",
							fieldLabel : "\u5458\u5de5\u804c\u79f0",
							name : "employeeInfo.title",
							maxLength : 10
						}, {
							xtype : "textfield",
							fieldLabel : "\u5458\u5de5\u804c\u4f4d",
							name : "employeeInfo.position",
							maxLength : 10
						}]

			}, {
				xtype : 'fieldset',
				defaults : {
					labelWidth : 60,
					margin : '0 10 10'
				},
				layout : {
					type : 'table',
					columns : 2
				},
				title : '联系方式',
				items : [{
							xtype : "textfield",
							fieldLabel : "\u5458\u5de5Email",
							name : "employeeInfo.email",
							vtype : "email",
							allowBlank : false
						}, {
							xtype : "numberfield",
							fieldLabel : "\u624b\u673a\u53f7\u7801",
							maxValue : 20000000000,
							minValue : 10000000000,
							name : "employeeInfo.mobile"
						}, {
							xtype : "textfield",
							fieldLabel : "\u5ea7\u673a\u53f7\u7801",
							name : "employeeInfo.telephone",
							minLength : 8,
							maxLength : 18
						}, {
							xtype : "textfield",
							fieldLabel : "msn",
							name : "employeeInfo.msn",
							vtype : "email"
						}, {
							xtype : "numberfield",
							fieldLabel : "qq",
							name : "employeeInfo.qq",
							maxValue : 10000000000,
							minValue : 1000
						}]
			}, {
				xtype : 'fieldset',
				title : '工卡信息',
				defaults : {
					anchor : '100%'
				},
				layout : 'anchor',
				items : [{
							fieldLabel : '工卡密钥',
							xtype : 'tockenfield',
							name : 'employeeInfo.tocken'
						}, {
							fieldLabel : "\u662f\u5426\u4fdd\u5bc6",
							name : "hidden",
							xtype : "radiogroup",
							items : [{
										boxLabel : "\u4fdd\u5bc6\u4fe1\u606f",
										name : "employeeInfo.hidden",
										inputValue : "1"
									}, {
										boxLabel : "\u4e0d\u4fdd\u5bc6",
										name : "employeeInfo.hidden",
										inputValue : "0",
										checked : true
									}]
						}]
			}, {
				xtype : 'container',
				width : 500,
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
									url : "/employeeManagementAction!addEmployee.action",
									success : function(form, action) {
										Ext.Msg
												.alert("\u6210\u529f",
														"\u5458\u5de5\u4fe1\u606f\u6dfb\u52a0\u6210\u529f!");
										form.reset();
									},
									failure : Pcbms.formHandler
								});
							}

						}]
			}]
});
Ext.define("Pcbms.user.EmployeeEditForm", {
	extend : "Ext.form.Panel",
	alias : "widget.employeeeditform",
	title : "\u5458\u5de5\u4fe1\u606f\u7f16\u8f91",
	layout : "anchor",
	bodyPadding : 10,
	defaults : {
		width : 500
	},
	initialization : function(data) {
		// 数据的初始化 信息的编辑
		this.removeAll();
		this.record = data.record;
		this.add([{
					xtype : 'fieldset',
					defaults : {
						labelWidth : 60,
						columnWidth : 0.5,
						margin : '0 10 10'
					},
					layout : 'column',
					title : '基本信息',
					items : [{
								xtype : 'textfield',
								fieldLabel : "\u5458\u5de5\u7f16\u53f7",
								name : "employeeInfo.userid",
								readOnly : true,
								value : this.record.data.userid,
								allowBlank : false
							}, {
								xtype : "textfield",
								fieldLabel : "\u5458\u5de5\u59d3\u540d",
								name : "employeeInfo.name",
								minLength : 2,
								maxLength : 8,
								value : this.record.data["name"],
								allowBlank : false
							}, {
								xtype : "departselection",
								fieldLabel : "\u6240\u5c5e\u90e8\u95e8",
								name : "employeeInfo.departid",
								value : this.record.data["departid"],
								allowBlank : false
							}, {
								xtype : "datefield",
								fieldLabel : "\u5458\u5de5\u751f\u65e5",
								submitFormat : "U000",
								name : "employeeInfo.birthday",
								value : this.record.data["birthday"],
								value : new Date()
							}, {
								xtype : "textfield",
								fieldLabel : "\u5458\u5de5\u804c\u79f0",
								name : "employeeInfo.title",
								value : this.record.data["title"],
								maxLength : 10
							}, {
								xtype : "textfield",
								fieldLabel : "\u5458\u5de5\u804c\u4f4d",
								name : "employeeInfo.position",
								value : this.record.data["position"],
								maxLength : 10
							}, {
								xtype : "radiogroup",
								fieldLabel : "员工类型",
								columns : 2,
								vertical : true,
								columnWidth : 1,
								items : [{
											boxLabel : "普通员工",
											name : "employeeInfo.category",
											inputValue : "0",
											checked : this.record.data["category"] == 0
										}, {
											boxLabel : "业务人员",
											name : "employeeInfo.category",
											inputValue : "1",
											checked : this.record.data["category"] == 1
										}]
							}]

				}, {
					xtype : 'fieldset',
					defaults : {
						labelWidth : 60,
						columnWidth : 0.5,
						margin : '0 10 10'
					},
					layout : 'column',
					title : '联系方式',
					items : [{
								xtype : "textfield",
								fieldLabel : "\u5458\u5de5Email",
								name : "employeeInfo.email",
								value : this.record.data["email"],
								vtype : "email",
								allowBlank : false
							}, {
								xtype : "numberfield",
								fieldLabel : "\u624b\u673a\u53f7\u7801",
								maxValue : 20000000000,
								minValue : 10000000000,
								value : this.record.data["mobile"],
								name : "employeeInfo.mobile"
							}, {
								xtype : "textfield",
								fieldLabel : "\u5ea7\u673a\u53f7\u7801",
								name : "employeeInfo.telephone",
								value : this.record.data["telephone"],
								minLength : 8,
								maxLength : 18
							}, {
								xtype : "textfield",
								fieldLabel : "msn",
								value : this.record.data["msn"],
								name : "employeeInfo.msn",
								vtype : "email"
							}, {
								xtype : "numberfield",
								fieldLabel : "qq",
								name : "employeeInfo.qq",
								value : this.record.data["qq"],
								maxValue : 10000000000,
								minValue : 1000
							}]
				}, {
					xtype : 'fieldset',
					title : '工卡信息',
					defaultType : 'tockenfield',
					defaults : {
						anchor : '100%'
					},
					layout : 'anchor',
					items : [{
								fieldLabel : '工卡密钥',
								value : this.record.data["tocken"],
								name : 'employeeInfo.tocken'
							}, {
								fieldLabel : "\u662f\u5426\u4fdd\u5bc6",
								name : "hidden",
								xtype : "radiogroup",
								items : [{
									boxLabel : "\u4fdd\u5bc6\u4fe1\u606f",
									name : "employeeInfo.hidden",
									inputValue : "1"
										// checked : this.record.data["hidden"]
										// = true
										// ? true
										// : false
									}, {
									boxLabel : "\u4e0d\u4fdd\u5bc6",
									name : "employeeInfo.hidden",
									inputValue : "0",
									checked : true
								}]
							}]
				}, {
					xtype : 'container',
					width : 500,
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
								text : "\u786e\u8ba4\u4fee\u6539",
								iconCls : "accept",
								handler : function() {
									var form = this.up("form").getForm();
									form.submit({
										clientValidation : true,
										includeEmptyText : false,
										url : "/employeeManagementAction!updateEmployee.action",
										success : function(form, action) {
											Ext.Msg
													.alert("\u6210\u529f",
															"\u5458\u5de5\u4fe1\u606f\u7f16\u8f91\u6210\u529f!");
										},
										failure : Pcbms.formHandler
									});
								}
							}]
				}]);
	},
	defaultType : "textfield"
});
Ext.define("Pcbms.user.DisabledEmployeeList", {
	extend : "Ext.grid.Panel",
	alias : "widget.disabledemployeelist",
	text : "已删除员工列表",
	tabConfig : {
		title : "已删除员工列表",
		tooltip : "已删除员工列表信息"
	},
	iconCls : "employee",
	layout : "fit",
	columns : [{
				header : "\u5458\u5de5\u5de5\u53f7",
				dataIndex : "userid"
			}, {
				header : "\u6240\u5728\u90e8\u95e8",
				dataIndex : "departid",
				renderer : function(value) {
					var node = datastore.getDepartmentNode(value);
					if (node) {
						return node.text;
					}
				}
			}, {
				header : "\u5458\u5de5\u59d3\u540d",
				dataIndex : "name"
			}, {
				header : "Email",
				dataIndex : "email",
				flex : 1
			}, {
				header : "手机号码",
				dataIndex : "mobile"
			}, {
				header : "\u5458\u5de5\u804c\u79f0",
				dataIndex : "title"
			}, {
				header : "\u5458\u5de5\u804c\u4f4d",
				dataIndex : "position"
			}, {
				header : "\u7535\u8bdd\u53f7\u7801",
				dataIndex : "telephone"
			}, {
				header : "qq",
				dataIndex : "qq"
			}, {
				header : "msn",
				dataIndex : "msn"
			}, {
				header : "\u751f\u65e5",
				dataIndex : "birthday",
				renderer : Ext.util.Format.dateRenderer("Y-m-d")
			}, {
				header : "\u79bb\u804c\u65e5\u671f",
				dataIndex : "dimission",
				renderer : Ext.util.Format.dateRenderer("Y-m-d")
			}],
	initComponent : function() {
		this.store = Ext.create("Ext.data.Store", {
			storeId : "employeeStore",
			model : "Account",
			autoLoad : true,
			proxy : Pcbms
					.ajaxProxy("/employeeManagementAction!searchEmployee.action?employeeInfo.status=0")
		});
		this.bbar = Ext.create("Ext.PagingToolbar", {
					store : this.store,
					displayInfo : true,
					beforePageText : "\u5f53\u524d\u9875",
					afterPageText : "\u603b {0} \u9875",
					displayMsg : "\u663e\u793a\u6761\u76ee\u6570 {0} - {1} \u5230 {2}",
					emptyMsg : "\u6ca1\u6709\u5458\u5de5\u6570\u636e"
				});
		this.callParent();
	}
});