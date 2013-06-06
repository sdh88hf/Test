/**
 * 用户组管理 列出所有的用户组
 */
Ext.define("Pcbms.user.UserGroupList", {
	extend : "Ext.grid.Panel",
	alias : "widget.usergrouplist",
	text : "用户组信息列表",
	tooltip : "用户组信息列表",
	tbar : [{
		xtype : "buttongroup",
		title : "用户组信息管理",
		columns : 2,
		defaults : {
			scale : "small"
		},
		items : [{
					text : "编辑用户组",
					iconCls : "groupedit",
					handler : function(b) {
						var s = checkGridSelect(b.up("gridpanel"), 1);
						if (!s) {
							return;
						}
						Ext.getCmp("mainpanel").loadControl({
									xtype : "ugeditform",
									record : s[0],
									id : "ugeditform",
									text : "用户组编辑"
								});
					}
				}, {
					text : "删除用户组",
					iconCls : "delete",
					handler : function(b) {
						var s = checkGridSelect(b.up("gridpanel"), 2);
						if (!s) {
							return;
						}
						function cfd(a) {
							if (a != "yes") {
								return;
							}
							var params = {
								ugid : []
							};

							for (var i = 0; i < s.length; i++) {
								params.ugid.push(s[i].data["ugid"]);
							}

							b.up("gridpanel").el.mask("数据删除中..请稍后!!!");
							var sh = new Pcbms.ajaxHandler({
								success : function() {
									b.up("gridpanel").getStore().remove(s);
									b.up("gridpanel").el.unmask();
								},
								error : function(r) {
									Ext.Msg.alert('出现错误', '原因 <' + r.msg + ">");
									b.up("gridpanel").el.unmask();
								}
							});
							Ext.Ajax.trequest({
								url : "/userGroupManagementAction!deleteUserGroup.action",
								params : params,
								success : sh
							});
						}
						Ext.MessageBox.confirm("确认操作", "确认将选中的数据删除?", cfd);
					}
				}]
	}, '->', {
		xtype : "searchbg",
		title : "用户组信息查询",
		columns : 3,
		defaults : {
			scale : "small"
		},
		items : [{
					fieldLabel : "用户组名称",
					labelAlign : "right",
					labelWidth : 70,
					xtype : "textfield",
					name : "userGroupInfo.name"
				}, {
					fieldLabel : "角色名称",
					labelAlign : "right",
					labelWidth : 70,
					xtype : "textfield",
					name : "userGroupInfo.roleName"
				}, Pcbms.searchbtn("查询", "userGroupStore", "small"), {
					xtype : "modulecombo",
					fieldLabel : "所属模块",
					name : "userGroupInfo.moduleid",
					allowBlank : false,
					labelWidth : 70,
					labelAlign : "right",
					listeners : {
						afterrender : function(combo) {
							var recordSelected = combo.getStore().getAt(0);
							if (recordSelected != null) {
								combo.setValue(recordSelected.get('moduleid'));
							}
						}
					}
				}]
	}],
	columns : [{
				header : "用户组名称",
				width : 120,
				dataIndex : "name"
			}, {
				header : "用户组描述",
				flex : 1,
				dataIndex : "description"
			}, {
				header : "创建人名称",
				width : 120,
				dataIndex : "employeeName"
			}, {
				header : "创建时间",
				width : 120,
				dataIndex : "createtime",
				renderer : Ext.util.Format.dateRenderer("Y-m-d")
			}],
	initComponent : function() {
		this.store = Ext.create("Ext.data.Store", {
			storeId : "userGroupStore",
			model : "UserGroup",
			proxy : Pcbms
					.ajaxProxy("/userGroupManagementAction!searchUserGroup.action")
		});
		this.bbar = Ext.create("Ext.PagingToolbar", {
					store : this.store,
					displayInfo : true,
					beforePageText : "\u5f53\u524d\u9875",
					afterPageText : "\u603b {0} \u9875",
					displayMsg : "\u663e\u793a\u6761\u76ee\u6570 {0} - {1} \u5230 {2}",
					emptyMsg : "暂无用户组信息"
				});
		this.selModel = Ext.create("Ext.selection.CheckboxModel");
		this.callParent();
	}
});
// 用户组信息添加
Ext.define("Pcbms.user.UserGroupAddForm", {
	extend : "Ext.form.Panel",
	alias : "widget.ugaddform",
	text : "用户组信息添加",
	tabConfig : {
		title : "用户组信息添加",
		tooltip : "用户组基本信息维护,所具有的角色信息维护"
	},
	layout : "anchor",
	bodyPadding : 10,
	defaults : {
		width : 600
	},
	initialization : function() {
		var me = this;
		me.down("itemselector").store.load();
	},
	items : [{
				xtype : 'fieldset',
				title : '用户组基本信息编辑',
				defaults : {
					anchor : '100%'
				},
				layout : 'anchor',
				items : [{
							xtype : "textfield",
							fieldLabel : "用户组名称",
							name : "userGroupInfo.name",
							allowBlank : false,
							maxLength : 30
						}, {
							xtype : "textarea",
							fieldLabel : "用户组介绍",
							name : "userGroupInfo.description",
							maxLength : 300
						}]
			}, {
				xtype : 'fieldset',
				title : '用户组具有角色编辑',
				defaults : {
					anchor : '100%'
				},
				layout : 'anchor',
				items : [{
					xtype : 'itemselector',
					name : 'userGroupInfo.roleids',
					fieldLabel : '角色功能管理',
					// 保留原来内容
					store : Ext.create("Ext.data.Store", {
						model : "Role",
						autoLoad : false,
						proxy : Pcbms.ajaxProxy({
							url : "/userGroupManagementAction!searchAllRolesGroup.action",
							extraParams : {
								pagesize : 99999
							},
							reader : {
								type : 'json',
								root : 'roleList'
							}
						})
					}),
					height : 370,
					multiselects : [{
								height : 350,
								listTitle : "可选角色列表"
							}, {
								height : 350,
								listTitle : "已选角色列表"
							}],
					keepupModel : true,
					displayField : 'name',
					valueField : 'roleid',
					value : [],
					allowBlank : false,
					msgTarget : "under"
				}]
			}],
	buttonAlign : "center",
	buttons : [{
				text : "重置表单",
				iconCls : "tablerefresh",
				handler : function() {
					this.up("form").getForm().reset();
				}
			}, {
				text : "添加用户组",
				iconCls : "GroupInfoAdd",
				handler : function() {
					var form = this.up("form").getForm();
					form.submit({
								clientValidation : true,
								includeEmptyText : false,
								waitMsgTarget : true,
								url : "/userGroupManagementAction!addUserGroup.action",
								success : function(form, action) {
									form.reset();
									Ext.Msg.alert("添加成功", action.result.msg);
								},
								failure : Pcbms.formHandler
							});
				}
			}]
});
// 用户组信息维护
Ext.define("Pcbms.user.UserGroupEditForm", {
	extend : "Ext.form.Panel",
	alias : "widget.ugeditform",
	text : "用户组信息维护",
	tabConfig : {
		title : "用户组信息维护",
		tooltip : "用户组基本信息维护,所具有的角色信息维护"
	},
	layout : "anchor",
	bodyPadding : 10,
	defaults : {
		width : 600
	},
	initialization : function(data) {
		var me = this;
		me.removeAll();
		me.record = data.record;
		var ugid = me.record.data.ugid;
		me.add([{
					xtype : 'fieldset',
					title : '用户组基本信息编辑',
					defaults : {
						anchor : '100%'
					},
					layout : 'anchor',
					items : [{
								xtype : "hidden",
								name : "userGroupInfo.ugid",
								value : ugid
							}, {
								fieldLabel : "用户组名称",
								xtype : "textfield",
								name : "userGroupInfo.name",
								allowBlank : false,
								maxLength : 30,
								value : this.record.data.name
							}, {
								xtype : "textarea",
								fieldLabel : "用户组介绍",
								name : "userGroupInfo.description",
								maxLength : 300,
								value : this.record.data.description
							}]
				}, {
					xtype : 'fieldset',
					title : '用户组具有角色编辑',
					defaults : {
						anchor : '100%'
					},
					layout : 'anchor',
					items : [{
						xtype : 'itemselector',
						name : 'userGroupInfo.roleids',
						keepupModel : true,
						fieldLabel : '角色功能管理',
						store : Ext.create("Ext.data.Store", {
							storeId : "ugupdaterolestore",
							model : "Role",
							autoLoad : false,
							proxy : Pcbms.ajaxProxy({
								url : "/userGroupManagementAction!searchAllRolesGroup.action",
								extraParams : {
									pagesize : 99999
								},
								reader : {
									type : 'json',
									root : 'roleList'
								}
							})
						}),
						height : 370,
						multiselects : [{
									height : 350,
									listTitle : "可选角色列表"
								}, {
									height : 350,
									listTitle : "已选角色列表"
								}],
						displayField : 'name',
						valueField : 'roleid',
						value : [],
						allowBlank : false,
						msgTarget : "under"
					}]
				}]);
		me.down("itemselector").store.load(function() {
			Ext.Ajax.trequest({
				url : '/userGroupManagementAction!searchSelectedRolesInGroup.action',
				params : {
					"userGroupInfo.ugid" : ugid
				},
				success : function(result) {
					// 这里我们需要少许修改
					var values = [];
					for (var i = 0; i < result.roleidList.length; i++) {
						values.push(Ext.create("Role", result.roleidList[i]));
					}
					me.down("itemselector").setValue(values);
				}
			});
		});
	},
	defaultType : "textfield",
	buttonAlign : "center",
	buttons : [{
				text : "重置表单",
				iconCls : "tablerefresh",
				handler : function() {
					this.up("form").getForm().reset();
				}
			}, {
				text : "确认修改用户组",
				iconCls : "accept",
				handler : function() {
					var form = this.up("form").getForm();
					form.submit({
						clientValidation : true,
						includeEmptyText : false,
						waitMsgTarget : true,
						url : "/userGroupManagementAction!updateUserGroup.action",
						success : function(form, action) {
							Ext.Msg.alert("用户组信息修改成功", action.result.msg);
						},
						failure : Pcbms.formHandler
					});
				}
			}]
});