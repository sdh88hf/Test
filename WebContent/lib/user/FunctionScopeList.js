/**
 * 功能信息查询
 */
Ext.define("Pcbms.user.FunctionScopeList", {
	extend : "Ext.grid.Panel",
	alias : "widget.functionscopelist",
	text : "功能作用域信息列表",
	tabConfig : {
		title : "功能作用域信息列表",
		tooltip : "模块功能作用域信息列表"
	},
	selType : 'rowmodel',
	iconCls : "functionscope",
	layout : "fit",
	tbar : [{
		xtype : "buttongroup",
		title : "功能作用域管理",
		columns : 2,
		defaults : {
			scale : "small"
		},
		items : [{
			text : "删除",
			iconCls : "delete",
			handler : function(b) {
				var s = b.up("gridpanel").getSelectionModel().getSelection();
				if (s == null || s.length == 0) {
					Ext.MessageBox.alert("操作错误", "请选择需要删除的功能作用域");
					return;
				}
				Ext.MessageBox.confirm("确认操作", "确认将选中的数据删除?", function(b) {
					if (b == "yes") {
						var gridpanel = this.up("gridpanel");
						gridpanel.el.mask("数据删除中请稍后....", Ext.baseCSSPrefix
										+ "mask-loading");
						Ext.Ajax.trequest({
									url : "/funcManagementAction!deleteFunc.action",
									params : {
										"funcInfo.funcid" : s[0].get("funcid"),
										"funcInfo.scope" : s[0].get("scope"),
										"funcInfo.moduleid" : s[0]
												.get("moduleid")

									},
									success : function(result) {
										gridpanel.getStore()
												.remove(s);
										gridpanel.el.unmask();
									}
								});
					}
				}, b);
			}
		}, {
			text : "修改",
			iconCls : "wrench",
			handler : function(b) {
				var s = b.up("gridpanel").getSelectionModel().getSelection();
				if (s == null || s.length == 0) {
					Ext.MessageBox
							.alert("\u64cd\u4f5c\u9519\u8bef",
									"\u8bf7\u5148\u9009\u62e9\u9700\u8981\u4fee\u6539\u7684\u7528\u6237");
					return;
				}
				Ext.getCmp("mainpanel").loadControl({
							xtype : "funcscopeeditform",
							record : s[0],
							id : "funcscopeeditform" + s[0].get("funcid"),
							text : s[0].get("name") + " 编辑"
						});
			}
		}]
	}, "->", {
		xtype : "searchbg",
		title : "功能作用域查询",
		columns : 3,
		defaults : {
			scale : "small"
		},
		items : [{
					xtype : "textfield",
					fieldLabel : "功能ID",
					labelAlign : "right",
					labelWidth : 60,
					name : "funcInfo.funcid",
					emptyText : "请输入需要查询的功能ID"
				}, {
					xtype : "modulecombo",
					fieldLabel : "所属模块",
					name : "funcInfo.moduleid",
					allowBlank : false,
					labelWidth : 60,
					labelAlign : "right"
				}, Pcbms.searchbtn("功能查询", "functionScopeStore", "small"), {
					xtype : "combobox",
					fieldLabel : "作用域",
					labelWidth : 60,
					labelAlign : "right",
					name : "funcInfo.scope",
					allowBlank : false,
					value : "-1",
					queryMode : 'local',
					store : [['-1', '默认域'], ['0', '全部域'], ['1', '1级部门'],
							['2', '2级部门'], ['3', '3级部门'], ['4', '4级部门'],
							['5', '5级部门']]
				}, {
					xtype : "textfield",
					fieldLabel : "名称",
					labelAlign : "right",
					labelWidth : 60,
					name : "funcInfo.name",
					emptyText : "请输入需要查询的功能名称"
				}]
	}],
	initComponent : function() {
		this.store = Ext.create("Ext.data.Store", {
			storeId : "functionScopeStore",
			model : "FunctionScope",
			autoLoad : false,
			proxy : Pcbms.ajaxProxy("/funcManagementAction!searchFunc.action")
		});
		this.bbar = Ext.create("Ext.PagingToolbar", {
					store : this.store,
					displayInfo : true,
					beforePageText : "\u5f53\u524d\u9875",
					afterPageText : "\u603b {0} \u9875",
					displayMsg : "\u663e\u793a\u6761\u76ee\u6570 {0} - {1} \u5230 {2}",
					emptyMsg : "暂无功能可以显示"
				});
		this.callParent();
	},
	columns : [{
				header : "功能ID",
				width : 250,
				dataIndex : "funcid",
				editor : {
					allowBlank : false
				}
			}, {
				header : "权限域",
				width : 80,
				dataIndex : "scope",
				renderer : function(value) {
					switch (value) {
						case -1 :
							return "默认域";
						case 0 :
							return "全部域";
						default :
							return value + "级部门域";
					}
				}
			}, {
				header : "所属模块",
				width : 80,
				dataIndex : "moduleid",
				renderer : function(value) {
					var module = datastore.getModule(value);
					if (module == null) {
						return "未知模块";
					}
					return module.name;
				}
			}, {
				header : "功能名称",
				flex : 1,
				editor : {
					xtype : "textfield",
					allowBlank : false
				},
				dataIndex : "name"
			}, {
				header : "功能介绍",
				flex : 3,
				editor : {
					xtype : "textfield"
				},
				dataIndex : "description"
			}]
});
Ext.define("Pcbms.user.FunctionScopeAddForm", {
	extend : "Ext.form.Panel",
	alias : "widget.funcscopeaddform",
	tabConfig : {
		title : "功能权限域信息添加",
		tooltip : "功能权限域信息添加"
	},
	layout : "auto",
	bodyPadding : 10,
	defaults : {
		width : 500
	},
	defaultType : "textfield",
	items : [{
				fieldLabel : "功能ID",
				name : "funcInfo.funcid",
				minLength : 2,
				maxLength : 100,
				allowBlank : false
			}, {
				fieldLabel : "权限域",
				xtype : "combo",
				name : "funcInfo.scope",
				allowBlank : false,
				queryMode : 'local',
				store : [['-1', '默认域'], ['0', '全部域'], ['1', '1级部门'],
						['2', '2级部门'], ['3', '3级部门'], ['4', '4级部门'],
						['5', '5级部门']]
			}, {
				fieldLabel : "所属模块",
				xtype : "modulecombo",
				allowBlank : false,
				name : "funcInfo.moduleid"
			}, {
				fieldLabel : "功能名称",
				name : "funcInfo.name",
				allowBlank : false,
				maxLength : 30
			}, {
				xtype : "textarea",
				fieldLabel : "功能介绍",
				name : "funcInfo.description",
				maxLength : 300
			}, {
				xtype : 'container',
				width : 300,
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
							text : "确认添加权限域",
							iconCls : "accept",
							handler : function() {
								var form = this.up("form").getForm();
								form.submit({
									clientValidation : true,
									includeEmptyText : false,
									url : "/funcManagementAction!addFunc.action",
									success : function(form, action) {
										form.reset();
										Ext.Msg
												.alert("添加成功",
														action.result.msg);
									},
									failure : Pcbms.formHandler
								});
							}
						}]
			}]
});
Ext.define("Pcbms.user.FunctionScopeEditForm", {
	defaultType : "textfield",
	extend : "Ext.form.Panel",
	alias : "widget.funcscopeeditform",
	tabConfig : {
		title : "功能权限域信息修改",
		tooltip : "功能权限域信息修改"
	},
	layout : "auto",
	bodyPadding : 10,
	defaults : {
		width : 500
	},
	initComponent : function() {
		var mid = this.record.data.moduleid;
		var mname = datastore.getModule(mid).name;
		this.items = [{
					fieldLabel : "功能ID",
					name : "funcInfo.funcid",
					value : this.record.data.funcid,
					minLength : 2,
					maxLength : 100,
					readOnly : true,
					allowBlank : false
				}, {
					fieldLabel : "权限域",
					xtype : "combo",
					name : "funcInfo.scope",
					value : this.record.data.scope,
					allowBlank : false,
					readOnly : true,
					queryMode : 'local',
					store : [['-1', '默认域'], ['0', '全部域'], ['1', '1级部门'],
							['2', '2级部门'], ['3', '3级部门'], ['4', '4级部门'],
							['5', '5级部门']]
				}, {
					fieldLabel : "所属模块",
					xtype : "combo",
					queryMode : 'local',
					allowBlank : false,
					value : mid,
					readOnly : true,
					name : "funcInfo.moduleid",
					store : [[mid, mname]]
				}, {
					fieldLabel : "功能名称",
					name : "funcInfo.name",
					value : this.record.data.name,
					allowBlank : false
				}, {
					xtype : "textarea",
					fieldLabel : "功能介绍",
					value : this.record.data.description,
					name : "funcInfo.description",
					maxLength : 300
				}, {

					xtype : 'container',
					width : 300,
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
										url : "/funcManagementAction!updateFunc.action",
										success : function(form, action) {
											Ext.Msg.alert("更新成功",
													"功能权限域信息更新成功!");
										},
										failure : Pcbms.formHandler
									});
								}
							}]

				}];
		this.callParent();
	}
});