/**
 * 角色信息管理
 */
Ext.define("Pcbms.user.RoleList", {
	extend : "Ext.grid.Panel",
	alias : "widget.rolelist",
	text : "角色信息列表",
	tabConfig : {
		title : "角色信息列表",
		tooltip : "模块角色信息列表"
	},
	iconCls : "rolelist",
	layout : "fit",
	tbar : [{
		xtype : "buttongroup",
		title : "角色管理",
		columns : 2,
		defaults : {
			scale : "small"
		},
		items : [{
					iconCls : "rolewrench",
					text : "修改",
					handler : function(b) {
						var s = checkGridSelect(b.up("gridpanel"), 1);
						if (!s) {
							return;
						}
						Ext.getCmp("mainpanel").loadControl({
									xtype : "roleeditform",
									record : s[0],
									id : "roleeditform" + s[0].get("roleid"),
									text : s[0].get("name") + " 编辑"
								});
					}
				}, {
					text : "删除",
					iconCls : "delete",
					handler : function(b) {
						var s = checkGridSelect(b.up("gridpanel"), 1);
						if (!s) {
							return;
						}
						Ext.MessageBox.confirm("确认操作", "确认将选中的数据删除?", function(
								b) {
							if (b == "yes") {
								var gridpanel = this.up("gridpanel");
								gridpanel.el.mask("数据删除中请稍后....",
										Ext.baseCSSPrefix + "mask-loading");
								var params = {
									roleids : []
								};
								for (var i = 0; i < s.length; i += 1) {
									params.roleids.push(s[i].get("roleid"));
								}
								Ext.Ajax.trequest({
									url : "/roleManagementAction!deleteRoles.action",
									params : params,
									success : function(result) {
										gridpanel.getStore().remove(s);
										gridpanel.el.unmask();
									},
									error : function(result) {
										Ext.Msg.alert('出现错误', '原因 <'
														+ result.msg + ">");
										gridpanel.el.unmask();
									}
								});
							}
						}, b);
					}
				}]
	}, '->', {
		xtype : "buttongroup",
		title : "角色信息查询",
		columns : 3,
		defaults : {
			scale : "small"
		},
		items : [{
					xtype : "textfield",
					fieldLabel : "角色名称",
					labelAlign : "right",
					labelWidth : 60,
					name : "roleInfo.name",
					emptyText : "请输入需要查询的角色名称",
					maxLength : 30
				}, {
					xtype : "modulecombo",
					fieldLabel : "所属模块",
					name : "roleInfo.moduleid",
					allowBlank : false,
					labelWidth : 60,
					labelAlign : "right"
				}, Pcbms.searchbtn("角色查询", "roleStore", "small")]
	}],
	initComponent : function() {
		this.store = Ext.create("Ext.data.Store", {
					storeId : "roleStore",
					model : "Role",
					autoLoad : false,
					proxy : Pcbms
							.ajaxProxy("/roleManagementAction!searchRoles.action")
				});
		this.bbar = Ext.create("Ext.PagingToolbar", {
					store : this.store,
					displayInfo : true,
					beforePageText : "\u5f53\u524d\u9875",
					afterPageText : "\u603b {0} \u9875",
					displayMsg : "\u663e\u793a\u6761\u76ee\u6570 {0} - {1} \u5230 {2}",
					emptyMsg : "暂无角色信息"
				});
		this.selModel = Ext.create("Ext.selection.CheckboxModel");
		this.callParent();
	},
	columns : [{
				header : "角色名称",
				width : 200,
				dataIndex : "name"
			}, {
				header : "所属模块",
				width : 200,
				dataIndex : "moduleid",
				renderer : function(value) {
					var module = datastore.getModule(value);
					if (module == null) {
						return "未知模块";
					}
					return module.name;
				}
			}, {
				header : "创建时间",
				width : 250,
				dataIndex : "createtime",
				renderer : Ext.util.Format.dateRenderer("Y-m-d")
			}, {
				header : "模块介绍",
				flex : 1,
				dataIndex : "description"
			}]
});

Ext.define("Pcbms.RoleAddForm", {
	extend : "Ext.form.Panel",
	alias : "widget.roleaddform",
	text : "角色信息添加",
	tabConfig : {
		title : "角色信息添加",
		tooltip : "角色信息添加"
	},
	requires: ['Ext.ux.form.MultiSelect', 'Ext.ux.form.ItemSelector'],
	bodyPadding : 10,
	defaults : {
		width : 600
	},
	defaultType : "textfield",
	items : [{
				fieldLabel : "角色名称",
				name : "roleInfo.name",
				allowBlank : false,
				maxLength : 30
			}, {
				fieldLabel : "所属模块",
				xtype : "modulecombo",
				allowBlank : false,
				name : "roleInfo.moduleid",
				listeners : {
					change : function(field, newvalue) {
						var store = Ext.data.StoreManager
								.lookup('roleaddfuncstore');
						store.getProxy().extraParams = {
							length : 99999,
							"funcInfo.moduleid" : newvalue
						};
						store.load({
									callback : function(records, operation,
											success) {
										Ext.getCmp("rolefuncs-field")
												.bindStore(store);
									}
								});

					}
				}
			}, {
				xtype : "textarea",
				fieldLabel : "角色介绍",
				name : "roleInfo.description",
				maxLength : 300
			}, {
				xtype : 'itemselector',
				name : 'funcids',
				id : 'rolefuncs-field',
				fieldLabel : '角色功能管理',
				store : Ext.create("Ext.data.Store", {
					storeId : "roleaddfuncstore",
					model : "FunctionScope",
					autoLoad : false,
					proxy : Pcbms.ajaxProxy({
								url : "/funcManagementAction!searchFunc.action",
								extraParams : {
									pagesize : 99999
								}
							})
				}),
				height : 470,
				multiselects : [{
							height : 450,
							listTitle : "可选功能列表"
						}, {
							height : 450,
							listTitle : "已选功能列表"
						}],
				displayField : 'name',
				valueField : 'funcscope',
				value : [],
				allowBlank : false,
				msgTarget : "under"
			}],
	buttons : [{
				text : "\u91cd\u7f6e\u8868\u5355",
				iconCls : "tablerefresh",
				handler : function() {
					this.up("form").getForm().reset();
				}
			}, {
				text : "添加角色",
				iconCls : "RoleInfoAdd",
				handler : function(b) {
					var form = this.up("form").getForm();
					form.submit({
								clientValidation : true,
								includeEmptyText : false,
								waitMsgTarget : true,
								url : "/roleManagementAction!addRole.action",
								success : function(form, action) {
									Ext.Msg.alert("角色添加成功", action.result.msg,
											function() {
												form.reset()
											});
								},
								failure : Pcbms.formHandler
							});
				}
			}]
});
/**
 * 编辑角色信息
 */
Ext.define("Pcbms.RoleEditForm", {
	extend : "Ext.form.Panel",
	alias : "widget.roleeditform",
	text : "编辑角色信息",
	requires: ['Ext.ux.form.MultiSelect', 'Ext.ux.form.ItemSelector'],
	tabConfig : {
		title : "编辑角色信息",
		tooltip : "编辑角色信息"
	},
	layout : "anchor",
	bodyPadding : 10,
	defaults : {
		anchor : "95%"
	},
	defaultType : "textfield",
	initComponent : function() {
		var me = this;
		var roleid = me.record.data.roleid;
		var mid = me.record.data.moduleid;
		var module = datastore.getModule(mid);
		if (module == null) {
			Ext.Msg.alert("出现错误，请联系管理员");
			return;
		}
		var mname = module.name;
		var store = Ext.create("Ext.data.Store", {
					model : "FunctionScope",
					proxy : Pcbms.ajaxProxy({
								url : "/funcManagementAction!searchFunc.action",
								extraParams : {
									pagesize : 99999,
									"funcInfo.moduleid" : mid
								}
							})
				});
		this.items = [{
					xtype : "hidden",
					name : "roleInfo.roleid",
					readOnly : true,
					value : roleid
				}, {
					fieldLabel : "角色名称",
					name : "roleInfo.name",
					allowBlank : false,
					value : me.record.data.name
				}, {
					fieldLabel : "所属模块",
					xtype : "combo",
					allowBlank : false,
					name : "roleInfo.moduleid",
					value : mid,
					readOnly : true,
					store : [[mid, mname]]
				}, {
					xtype : "textarea",
					fieldLabel : "角色介绍",
					name : "roleInfo.description",
					value : this.record.data.description
				}, {
					xtype : 'itemselector',
					name : 'funcids',
					fieldLabel : '角色功能管理',
					store : store,
					height : 470,
					multiselects : [{
								height : 450,
								listTitle : "可选功能列表"
							}, {
								height : 450,
								listTitle : "已选功能列表"
							}],
					displayField : 'name',
					valueField : 'funcscope',
					value : [],
					allowBlank : false,
					msgTarget : "under"
				}];
		me.callParent();
		var rolefuncsupdate = me.down("itemselector");
		store.load({
			callback : function(records, operation, success) {
				rolefuncsupdate.bindStore(store);
				Ext.Ajax.trequest({
							url : '/roleManagementAction!searchSelectedFunc.action',
							params : {
								"roleInfo.roleid" : roleid
							},
							success : function(result) {
								var values = [];
								for (var i = 0; i < result.funcList.length; i += 1) {
									values.push(Ext.create("FunctionScope",
											result.funcList[i]));
								}
								rolefuncsupdate.setValue(values);
							}
						});
			}
		});
	},
	buttons : [{
		text : '删除当前角色',
		handler : function(b) {
			var fp = b.up("form");
			Ext.Msg.confirm("操作确认", "确认删除当前的角色", function(b) {
						if (b == "yes") {
							fp.getForm().submit({
								clientValidation : false,
								includeEmptyText : false,
								waitMsgTarget : true,
								params : {
									roleids : fp.record.get("roleid")
								},
								url : "/roleManagementAction!deleteRoles.action",
								success : function(form, action) {
									Ext.Msg.alert("角色信息删除成功",
											action.result.msg, function() {
												fp.close();
											});
								},
								failure : Pcbms.formHandler
							});
						}
					});
		}
	}, {
		text : "\u91cd\u7f6e\u8868\u5355",
		iconCls : "tablerefresh",
		handler : function() {
			this.up("form").getForm().reset();
		}
	}, {
		text : "确认更新",
		iconCls : "accept",
		handler : function() {
			var form = this.up("form").getForm();
			form.submit({
						clientValidation : true,
						includeEmptyText : false,
						waitMsgTarget : true,
						url : "/roleManagementAction!updateRole.action",
						success : function(form, action) {
							Ext.Msg.alert("角色信息编辑成功", action.result.msg);
						},
						failure : Pcbms.formHandler
					});
		}
	}]
});